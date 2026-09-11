import {
    fetchAllScoresForAdmin,
    getCurrentSessionProfile,
    isSupabaseConfigured,
    signInWithEmail,
    signOutUser,
} from "./supabase-client.js";
import { buildCategoryMap, getImageUrl, loadCategories } from "./category-config.js";

let categoryList = [];
let CATEGORIES = {};
let currentAdminCategory = "";
let currentAdminTab = "soal";
let currentAdminProfile = null;
let questions = [];
let editingId = null;

document.addEventListener("DOMContentLoaded", async () => {
    await initializeCategories();
    setupAdminEvents();
    updateSetupStatus();
    await restoreAdminSession();
    try {
        await switchAdminCategory(currentAdminCategory);
    } catch (e) {
        console.warn("Init error:", e);
    }
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
}

function updateSetupStatus() {
    const supabaseStatus = document.getElementById("setup-supabase-status");
    const adminStatus = document.getElementById("setup-admin-status");
    if (supabaseStatus) {
        supabaseStatus.textContent = isSupabaseConfigured() ? "Siap" : "Belum dikonfigurasi";
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
    ["soal", "setup", "scores"].forEach((t) => {
        const btn = document.getElementById("tab-btn-" + t);
        if (btn) btn.classList.toggle("active", t === tab);
    });

    const panelSoal = document.getElementById("tab-panel-soal");
    const panelSetup = document.getElementById("tab-panel-setup");
    const panelScores = document.getElementById("tab-panel-scores");
    if (panelSoal) panelSoal.style.display = tab === "soal" ? "" : "none";
    if (panelSetup) panelSetup.style.display = tab === "setup" ? "" : "none";
    if (panelScores) panelScores.style.display = tab === "scores" ? "" : "none";

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
    }
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

    questions = loadedQuestions.map((q, idx) => ({
        id: q.id || idx + 1,
        level: q.level || "shokyu",
        year: q.year ? Number(q.year) : 2024,
        question: q.question || "",
        reading: q.reading || "",
        image: q.image || "",
        answer: q.answer || "○",
        explanation: q.explanation || "",
    }));
    localStorage.setItem(cat.storageKey, JSON.stringify(questions));
}

function persistQuestions() {
    const cat = CATEGORIES[currentAdminCategory];
    localStorage.setItem(cat.storageKey, JSON.stringify(questions));
    populateYearFilter();
    updateStats();
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
            <td><div class="td-question">${escapeHtml(q.question)}</div>${q.image ? `<div class="table-img-badge"><img class="table-img-thumb" src="${escapeHtml(q.image)}" alt="thumb" onerror="this.style.display='none'" /> 🖼️ Gambar</div>` : ""}${q.reading ? `<div class="reading-subtext">${escapeHtml(q.reading)}</div>` : ""}${q.explanation ? `<div class="explanation-subtext"><strong>Penjelasan:</strong> ${escapeHtml(q.explanation)}</div>` : ""}</td>
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
            questions[index] = { id, level: levelVal, year: yearVal, question: questionText, reading: readingText, image: imageText, answer: answerVal, explanation: explanationText };
            showToast("✅ Soal berhasil diperbarui.");
        }
    } else {
        const exists = questions.some((q) => q.id === id);
        const finalId = exists ? getNextId() : id;
        questions.push({ id: finalId, level: levelVal, year: yearVal, question: questionText, reading: readingText, image: imageText, answer: answerVal, explanation: explanationText });
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

        tbody.innerHTML = "";
        if (filtered.length === 0) {
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
                <td class="td-id">#${idx + 1}</td>
                <td><div style="font-weight:700;color:#1e40af;">${escapeHtml(r.username || "—")}</div><div style="font-size:0.82rem;color:#64748b;">${escapeHtml(r.name || "")}</div></td>
                <td><div style="font-size:0.85rem;">${escapeHtml(catName)}</div><div style="font-size:0.78rem;color:#64748b;margin-top:2px;">${levelText} • ${escapeHtml(String(yearText))}</div></td>
                <td><div style="font-weight:800;font-size:1.2rem;color:${scoreColor};">${pct}%</div></td>
                <td><div style="font-size:0.85rem;">✅ ${r.correct} / ${r.total}</div><div style="font-size:0.78rem;color:#64748b;">❌ ${r.wrong} salah</div></td>
                <td><div style="font-size:0.85rem;">${time}</div></td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = "";
        tbody.style.display = "none";
        emptyState.style.display = "block";
        emptyState.querySelector("h3").textContent = "Gagal memuat skor";
        emptyState.querySelector("p").textContent = err.message || "Periksa RLS dan konfigurasi Supabase.";
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
