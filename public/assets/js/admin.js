import {
    fetchAllScoresForAdmin,
    deleteScoreForAdmin,
    deleteScoresForAdmin,
    fetchPendingProfilesForAdmin,
    fetchRegistrationGroupsForAdmin,
    fetchQuestionBank,
    getCurrentSessionProfile,
    getSupabaseStatus,
    isSupabaseConfigured,
    replaceQuestionBank,
    signInWithEmail,
    signOutUser,
    createRegistrationGroup,
    updateRegistrationGroupActive,
    moveProfilesToRegistrationGroup,
} from "./supabase-client.js";
import { buildCategoryMap, getImageUrl, loadCategories } from "./category-config.js";

let categoryList = [];
let CATEGORIES = {};
let currentAdminCategory = "";
let currentAdminTab = "home";
let currentAdminProfile = null;
let questions = [];
let editingId = null;
let cachedProfiles = [];
let cachedGroups = [];
let profilesPage = 1;
const profilesPageSize = 20;
const selectedScoreIds = new Set();
let visibleScoreIds = [];
const selectedProfileIds = new Set();
let visibleProfileIds = [];

document.addEventListener("DOMContentLoaded", async () => {
    await initializeCategories();
    setupAdminEvents();
    updateSetupStatus();
    await restoreAdminSession();
    await switchAdminTab("home");
});

async function initializeCategories() {
    categoryList = await loadCategories();
    CATEGORIES = buildCategoryMap(categoryList);
    if (categoryList[0]?.id) {
        currentAdminCategory = categoryList[0].id;
    }
    populateCategorySelect();
}

function populateCategorySelect() {
    const select = document.getElementById("admin-category-select");
    const scoreFilter = document.getElementById("filter-score-category");
    if (!select) return;
    select.innerHTML = "";
    categoryList.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
    select.value = currentAdminCategory;

    if (scoreFilter) {
        scoreFilter.innerHTML = '<option value="all">Semua Bidang</option>';
        categoryList.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.shortName || category.name;
            scoreFilter.appendChild(option);
        });
    }
}

async function restoreAdminSession() {
    if (!isSupabaseConfigured()) {
        showAuthError("Supabase belum dikonfigurasi. Isi public/config/supabase.config.js.");
        return;
    }

    try {
        const profile = await getCurrentSessionProfile();
        if (!profile) return;
        if (!profile.is_admin) {
            showAuthError("Akun ini bukan admin. Set kolom is_admin = true di tabel profiles.");
            await signOutUser().catch(() => {});
            return;
        }
        currentAdminProfile = profile;
        unlockAdmin();
    } catch (e) {
        console.error("Gagal memulihkan sesi admin:", e);
        showAuthError("Gagal memeriksa sesi admin.");
    }
}

function setupAdminEvents() {
    document.getElementById("search-input")?.addEventListener("input", renderTable);
    document.getElementById("filter-level")?.addEventListener("change", renderTable);
    document.getElementById("filter-year")?.addEventListener("change", renderTable);
    document.getElementById("filter-answer")?.addEventListener("change", renderTable);
    document.getElementById("question-form")?.addEventListener("submit", handleFormSubmit);
    document.getElementById("import-file-input")?.addEventListener("change", importQuestionsJSON);
    document.getElementById("search-score-input")?.addEventListener("input", () => renderScoresTable());
    document.getElementById("filter-score-category")?.addEventListener("change", () => renderScoresTable());
    document.getElementById("registration-group-form")?.addEventListener("submit", handleRegistrationGroupSubmit);
    document.getElementById("select-all-scores")?.addEventListener("change", (event) => toggleAllScores(event.target.checked));
    document.getElementById("select-all-profiles")?.addEventListener("change", (event) => toggleAllProfiles(event.target.checked));
    document.getElementById("move-selected-profiles")?.addEventListener("click", moveSelectedProfiles);
}

function updateSetupStatus() {
    const supabaseStatus = document.getElementById("setup-supabase-status");
    const adminStatus = document.getElementById("setup-admin-status");
    const status = getSupabaseStatus();
    if (supabaseStatus) {
        supabaseStatus.textContent = status.message;
        supabaseStatus.style.color = status.ready ? "#15803d" : "#b45309";
    }
    if (adminStatus) {
        adminStatus.textContent = currentAdminProfile
            ? `${currentAdminProfile.name} (${currentAdminProfile.email})`
            : "Belum login";
    }
}

function unlockAdmin() {
    document.getElementById("auth-overlay")?.classList.add("hidden");
    updateSetupStatus();
    if (currentAdminTab === "scores") {
        renderScoresTable();
    }
}

function showAuthError(message) {
    const errorMsg = document.getElementById("auth-error-msg");
    if (!errorMsg) return;
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("auth-email-input").value.trim();
    const password = document.getElementById("auth-password-input").value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const errorMsg = document.getElementById("auth-error-msg");

    submitBtn.disabled = true;
    submitBtn.textContent = "Memuat...";
    errorMsg.style.display = "none";

    try {
        await signInWithEmail(email, password);
        const profile = await getCurrentSessionProfile();
        if (!profile?.is_admin) {
            await signOutUser().catch(() => {});
            throw new Error("Akun ini belum diberi hak admin.");
        }
        currentAdminProfile = profile;
        document.getElementById("auth-password-input").value = "";
        unlockAdmin();
        showToast("🔓 Login admin berhasil.");
    } catch (err) {
        showAuthError(err.message || "Login admin gagal.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Masuk ke Admin";
    }
}

async function logoutAdmin() {
    try {
        await signOutUser();
    } catch (err) {
        console.error("Gagal logout admin:", err);
    }
    currentAdminProfile = null;
    updateSetupStatus();
    document.getElementById("auth-overlay")?.classList.remove("hidden");
    const passwordInput = document.getElementById("auth-password-input");
    if (passwordInput) passwordInput.value = "";
    showToast("🔒 Anda telah logout dari admin.");
}

async function switchAdminTab(tab) {
    currentAdminTab = tab;
    ["home", "soal", "setup", "scores", "users"].forEach((t) => {
        const btn = document.getElementById("tab-btn-" + t);
        if (btn) btn.classList.toggle("active", t === tab);
    });

    const panelHome = document.getElementById("tab-panel-home");
    const panelSoal = document.getElementById("tab-panel-soal");
    const panelSetup = document.getElementById("tab-panel-setup");
    const panelScores = document.getElementById("tab-panel-scores");
    const panelUsers = document.getElementById("tab-panel-users");
    if (panelHome) panelHome.style.display = tab === "home" ? "" : "none";
    if (panelSoal) panelSoal.style.display = tab === "soal" ? "" : "none";
    if (panelSetup) panelSetup.style.display = tab === "setup" ? "" : "none";
    if (panelScores) panelScores.style.display = tab === "scores" ? "" : "none";
    if (panelUsers) panelUsers.style.display = tab === "users" ? "" : "none";

    const categoryWrap = document.querySelector("#admin-category-select")?.parentElement;
    const statsWrap = document.querySelector(".stats-summary");
    const toolbar = document.querySelector(".toolbar-card");
    const showQuestionControls = tab === "soal";
    if (categoryWrap) categoryWrap.style.display = showQuestionControls ? "" : "none";
    if (statsWrap) statsWrap.style.display = showQuestionControls ? "" : "none";
    if (toolbar) toolbar.style.display = showQuestionControls ? "" : "none";

    if (tab === "setup") {
        updateSetupStatus();
    } else if (tab === "scores") {
        await renderScoresTable();
    } else if (tab === "users") {
        await renderRegistrationGroups();
        await renderProfilesTable();
    }
}

async function renderRegistrationGroups() {
    const tbody = document.getElementById("registration-groups-tbody");
    const emptyState = document.getElementById("empty-registration-groups-state");
    if (!tbody || !currentAdminProfile?.is_admin) return;
    try {
        const [groups, profiles] = await Promise.all([
            fetchRegistrationGroupsForAdmin(),
            fetchPendingProfilesForAdmin(),
        ]);
        cachedGroups = groups;
        cachedProfiles = profiles;
        profilesPage = 1;
        selectedProfileIds.clear();
        populateProfileGroupSelect(groups);
        const countByGroup = profiles.reduce((counts, profile) => {
            const key = (profile.group_name || "").trim().toLowerCase();
            if (key) counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {});
        tbody.innerHTML = "";
        if (!groups.length) {
            tbody.style.display = "none";
            emptyState.style.display = "block";
            return;
        }
        tbody.style.display = "";
        emptyState.style.display = "none";
        groups.forEach((group) => {
            const tr = document.createElement("tr");
            const count = countByGroup[(group.name || "").trim().toLowerCase()] || 0;
            const members = profiles
                .filter((profile) => (profile.group_name || "").trim().toLowerCase() === (group.name || "").trim().toLowerCase())
                .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            const memberList = members.length
                ? `<details class="group-members-details"><summary>Lihat ${members.length} user</summary><div class="group-members-list">${members.map((member) => `<div><strong>${escapeHtml(member.name || "—")}</strong><span>${escapeHtml(member.email || "—")}</span></div>`).join("")}</div></details>`
                : '<span class="muted-text">Belum ada user</span>';
            tr.innerHTML = `<td><strong>${escapeHtml(group.name)}</strong></td>
                <td>${count} user</td>
                <td>${group.active ? '<span style="color:#15803d;font-weight:700;">Aktif</span>' : '<span style="color:#b91c1c;font-weight:700;">Nonaktif</span>'}</td>
                <td>${memberList}<button class="btn ${group.active ? "btn-danger" : "btn-success"}" data-action="toggle">${group.active ? "Nonaktifkan Grup" : "Aktifkan Grup"}</button></td>`;
            tr.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
                const action = group.active ? "menonaktifkan" : "mengaktifkan";
                if (!confirm(`Yakin ingin ${action} grup "${group.name}"?\n\nPerubahan ini berlaku untuk semua user dalam grup.`)) return;
                try {
                    await updateRegistrationGroupActive(group.id, !group.active);
                    showToast(group.active ? "⛔ Grup dinonaktifkan." : "✅ Grup diaktifkan.");
                    await renderRegistrationGroups();
                    await renderProfilesTable();
                } catch (error) {
                    showToast(`Gagal mengubah grup: ${error.message}`);
                }
            });
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Gagal memuat grup: ${escapeHtml(error.message)}</td></tr>`;
    }
}

async function handleRegistrationGroupSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById("registration-group-name");
    const button = event.target.querySelector('button[type="submit"]');
    const name = nameInput.value.trim();
    if (name.length < 2) {
        showToast("Nama grup minimal 2 karakter.");
        return;
    }
    button.disabled = true;
    try {
        await createRegistrationGroup(name);
        event.target.reset();
        showToast("✅ Grup pendaftaran berhasil ditambahkan.");
        await renderRegistrationGroups();
    } catch (error) {
        showToast(`Gagal menambahkan grup: ${error.message}`);
    } finally {
        button.disabled = false;
    }
}

async function renderProfilesTable() {
    const tbody = document.getElementById("profiles-tbody");
    const emptyState = document.getElementById("empty-profiles-state");
    if (!tbody || !currentAdminProfile?.is_admin) return;
    try {
        const profiles = cachedProfiles.length ? cachedProfiles : await fetchPendingProfilesForAdmin();
        const groups = cachedGroups.length ? cachedGroups : await fetchRegistrationGroupsForAdmin();
        const activeByGroup = groups.reduce((statuses, group) => {
            statuses[group.name.trim().toLowerCase()] = group.active;
            return statuses;
        }, {});
        tbody.innerHTML = "";
        if (!profiles.length) {
            visibleProfileIds = [];
            updateProfileSelectionUI();
            tbody.style.display = "none";
            emptyState.style.display = "block";
            renderProfilesPagination(0, 1);
            return;
        }
        tbody.style.display = "";
        emptyState.style.display = "none";
        const totalPages = Math.max(1, Math.ceil(profiles.length / profilesPageSize));
        profilesPage = Math.min(profilesPage, totalPages);
        const pageProfiles = profiles.slice((profilesPage - 1) * profilesPageSize, profilesPage * profilesPageSize);
        visibleProfileIds = pageProfiles.filter((profile) => !profile.is_admin).map((profile) => profile.id);
        pageProfiles.forEach((profile) => {
            const tr = document.createElement("tr");
            const created = profile.created_at ? new Date(profile.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "—";
            const actions = profile.is_admin
                ? `<span style="color:#64748b;font-size:.85rem;">Admin</span>`
                    : "<span style=\"color:#64748b;font-size:.85rem;\">Diatur oleh status grup</span>";
            const groupStatus = profile.is_admin || activeByGroup[(profile.group_name || "").trim().toLowerCase()] === true;
            tr.innerHTML = `<td>${profile.is_admin ? "" : `<input type="checkbox" class="profile-checkbox" data-profile-id="${escapeHtml(String(profile.id))}" ${selectedProfileIds.has(profile.id) ? "checked" : ""} />`}</td>
                <td><strong>${escapeHtml(profile.name || "—")}</strong></td>
                <td>${escapeHtml(profile.email || "—")}</td>
                <td>${escapeHtml(profile.group_name || "—")}</td>
                <td style="font-weight:700;color:${groupStatus ? "#15803d" : "#b91c1c"};">${groupStatus ? "Aktif" : "Grup Nonaktif"}</td>
                <td style="font-size:.85rem;">${created}</td><td>${actions}</td>`;
            tr.querySelector(".profile-checkbox")?.addEventListener("change", (event) => {
                if (event.target.checked) selectedProfileIds.add(profile.id);
                else selectedProfileIds.delete(profile.id);
                updateProfileSelectionUI();
            });
            tbody.appendChild(tr);
        });
        updateProfileSelectionUI();
        renderProfilesPagination(profiles.length, totalPages);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7">Gagal memuat pendaftar: ${escapeHtml(error.message)}</td></tr>`;
    }
}

function populateProfileGroupSelect(groups) {
    const select = document.getElementById("profile-target-group");
    if (!select) return;
    select.innerHTML = '<option value="">Pilih grup tujuan...</option>';
    groups.forEach((group) => {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = `${group.name}${group.active ? "" : " (Nonaktif)"}`;
        select.appendChild(option);
    });
}

function updateProfileSelectionUI() {
    const selectAll = document.getElementById("select-all-profiles");
    const button = document.getElementById("move-selected-profiles");
    const count = selectedProfileIds.size;
    if (selectAll) {
        selectAll.checked = visibleProfileIds.length > 0 && visibleProfileIds.every((id) => selectedProfileIds.has(id));
        selectAll.indeterminate = visibleProfileIds.some((id) => selectedProfileIds.has(id)) && !selectAll.checked;
    }
    if (button) {
        button.disabled = count === 0;
        button.textContent = count ? `👥 Pindahkan ${count} User` : "👥 Pindahkan User Terpilih";
    }
}

function toggleAllProfiles(checked) {
    visibleProfileIds.forEach((id) => {
        if (checked) selectedProfileIds.add(id);
        else selectedProfileIds.delete(id);
    });
    document.querySelectorAll(".profile-checkbox").forEach((checkbox) => {
        checkbox.checked = checked;
    });
    updateProfileSelectionUI();
}

async function moveSelectedProfiles() {
    const groupId = document.getElementById("profile-target-group")?.value;
    const ids = Array.from(selectedProfileIds);
    const group = cachedGroups.find((item) => item.id === groupId);
    if (!ids.length || !group) {
        showToast("Pilih user dan grup tujuan terlebih dahulu.");
        return;
    }
    if (!confirm(`Pindahkan ${ids.length} user ke grup "${group.name}"?`)) return;
    try {
        const changedCount = await moveProfilesToRegistrationGroup(ids, groupId);
        selectedProfileIds.clear();
        showToast(`✅ ${changedCount || ids.length} user berhasil dipindahkan.`);
        await renderRegistrationGroups();
        await renderProfilesTable();
    } catch (error) {
        showToast(`Gagal memindahkan user: ${error.message}`);
    }
}

function renderProfilesPagination(totalProfiles, totalPages) {
    const pagination = document.getElementById("profiles-pagination");
    if (!pagination) return;
    pagination.innerHTML = `<span>Menampilkan ${totalProfiles ? ((profilesPage - 1) * profilesPageSize + 1) : 0}–${Math.min(profilesPage * profilesPageSize, totalProfiles)} dari ${totalProfiles} user</span>
        <button class="btn btn-secondary" ${profilesPage <= 1 ? "disabled" : ""} data-page="prev">← Sebelumnya</button>
        <strong>Halaman ${profilesPage} / ${totalPages}</strong>
        <button class="btn btn-secondary" ${profilesPage >= totalPages ? "disabled" : ""} data-page="next">Berikutnya →</button>`;
    pagination.querySelector('[data-page="prev"]')?.addEventListener("click", async () => {
        profilesPage -= 1;
        await renderProfilesTable();
    });
    pagination.querySelector('[data-page="next"]')?.addEventListener("click", async () => {
        profilesPage += 1;
        await renderProfilesTable();
    });
}

async function switchAdminCategory(catId) {
    if (!CATEGORIES[catId]) return;
    currentAdminCategory = catId;
    document.getElementById("admin-category-select").value = catId;
    await loadQuestionsForCategory(catId);
    populateYearFilter();
    renderTable();
    updateStats();
}

async function loadQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    try {
        const remoteQuestions = await fetchQuestionBank(catId);
        if (remoteQuestions.length > 0) {
            questions = normalizeQuestions(remoteQuestions);
            localStorage.setItem(cat.storageKey, JSON.stringify(questions));
            return;
        }
    } catch (err) {
        console.warn(`Bank soal ${catId} dari Supabase belum tersedia:`, err);
    }

    questions = await loadStaticQuestionsForCategory(catId);
    localStorage.setItem(cat.storageKey, JSON.stringify(questions));
}

function normalizeQuestions(loadedQuestions) {
    return loadedQuestions.map((q, idx) => ({
        id: q.id || idx + 1,
        level: q.level || "shokyu",
        year: q.year ? Number(q.year) : 2024,
        question: q.question || "",
        reading: q.reading || "",
        translation: q.translation || q.explanation || "",
        image: q.image || "",
        answer: q.answer || "○",
        explanation: q.explanation || "",
    }));
}

async function loadStaticQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    const localData = localStorage.getItem(cat.storageKey);
    let loadedQuestions = null;

    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed.some((q) => q.year !== undefined && q.year !== null)) {
                loadedQuestions = parsed;
            }
        } catch (e) {
            console.error("Gagal parse localStorage:", e);
        }
    }

    if (!loadedQuestions) {
        try {
            const response = await fetch(cat.fileUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Status HTTP: " + response.status);
            loadedQuestions = await response.json();
        } catch (err) {
            loadedQuestions = getDefaultFallbackForCategory(catId);
        }
    }

    return normalizeQuestions(loadedQuestions);
}

async function fetchBundledQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    const response = await fetch(`${cat.fileUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Gagal memuat ${cat.filename}: HTTP ${response.status}`);
    const loadedQuestions = await response.json();
    if (!Array.isArray(loadedQuestions) || loadedQuestions.length === 0) {
        throw new Error(`File ${cat.filename} kosong atau tidak valid.`);
    }
    return normalizeQuestions(loadedQuestions);
}

async function syncCurrentQuestionBank() {
    if (!currentAdminProfile?.is_admin) {
        showToast("🔒 Login admin diperlukan.");
        return;
    }
    try {
        const count = await replaceQuestionBank(currentAdminCategory, questions);
        localStorage.setItem(CATEGORIES[currentAdminCategory].storageKey, JSON.stringify(questions));
        showToast(`☁️ ${count} soal berhasil disimpan ke Supabase.`);
    } catch (err) {
        showToast(`❌ Gagal menyimpan bank soal: ${err.message}`);
    }
}

async function reloadAllQuestionBanks() {
    if (!currentAdminProfile?.is_admin) {
        showToast("🔒 Login admin diperlukan.");
        return;
    }
    const button = document.getElementById("reload-all-question-banks");
    if (button) {
        button.disabled = true;
        button.textContent = "🔄 Memuat dari Supabase...";
    }
    try {
        let total = 0;
        for (const category of categoryList) {
            const remoteQuestions = await fetchQuestionBank(category.id);
            if (remoteQuestions.length > 0) {
                const normalized = normalizeQuestions(remoteQuestions);
                localStorage.setItem(category.storageKey, JSON.stringify(normalized));
                total += normalized.length;
            }
        }
        await switchAdminCategory(currentAdminCategory);
        showToast(`✅ Data terbaru dimuat dari Supabase (${total} soal).`);
    } catch (err) {
        showToast(`❌ Gagal memuat soal dari Supabase: ${err.message}`);
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "🔄 Muat Ulang Semua Soal dari Supabase";
        }
    }
}

async function publishLocalQuestionBanks() {
    if (!currentAdminProfile?.is_admin) {
        showToast("🔒 Login admin diperlukan.");
        return;
    }
    const confirmed = confirm(
        "JSON lokal akan menimpa seluruh soal di Supabase untuk semua bidang.\n\n" +
        "Perubahan yang dibuat melalui dashboard tetapi belum ada di file JSON dapat hilang.\n\n" +
        "Lanjutkan?"
    );
    if (!confirmed) return;

    const button = document.getElementById("publish-local-question-banks");
    if (button) {
        button.disabled = true;
        button.textContent = "☁️ Menerbitkan JSON lokal...";
    }
    try {
        let total = 0;
        for (const category of categoryList) {
            const staticQuestions = await fetchBundledQuestionsForCategory(category.id);
            localStorage.setItem(category.storageKey, JSON.stringify(staticQuestions));
            total += await replaceQuestionBank(category.id, staticQuestions);
        }
        await switchAdminCategory(currentAdminCategory);
        showToast(`✅ Semua bidang tersimpan ke Supabase (${total} soal).`);
    } catch (err) {
        showToast(`❌ Sinkronisasi gagal: ${err.message}`);
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "⚠️ Timpa Supabase dengan JSON Lokal";
        }
    }
}

// Alias lama untuk kompatibilitas dengan pemanggilan dari browser lama.
const syncAllQuestionBanks = publishLocalQuestionBanks;

function persistQuestions() {
    const cat = CATEGORIES[currentAdminCategory];
    localStorage.setItem(cat.storageKey, JSON.stringify(questions));
    populateYearFilter();
    updateStats();
    if (currentAdminProfile?.is_admin) {
        replaceQuestionBank(currentAdminCategory, questions)
            .then(() => showToast("☁️ Perubahan soal tersimpan di Supabase."))
            .catch((err) => showToast(`⚠️ Soal tersimpan lokal, tetapi gagal ke Supabase: ${err.message}`));
    }
}

function updateStats() {
    const total = questions.length;
    const countTrue = questions.filter((q) => q.answer === "○").length;
    const countFalse = questions.filter((q) => q.answer === "×").length;
    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-true").textContent = countTrue;
    document.getElementById("stat-false").textContent = countFalse;
}

function renderTable() {
    const tbody = document.getElementById("questions-tbody");
    const emptyState = document.getElementById("empty-state");
    if (!tbody) return;

    const searchVal = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
    const filterLevel = document.getElementById("filter-level")?.value || "all";
    const filterYear = document.getElementById("filter-year")?.value || "all";
    const filterAnswer = document.getElementById("filter-answer")?.value || "all";

    const filtered = questions.filter((q) => {
        if (filterLevel !== "all" && (q.level || "shokyu") !== filterLevel) return false;
        if (filterYear !== "all" && String(q.year) !== filterYear) return false;
        if (filterAnswer !== "all" && q.answer !== filterAnswer) return false;
        if (searchVal) {
            return String(q.id).includes(searchVal) ||
                (q.question || "").toLowerCase().includes(searchVal) ||
                (q.reading || "").toLowerCase().includes(searchVal) ||
                (q.translation || "").toLowerCase().includes(searchVal) ||
                (q.explanation || "").toLowerCase().includes(searchVal) ||
                String(q.year || "").includes(searchVal);
        }
        return true;
    });

    tbody.innerHTML = "";
    if (filtered.length === 0) {
        tbody.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    tbody.style.display = "";
    emptyState.style.display = "none";
    filtered.forEach((q) => {
        const tr = document.createElement("tr");
        const isTrue = q.answer === "○";
        tr.innerHTML = `
            <td class="td-id">#${q.id}</td>
            <td><div class="td-question">${escapeHtml(q.question)}</div>${q.image ? `<div class="table-img-badge"><img class="table-img-thumb" src="${escapeHtml(q.image)}" alt="thumb" onerror="this.style.display='none'" /> 🖼️ Gambar</div>` : ""}${q.reading ? `<div class="reading-subtext">${escapeHtml(q.reading)}</div>` : ""}${q.translation ? `<div class="explanation-subtext"><strong>Terjemahan:</strong> ${escapeHtml(q.translation)}</div>` : ""}${q.explanation ? `<div class="explanation-subtext"><strong>Alasan:</strong> ${escapeHtml(q.explanation)}</div>` : ""}</td>
            <td>${q.level === "senmonkyu" ? '<span style="display:inline-block;padding:3px 8px;border-radius:6px;background:#fef3c7;color:#92400e;font-weight:700;font-size:0.78rem;margin-bottom:4px;">⭐ 専門級</span>' : '<span style="display:inline-block;padding:3px 8px;border-radius:6px;background:#e0e7ff;color:#3730a3;font-weight:700;font-size:0.78rem;margin-bottom:4px;">🔰 初級</span>'}<div style="margin-top:6px;"><span style="display:inline-block;padding:2px 8px;border-radius:6px;background:#f1f5f9;color:#475569;font-weight:600;font-size:0.78rem;">📅 ${q.year}</span></div></td>
            <td>${isTrue ? '<span class="badge-answer true">○ BENAR</span>' : '<span class="badge-answer false">✕ SALAH</span>'}</td>
            <td><div class="table-actions"><button class="btn-icon edit" onclick="openEditModal(${q.id})" title="Ubah Soal">✏️ Edit</button><button class="btn-icon delete" onclick="deleteQuestion(${q.id})" title="Hapus Soal">🗑️ Hapus</button></div></td>`;
        tbody.appendChild(tr);
    });
}

function handleImageInputManual(val) {
    const previewWrap = document.getElementById("form-image-preview-wrap");
    const previewImg = document.getElementById("form-image-preview");
    if (val && val.trim() !== "") {
        previewImg.src = val.trim();
        previewWrap.style.display = "inline-block";
    } else {
        previewImg.src = "";
        previewWrap.style.display = "none";
    }
}

function handleImageFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        document.getElementById("form-image").value = loadEvent.target.result;
        handleImageInputManual(loadEvent.target.result);
        showToast("🖼️ Gambar berhasil dimuat.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
}

function clearFormImage() {
    document.getElementById("form-image").value = "";
    handleImageInputManual("");
}

function openAddModal() {
    editingId = null;
    const catName = CATEGORIES[currentAdminCategory].name;
    document.getElementById("modal-title").textContent = `Tambah Soal Baru (${catName})`;
    document.getElementById("form-id").value = getNextId();
    document.getElementById("form-level").value = document.getElementById("filter-level")?.value === "senmonkyu" ? "senmonkyu" : "shokyu";
    document.getElementById("form-year").value = document.getElementById("filter-year")?.value !== "all" ? document.getElementById("filter-year").value : "2024";
    document.getElementById("form-question").value = "";
    document.getElementById("form-reading").value = "";
    document.getElementById("form-translation").value = "";
    clearFormImage();
    document.getElementById("answer-true").checked = true;
    document.getElementById("form-explanation").value = "";
    document.getElementById("modal-form").classList.add("open");
}

function openEditModal(id) {
    const q = questions.find((item) => item.id === id);
    if (!q) return;
    editingId = id;
    document.getElementById("modal-title").textContent = "Ubah Soal #" + q.id;
    document.getElementById("form-id").value = q.id;
    document.getElementById("form-level").value = q.level || "shokyu";
    document.getElementById("form-year").value = q.year || 2024;
    document.getElementById("form-question").value = q.question || "";
    document.getElementById("form-reading").value = q.reading || "";
    document.getElementById("form-translation").value = q.translation || "";
    document.getElementById("form-image").value = q.image || "";
    handleImageInputManual(q.image || "");
    if (q.answer === "○") document.getElementById("answer-true").checked = true;
    else document.getElementById("answer-false").checked = true;
    document.getElementById("form-explanation").value = q.explanation || "";
    document.getElementById("modal-form").classList.add("open");
}

function closeModal() {
    document.getElementById("modal-form").classList.remove("open");
}

function handleFormSubmit(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("form-id").value, 10);
    const levelVal = document.getElementById("form-level").value;
    const yearVal = parseInt(document.getElementById("form-year").value, 10) || 2024;
    const questionText = document.getElementById("form-question").value.trim();
    const readingText = document.getElementById("form-reading").value.trim();
    const translationText = document.getElementById("form-translation").value.trim();
    const imageText = document.getElementById("form-image").value.trim();
    const answerVal = document.querySelector('input[name="form-answer"]:checked').value;
    const explanationText = document.getElementById("form-explanation").value.trim();

    if (!questionText) {
        alert("Teks pertanyaan tidak boleh kosong.");
        return;
    }

    if (editingId !== null) {
        const index = questions.findIndex((q) => q.id === editingId);
        if (index !== -1) {
            questions[index] = { id, level: levelVal, year: yearVal, question: questionText, reading: readingText, translation: translationText, image: imageText, answer: answerVal, explanation: explanationText };
            showToast("✅ Soal berhasil diperbarui.");
        }
    } else {
        const exists = questions.some((q) => q.id === id);
        const finalId = exists ? getNextId() : id;
        questions.push({ id: finalId, level: levelVal, year: yearVal, question: questionText, reading: readingText, translation: translationText, image: imageText, answer: answerVal, explanation: explanationText });
        showToast("🎉 Soal baru berhasil ditambahkan.");
    }

    questions.sort((a, b) => a.id - b.id);
    persistQuestions();
    closeModal();
    renderTable();
}

function deleteQuestion(id) {
    const q = questions.find((item) => item.id === id);
    if (!q) return;
    if (confirm(`Apakah Anda yakin ingin menghapus Soal #${q.id}?\n\n"${q.question}"`)) {
        questions = questions.filter((item) => item.id !== id);
        persistQuestions();
        renderTable();
        showToast("🗑️ Soal berhasil dihapus.");
    }
}

function getNextId() {
    if (questions.length === 0) return 1;
    return Math.max(...questions.map((q) => q.id || 0)) + 1;
}

function exportQuestionsJSON() {
    const cat = CATEGORIES[currentAdminCategory];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", cat.downloadName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`💾 File ${cat.downloadName} berhasil diunduh.`);
}

function importQuestionsJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const cat = CATEGORIES[currentAdminCategory];
    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        try {
            const importedData = JSON.parse(loadEvent.target.result);
            if (!Array.isArray(importedData)) throw new Error("Format JSON harus berupa array.");
            const valid = importedData.every((q) => q.question && q.answer);
            if (!valid) {
                alert("File JSON tidak sesuai format.");
                return;
            }
            if (confirm(`Impor ${importedData.length} soal dari file "${file.name}" ke bidang "${cat.name}"? Data local browser saat ini akan digantikan.`)) {
                questions = importedData.map((q, idx) => ({
                    id: q.id || idx + 1,
                    level: q.level || "shokyu",
                    year: q.year ? Number(q.year) : 2024,
                    question: q.question || "",
                    reading: q.reading || "",
                    translation: q.translation || q.explanation || "",
                    image: q.image || "",
                    answer: q.answer || "○",
                    explanation: q.explanation || "",
                }));
                persistQuestions();
                renderTable();
                showToast(`📂 Berhasil mengimpor ${importedData.length} soal.`);
            }
        } catch (err) {
            alert("Gagal membaca file JSON: " + err.message);
        }
        event.target.value = "";
    };
    reader.readAsText(file);
}

function resetToDefault() {
    const cat = CATEGORIES[currentAdminCategory];
    if (confirm(`Reset bank soal "${cat.name}" ke data bawaan lokal?`)) {
        questions = getDefaultFallbackForCategory(currentAdminCategory);
        persistQuestions();
        renderTable();
        showToast(`🔄 Bank soal ${cat.name} direset ke data bawaan.`);
    }
}

function populateYearFilter() {
    const filterYear = document.getElementById("filter-year");
    if (!filterYear) return;
    const currentSelected = filterYear.value;
    const yearsSet = new Set();
    questions.forEach((q) => {
        if (q.year) yearsSet.add(Number(q.year));
    });
    if (yearsSet.size === 0) {
        yearsSet.add(2024);
        yearsSet.add(2023);
        yearsSet.add(2022);
    }
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
    filterYear.innerHTML = '<option value="all">Semua Tahun</option>';
    sortedYears.forEach((yr) => {
        const opt = document.createElement("option");
        opt.value = String(yr);
        opt.textContent = `Tahun ${yr}`;
        if (String(yr) === currentSelected) opt.selected = true;
        filterYear.appendChild(opt);
    });
}

async function renderScoresTable() {
    const tbody = document.getElementById("scores-tbody");
    const emptyState = document.getElementById("empty-scores-state");
    if (!tbody) return;
    if (!currentAdminProfile?.is_admin) {
        tbody.innerHTML = "";
        tbody.style.display = "none";
        emptyState.style.display = "block";
        emptyState.querySelector("h3").textContent = "Login admin diperlukan";
        emptyState.querySelector("p").textContent = "Masuk dengan akun Supabase admin untuk melihat riwayat skor.";
        return;
    }

    const searchVal = (document.getElementById("search-score-input")?.value || "").toLowerCase().trim();
    const filterCat = document.getElementById("filter-score-category")?.value || "all";

    try {
        const allScores = await fetchAllScoresForAdmin();
        const filtered = allScores.filter((r) => {
            if (filterCat !== "all" && r.category !== filterCat) return false;
            if (searchVal) {
                return (r.username || "").toLowerCase().includes(searchVal) || (r.name || "").toLowerCase().includes(searchVal);
            }
            return true;
        });
        visibleScoreIds = filtered.map((score) => score.id);

        tbody.innerHTML = "";
        if (filtered.length === 0) {
            visibleScoreIds = [];
            updateScoreSelectionUI();
            tbody.style.display = "none";
            emptyState.style.display = "block";
            emptyState.querySelector("h3").textContent = "Belum ada riwayat skor";
            emptyState.querySelector("p").textContent = "Skor akan muncul di sini setelah user menyelesaikan kuis.";
            return;
        }

        tbody.style.display = "";
        emptyState.style.display = "none";
        filtered.forEach((r, idx) => {
            const levelText = r.level === "shokyu" ? "🔰 初級" : "⭐ 専門級";
            const yearText = r.year === "all" ? "Semua Tahun" : r.year;
            const catName = r.category_name || r.category || "—";
            const time = r.timestamp ? new Date(r.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "—";
            const pct = Number(r.percentage) || 0;
            let scoreColor = "#dc2626";
            if (pct >= 75) scoreColor = "#16a34a";
            else if (pct >= 60) scoreColor = "#f59e0b";
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="td-id"><input type="checkbox" class="score-checkbox" data-score-id="${escapeHtml(String(r.id))}" ${selectedScoreIds.has(r.id) ? "checked" : ""} /> #${idx + 1}</td>
                <td><div style="font-weight:700;color:#1e40af;">${escapeHtml(r.username || "—")}</div><div style="font-size:0.82rem;color:#64748b;">${escapeHtml(r.name || "")}</div></td>
                <td><div style="font-size:0.85rem;">${escapeHtml(catName)}</div><div style="font-size:0.78rem;color:#64748b;margin-top:2px;">${levelText} • ${escapeHtml(String(yearText))}</div></td>
                <td><div style="font-weight:800;font-size:1.2rem;color:${scoreColor};">${pct}%</div></td>
                <td><div style="font-size:0.85rem;">✅ ${r.correct} / ${r.total}</div><div style="font-size:0.78rem;color:#64748b;">❌ ${r.wrong} salah</div></td>
                <td><div style="font-size:0.85rem;">${time}</div><button class="btn btn-danger score-delete-button" type="button">Hapus</button></td>`;
            tr.querySelector(".score-checkbox").addEventListener("change", (event) => {
                if (event.target.checked) selectedScoreIds.add(r.id);
                else selectedScoreIds.delete(r.id);
                updateScoreSelectionUI();
            });
            tr.querySelector(".score-delete-button").addEventListener("click", () => deleteSingleScore(r));
            tbody.appendChild(tr);
        });
        updateScoreSelectionUI();
    } catch (err) {
        tbody.innerHTML = "";
        tbody.style.display = "none";
        emptyState.style.display = "block";
        emptyState.querySelector("h3").textContent = "Gagal memuat skor";
        emptyState.querySelector("p").textContent = err.message || "Periksa RLS dan konfigurasi Supabase.";
    }
}

function updateScoreSelectionUI() {
    const count = selectedScoreIds.size;
    const button = document.getElementById("delete-selected-scores");
    const selectAll = document.getElementById("select-all-scores");
    if (button) {
        button.disabled = count === 0;
        button.textContent = count ? `🗑️ Hapus Terpilih (${count})` : "🗑️ Hapus Terpilih";
    }
    if (selectAll) {
        selectAll.checked = visibleScoreIds.length > 0 && visibleScoreIds.every((id) => selectedScoreIds.has(id));
        selectAll.indeterminate = visibleScoreIds.some((id) => selectedScoreIds.has(id)) && !selectAll.checked;
    }
}

function toggleAllScores(checked) {
    visibleScoreIds.forEach((id) => {
        if (checked) selectedScoreIds.add(id);
        else selectedScoreIds.delete(id);
    });
    document.querySelectorAll(".score-checkbox").forEach((checkbox) => {
        checkbox.checked = checked;
    });
    updateScoreSelectionUI();
}

async function deleteSingleScore(score) {
    if (!confirm(`Hapus skor ${score.username || score.name || "user ini"} sebesar ${score.percentage || 0}%?`)) return;
    try {
        await deleteScoreForAdmin(score.id);
        selectedScoreIds.delete(score.id);
        showToast("🗑️ Skor berhasil dihapus.");
        await renderScoresTable();
    } catch (error) {
        showToast(`Gagal menghapus skor: ${error.message}`);
    }
}

async function deleteSelectedScores() {
    const ids = Array.from(selectedScoreIds);
    if (!ids.length) return;
    if (!confirm(`Hapus ${ids.length} skor yang dipilih? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
        await deleteScoresForAdmin(ids);
        selectedScoreIds.clear();
        showToast(`🗑️ ${ids.length} skor berhasil dihapus.`);
        await renderScoresTable();
    } catch (error) {
        showToast(`Gagal menghapus skor: ${error.message}`);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getDefaultFallbackForCategory(catId) {
    if (!CATEGORIES[catId] || catId === "kensetsu") return [];
    if (catId === "shisetsu-engei") {
        return [
            { id: 1, level: "shokyu", year: 2024, question: "おんしつ の なか の おんど が たかすぎるとき は、てんそう や そくそう を あけて かんき します。", reading: "Onshitsu no naka no ondo ga takasugiru toki wa, tensō ya sokusō o akete kanki shimasu.", image: getImageUrl("greenhouse_ventilation.svg"), answer: "○", explanation: "Benar." },
            { id: 2, level: "shokyu", year: 2024, question: "かんすい（みずやり）は、ひ が くれて よる に なって から たっぷり おこないます。", reading: "Kansui (mizuyari) wa, hi ga kurete yoru ni natte kara tappuri okonaimasu.", image: "", answer: "×", explanation: "Salah." },
        ];
    }
    if (catId === "sozai-kako") return [
        { id: 1, level: "shokyu", year: 2024, question: "あぶら で あげた ころっけ や、ごまあえ は、そうざい です。", reading: "Abura de ageta korokke ya, gomaae wa, sōzai desu.", image: "", answer: "○", explanation: "Kroket goreng termasuk souzai." },
        { id: 2, level: "shokyu", year: 2024, question: "むした しゅうまい や、すのもの は、そうざい です。", reading: "Mushita shūmai ya, sunomono wa, sōzai desu.", image: "", answer: "○", explanation: "Shumai kukus termasuk souzai." },
    ];
    return [];
}

window.handleAuthSubmit = handleAuthSubmit;
window.logoutAdmin = logoutAdmin;
window.switchAdminTab = switchAdminTab;
window.switchAdminCategory = switchAdminCategory;
window.handleImageInputManual = handleImageInputManual;
window.handleImageFileUpload = handleImageFileUpload;
window.clearFormImage = clearFormImage;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.handleFormSubmit = handleFormSubmit;
window.deleteQuestion = deleteQuestion;
window.exportQuestionsJSON = exportQuestionsJSON;
window.importQuestionsJSON = importQuestionsJSON;
window.resetToDefault = resetToDefault;
window.syncCurrentQuestionBank = syncCurrentQuestionBank;
window.syncAllQuestionBanks = syncAllQuestionBanks;
window.reloadAllQuestionBanks = reloadAllQuestionBanks;
window.publishLocalQuestionBanks = publishLocalQuestionBanks;
window.deleteSelectedScores = deleteSelectedScores;
