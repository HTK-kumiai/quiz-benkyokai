#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const REQUIRED_COLUMNS = ["email", "password"];
const OPTIONAL_COLUMNS = ["name", "username", "is_admin", "email_confirm"];

main().catch((error) => {
    console.error(`Import gagal: ${error.message}`);
    process.exitCode = 1;
});

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (args.help || !args.file) {
        printUsage();
        process.exitCode = args.help ? 0 : 1;
        return;
    }

    const supabaseUrl = trimTrailingSlash(process.env.SUPABASE_URL || "");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!args.dryRun) {
        if (!supabaseUrl) throw new Error("SUPABASE_URL belum diisi.");
        if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi.");
    }

    const csvText = await readFile(args.file, "utf8");
    const rows = parseCsv(csvText);
    const users = buildUsers(rows);

    if (users.errors.length > 0) {
        console.error(`Ditemukan ${users.errors.length} error validasi di ${basename(args.file)}:`);
        for (const error of users.errors) {
            console.error(`- Baris ${error.line}: ${error.message}`);
        }
        process.exitCode = 1;
        return;
    }

    if (args.dryRun) {
        console.log(`Dry run OK. ${users.records.length} user siap diimpor dari ${basename(args.file)}.`);
        printSummary(users.records);
        return;
    }

    const client = createSupabaseAdminClient(supabaseUrl, serviceRoleKey);
    let successCount = 0;
    let failCount = 0;

    for (const user of users.records) {
        try {
            const createdUser = await createAuthUser(client, user);
            await upsertProfile(client, {
                id: createdUser.id,
                email: createdUser.email || user.email,
                username: user.username,
                name: user.name,
                is_admin: user.isAdmin,
            });
            successCount += 1;
            console.log(`[OK] ${user.email} -> ${createdUser.id}${user.isAdmin ? " (admin)" : ""}`);
        } catch (error) {
            failCount += 1;
            console.error(`[GAGAL] ${user.email}: ${error.message}`);
        }
    }

    console.log(`Selesai. Sukses: ${successCount}. Gagal: ${failCount}.`);
    if (failCount > 0) process.exitCode = 1;
}

function parseArgs(args) {
    const parsed = {
        file: "",
        dryRun: false,
        help: false,
    };

    for (const arg of args) {
        if (arg === "--dry-run") {
            parsed.dryRun = true;
        } else if (arg === "--help" || arg === "-h") {
            parsed.help = true;
        } else if (!parsed.file) {
            parsed.file = arg;
        } else {
            throw new Error(`Argumen tidak dikenal: ${arg}`);
        }
    }

    return parsed;
}

function printUsage() {
    console.log(`Usage:
  node scripts/import-supabase-users.mjs --dry-run data/users-import.csv
  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-supabase-users.mjs data/users-import.csv

Kolom CSV wajib:
  ${REQUIRED_COLUMNS.join(", ")}

Kolom CSV opsional:
  ${OPTIONAL_COLUMNS.join(", ")}
`);
}

function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];

        if (char === "\"") {
            if (inQuotes && next === "\"") {
                value += "\"";
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            row.push(value);
            value = "";
        } else if ((char === "\n" || char === "\r") && !inQuotes) {
            if (char === "\r" && next === "\n") i += 1;
            row.push(value);
            if (row.some((cell) => cell.trim() !== "")) rows.push(row);
            row = [];
            value = "";
        } else {
            value += char;
        }
    }

    if (inQuotes) throw new Error("CSV tidak valid: tanda kutip belum ditutup.");

    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);

    return rows;
}

function buildUsers(rows) {
    if (rows.length === 0) throw new Error("CSV kosong.");

    const headers = rows[0].map((header) => header.trim());
    const normalizedHeaders = headers.map((header) => header.toLowerCase());
    const errors = [];
    const records = [];
    const seenEmails = new Set();
    const seenUsernames = new Set();

    for (const column of REQUIRED_COLUMNS) {
        if (!normalizedHeaders.includes(column)) {
            errors.push({ line: 1, message: `Kolom wajib "${column}" tidak ada.` });
        }
    }

    if (errors.length > 0) return { records, errors };

    rows.slice(1).forEach((row, index) => {
        const line = index + 2;
        const record = rowToObject(row, normalizedHeaders);
        const email = normalizeEmail(record.email);
        const password = (record.password || "").trim();
        const name = (record.name || deriveUsernameFromEmail(email)).trim();
        const username = (record.username || deriveUsernameFromEmail(email)).trim();
        const isAdmin = parseBoolean(record.is_admin, false);
        const emailConfirm = parseBoolean(record.email_confirm, true);

        if (!isValidEmail(email)) {
            errors.push({ line, message: "Email tidak valid." });
        }
        if (password.length < 8) {
            errors.push({ line, message: "Password minimal 8 karakter." });
        }
        if (!username) {
            errors.push({ line, message: "Username tidak boleh kosong." });
        }
        if (seenEmails.has(email)) {
            errors.push({ line, message: `Email duplikat di CSV: ${email}` });
        }
        if (seenUsernames.has(username.toLowerCase())) {
            errors.push({ line, message: `Username duplikat di CSV: ${username}` });
        }

        seenEmails.add(email);
        seenUsernames.add(username.toLowerCase());

        records.push({
            email,
            password,
            name,
            username,
            isAdmin,
            emailConfirm,
        });
    });

    return { records, errors };
}

function rowToObject(row, headers) {
    return Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]));
}

function parseBoolean(value, fallback) {
    const normalized = String(value || "").trim().toLowerCase();
    if (!normalized) return fallback;
    if (["true", "1", "yes", "y", "ya"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "tidak"].includes(normalized)) return false;
    return fallback;
}

function printSummary(records) {
    const adminCount = records.filter((record) => record.isAdmin).length;
    console.log(`Admin: ${adminCount}. User biasa: ${records.length - adminCount}.`);
}

function createSupabaseAdminClient(supabaseUrl, serviceRoleKey) {
    return {
        supabaseUrl,
        headers: {
            apikey: serviceRoleKey,
            authorization: `Bearer ${serviceRoleKey}`,
            "content-type": "application/json",
        },
    };
}

async function createAuthUser(client, user) {
    const response = await fetch(`${client.supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: client.headers,
        body: JSON.stringify({
            email: user.email,
            password: user.password,
            email_confirm: user.emailConfirm,
            user_metadata: {
                name: user.name,
                username: user.username,
            },
        }),
    });

    const data = await parseJsonResponse(response);
    if (!response.ok) throw new Error(formatSupabaseError(data, response.status));
    if (!data.id) throw new Error("Respons Supabase tidak memuat user id.");
    return data;
}

async function upsertProfile(client, profile) {
    const response = await fetch(`${client.supabaseUrl}/rest/v1/profiles?on_conflict=id`, {
        method: "POST",
        headers: {
            ...client.headers,
            prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(profile),
    });

    const data = await parseJsonResponse(response);
    if (!response.ok) throw new Error(formatSupabaseError(data, response.status));
}

async function parseJsonResponse(response) {
    const text = await response.text();
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

function formatSupabaseError(data, status) {
    return data.message || data.error_description || data.error || `HTTP ${status}`;
}

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function deriveUsernameFromEmail(email) {
    return (email || "").split("@")[0] || "user";
}

function trimTrailingSlash(value) {
    return value.replace(/\/+$/, "");
}
