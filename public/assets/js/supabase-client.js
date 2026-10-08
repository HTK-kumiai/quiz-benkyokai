import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../../config/supabase.config.js";

const clientFactory = globalThis.supabase?.createClient;

export const supabase = isSupabaseConfigured() && clientFactory
    ? clientFactory(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    })
    : null;

export function isSupabaseConfigured() {
    return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getSupabaseStatus() {
    if (!isSupabaseConfigured()) {
        return { ready: false, message: "Belum dikonfigurasi" };
    }
    if (!clientFactory || !supabase) {
        return { ready: false, message: "Library Supabase belum termuat" };
    }
    return { ready: true, message: "Konfigurasi dan library siap" };
}

export function assertSupabaseReady() {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase belum dikonfigurasi. Isi public/config/supabase.config.js terlebih dahulu.");
    }
    if (!clientFactory || !supabase) {
        throw new Error("Library Supabase belum termuat di browser.");
    }
    return supabase;
}

export function deriveUsernameFromEmail(email) {
    return (email || "").split("@")[0] || "user";
}

export function normalizeProfile(authUser, profile = {}) {
    const email = authUser?.email || profile.email || "";
    return {
        id: authUser?.id || profile.id || "",
        email,
        username: profile.username || deriveUsernameFromEmail(email),
        name: profile.name || authUser?.user_metadata?.name || deriveUsernameFromEmail(email),
        is_admin: Boolean(profile.is_admin),
        approval_status: profile.approval_status || "pending",
        group_name: profile.group_name || "",
        group_active: profile.group_active !== false,
    };
}

export async function signUpUser(email, password, name, groupName) {
    const client = assertSupabaseReady();
    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
            data: { name },
        },
    });
    if (error) throw error;
    if (!data.session) {
        throw new Error("Pendaftaran berhasil, tetapi sesi belum tersedia. Pastikan Confirm email dimatikan di Supabase.");
    }

    const { error: registrationError } = await client.rpc("register_profile", {
        p_name: name,
        p_group_name: groupName,
    });
    if (registrationError) {
        await client.auth.signOut().catch(() => {});
        throw registrationError;
    }
    return data.user;
}

export async function signInWithEmail(email, password) {
    const client = assertSupabaseReady();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
}

export async function signOutUser() {
    const client = assertSupabaseReady();
    const { error } = await client.auth.signOut();
    if (error) throw error;
}

export async function getAuthUser() {
    const client = assertSupabaseReady();
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user || null;
}

export async function fetchOwnProfile(userId) {
    const client = assertSupabaseReady();
    const { data, error } = await client.rpc("get_profile_access", {
        p_user_id: userId,
    });
    if (error) throw error;
    return Array.isArray(data) ? data[0] || null : data;
}

export async function ensureOwnProfile(authUser) {
    const client = assertSupabaseReady();
    const existing = await fetchOwnProfile(authUser.id);
    if (existing) {
        return normalizeProfile(authUser, existing);
    }

    const profilePayload = {
        id: authUser.id,
        email: authUser.email || "",
        username: deriveUsernameFromEmail(authUser.email || ""),
        name: authUser.user_metadata?.name || deriveUsernameFromEmail(authUser.email || ""),
    };

    const { data, error } = await client
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" })
        .select("id, email, username, name, is_admin, approval_status, group_name")
        .single();
    if (error) throw error;
    return normalizeProfile(authUser, data);
}

export async function getCurrentSessionProfile() {
    const authUser = await getAuthUser();
    if (!authUser) return null;
    return ensureOwnProfile(authUser);
}

export async function insertScore(record) {
    const client = assertSupabaseReady();
    const { error } = await client.from("scores").insert(record);
    if (error) throw error;
}

export async function fetchQuestionBank(categoryId) {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("question_bank")
        .select("id, level, year, question, reading, translation, image, answer, explanation")
        .eq("category_id", categoryId)
        .order("id", { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function replaceQuestionBank(categoryId, questions) {
    const client = assertSupabaseReady();
    const rows = questions.map((question) => ({
        id: Number(question.id),
        category_id: categoryId,
        level: question.level,
        year: Number(question.year),
        question: question.question || "",
        reading: question.reading || "",
        translation: question.translation || "",
        image: question.image || "",
        answer: question.answer,
        explanation: question.explanation || "",
        updated_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
        const { error } = await client
            .from("question_bank")
            .upsert(rows, { onConflict: "category_id,id" });
        if (error) throw error;
    }

    const { data: existingRows, error: existingError } = await client
        .from("question_bank")
        .select("id")
        .eq("category_id", categoryId);
    if (existingError) throw existingError;

    const keepIds = new Set(rows.map((row) => row.id));
    const idsToDelete = (existingRows || [])
        .map((row) => row.id)
        .filter((id) => !keepIds.has(id));

    if (idsToDelete.length > 0) {
        const { error } = await client
            .from("question_bank")
            .delete()
            .eq("category_id", categoryId)
            .in("id", idsToDelete);
        if (error) throw error;
    }

    return rows.length;
}

export async function fetchOwnScores(userId) {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("scores")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function fetchAllScoresForAdmin() {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("scores")
        .select("*")
        .order("timestamp", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function deleteScoreForAdmin(scoreId) {
    const client = assertSupabaseReady();
    const { error } = await client.from("scores").delete().eq("id", scoreId);
    if (error) throw error;
}

export async function deleteScoresForAdmin(scoreIds) {
    if (!scoreIds.length) return;
    const client = assertSupabaseReady();
    const { error } = await client.from("scores").delete().in("id", scoreIds);
    if (error) throw error;
}

export async function fetchAdminProfiles() {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("profiles")
        .select("id, name, username, group_name, is_admin, approval_status")
        .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function createAttendanceSession(session) {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("attendance_sessions")
        .insert(session)
        .select("*")
        .single();
    if (error) throw error;
    return data;
}

export async function fetchLatestAttendanceSession(groupName, sessionDate) {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("attendance_sessions")
        .select("*")
        .eq("group_name", groupName)
        .eq("session_date", sessionDate)
        .order("created_at", { ascending: false })
        .limit(1);
    if (error) throw error;
    return data?.[0] || null;
}

export async function upsertAttendanceRecords(records) {
    if (!records.length) return [];
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("attendance_records")
        .upsert(records, { onConflict: "session_id,user_id" })
        .select("*");
    if (error) throw error;
    return data || [];
}

export async function fetchAttendanceRecords(sessionId) {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("attendance_records")
        .select("*")
        .eq("session_id", sessionId)
        .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function deleteAttendanceSession(sessionId) {
    const client = assertSupabaseReady();
    const { error } = await client
        .from("attendance_sessions")
        .delete()
        .eq("id", sessionId);
    if (error) throw error;
}

export async function fetchPendingProfilesForAdmin() {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("profiles")
        .select("id, email, username, name, is_admin, group_name, approval_status, created_at, approved_at")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function fetchRegistrationGroupsForAdmin() {
    const client = assertSupabaseReady();
    const { data, error } = await client
        .from("registration_groups")
        .select("id, name, active, created_at")
        .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
}

export async function createRegistrationGroup(name) {
    const client = assertSupabaseReady();
    const { data, error } = await client.rpc("create_registration_group", {
        p_name: name,
    });
    if (error) throw error;
    return data;
}

export async function updateRegistrationGroupActive(id, active) {
    const client = assertSupabaseReady();
    const { data, error } = await client.rpc("set_registration_group_active", {
        p_id: id,
        p_active: active,
    });
    if (error) throw error;
    return data;
}

export async function moveProfilesToRegistrationGroup(userIds, groupId) {
    const client = assertSupabaseReady();
    const { data, error } = await client.rpc("move_profiles_to_group", {
        p_user_ids: userIds,
        p_group_id: groupId,
    });
    if (error) throw error;
    return data;
}
