import {
    fetchOwnScores,
    fetchAdminProfiles,
    createAttendanceSession,
    fetchLatestAttendanceSession,
    upsertAttendanceRecords,
    fetchAttendanceRecords,
    deleteAttendanceSession,
    fetchQuestionBank,
    getCurrentSessionProfile,
    insertScore,
    isSupabaseConfigured,
    signUpUser,
    signInWithEmail,
    signOutUser,
} from "./supabase-client.js";
import { buildCategoryMap, getImageUrl, loadCategories } from "./category-config.js";

// ============================================================
// AUTH STATE
// ============================================================

// State user yang sedang login
let currentUser = null;

let categoryList = [];
let CATEGORIES = {};

// ============================================================
// STATE KUIS
// ============================================================
let currentCategory = null;
let selectedLevel = "shokyu";
let selectedYear = "all";
let rawCategoryQuestions = [];
let allQuestions = []; // Soal yang sudah difilter
let history = [];
let position = -1;
let unseen = new Set();
let userAnswers = {};
let resultsShown = false;
let secretAdminClicks = 0;

// STATE ABSENSI ADMIN
let attendanceProfiles = [];
let attendanceSession = null;
let attendanceRecords = new Map();
let attendancePanelOpen = false;
const ATTENDANCE_STATUSES = {
    pending: { label: "Belum ditandai", icon: "⚪" },
    present: { label: "Hadir", icon: "🟢" },
    late: { label: "Terlambat", icon: "🟡" },
    excused: { label: "Izin", icon: "🔵" },
    absent: { label: "Tidak hadir", icon: "🔴" },
};

// ============================================================
// INISIALISASI
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    await initializeCategories();
    await checkUserSession();
    setupEventListeners();
    setupSecretAdminAccess();
});

async function initializeCategories() {
    categoryList = await loadCategories();
    CATEGORIES = buildCategoryMap(categoryList);
    renderCategoryCards();
}

function renderCategoryCards() {
    const grid = document.getElementById("category-grid");
    if (!grid) return;
    grid.innerHTML = "";
    categoryList.forEach((cat) => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.onclick = () => openCategoryConfig(cat.id);
        card.onkeydown = (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCategoryConfig(cat.id);
            }
        };
        card.innerHTML = `
            <div>
                <div class="cat-top">
                    <span class="cat-icon">${escapeHtml(cat.icon || "📘")}</span>
                    <span class="cat-count-badge" id="count-${cat.id}">0 Soal</span>
                </div>
                <h2 class="cat-title">${escapeHtml(cat.title || cat.name)}</h2>
                <div class="cat-subtitle">${escapeHtml(cat.subtitle || "")}</div>
                <p class="cat-desc">${escapeHtml(cat.description || "")}</p>
            </div>
            <button class="btn-start-cat">Pilih Bidang Ini &rarr;</button>
        `;
        grid.appendChild(card);
    });
}

// ============================================================
// SISTEM AUTENTIKASI USER (Supabase)
// ============================================================

/**
 * Cek apakah ada sesi user Supabase yang masih aktif.
 * Dipanggil saat halaman dimuat.
 */
async function checkUserSession() {
    if (!isSupabaseConfigured()) {
        showLoginScreen();
        showLoginError("Supabase belum dikonfigurasi. Isi public/config/supabase.config.js lalu deploy ulang.");
        return;
    }

    try {
        currentUser = await getCurrentSessionProfile();
        if (currentUser) {
            if (!currentUser.is_admin && (currentUser.approval_status !== "approved" || currentUser.group_active === false)) {
                await signOutUser().catch(() => {});
                showLoginScreen();
                showLoginError(currentUser.group_active === false
                    ? "Grup Anda sedang dinonaktifkan. Silakan hubungi admin."
                    : currentUser.approval_status === "rejected"
                    ? "Pendaftaran Anda belum disetujui. Silakan hubungi sensei kumiai."
                    : "Pendaftaran Anda masih menunggu persetujuan admin.");
                return;
            }
            sessionStorage.setItem("quiz_current_user", JSON.stringify(currentUser));
            showMainApp();
            return;
        }
    } catch (e) {
        console.error("Gagal memeriksa session user:", e);
    }
    showLoginScreen();
}

function showLoginError(message) {
    const errorEl = document.getElementById("login-error");
    errorEl.textContent = message;
    errorEl.style.display = "block";
}

function showMainApp() {
    document.getElementById("screen-login").style.display = "none";
    document.getElementById("main-app").style.display = "block";
    document.getElementById("topbar-username").textContent = currentUser.name || currentUser.username;
    initializeAttendanceUI();
    updateCategoryCounts();
}

async function handleUserLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("login-username").value.trim();
    const passwordInput = document.getElementById("login-password").value.trim();
    const errorEl = document.getElementById("login-error");
    const submitBtn = event.target.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = "Memuat...";

    try {
        await signInWithEmail(usernameInput, passwordInput);
        currentUser = await getCurrentSessionProfile();
        if (!currentUser) throw new Error("Profil user tidak ditemukan.");
        if (!currentUser.is_admin && (currentUser.approval_status !== "approved" || currentUser.group_active === false)) {
            await signOutUser().catch(() => {});
            throw new Error(currentUser.group_active === false
                ? "Grup Anda sedang dinonaktifkan. Silakan hubungi admin."
                : currentUser.approval_status === "rejected"
                ? "Pendaftaran Anda belum disetujui. Silakan hubungi sensei kumiai."
                : "Pendaftaran Anda masih menunggu persetujuan admin.");
        }
        sessionStorage.setItem("quiz_current_user", JSON.stringify(currentUser));
        errorEl.style.display = "none";
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
        submitBtn.disabled = false;
        submitBtn.textContent = "Masuk →";
        showMainApp();
    } catch (e) {
        showLoginError(e.message || "Gagal login ke Supabase.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Masuk →";
        document.getElementById("login-password").value = "";
    }
}

async function handleUserSignup(event) {
    event.preventDefault();
    const form = event.target;
    const name = document.getElementById("signup-name").value.trim();
    const groupName = document.getElementById("signup-group").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const errorEl = document.getElementById("signup-error");
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Mendaftarkan...";
    errorEl.style.display = "none";
    try {
        await signUpUser(email, password, name, groupName);
        currentUser = await getCurrentSessionProfile();
        form.reset();
        showMainApp();
    } catch (e) {
        errorEl.textContent = e.message || "Pendaftaran gagal.";
        errorEl.style.display = "block";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Daftar akun";
    }
}

function showSignupScreen() {
    document.getElementById("screen-login").style.display = "none";
    document.getElementById("screen-signup").style.display = "flex";
}

function showLoginScreen() {
    document.getElementById("screen-signup").style.display = "none";
    document.getElementById("screen-login").style.display = "flex";
    document.getElementById("main-app").style.display = "none";
}

async function handleUserLogout() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        try {
            await signOutUser();
        } catch (e) {
            console.error("Gagal logout:", e);
        }
        currentUser = null;
        closeAttendancePanel();
        attendanceSession = null;
        attendanceRecords = new Map();
        sessionStorage.removeItem("quiz_current_user");
        // Reset kuis state
        currentCategory = null;
        allQuestions = [];
        history = [];
        position = -1;
        userAnswers = {};
        showLoginScreen();
    }
}

// ============================================================
// DATABASE SKOR (server API)
// ============================================================
async function getScoreRecords() {
    if (!currentUser) return [];
    try {
        return await fetchOwnScores(currentUser.id);
    } catch (e) { return []; }
}

async function saveScoreRecord(record) {
    if (!currentUser) return false;
    try {
        await insertScore({
            user_id: currentUser.id,
            username: record.username,
            name: record.name,
            category: record.category,
            category_name: record.categoryName,
            level: record.level,
            year: String(record.year),
            correct: record.correct,
            wrong: record.wrong,
            total: record.total,
            percentage: record.percentage,
            timestamp: record.timestamp,
        });
        return true;
    } catch (e) {
        console.error("Gagal simpan skor:", e);
        return false;
    }
}

// ============================================================
// UPDATE JUMLAH SOAL DI KARTU BIDANG
// ============================================================
async function updateCategoryCounts() {
    for (const cat of categoryList) {
        const catId = cat.id;
        const countBadge = document.getElementById("count-" + catId);
        if (!countBadge) continue;
        const questions = await getQuestionsForCategory(catId);
        countBadge.textContent = questions.length + " Soal";
    }
}

// ============================================================
// MENGAMBIL SOAL
// ============================================================
function normalizeQuestionRecord(question) {
    const legacyTranslation = question.translation || question.explanation || "";
    const hasSeparateExplanation = Boolean(question.translation);
    return {
        ...question,
        translation: legacyTranslation,
        explanation: hasSeparateExplanation
            ? (question.explanation || "")
            : (question.answer === "○"
                ? "Jawaban yang benar adalah ○ karena pernyataan pada soal dinilai sesuai dengan materi yang berlaku."
                : "Jawaban yang benar adalah × karena pernyataan pada soal dinilai tidak sesuai dengan materi yang berlaku."),
    };
}

function normalizeQuestionList(questions) {
    return Array.isArray(questions) ? questions.map(normalizeQuestionRecord) : [];
}

async function getQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    if (!cat) return [];

    const localData = localStorage.getItem(cat.storageKey);

    if (currentUser && isSupabaseConfigured()) {
        try {
            const remoteData = await fetchQuestionBank(catId);
            if (remoteData.length > 0) {
                localStorage.setItem(cat.storageKey, JSON.stringify(remoteData));
                return normalizeQuestionList(remoteData);
            }
        } catch (err) {
            console.warn(`Gagal memuat bank soal ${catId} dari Supabase.`, err);
        }
    }

    try {
        const response = await fetch(`${cat.fileUrl}?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("Format JSON tidak valid");
        localStorage.setItem(cat.storageKey, JSON.stringify(data));
        return normalizeQuestionList(data);
    } catch (err) {
        console.warn(`Gagal memuat ${cat.fileUrl} via fetch.`, err);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed) && parsed.length > 0) return normalizeQuestionList(parsed);
            } catch (storageErr) {
                console.error("Gagal parse localStorage:", storageErr);
            }
        }
        const fallbackData = getDefaultFallbackForCategory(catId);
        localStorage.setItem(cat.storageKey, JSON.stringify(fallbackData));
        return normalizeQuestionList(fallbackData);
    }
}

// ============================================================
// NAVIGASI LAYAR
// ============================================================
async function openCategoryConfig(catId) {
    const cat = CATEGORIES[catId];
    if (!cat) return;

    currentCategory = catId;
    rawCategoryQuestions = await getQuestionsForCategory(catId);

    document.getElementById("screen-categories").style.display = "none";
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-results").style.display = "none";
    document.getElementById("screen-config").style.display = "block";

    document.getElementById("config-cat-title").textContent = cat.name;

    selectedLevel = "shokyu";
    selectedYear = "all";

    renderLevelOptions();
    renderYearOptions();
    showLevelStep();
    updateConfigSummary();
}

function selectLevel(level) {
    selectedLevel = level;
    selectedYear = "all";
    renderLevelOptions();
    renderYearOptions();
    updateConfigSummary();
}

function showLevelStep() {
    document.getElementById("config-step-level").style.display = "block";
    document.getElementById("config-step-year").style.display = "none";
}

function showYearStep() {
    renderYearOptions();
    updateConfigSummary();
    document.getElementById("config-step-level").style.display = "none";
    document.getElementById("config-step-year").style.display = "block";
}

function renderLevelOptions() {
    const optShokyu = document.getElementById("opt-level-shokyu");
    const optSenmon = document.getElementById("opt-level-senmonkyu");

    if (selectedLevel === "shokyu") {
        optShokyu.classList.add("selected");
        optSenmon.classList.remove("selected");
    } else {
        optSenmon.classList.add("selected");
        optShokyu.classList.remove("selected");
    }
}

function renderYearOptions() {
    const container = document.getElementById("year-options-container");
    container.innerHTML = "";

    const levelQuestions = rawCategoryQuestions.filter(
        (q) => (q.level || "shokyu") === selectedLevel
    );
    const yearsSet = new Set();
    levelQuestions.forEach((q) => {
        if (q.year) yearsSet.add(Number(q.year));
    });

    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    const allOption = document.createElement("button");
    allOption.type = "button";
    allOption.className = "year-option" + (selectedYear === "all" ? " selected" : "");
    allOption.setAttribute("role", "radio");
    allOption.setAttribute("aria-checked", String(selectedYear === "all"));
    allOption.innerHTML = `<span class="year-option-mark">🌟</span><span><strong>Semua Tahun</strong><small>${levelQuestions.length} soal tersedia</small></span>`;
    allOption.onclick = () => selectYear("all");
    container.appendChild(allOption);

    sortedYears.forEach((yr) => {
        const count = levelQuestions.filter((q) => Number(q.year) === yr).length;
        const option = document.createElement("button");
        option.type = "button";
        option.className = "year-option" + (selectedYear === String(yr) ? " selected" : "");
        option.setAttribute("role", "radio");
        option.setAttribute("aria-checked", String(selectedYear === String(yr)));
        option.innerHTML = `<span class="year-option-mark">📅</span><span><strong>Tahun ${yr}</strong><small>${count} soal tersedia</small></span>`;
        option.onclick = () => selectYear(String(yr));
        container.appendChild(option);
    });
}

function selectYear(yr) {
    selectedYear = yr;
    renderYearOptions();
    updateConfigSummary();
}

function updateConfigSummary() {
    const matched = getFilteredQuestions();
    const countEl = document.getElementById("config-question-count");
    const detailEl = document.getElementById("config-summary-detail");
    const btnLaunch = document.getElementById("btn-start-quiz");

    countEl.textContent = matched.length + " Soal";

    const levelText = selectedLevel === "shokyu" ? "初級 (Shokyu)" : "専門級 (Senmonkyu)";
    const yearText = selectedYear === "all" ? "Semua Tahun" : "Tahun " + selectedYear;
    const sessionText = `Semua ${matched.length} soal`;
    detailEl.textContent = `${levelText} • ${yearText} • ${sessionText}`;

    if (matched.length === 0) {
        btnLaunch.disabled = true;
        btnLaunch.textContent = "Belum Ada Soal untuk Kriteria Ini";
    } else {
        btnLaunch.disabled = false;
        btnLaunch.innerHTML = `🚀 Mulai Latihan Kuis (${matched.length} Soal) &rarr;`;
    }
}

function getFilteredQuestions() {
    return rawCategoryQuestions.filter((q) => {
        const matchLevel = (q.level || "shokyu") === selectedLevel;
        const matchYear =
            selectedYear === "all" || String(q.year) === String(selectedYear);
        return matchLevel && matchYear;
    });
}

// ============================================================
// MULAI KUIS
// ============================================================
function launchQuiz() {
    const matched = getFilteredQuestions();
    allQuestions = [...matched].sort(() => Math.random() - 0.5);
    if (allQuestions.length === 0) {
        alert("Tidak ada soal yang cocok dengan pilihan level dan tahun tersebut.");
        return;
    }

    const cat = CATEGORIES[currentCategory];

    // Sembunyikan semua layar lain
    document.getElementById("screen-config").style.display = "none";
    document.getElementById("screen-results").style.display = "none";
    document.getElementById("screen-quiz").style.display = "flex";
    const topbarControls = document.getElementById("quiz-topbar-controls");
    if (topbarControls) topbarControls.style.display = "flex";

    document.getElementById("quiz-cat-name").textContent = cat.shortName;
    const levelName = selectedLevel === "shokyu" ? "🔰 初級" : "⭐ 専門級";
    const yearName = selectedYear === "all" ? "Semua Tahun" : selectedYear;
    document.getElementById("quiz-level-year-badge").textContent = `${levelName} • ${yearName}`;

    history = [];
    position = -1;
    unseen = new Set(allQuestions.map((q) => q.id));
    userAnswers = {};
    resultsShown = false;

    nextQuestion();
}

function backToConfig() {
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-results").style.display = "none";
    document.getElementById("screen-config").style.display = "block";
    const topbarControls = document.getElementById("quiz-topbar-controls");
    if (topbarControls) topbarControls.style.display = "none";
    showLevelStep();
    updateConfigSummary();
}

function backToCategories() {
    document.getElementById("screen-config").style.display = "none";
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-results").style.display = "none";
    document.getElementById("screen-categories").style.display = "block";
    const topbarControls = document.getElementById("quiz-topbar-controls");
    if (topbarControls) topbarControls.style.display = "none";
    currentCategory = null;
    updateCategoryCounts();
}

// ============================================================
// RENDER SOAL
// ============================================================
function updateScoreStats() {
    let correctCount = 0;
    let wrongCount = 0;
    for (const key in userAnswers) {
        if (userAnswers[key].isCorrect) {
            correctCount++;
        } else {
            wrongCount++;
        }
    }
    const statCorrect = document.getElementById("stat-correct");
    const statWrong = document.getElementById("stat-wrong");
    if (statCorrect) statCorrect.textContent = "Benar: " + correctCount;
    if (statWrong) statWrong.textContent = "Salah: " + wrongCount;
}

function render() {
    const q = allQuestions.find((x) => x.id === history[position]);
    if (!q) return;

    document.getElementById("meta").textContent = `Soal #${q.id} ${q.year ? `(${q.year})` : ""}`;
    document.getElementById("question").textContent = q.question;
    document.getElementById("reading").textContent = q.reading || "";
    const meaning = document.getElementById("meaning");
    if (meaning) meaning.textContent = q.translation || "Terjemahan belum tersedia.";

    const imgWrap = document.getElementById("question-image-wrap");
    const imgEl = document.getElementById("question-image");
    if (q.image && q.image.trim() !== "") {
        imgEl.src = q.image;
        imgWrap.style.display = "block";
    } else {
        imgEl.src = "";
        imgWrap.style.display = "none";
    }

    const btnTrue = document.getElementById("btn-true");
    const btnFalse = document.getElementById("btn-false");
    const feedback = document.getElementById("feedback");

    // Reset tampilan default
    btnTrue.className = "choice-btn";
    btnFalse.className = "choice-btn";
    feedback.style.display = "none";
    feedback.className = "feedback-box";

    const record = userAnswers[q.id];
    if (record) {
        // Soal sudah dijawab — tampilkan visual dan kunci jawaban
        applyAnswerVisuals(q, record.chosen, record.isCorrect);
        // KUNCI: nonaktifkan tombol agar jawaban tidak bisa diubah
        btnTrue.disabled = true;
        btnFalse.disabled = true;
    } else {
        // Belum dijawab — aktifkan tombol
        btnTrue.disabled = false;
        btnFalse.disabled = false;
    }

    document.getElementById("back").disabled = position <= 0;
    const progressText = "Sudah muncul: " + history.length + " / " + allQuestions.length;
    const progressFooter = document.getElementById("progress");
    if (progressFooter) progressFooter.textContent = progressText;
    const topbarContext = document.getElementById("topbar-quiz-context");
    if (topbarContext) {
        topbarContext.textContent = [
            document.getElementById("quiz-cat-name")?.textContent,
            document.getElementById("quiz-level-year-badge")?.textContent,
            document.getElementById("meta")?.textContent,
        ].filter(Boolean).join(" · ");
    }

    updateScoreStats();
}

// ============================================================
// PILIH JAWABAN (Hanya bisa sekali per soal)
// ============================================================
function selectAnswer(choice) {
    const q = allQuestions.find((x) => x.id === history[position]);
    if (!q) return;

    // Jika soal sudah dijawab, abaikan klik
    if (userAnswers[q.id]) return;

    const isCorrect = choice === q.answer;

    userAnswers[q.id] = {
        chosen: choice,
        isCorrect: isCorrect,
    };

    applyAnswerVisuals(q, choice, isCorrect);
    updateScoreStats();

    // Nonaktifkan tombol setelah menjawab
    document.getElementById("btn-true").disabled = true;
    document.getElementById("btn-false").disabled = true;

    // Cek apakah ini soal terakhir yang belum dijawab
    // (semua soal sudah muncul dan semua sudah dijawab)
    checkIfQuizComplete();
}

/**
 * Cek apakah kuis sudah selesai: semua soal sudah muncul DAN dijawab.
 */
function checkIfQuizComplete() {
    if (unseen.size > 0) return; // masih ada soal yang belum muncul

    // Semua soal sudah muncul, cek apakah semua sudah dijawab
    const totalAnswered = Object.keys(userAnswers).length;
    if (totalAnswered >= allQuestions.length) {
        // Semua selesai — tampilkan hasil setelah jeda singkat
        setTimeout(() => showResults(), 800);
    }
}

// ============================================================
// TAMPILKAN LAYAR HASIL SKOR
// ============================================================
async function showResults() {
    // Cegah double-click atau dua event selesai yang masuk hampir bersamaan.
    if (resultsShown) return;
    resultsShown = true;
    const totalQ = allQuestions.length;
    let correct = 0;
    for (const key in userAnswers) {
        if (userAnswers[key].isCorrect) correct++;
    }
    const wrong = totalQ - correct;
    const pct = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;

    // Tentukan trophy dan pesan berdasarkan nilai
    let trophy, title, subtitle;
    if (pct >= 90) {
        trophy = "🏆";
        title = "Luar Biasa! Nilai Sempurna!";
        subtitle = "Penguasaan materi Anda sangat baik!";
    } else if (pct >= 75) {
        trophy = "🥇";
        title = "Bagus! Kamu Lulus!";
        subtitle = "Tetap semangat untuk meningkatkan nilai!";
    } else if (pct >= 60) {
        trophy = "🥈";
        title = "Hampir Lulus!";
        subtitle = "Perlu belajar lagi untuk soal yang salah.";
    } else {
        trophy = "📚";
        title = "Perlu Lebih Banyak Latihan";
        subtitle = "Jangan menyerah, coba lagi setelah belajar!";
    }

    document.getElementById("results-trophy").textContent = trophy;
    document.getElementById("results-title").textContent = title;
    document.getElementById("results-subtitle").textContent = subtitle;
    document.getElementById("results-score-pct").textContent = pct + "%";
    document.getElementById("results-correct").textContent = correct;
    document.getElementById("results-wrong").textContent = wrong;
    document.getElementById("results-total").textContent = totalQ;

    // Warna lingkaran skor berdasarkan nilai
    const scoreCircle = document.getElementById("results-score-circle");
    scoreCircle.className = "results-score-circle";
    if (pct >= 75) {
        scoreCircle.classList.add("score-pass");
    } else if (pct >= 60) {
        scoreCircle.classList.add("score-near");
    } else {
        scoreCircle.classList.add("score-fail");
    }

    // Info bidang, level, tahun
    const cat = CATEGORIES[currentCategory];
    const levelName = selectedLevel === "shokyu" ? "初級 (Shokyu)" : "専門級 (Senmonkyu)";
    const yearName = selectedYear === "all" ? "Semua Tahun" : "Tahun " + selectedYear;
    document.getElementById("results-meta-info").textContent =
        `${cat ? cat.shortName : ""} • ${levelName} • ${yearName}`;

    // Simpan skor ke database
    let scoreSaved = false;
    if (currentUser) {
        const record = {
            username: currentUser.username,
            name: currentUser.name || currentUser.username,
            category: currentCategory,
            categoryName: cat ? cat.name : currentCategory,
            level: selectedLevel,
            year: selectedYear,
            correct: correct,
            wrong: wrong,
            total: totalQ,
            percentage: pct,
            timestamp: new Date().toISOString(),
        };
        scoreSaved = await saveScoreRecord(record);
    }

    const scoreSaveStatus = document.getElementById("score-save-status");
    if (scoreSaveStatus) {
        scoreSaveStatus.className = scoreSaved ? "score-save-status success" : "score-save-status warning";
        scoreSaveStatus.textContent = scoreSaved
            ? "✅ Skor berhasil disimpan ke riwayat akun Anda."
            : "⚠️ Skor belum berhasil disimpan. Silakan hubungi admin atau coba lagi nanti.";
    }



    // Tampilkan layar hasil
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-results").style.display = "block";
}

// ============================================================
// APPLY VISUAL JAWABAN
// ============================================================
function applyAnswerVisuals(q, choice, isCorrect) {
    const btnTrue = document.getElementById("btn-true");
    const btnFalse = document.getElementById("btn-false");
    const feedback = document.getElementById("feedback");
    const feedbackTitle = document.getElementById("feedback-title");
    const feedbackExplanation = document.getElementById("feedback-explanation");

    btnTrue.className = "choice-btn";
    btnFalse.className = "choice-btn";

    if (isCorrect) {
        if (choice === "○") {
            btnTrue.classList.add("correct");
        } else {
            btnFalse.classList.add("correct");
        }
        feedback.className = "feedback-box correct-box";
        feedbackTitle.innerHTML = "🎉 <span>Jawaban Kamu Tepat! (Benar)</span>";
    } else {
        if (choice === "○") {
            btnTrue.classList.add("wrong");
            btnFalse.classList.add("reveal-correct");
        } else {
            btnFalse.classList.add("wrong");
            btnTrue.classList.add("reveal-correct");
        }
        feedback.className = "feedback-box wrong-box";
        feedbackTitle.innerHTML = "❌ <span>Jawaban Kamu Kurang Tepat!</span>";
    }

    feedbackExplanation.innerHTML = `<strong>Kunci Jawaban: ${
        q.answer === "○" ? "○ (BENAR)" : "✕ (SALAH)"
    }</strong>${q.explanation ? `<div class="feedback-reason">${escapeHtml(q.explanation)}</div>` : ""}`;
    feedback.style.display = "block";
}

// ============================================================
// NAVIGASI SOAL
// ============================================================
function nextQuestion() {
    if (position < history.length - 1) {
        position++;
        render();
        return;
    }
    if (unseen.size === 0) {
        // Semua soal sudah pernah muncul — jika semua sudah dijawab, tampilkan hasil
        const totalAnswered = Object.keys(userAnswers).length;
        if (totalAnswered >= allQuestions.length) {
            showResults();
        }
        return;
    }
    const arr = [...unseen];
    const id = arr[Math.floor(Math.random() * arr.length)];
    unseen.delete(id);
    history.push(id);
    position++;
    render();
}

function prevQuestion() {
    if (position > 0) {
        position--;
        render();
    }
}

function resetSession() {
    if (confirm("Mulai ulang seluruh sesi kuis ini dari awal?")) {
        launchQuiz();
    }
}

// ============================================================
// ABSENSI ADMIN
// ============================================================
function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function initializeAttendanceUI() {
    if (!currentUser?.is_admin) {
        return;
    }

    document.getElementById("attendance-date").value = localDateString();
    try {
        attendanceProfiles = (await fetchAdminProfiles()).filter((profile) =>
            !profile.is_admin && profile.approval_status === "approved" && profile.group_name
        );
        populateAttendanceGroups();
    } catch (error) {
        showAttendanceFeedback("Daftar peserta belum dapat dimuat. Pastikan migrasi database absensi sudah dijalankan.", true);
        console.error("Gagal memuat peserta absensi:", error);
    }
}

function populateAttendanceGroups() {
    const select = document.getElementById("attendance-group-select");
    if (!select) return;
    const groups = [...new Set(attendanceProfiles.map((profile) => profile.group_name.trim()))]
        .sort((a, b) => a.localeCompare(b, "id"));
    select.innerHTML = groups.length
        ? groups.map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`).join("")
        : `<option value="">Belum ada grup peserta</option>`;
}

function toggleAttendancePanel() {
    if (!currentUser?.is_admin) return;
    const panel = document.getElementById("attendance-panel");
    if (!panel) return;
    attendancePanelOpen = !attendancePanelOpen;
    if (attendancePanelOpen) updateAttendancePanelPosition();
    panel.classList.toggle("open", attendancePanelOpen);
    document.getElementById("attendance-backdrop")?.classList.toggle("open", attendancePanelOpen);
    panel.setAttribute("aria-hidden", String(!attendancePanelOpen));
}

function updateAttendancePanelPosition() {
    const topbar = document.querySelector(".user-topbar");
    const panel = document.getElementById("attendance-panel");
    const backdrop = document.getElementById("attendance-backdrop");
    if (!topbar || !panel || !backdrop) return;
    const top = Math.max(0, Math.ceil(topbar.getBoundingClientRect().bottom));
    panel.style.top = `${top}px`;
    panel.style.height = `calc(100vh - ${top}px)`;
    backdrop.style.top = `${top}px`;
}

function closeAttendancePanel() {
    attendancePanelOpen = false;
    document.getElementById("attendance-panel")?.classList.remove("open");
    document.getElementById("attendance-backdrop")?.classList.remove("open");
    document.getElementById("attendance-panel")?.setAttribute("aria-hidden", "true");
}

async function startAttendanceSession() {
    if (!currentUser?.is_admin) return;
    const groupName = document.getElementById("attendance-group-select")?.value;
    const sessionDate = document.getElementById("attendance-date")?.value;
    const title = document.getElementById("attendance-title")?.value.trim() || "Pertemuan";
    const button = document.getElementById("attendance-start-btn");
    if (!groupName || !sessionDate) {
        showAttendanceFeedback("Pilih grup dan tanggal terlebih dahulu.", true);
        return;
    }

    button.disabled = true;
    button.textContent = "Memuat sesi...";
    try {
        attendanceSession = await fetchLatestAttendanceSession(groupName, sessionDate);
        if (!attendanceSession) {
            attendanceSession = await createAttendanceSession({
                admin_id: currentUser.id,
                group_name: groupName,
                session_date: sessionDate,
                title,
            });
        }
        const existing = await fetchAttendanceRecords(attendanceSession.id);
        attendanceRecords = new Map(existing.map((record) => [record.user_id, record]));

        const roster = attendanceProfiles.filter((profile) => profile.group_name.trim() === groupName);
        const missing = roster
            .filter((profile) => !attendanceRecords.has(profile.id))
            .map((profile) => ({
                session_id: attendanceSession.id,
                user_id: profile.id,
                name: profile.name || profile.username,
                status: "pending",
            }));
        if (missing.length) {
            const created = await upsertAttendanceRecords(missing);
            created.forEach((record) => attendanceRecords.set(record.user_id, record));
        }
        renderAttendanceRoster(roster);
        showAttendanceFeedback(`Sesi ${formatAttendanceDate(attendanceSession.session_date)} siap digunakan.`);
    } catch (error) {
        showAttendanceFeedback(error.message || "Sesi absensi gagal dibuka.", true);
        console.error("Gagal membuka sesi absensi:", error);
    } finally {
        button.disabled = false;
        button.textContent = "Buka / Buat Sesi";
    }
}

function formatAttendanceDate(value) {
    if (!value) return "";
    return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    });
}

function renderAttendanceRoster(roster) {
    const info = document.getElementById("attendance-session-info");
    const summary = document.getElementById("attendance-summary");
    const actions = document.getElementById("attendance-actions");
    const list = document.getElementById("attendance-roster");
    info.style.display = "block";
    info.innerHTML = `<strong>${escapeHtml(attendanceSession.title || "Pertemuan")}</strong><span>${formatAttendanceDate(attendanceSession.session_date)} · ${escapeHtml(attendanceSession.group_name)}</span><button type="button" class="attendance-delete-btn" onclick="deleteCurrentAttendanceSession()">🗑️ Hapus sesi</button>`;
    actions.style.display = "flex";
    list.innerHTML = roster.length ? roster.map((profile) => {
        const record = attendanceRecords.get(profile.id) || { status: "pending" };
        const status = ATTENDANCE_STATUSES[record.status] || ATTENDANCE_STATUSES.pending;
        return `<div class="attendance-person" data-user-id="${escapeHtml(profile.id)}">
            <div class="attendance-person-name"><span class="attendance-status-dot status-${record.status}">${status.icon}</span><span>${escapeHtml(profile.name || profile.username)}</span></div>
            <select class="attendance-status-select status-${record.status}" onchange="updateAttendanceStatus('${escapeHtml(profile.id)}', this.value)">
                ${Object.entries(ATTENDANCE_STATUSES).map(([key, value]) => `<option value="${key}" ${record.status === key ? "selected" : ""}>${value.icon} ${value.label}</option>`).join("")}
            </select>
        </div>`;
    }).join("") : `<div class="attendance-empty">Tidak ada peserta aktif di grup ini.</div>`;
    updateAttendanceSummary();
}

async function deleteCurrentAttendanceSession() {
    if (!currentUser?.is_admin || !attendanceSession) return;
    const sessionLabel = `${attendanceSession.title || "Pertemuan"} (${formatAttendanceDate(attendanceSession.session_date)})`;
    if (!confirm(`Hapus sesi ${sessionLabel}? Semua data absensi dalam sesi ini juga akan dihapus.`)) return;

    try {
        await deleteAttendanceSession(attendanceSession.id);
        attendanceSession = null;
        attendanceRecords = new Map();
        document.getElementById("attendance-session-info").style.display = "none";
        document.getElementById("attendance-summary").style.display = "none";
        document.getElementById("attendance-actions").style.display = "none";
        document.getElementById("attendance-roster").innerHTML = `<div class="attendance-empty">Sesi dihapus. Pilih tanggal atau grup untuk membuat sesi baru.</div>`;
        showAttendanceFeedback("Sesi dan seluruh data absensinya berhasil dihapus.");
    } catch (error) {
        showAttendanceFeedback(error.message || "Sesi gagal dihapus.", true);
    }
}

async function updateAttendanceStatus(userId, status) {
    if (!attendanceSession || !ATTENDANCE_STATUSES[status]) return;
    const profile = attendanceProfiles.find((item) => item.id === userId);
    if (!profile) return;
    try {
        const updated = await upsertAttendanceRecords([{
            session_id: attendanceSession.id,
            user_id: userId,
            name: profile.name || profile.username,
            status,
            marked_at: status === "pending" ? null : new Date().toISOString(),
        }]);
        if (updated[0]) attendanceRecords.set(userId, updated[0]);
        updateAttendanceSummary();
        const row = document.querySelector(`.attendance-person[data-user-id="${CSS.escape(userId)}"]`);
        if (row) {
            row.querySelector(".attendance-status-dot").className = `attendance-status-dot status-${status}`;
            row.querySelector(".attendance-status-dot").textContent = ATTENDANCE_STATUSES[status].icon;
            row.querySelector(".attendance-status-select").className = `attendance-status-select status-${status}`;
        }
    } catch (error) {
        showAttendanceFeedback(error.message || "Status absensi gagal disimpan.", true);
    }
}

async function markRemainingAttendance(status) {
    if (!attendanceSession) return;
    const roster = attendanceProfiles.filter((profile) => profile.group_name.trim() === attendanceSession.group_name);
    const targets = roster.filter((profile) => (attendanceRecords.get(profile.id)?.status || "pending") === "pending");
    if (!targets.length) return;
    try {
        const saved = await upsertAttendanceRecords(targets.map((profile) => ({
            session_id: attendanceSession.id,
            user_id: profile.id,
            name: profile.name || profile.username,
            status,
            marked_at: new Date().toISOString(),
        })));
        saved.forEach((record) => attendanceRecords.set(record.user_id, record));
        renderAttendanceRoster(roster);
    } catch (error) {
        showAttendanceFeedback(error.message || "Absensi gagal disimpan.", true);
    }
}

function updateAttendanceSummary() {
    const summary = document.getElementById("attendance-summary");
    if (!summary || !attendanceSession) return;
    const records = [...attendanceRecords.values()].filter((record) => record.session_id === attendanceSession.id);
    const present = records.filter((record) => record.status === "present" || record.status === "late").length;
    const marked = records.filter((record) => record.status !== "pending").length;
    summary.style.display = "block";
    summary.innerHTML = `<strong>${present} hadir</strong><span>${marked} ditandai · ${records.length} peserta</span>`;
}

function showAttendanceFeedback(message, isError = false) {
    const feedback = document.getElementById("attendance-feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `attendance-feedback${isError ? " error" : ""}`;
}

// ============================================================
// LIGHTBOX GAMBAR
// ============================================================
function openImageLightbox(src) {
    const modal = document.getElementById("image-lightbox-modal");
    const img = document.getElementById("lightbox-img");
    if (modal && img && src) {
        img.src = src;
        modal.classList.add("open");
    }
}

function closeImageLightbox() {
    const modal = document.getElementById("image-lightbox-modal");
    if (modal) {
        modal.classList.remove("open");
    }
}

// ============================================================
// EVENT LISTENERS & SHORTCUT KEYBOARD
// ============================================================
function setupEventListeners() {
    document.getElementById("next").onclick = nextQuestion;
    document.getElementById("back").onclick = prevQuestion;
    window.addEventListener("resize", () => {
        if (attendancePanelOpen) updateAttendancePanelPosition();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeImageLightbox();
            closeAttendancePanel();
            return;
        }

        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

        if (currentUser?.is_admin && !e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            toggleAttendancePanel();
            return;
        }

        // Shortcut rahasia admin: Alt + A atau Ctrl + Shift + A
        if (
            (e.altKey && e.key.toLowerCase() === "a") ||
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")
        ) {
            e.preventDefault();
            window.location.href = "admin.html";
            return;
        }

        if (
            document.getElementById("screen-quiz") &&
            document.getElementById("screen-quiz").style.display !== "none"
        ) {
            if (e.key === "1" || e.key.toLowerCase() === "o") {
                selectAnswer("○");
            } else if (e.key === "2" || e.key.toLowerCase() === "x") {
                selectAnswer("×");
            } else if (e.key === "ArrowRight") {
                nextQuestion();
            } else if (e.key === "ArrowLeft") {
                prevQuestion();
            }
        }
    });
}

function setupSecretAdminAccess() {
    const triggers = ["hero-badge-title", "meta"];
    triggers.forEach((elId) => {
        const el = document.getElementById(elId);
        if (el) {
            el.addEventListener("click", () => {
                secretAdminClicks++;
                if (secretAdminClicks >= 5) {
                    secretAdminClicks = 0;
                    window.location.href = "admin.html";
                }
                setTimeout(() => {
                    secretAdminClicks = 0;
                }, 2000);
            });
        }
    });
}

function escapeHtml(text) {
    if (!text) return "";
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// ============================================================
// FALLBACK DATA BAWAAN
// ============================================================
function getDefaultFallbackForCategory(catId) {
    if (!CATEGORIES[catId] || catId === "kensetsu") {
        return [];
    }

    if (catId === "shisetsu-engei") {
        return [
            { id: 1, level: "shokyu", year: 2024, question: "おんしつ の なか の おんど が たかすぎるとき は、てんそう や そくそう を あけて かんき します。", reading: "Onshitsu no naka no ondo ga takasugiru toki wa, tensō ya sokusō o akete kanki shimasu.", image: getImageUrl("greenhouse_ventilation.svg"), answer: "○", explanation: "Benar. Jika suhu di dalam rumah kaca terlalu tinggi, buka ventilasi atap (tensō) atau ventilasi samping (sokusō) untuk sirkulasi udara." },
            { id: 2, level: "shokyu", year: 2024, question: "かんすい（みずやり）は、ひ が くれて よる に なって から たっぷり おこないます。", reading: "Kansui (mizuyari) wa, hi ga kurete yoru ni natte kara tappuri okonaimasu.", image: "", answer: "×", explanation: "Salah. Penyiraman (kansui) umumnya dilakukan pada pagi hari agar kelembapan udara malam hari tidak memicu penyakit jamur tanaman." },
            { id: 3, level: "shokyu", year: 2023, question: "のうやく を さんぷ するとき は、ますく や めがね、ぼうごふく を ちゃくよう します。", reading: "Nōyaku o sampai suru toki wa, masuku ya megane, bōgofuku o chakuyō shimasu.", image: getImageUrl("spray_equipment.svg"), answer: "○", explanation: "Benar. Saat menyemprot pestisida (nōyaku), wajib memakai masker pelindung, kacamata pengaman, sarung tangan, dan baju pelindung." },
            { id: 4, level: "shokyu", year: 2023, question: "しゅうかく した やさい は、ちょくしゃにっこう が あたる あつい ばしょ に ほうち します。", reading: "Shūkaku shita yasai wa, chokusha-nikkō ga ataru atsui basho ni hōchi shimasu.", image: "", answer: "×", explanation: "Salah. Sayuran yang baru dipanen harus segera ditaruh di tempat teduh/sejuk dan tidak terkena sinar matahari langsung agar tidak layu." },
            { id: 5, level: "shokyu", year: 2022, question: "はさみ など の のうぐ は、つかいおわったら つち や よごれ を おとして ていれ します。", reading: "Hasami nado no nōgu wa, tsukaiowattara tsuchi ya yogore o otoshite teire shimasu.", image: "", answer: "○", explanation: "Benar. Gunting pangkas dan alat pertanian lainnya setelah digunakan harus dibersihkan dari tanah/getah untuk mencegah karat dan penularan hama penyakit." },
            { id: 101, level: "senmonkyu", year: 2024, question: "ようえきさいばい（すいこうさいばい）に おいて、ばいようえき の EC（でんきでんどうど）と pH の かんり は きわめて じゅうよう です。", reading: "Yōeki saibai (suikō saibai) ni oite, baiyōeki no EC (denki dendōdo) to pH no kanri wa kiwamete jūyō desu.", image: "", answer: "○", explanation: "Benar. Pada budidaya hidroponik/larutan nutrisi, pengukuran dan pengendalian nilai EC (kepekatan nutrisi) serta pH larutan sangat penting bagi pertumbuhan akar tanaman." },
            { id: 102, level: "senmonkyu", year: 2023, question: "ひるま の おんしつない の にさんかたんそ（CO2）のうど は、こうごうせい に よって しぜんかい より たかく なります。", reading: "Hiruma no onshitsunai no nisanka tanso (CO2) nōdo wa, kōgōsei ni yotte shizenkai yori takaku narimasu.", image: "", answer: "×", explanation: "Salah. Pada siang hari, tanaman melakukan fotosintesis secara aktif sehingga konsentrasi CO2 di dalam rumah kaca yang tertutup justru akan menurun jika tidak dilakukan ventilasi atau injeksi CO2." }
        ];
    }

    if (catId === "sozai-kako") return [
        { id: 1, level: "shokyu", year: 2024, question: "あぶら で あげた ころっけ や、ごまあえ は、そうざい です。", reading: "Abura de ageta korokke ya, gomaae wa, sōzai desu.", image: "", answer: "○", explanation: "Kroket goreng dan salad gomaae (sayuran saus wijen) termasuk ke dalam jenis lauk olahan (souzai)." },
        { id: 2, level: "shokyu", year: 2024, question: "むした しゅうまい や、すのもの は、そうざい です。", reading: "Mushita shūmai ya, sunomono wa, sōzai desu.", image: "", answer: "○", explanation: "Shumai kukus dan sunomono (acar/makanan asam) termasuk kategori lauk olahan (souzai)." },
        { id: 3, level: "shokyu", year: 2024, question: "にた かぼちゃ や、 ぽてとさらだ は、 そうざい です。", reading: "Nita kabocha ya, potetosarada wa, sōzai desu.", image: "", answer: "○", explanation: "Labu rebus (nita kabocha) dan salad kentang (potato salad) adalah souzai." },
        { id: 4, level: "shokyu", year: 2024, question: "むした じゃがいも と、さっきん した にんじん を まぜた もの は、そうざい です。", reading: "Mushita jagaimo to, sakkin shita ninjin o mazeta mono wa, sōzai desu.", image: "", answer: "○", explanation: "Campuran kentang kukus dan wortel yang disterilkan adalah produk souzai." },
        { id: 5, level: "shokyu", year: 2024, question: "すらいす する しょくざい を かえる とき は、いちど すらいさー を あらいます。", reading: "Suraisu suru shokuzai o kaeru toki wa, ichido suraisā o araimasu.", image: "", answer: "○", explanation: "Saat mengganti bahan yang akan diiris dengan slicer, mesin harus dicuci terlebih dahulu untuk mencegah kontaminasi silang." },
        { id: 6, level: "shokyu", year: 2024, question: "れいとうにく を かいとう する とき は、とれー や こんてな に いれます。", reading: "Reitōniku o kaitō suru toki wa, torē ya kontena ni iremasu.", image: "", answer: "○", explanation: "Mencairkan daging beku harus menggunakan baki (tray) atau wadah kontainer agar cairan drip daging tidak mengontaminasi tempat lain." },
        { id: 7, level: "shokyu", year: 2024, question: "れいとう の えび を かいとう する とき は、とれー や こんてな に いれません。", reading: "Reitō no ebi o kaitō suru toki wa, torē ya kontena ni iremasen.", image: "", answer: "×", explanation: "Mencairkan udang beku juga harus ditaruh di dalam wadah/baki (tray) agar higienis dan cairan tidak mengontaminasi." },
        { id: 8, level: "shokyu", year: 2024, question: "ふくろ に はいった しょくざい を、みず の なか で かいとう する とき は、ふくろ に あな が あいて いない か かくにん します。", reading: "Fukuro ni haitta shokuzai o, mizu no naka de kaitō suru toki wa, fukuro ni ana ga aite inai ka kakunin shimasu.", image: "", answer: "○", explanation: "Saat mencairkan makanan berbungkus di dalam air, wajib memeriksa tidak ada lubang/bocor agar air tidak masuk ke makanan." },
        { id: 9, level: "shokyu", year: 2024, question: "さっきんざい の のうど は、きじゅん より こく します。", reading: "Sakkin-zai no nōdo wa, kijun yori koku shimasu.", image: "", answer: "×", explanation: "Konsentrasi disinfektan/cairan sterilisasi harus sesuai takaran standar (kijun), tidak boleh dibuat terlalu pekat." },
        { id: 10, level: "shokyu", year: 2024, question: "さっきんざい の のうど は、きじゅん より うすく します。", reading: "Sakkin-zai no nōdo wa, kijun yori usuku shimasu.", image: "", answer: "×", explanation: "Konsentrasi disinfektan tidak boleh lebih encer dari standar karena daya bunuh bakterinya akan berkurang." },
        { id: 11, level: "shokyu", year: 2024, question: "さっきんざい が ない とき は、せんざい を つかいます。", reading: "Sakkin-zai ga nai toki wa, senzai o tsukaimasu.", image: "", answer: "×", explanation: "Deterjen biasa (senzai) hanya untuk membersihkan kotoran, tidak bisa menggantikan fungsi disinfektan pembunuh kuman (sakkin-zai)." },
        { id: 12, level: "shokyu", year: 2024, question: "しょくざい を れいぞうこ に ほかん する とき は、ようき に ふた を します。", reading: "Shokuzai o reizōko ni hokan suru toki wa, yōki ni futa o shimasu.", image: "", answer: "○", explanation: "Saat menyimpan bahan makanan di dalam kulkas, wadah wajib ditutup rapat." },
        { id: 13, level: "shokyu", year: 2024, question: "ゆか や かべ は、そうじ しません。", reading: "Yuka ya kabe wa, sōji shimasen.", image: "", answer: "×", explanation: "Lantai dan dinding ruang kerja pabrik makanan wajib dibersihkan secara berkala." },
        { id: 14, level: "shokyu", year: 2024, question: "つめ を、ながく のばして います。", reading: "Tsume o, nagaku nobashite imasu.", image: "", answer: "×", explanation: "Kuku tidak boleh dibiarkan panjang karena dapat menyimpan kotoran dan bakteri patogen." },
        { id: 15, level: "shokyu", year: 2024, question: "つめ は、 いつも みじかく きって おきます。", reading: "Tsume wa, itsumo mijikaku kitte okimasu.", image: "", answer: "○", explanation: "Kuku harus selalu dipotong pendek dan dijaga kebersihannya." },
        { id: 16, level: "shokyu", year: 2024, question: "つめ に、 まにきゅあ を ぬった まま しごと を しました。", reading: "Tsume ni, manikyua o nutta mama shigoto o shimashita.", image: "", answer: "×", explanation: "Dilarang memakai kutek/cat kuku saat bekerja karena serpihannya berisiko mengontaminasi makanan." },
        { id: 17, level: "shokyu", year: 2024, question: "はいすいこう は、すぐ に よごれる ので、そうじ しません。", reading: "Haisuikō wa, sugu ni yogoreru node, sōji shimasen.", image: "", answer: "×", explanation: "Saluran pembuangan air (drainase) justru harus sering dibersihkan agar tidak menjadi sarang bakteri dan bau." },
        { id: 18, level: "shokyu", year: 2024, question: "ゆか に おちた しょくざい を そのまま つかいました。", reading: "Yuka ni ochita shokuzai o sonomama tsukaimashita.", image: "", answer: "×", explanation: "Bahan makanan yang jatuh ke lantai tidak boleh langsung dipakai karena telah terkontaminasi." },
        { id: 19, level: "shokyu", year: 2023, question: "といれ から でる とき に、て を あらいません でした。", reading: "Toire kara deru toki ni, te o araimasen deshita.", image: "", answer: "×", explanation: "Setelah dari toilet wajib mencuci tangan dan melakukan disinfeksi sebelum kembali ke area kerja." },
        { id: 20, level: "shokyu", year: 2023, question: "にく と やさい を きる とき は、おなじ まないた を つかいます。", reading: "Niku to yasai o kiru toki wa, onaji manaita o tsukaimasu.", image: "", answer: "×", explanation: "Talenan untuk memotong daging dan sayuran harus dibedakan untuk mencegah kontaminasi silang." },
        { id: 21, level: "shokyu", year: 2023, question: "ちゅうしんおんどけい を つかった あと は、 せんさー ぶぶん を せいけつ に します。", reading: "Chūshin-ondokei o tsukatta ato wa, sensā bubun o seiketsu ni shimasu.", image: "", answer: "○", explanation: "Setelah menggunakan termometer suhu pusat, bagian sensor jarum harus dibersihkan dan disterilkan." },
        { id: 22, level: "shokyu", year: 2023, question: "ほうちょう は、 は の ぶぶん だけ では なく、て で もつ ぶぶん も あらいます。", reading: "Hōchō wa, ha no bubun dake dewa naku, te de motsu bubun mo araimasu.", image: "", answer: "○", explanation: "Pisau harus dicuci bersih secara menyeluruh, baik bilah pisaunya maupun gagang pegangannya." },
        { id: 23, level: "shokyu", year: 2023, question: "もりつけ さぎょう を おこなう、 せいけつ な さぎょうしつ に は、だんぼーるばこ を いれません。", reading: "Moritsuke sagyō o okonau, seiketsu na sagyōshitsu ni wa, danbōrubako o iremasen.", image: "", answer: "○", explanation: "Kardus kemasan tidak boleh dimasukkan ke dalam ruang bersih/plating karena membawa debu dan hama dari luar." },
        { id: 24, level: "shokyu", year: 2023, question: "さぎょうば が あつかった ので、まど を あけました。", reading: "Sagyōba ga atsukatta node, mado o akemashita.", image: "", answer: "×", explanation: "Jendela ruang produksi makanan tidak boleh dibuka bebas karena debu dan serangga dari luar bisa masuk." },
        { id: 25, level: "shokyu", year: 2023, question: "さぎょうちゅう に あつく なった ので、そで を まくりました。", reading: "Sagyōchū ni atsuku natta node, sode o makurimashita.", image: "", answer: "×", explanation: "Lengan baju kerja tidak boleh digulung agar bulu tangan atau kotoran tidak jatuh ke produk makanan." },
        { id: 26, level: "shokyu", year: 2023, question: "さぎょうちゅう に あつく なった ので、 ぼうし を ぬぎました。", reading: "Sagyōchū ni atsuku natta node, bōshi o nugimashita.", image: "", answer: "×", explanation: "Topi kerja pabrik makanan dilarang dilepas di area kerja agar rambut tidak jatuh mencemari makanan." },
        { id: 27, level: "shokyu", year: 2023, question: "ながく つかって け が みじかく なった ぶらし を つかいました。", reading: "Nagaku tsukatte, ke ga mijikaku natta burashi o tsukaimashita.", image: "", answer: "×", explanation: "Sikat yang bulunya sudah aus/pendek harus diganti karena bulu sikat rawan rontok dan menjadi benda asing dalam makanan." },
        { id: 28, level: "shokyu", year: 2023, question: "ふくろ に はいった しょくざい を もりつけ に つかう とき は、ふくろ の ひょうめん を しょうどく して から かいふう します。", reading: "Fukuro ni haitta shokuzai o moritsuke ni tsukau toki wa, fukuro no hyōmen o shōdoku shite kara kaifū shimasu.", image: "", answer: "○", explanation: "Permukaan kemasan kantong harus disterilkan terlebih dahulu sebelum digunting/dibuka agar debu luar tidak masuk." },
        { id: 29, level: "shokyu", year: 2023, question: "そうじ よう の ぶらし が とどかない ところ は、そうじ しません。", reading: "Sōji yō no burashi ga todokanai tokoro wa, sōji shimasen.", image: "", answer: "×", explanation: "Bagian yang sulit terjangkau pun tetap wajib dibersihkan menggunakan peralatan pembersih yang sesuai." },
        { id: 30, level: "shokyu", year: 2023, question: "ころっけ を あげた とき は、ちゅうしん の おんど を はかります。", reading: "Korokke o ageta toki wa, chūshin no ondo o hakarimasu.", image: "", answer: "○", explanation: "Setelah menggoreng kroket, ukur suhu pusat/bagian dalam (minimal 75°C selama 1 menit) untuk memastikan bakteri mati." },
        { id: 31, level: "shokyu", year: 2023, question: "ころっけ を あげた とき は、ひょうめん の おんど を はかります。", reading: "Korokke o ageta toki wa, hyōmen no ondo o hakarimasu.", image: "", answer: "×", explanation: "Pengukuran kematangan masakan wajib dilakukan pada suhu pusat (bagian dalam makanan), bukan hanya suhu permukaannya." },
        { id: 32, level: "shokyu", year: 2023, question: "ころっけ を あげる とき は、じかん を はかりません。", reading: "Korokke o ageru toki wa, jikan o hakarimasen.", image: "", answer: "×", explanation: "Waktu penggorengan wajib diukur dan dipantau sesuai standar SOP." },
        { id: 33, level: "shokyu", year: 2023, question: "はんばーぐ を やいた とき は、ひょうめん の おんど を はかります。", reading: "Hanbāgu o yaita toki wa, hyōmen no ondo o hakarimasu.", image: "", answer: "×", explanation: "Saat memanggang patty hamburger, wajib mengukur suhu bagian pusat/dalam daging." },
        { id: 34, level: "shokyu", year: 2023, question: "こんべくしょん おーぶん の なか は、いち に よって おんど が ちがいます。", reading: "Konbekushon ōbun no naka wa, ichi ni yotte ondo ga chigaimasu.", image: "", answer: "○", explanation: "Di dalam convection oven, suhu di berbagai sudut/posisi loyang bisa sedikit berbeda." },
        { id: 35, level: "shokyu", year: 2023, question: "じょうき で ちょうり する こと を、あげる と いいます。", reading: "Jōki de chōri suru koto o, ageru to iimasu.", image: "", answer: "×", explanation: "Memasak dengan uap air disebut 'mengukus' (蒸す / musu). 'Ageru' (揚げる) artinya menggoreng dengan minyak." },
        { id: 36, level: "shokyu", year: 2023, question: "ふらいやー の なか の あげかす は 、とりません。", reading: "Furaiyā no naka no agekasu wa, torimasen.", image: "", answer: "×", explanation: "Remah/ampas gorengan di dalam fryer harus selalu diangkat agar minyak tidak gosong dan cepat rusak." },
        { id: 37, level: "shokyu", year: 2022, question: "ふらいやー へ、 いちど に たいりょう の しょくざい を いれました。", reading: "Furaiyā e, ichido ni tairyō no shokuzai o iremashita.", image: "", answer: "×", explanation: "Memasukkan terlalu banyak bahan sekaligus ke dalam fryer akan menurunkan suhu minyak secara drastis." },
        { id: 38, level: "shokyu", year: 2022, question: "ふらいやー に、 たいりょう の しょくざい を いれる と、あぶら の おんど が さがり、きんとう に かねつ できません。", reading: "Furaiyā ni, tairyō no shokuzai o ireru to, abura no ondo ga sagari, kintō ni kanetsu dekimasen.", image: "", answer: "○", explanation: "Benar. Jika memasukkan terlalu banyak bahan sekaligus, suhu minyak anjlok sehingga pemanasan tidak merata." },
        { id: 39, level: "shokyu", year: 2022, question: "こめ を たく とき は、 みず の りょう が たいせつ です。", reading: "Kome o taku toki wa, mizu no ryō ga taisetsu desu.", image: "", answer: "○", explanation: "Saat menanak nasi, takaran perbandingan air sangat penting untuk menghasilkan tekstur nasi yang tepat." },
        { id: 40, level: "shokyu", year: 2022, question: "かねつ ちょうり を する とき は、 やけど に ちゅうい します。", reading: "Kanetsu chōri o suru toki wa, yakedo ni chūi shimasu.", image: "", answer: "○", explanation: "Saat memasak menggunakan panas/api/minyak, harus selalu waspada terhadap bahaya luka bakar." },
        { id: 41, level: "shokyu", year: 2022, question: "きかい から いつも と ちがう おと が したら、すぐ に きかい を とめます。", reading: "Kikai kara itsumo to chigau oto ga shitara, sugu ni kikai o tomemasu.", image: "", answer: "○", explanation: "Jika mesin terdengar mengeluarkan suara asing/tidak biasa, segera matikan mesin dan laporkan ke atasan." },
        { id: 42, level: "shokyu", year: 2022, question: "すらいさー を つかった あと は、すらいさー の は が かけて いない か かくにん します。", reading: "Suraisā o tsukatta ato wa, suraisā no ha ga kakete inai ka kakunin shimasu.", image: "", answer: "○", explanation: "Setelah menggunakan slicer, periksa mata pisau untuk memastikan tidak ada bagian yang gompal/pecah dan tercecer ke makanan." },
        { id: 43, level: "shokyu", year: 2022, question: "いそいで いた ので、こうじょう の なか を はしりました。", reading: "Isoide ita node, kōjō no naka o hashirimashita.", image: "", answer: "×", explanation: "Dilarang berlari di dalam pabrik makanan karena dapat menyebabkan kecelakaan fatal atau menabrak pekerja lain." },
        { id: 44, level: "shokyu", year: 2022, question: "ゆか が ぬれて いる と、すべる ので きけん です。", reading: "Yuka ga nurete iru to, suberu node kiken desu.", image: "", answer: "○", explanation: "Lantai yang basah sangat licin dan berbahaya bagi keselamatan kerja." },
        { id: 45, level: "shokyu", year: 2022, question: "ゆか は、 ぬれて いた ほう が すべり やすくて よい です。", reading: "Yuka wa, nurete ita hō ga suberi yasukute yoi desu.", image: "", answer: "×", explanation: "Lantai yang licin berbahaya. Lantai harus selalu diupayakan tetap kering dan bersih." },
        { id: 46, level: "shokyu", year: 2022, question: "せんざい を つかう とき は、 め に はいらない よう に ちゅうい します。", reading: "Senzai o tsukau toki wa, me ni hairanai yō ni chūi shimasu.", image: "", answer: "○", explanation: "Saat menggunakan deterjen/bahan kimia pembersih, berhati-hatilah agar tidak mengenai mata." },
        { id: 47, level: "shokyu", year: 2022, question: "しょくざい を すらいす して いる とき に、 すらいさー の かばー を はずして は いけません。", reading: "Shokuzai o suraisu shite iru toki ni, suraisā no kabā o hazushite wa ikemasen.", image: "", answer: "○", explanation: "Saat mesin pemotong (slicer) sedang memotong bahan, penutup pelindung keamanan tidak boleh dibuka." },
        { id: 48, level: "shokyu", year: 2022, question: "すらいさー が かんぜん に ていし する まえ に、 かばー を あけました。", reading: "Suraisā ga kanzen ni teishi suru mae ni, kabā o akemashita.", image: "", answer: "×", explanation: "Tutup pelindung hanya boleh dibuka setelah mesin slicer berhenti berputar secara total." },
        { id: 49, level: "shokyu", year: 2022, question: "きかい が うごいて いる とき は、 きかい に て を ふれて は いけません。", reading: "Kikai ga ugoite iru toki wa, kikai ni te o furete wa ikemasen.", image: "", answer: "○", explanation: "Jangan menyentuh bagian mesin yang sedang bergerak/beroperasi untuk menghindari risiko cedera terjepit." },
        { id: 50, level: "shokyu", year: 2022, question: "ちょうりちゅう に がす の ひ が きえて いたら、がす が もれて いる かのうせい が ある ため、ひ を つけて は いけません。", reading: "Chōrichū ni gasu no hi ga kiete itara, gasu ga morete iru kanōsei ga aru tame, hi o tsukete wa ikemasen.", image: "", answer: "○", explanation: "Jika api gas tiba-tiba mati, jangan langsung menyalakan api kembali karena gas yang terakumulasi bisa memicu ledakan. Tutup katup dan lakukan ventilasi udara." },
        { id: 51, level: "shokyu", year: 2022, question: "ちゅうしんおんどけい は、たべもの の ひょうめん の おんど を はかる きぐ です。", reading: "Chūshin-ondokei wa, tabemono no hyōmen no ondo wo hakaru kigu desu.", image: "", answer: "×", explanation: "Termometer suhu pusat (中心温度計) adalah alat untuk mengukur suhu bagian dalam/tengah makanan, bukan suhu permukaan." },
        { id: 52, level: "shokyu", year: 2022, question: "けいりょうかっぷ は、かっぷ を かたむけて はかります。", reading: "Keiryō kappu wa, kappu wo katamukete hakarimasu.", image: "", answer: "×", explanation: "Gelas ukur harus ditaruh mendatar di tempat rata dan dibaca sejajar dengan tinggi mata, bukan dimiringkan." },
        { id: 101, level: "senmonkyu", year: 2024, question: "HACCP（はさっぷ）に おいて、じゅうようかんりてん（CCP）を せってい して れんぞくてき に かんし します。", reading: "HACCP ni oite, jūyō kanriten (CCP) o settei shite renzokuteki ni kanshi shimasu.", image: "", answer: "○", explanation: "Benar. Dalam sistem HACCP, Titik Kendali Kritis (CCP) ditetapkan dan dipantau secara berkelanjutan untuk menjamin keamanan pangan." },
        { id: 102, level: "senmonkyu", year: 2024, question: "かねつちょうりご の そうざい は、さいきん の ぞうしょく を ふせぐ ため、できるだけ すみやか に きゅうそくれいきゃく します。", reading: "Kanetsu chōrigo no sōzai wa, saikin no zōshoku o fusegu tame, dekiru dake sumiyaka ni kyūsoku reikyaku shimasu.", image: "", answer: "○", explanation: "Benar. Setelah dimasak dengan panas, produk lauk harus segera didinginkan cepat (rapid cooling) untuk mencegah pertumbuhan bakteri di suhu bahaya (20°C - 50°C)." },
        { id: 103, level: "senmonkyu", year: 2023, question: "あるみはく で ほうそう された しょくひん の いぶつこんにゅう は、つうじょう の きんぞくけんしゅつき で かんぜん に けんしゅつ できます。", reading: "Arumihaku de hōsō sareta shokuhin no ibutsu konnyū wa, tsūjō no kinzoku kenshutsuki de kanzen ni kenshutsu dekimasu.", image: "", answer: "×", explanation: "Salah. Makanan dalam kemasan aluminium foil tidak dapat dideteksi secara akurat dengan metal detector biasa; diperlukan mesin X-ray (X線異物検出機)." },
        { id: 104, level: "senmonkyu", year: 2023, question: "しょくひんてんかぶつ は、ほうりつ で さだめられた しようきじゅん や たいしょうしょくひん を まもって しよう します。", reading: "Shokuhin tenkabutsu wa, hōritsu de sadamerareta shiyō kijun ya taishō shokuhin o mamotte shiyō shimasu.", image: "", answer: "○", explanation: "Benar. Bahan Tambahan Pangan (BTP) wajib digunakan secara ketat sesuai standar batasan dan peruntukan makanan yang diatur undang-undang." }
    ];
    return [];
}

// Expose functions to global scope for inline HTML handlers
window.checkUserSession = checkUserSession;
window.showLoginScreen = showLoginScreen;
window.showMainApp = showMainApp;
window.handleUserLogin = handleUserLogin;
window.handleUserSignup = handleUserSignup;
window.showSignupScreen = showSignupScreen;
window.handleUserLogout = handleUserLogout;
window.getScoreRecords = getScoreRecords;
window.saveScoreRecord = saveScoreRecord;
window.updateCategoryCounts = updateCategoryCounts;
window.getQuestionsForCategory = getQuestionsForCategory;
window.openCategoryConfig = openCategoryConfig;
window.selectLevel = selectLevel;
window.showLevelStep = showLevelStep;
window.showYearStep = showYearStep;
window.renderLevelOptions = renderLevelOptions;
window.renderYearOptions = renderYearOptions;
window.selectYear = selectYear;
window.updateConfigSummary = updateConfigSummary;
window.getFilteredQuestions = getFilteredQuestions;
window.launchQuiz = launchQuiz;
window.backToConfig = backToConfig;
window.backToCategories = backToCategories;
window.updateScoreStats = updateScoreStats;
window.render = render;
window.selectAnswer = selectAnswer;
window.checkIfQuizComplete = checkIfQuizComplete;
window.showResults = showResults;
window.applyAnswerVisuals = applyAnswerVisuals;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.resetSession = resetSession;
window.openImageLightbox = openImageLightbox;
window.closeImageLightbox = closeImageLightbox;
window.toggleAttendancePanel = toggleAttendancePanel;
window.closeAttendancePanel = closeAttendancePanel;
window.startAttendanceSession = startAttendanceSession;
window.updateAttendanceStatus = updateAttendanceStatus;
window.markRemainingAttendance = markRemainingAttendance;
window.deleteCurrentAttendanceSession = deleteCurrentAttendanceSession;
window.setupEventListeners = setupEventListeners;
window.setupSecretAdminAccess = setupSecretAdminAccess;
window.getDefaultFallbackForCategory = getDefaultFallbackForCategory;
window.escapeHtml = escapeHtml;
