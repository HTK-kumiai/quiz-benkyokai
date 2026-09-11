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
    };
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
    const { data, error } = await client
        .from("profiles")
        .select("id, email, username, name, is_admin")
        .eq("id", userId)
        .maybeSingle();
    if (error) throw error;
    return data;
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
        .select("id, email, username, name, is_admin")
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
