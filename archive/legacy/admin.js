// State Manajemen Soal & Autentikasi Admin Multi-Bidang
const CATEGORIES = {
    "sozai-kako": {
        id: "sozai-kako",
        name: "🍱 惣菜製造業 (Sozai Kako)",
        file: "questions-sozai-kako.json",
        storageKey: "quiz_questions_sozai-kako",
    },
    "shisetsu-engei": {
        id: "shisetsu-engei",
        name: "🌱 施設園芸 (Shisetsu Engei)",
        file: "questions-shisetsu-engei.json",
        storageKey: "quiz_questions_shisetsu-engei",
    },
};

let currentAdminCategory = "sozai-kako";
let questions = [];
let editingId = null;

const DEFAULT_PIN = "2026";

document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();
    setupAdminEvents();
    await switchAdminCategory("sozai-kako");
});

// Sistem Autentikasi / Proteksi PIN
function getStoredPin() {
    return localStorage.getItem("admin_pin") || DEFAULT_PIN;
}

function checkAuth() {
    const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
    const overlay = document.getElementById("auth-overlay");
    const pinInput = document.getElementById("auth-pin-input");

    if (isAuth) {
        overlay.classList.add("hidden");
    } else {
        overlay.classList.remove("hidden");
        if (pinInput) pinInput.focus();
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const pinInput = document.getElementById("auth-pin-input");
    const errorMsg = document.getElementById("auth-error-msg");
    const enteredPin = pinInput.value.trim();

    if (enteredPin === getStoredPin()) {
        sessionStorage.setItem("admin_authenticated", "true");
        document.getElementById("auth-overlay").classList.add("hidden");
        errorMsg.style.display = "none";
        pinInput.value = "";
        showToast("🔓 Selamat datang, Administrator!");
    } else {
        errorMsg.style.display = "block";
        pinInput.value = "";
        pinInput.focus();
    }
}

function logoutAdmin() {
    sessionStorage.removeItem("admin_authenticated");
    document.getElementById("auth-overlay").classList.remove("hidden");
    const pinInput = document.getElementById("auth-pin-input");
    if (pinInput) {
        pinInput.value = "";
        pinInput.focus();
    }
    showToast("🔒 Anda telah keluar dari mode admin.");
}

function openChangePasswordModal() {
    document.getElementById("pwd-current").value = "";
    document.getElementById("pwd-new").value = "";
    document.getElementById("pwd-confirm").value = "";
    document.getElementById("modal-password").classList.add("open");
}

function closeChangePasswordModal() {
    document.getElementById("modal-password").classList.remove("open");
}

function handleChangePasswordSubmit(e) {
    e.preventDefault();
    const currentPin = document.getElementById("pwd-current").value.trim();
    const newPin = document.getElementById("pwd-new").value.trim();
    const confirmPin = document.getElementById("pwd-confirm").value.trim();

    if (currentPin !== getStoredPin()) {
        alert("PIN Saat Ini salah!");
        return;
    }

    if (newPin.length < 4) {
        alert("PIN Baru minimal terdiri dari 4 karakter!");
        return;
    }

    if (newPin !== confirmPin) {
        alert("Konfirmasi PIN Baru tidak cocok!");
        return;
    }

    localStorage.setItem("admin_pin", newPin);
    closeChangePasswordModal();
    showToast("🔑 PIN Administrator berhasil diperbarui!");
}

// Beralih Bidang yang Dikelola
async function switchAdminCategory(catId) {
    if (!CATEGORIES[catId]) return;
    currentAdminCategory = catId;
    document.getElementById("admin-category-select").value = catId;

    await loadQuestionsForCategory(catId);
    populateYearFilter();
    renderTable();
    updateStats();
}

// Memuat data soal untuk bidang tertentu dengan auto-migrasi format
async function loadQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    const localData = localStorage.getItem(cat.storageKey);

    let loadedQuestions = null;

    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Cek apakah data di localStorage sudah memiliki atribut 'year'
                const hasYear = parsed.some((q) => q.year !== undefined && q.year !== null);
                if (hasYear) {
                    loadedQuestions = parsed;
                }
            }
        } catch (e) {
            console.error("Gagal parse localStorage:", e);
        }
    }

    // Jika belum ada atau formatnya versi lama tanpa 'year', ambil dari file JSON
    if (!loadedQuestions) {
        try {
            const response = await fetch(cat.file);
            if (!response.ok) throw new Error("Status HTTP: " + response.status);
            loadedQuestions = await response.json();
        } catch (err) {
            console.warn(`Gagal fetch ${cat.file}, memakai fallback bawaan:`, err);
            loadedQuestions = getDefaultFallbackForCategory(catId);
        }
    }

    // Validasi dan lengkapi atribut jika ada yang kosong
    questions = loadedQuestions.map((q, idx) => ({
        id: q.id || (idx + 1),
        level: q.level || "shokyu",
        year: q.year ? Number(q.year) : (q.id > 36 ? 2022 : (q.id > 18 ? 2023 : 2024)),
        question: q.question || "",
        reading: q.reading || "",
        image: q.image || "",
        answer: q.answer || "○",
        explanation: q.explanation || "",
    }));

    localStorage.setItem(cat.storageKey, JSON.stringify(questions));
}

// Isi opsi filter tahun berdasarkan data yang ada
function populateYearFilter() {
    const filterYear = document.getElementById("filter-year");
    if (!filterYear) return;

    const currentSelected = filterYear.value;

    const yearsSet = new Set();
    questions.forEach((q) => {
        if (q.year) yearsSet.add(Number(q.year));
    });

    // Default jika belum ada tahun
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

// Render Tabel Soal
function renderTable() {
    const tbody = document.getElementById("questions-tbody");
    const emptyState = document.getElementById("empty-state");
    const searchVal = document.getElementById("search-input").value.toLowerCase().trim();
    const filterLevel = document.getElementById("filter-level").value;
    const filterYear = document.getElementById("filter-year").value;
    const filterAnswer = document.getElementById("filter-answer").value;

    let filtered = questions.filter((q) => {
        // Filter Level
        if (filterLevel !== "all" && (q.level || "shokyu") !== filterLevel) {
            return false;
        }
        // Filter Tahun
        if (filterYear !== "all" && String(q.year) !== filterYear) {
            return false;
        }
        // Filter Kunci Jawaban
        if (filterAnswer !== "all" && q.answer !== filterAnswer) {
            return false;
        }
        // Filter Pencarian
        if (searchVal) {
            const matchId = String(q.id).includes(searchVal);
            const matchQ = (q.question || "").toLowerCase().includes(searchVal);
            const matchR = (q.reading || "").toLowerCase().includes(searchVal);
            const matchE = (q.explanation || "").toLowerCase().includes(searchVal);
            const matchY = String(q.year || "").includes(searchVal);
            return matchId || matchQ || matchR || matchE || matchY;
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
        const answerBadge = isTrue
            ? '<span class="badge-answer true">○ BENAR</span>'
            : '<span class="badge-answer false">✕ SALAH</span>';

        const imageBadge = q.image
            ? `<div class="table-img-badge">
                 <img class="table-img-thumb" src="${escapeHtml(q.image)}" alt="thumb" onerror="this.style.display='none'" />
                 🖼️ Gambar
               </div>`
            : "";

        const levelBadge = q.level === "senmonkyu"
            ? '<span style="display:inline-block; padding:3px 8px; border-radius:6px; background:#fef3c7; color:#92400e; font-weight:700; font-size:0.78rem; margin-bottom:4px;">⭐ 専門級</span>'
            : '<span style="display:inline-block; padding:3px 8px; border-radius:6px; background:#e0e7ff; color:#3730a3; font-weight:700; font-size:0.78rem; margin-bottom:4px;">🔰 初級</span>';

        const yearBadge = q.year
            ? `<span style="display:inline-block; padding:2px 8px; border-radius:6px; background:#f1f5f9; color:#475569; font-weight:600; font-size:0.78rem;">📅 ${q.year}</span>`
            : "";

        tr.innerHTML = `
            <td class="td-id">#${q.id}</td>
            <td>
                <div class="td-question">${escapeHtml(q.question)}</div>
                ${imageBadge}
                ${q.reading ? `<div class="reading-subtext">${escapeHtml(q.reading)}</div>` : ""}
                ${q.explanation ? `<div class="explanation-subtext"><strong>Penjelasan:</strong> ${escapeHtml(q.explanation)}</div>` : ""}
            </td>
            <td>
                <div>${levelBadge}</div>
                <div>${yearBadge}</div>
            </td>
            <td>${answerBadge}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit" onclick="openEditModal(${q.id})" title="Ubah Soal">✏️ Edit</button>
                    <button class="btn-icon delete" onclick="deleteQuestion(${q.id})" title="Hapus Soal">🗑️ Hapus</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Handler Gambar di Form Modal
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
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        document.getElementById("form-image").value = dataUrl;
        handleImageInputManual(dataUrl);
        showToast("🖼️ Gambar berhasil dimuat!");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
}

function clearFormImage() {
    document.getElementById("form-image").value = "";
    handleImageInputManual("");
}

// Buka Modal Tambah Soal
function openAddModal() {
    editingId = null;
    const catName = CATEGORIES[currentAdminCategory].name;
    document.getElementById("modal-title").textContent = `Tambah Soal Baru (${catName})`;
    document.getElementById("form-id").value = getNextId();
    
    // Level dan Tahun bawaan dari filter jika aktif
    const activeLevel = document.getElementById("filter-level").value;
    document.getElementById("form-level").value = activeLevel === "senmonkyu" ? "senmonkyu" : "shokyu";

    const activeYear = document.getElementById("filter-year").value;
    document.getElementById("form-year").value = activeYear !== "all" ? activeYear : "2024";

    document.getElementById("form-question").value = "";
    document.getElementById("form-reading").value = "";
    clearFormImage();
    document.getElementById("answer-true").checked = true;
    document.getElementById("form-explanation").value = "";
    
    document.getElementById("modal-form").classList.add("open");
}

// Buka Modal Edit Soal
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
    
    const imgVal = q.image || "";
    document.getElementById("form-image").value = imgVal;
    handleImageInputManual(imgVal);

    if (q.answer === "○") {
        document.getElementById("answer-true").checked = true;
    } else {
        document.getElementById("answer-false").checked = true;
    }
    document.getElementById("form-explanation").value = q.explanation || "";

    document.getElementById("modal-form").classList.add("open");
}

function closeModal() {
    document.getElementById("modal-form").classList.remove("open");
}

// Simpan Soal (Tambah atau Edit)
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
        alert("Teks pertanyaan tidak boleh kosong!");
        return;
    }

    if (editingId !== null) {
        const index = questions.findIndex((q) => q.id === editingId);
        if (index !== -1) {
            questions[index] = {
                id: id,
                level: levelVal,
                year: yearVal,
                question: questionText,
                reading: readingText,
                image: imageText,
                answer: answerVal,
                explanation: explanationText,
            };
            showToast("✅ Soal #" + id + " berhasil diperbarui!");
        }
    } else {
        const exists = questions.some((q) => q.id === id);
        const finalId = exists ? getNextId() : id;

        questions.push({
            id: finalId,
            level: levelVal,
            year: yearVal,
            question: questionText,
            reading: readingText,
            image: imageText,
            answer: answerVal,
            explanation: explanationText,
        });
        showToast("🎉 Soal baru #" + finalId + " berhasil ditambahkan!");
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
        showToast("🗑️ Soal #" + id + " berhasil dihapus!");
    }
}

function getNextId() {
    if (questions.length === 0) return 1;
    const maxId = Math.max(...questions.map((q) => q.id || 0));
    return maxId + 1;
}

// Unduh / Simpan File JSON
function exportQuestionsJSON() {
    const cat = CATEGORIES[currentAdminCategory];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", cat.file);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`💾 File ${cat.file} berhasil diunduh!`);
}

// Impor dari File JSON
function importQuestionsJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const cat = CATEGORIES[currentAdminCategory];
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) {
                throw new Error("Format JSON harus berupa Array daftar soal.");
            }

            let valid = true;
            importedData.forEach((q) => {
                if (!q.question || !q.answer) valid = false;
            });

            if (!valid) {
                alert("File JSON tidak sesuai format. Pastikan setiap soal memiliki 'question' dan 'answer'.");
                return;
            }

            if (confirm(`Impor ${importedData.length} soal dari file "${file.name}" ke bidang "${cat.name}"? Data saat ini akan digantikan.`)) {
                questions = importedData.map((q, idx) => ({
                    id: q.id || (idx + 1),
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
                showToast(`📂 Berhasil mengimpor ${importedData.length} soal ke bidang ${cat.name}!`);
            }
        } catch (err) {
            alert("Gagal membaca file JSON: " + err.message);
        }
        event.target.value = "";
    };
    reader.readAsText(file);
}

// Reset ke Soal Bawaan
function resetToDefault() {
    const cat = CATEGORIES[currentAdminCategory];
    if (confirm(`Mulai ulang bank soal bidang "${cat.name}" ke setelan awal bawaan? Perubahan manual akan di-reset.`)) {
        questions = getDefaultFallbackForCategory(currentAdminCategory);
        persistQuestions();
        renderTable();
        showToast(`🔄 Bank soal ${cat.name} berhasil di-reset ke setelan awal!`);
    }
}

function setupAdminEvents() {
    document.getElementById("search-input").addEventListener("input", renderTable);
    document.getElementById("filter-level").addEventListener("change", renderTable);
    document.getElementById("filter-year").addEventListener("change", renderTable);
    document.getElementById("filter-answer").addEventListener("change", renderTable);
    document.getElementById("question-form").addEventListener("submit", handleFormSubmit);
    document.getElementById("import-file-input").addEventListener("change", importQuestionsJSON);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getDefaultFallbackForCategory(catId) {
    if (catId === "shisetsu-engei") {
        return [
            { id: 1, level: "shokyu", year: 2024, question: "おんしつ の なか の おんど が たかすぎるとき は、てんそう や そくそう を あけて かんき します。", reading: "Onshitsu no naka no ondo ga takasugiru toki wa, tensō ya sokusō o akete kanki shimasu.", image: "images/greenhouse_ventilation.svg", answer: "○", explanation: "Benar. Jika suhu di dalam rumah kaca terlalu tinggi, buka ventilasi atap (tensō) atau ventilasi samping (sokusō) untuk sirkulasi udara." },
            { id: 2, level: "shokyu", year: 2024, question: "かんすい（みずやり）は、ひ が くれて よる に なって から たっぷり おこないます。", reading: "Kansui (mizuyari) wa, hi ga kurete yoru ni natte kara tappuri okonaimasu.", image: "", answer: "×", explanation: "Salah. Penyiraman (kansui) umumnya dilakukan pada pagi hari agar kelembapan udara malam hari tidak memicu penyakit jamur tanaman." },
            { id: 3, level: "shokyu", year: 2023, question: "のうやく を さんぷ するとき は、ますく や めがね、ぼうごふく を ちゃくよう します。", reading: "Nōyaku o sampai suru toki wa, masuku ya megane, bōgofuku o chakuyō shimasu.", image: "images/spray_equipment.svg", answer: "○", explanation: "Benar. Saat menyemprot pestisida (nōyaku), wajib memakai masker pelindung, kacamata pengaman, sarung tangan, dan baju pelindung." },
            { id: 4, level: "shokyu", year: 2023, question: "しゅうかく した やさい は、ちょくしゃにっこう が あたる あつい ばしょ に ほうち します。", reading: "Shūkaku shita yasai wa, chokusha-nikkō ga ataru atsui basho ni hōchi shimasu.", image: "", answer: "×", explanation: "Salah. Sayuran yang baru dipanen harus segera ditaruh di tempat teduh/sejuk dan tidak terkena sinar matahari langsung agar tidak layu." },
            { id: 5, level: "shokyu", year: 2022, question: "はさみ など の のうぐ は、つかいおわったら つち や よごれ を おとして ていれ します。", reading: "Hasami nado no nōgu wa, tsukaiowattara tsuchi ya yogore o otoshite teire shimasu.", image: "", answer: "○", explanation: "Benar. Gunting pangkas dan alat pertanian lainnya setelah digunakan harus dibersihkan dari tanah/getah untuk mencegah karat dan penularan hama penyakit." },
            { id: 101, level: "senmonkyu", year: 2024, question: "ようえきさいばい（すいこうさいばい）に おいて、ばいようえき の EC（でんきでんどうど）と pH の かんり は きわめて じゅうよう です。", reading: "Yōeki saibai (suikō saibai) ni oite, baiyōeki no EC (denki dendōdo) to pH no kanri wa kiwamete jūyō desu.", image: "", answer: "○", explanation: "Benar. Pada budidaya hidroponik/larutan nutrisi, pengukuran dan pengendalian nilai EC (kepekatan nutrisi) serta pH larutan sangat penting bagi pertumbuhan akar tanaman." },
            { id: 102, level: "senmonkyu", year: 2023, question: "ひるま の おんしつない の にさんかたんそ（CO2）のうど は、こうごうせい に よって しぜんかい より たかく なります。", reading: "Hiruma no onshitsunai no nisanka tanso (CO2) nōdo wa, kōgōsei ni yotte shizenkai yori takaku narimasu.", image: "", answer: "×", explanation: "Salah. Pada siang hari, tanaman melakukan fotosintesis secara aktif sehingga konsentrasi CO2 di dalam rumah kaca yang tertutup justru akan menurun jika tidak dilakukan ventilasi atau injeksi CO2." }
        ];
    }

    return [
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
        { id: 22, level: "shokyu", year: 2023, question: "ほうちょう は、 は の ぶぶん だけ では なく、て で もつ ぶぶん も あらいます。", reading: "Hōchō wa, ha no bubun dake dewa naku, te de motsu bubun も araimasu.", image: "", answer: "○", explanation: "Pisau harus dicuci bersih secara menyeluruh, baik bilah pisaunya maupun gagang pegangannya." },
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
        { id: 50, level: "shokyu", year: 2022, question: "ちょうりちゅう に がす の ひ が きえて いたら、 gasu が もれて いる かのうせい が ある ため、ひ を つけて は いけません。", reading: "Chōrichū ni gasu no hi ga kiete itara, gasu ga morete iru kanōsei ga aru tame, hi o tsukete wa ikemasen.", image: "", answer: "○", explanation: "Jika api gas tiba-tiba mati, jangan langsung menyalakan api kembali karena gas yang terakumulasi bisa memicu ledakan. Tutup katup dan lakukan ventilasi udara." },
        { id: 51, level: "shokyu", year: 2022, question: "ちゅうしんおんどけい は、たべもの の ひょうめん の おんど を はかる きぐ です。", reading: "Chūshin-ondokei wa, tabemono no hyōmen no ondo wo hakaru kigu desu.", image: "", answer: "×", explanation: "Termometer suhu pusat (中心温度計) adalah alat untuk mengukur suhu bagian dalam/tengah makanan, bukan suhu permukaan." },
        { id: 52, level: "shokyu", year: 2022, question: "けいりょうかっぷ は、かっぷ を かたむけて はかります。", reading: "Keiryō kappu wa, kappu wo katamukete hakarimasu.", image: "", answer: "×", explanation: "Gelas ukur harus ditaruh mendatar di tempat rata dan dibaca sejajar dengan tinggi mata, bukan dimiringkan." },
        { id: 101, level: "senmonkyu", year: 2024, question: "HACCP（はさっぷ）に おいて、じゅうようかんりてん（CCP）を せってい して れんぞくてき に かんし します。", reading: "HACCP ni oite, jūyō kanriten (CCP) o settei shite renzokuteki ni kanshi shimasu.", image: "", answer: "○", explanation: "Benar. Dalam sistem HACCP, Titik Kendali Kritis (CCP) ditetapkan dan dipantau secara berkelanjutan untuk menjamin keamanan pangan." },
        { id: 102, level: "senmonkyu", year: 2024, question: "かねつちょうりご の そうざい は、さいきん の ぞうしょく を ふせぐ ため、できるだけ すみやか に きゅうそくれいきゃく します。", reading: "Kanetsu chōrigo no sōzai wa, saikin no zōshoku o fusegu tame, dekiru dake sumiyaka ni kyūsoku reikyaku shimasu.", image: "", answer: "○", explanation: "Benar. Setelah dimasak dengan panas, produk lauk harus segera didinginkan cepat (rapid cooling) untuk mencegah pertumbuhan bakteri di suhu bahaya (20°C - 50°C)." },
        { id: 103, level: "senmonkyu", year: 2023, question: "あるみはく で ほうそう された しょくひん の いぶつこんにゅう は、つうじょう の きんぞくけんしゅつき で かんぜん に けんしゅつ できます。", reading: "Arumihaku de hōsō sareta shokuhin no ibutsu konnyū wa, tsūjō no kinzoku kenshutsuki de kanzen ni kenshutsu dekimasu.", image: "", answer: "×", explanation: "Salah. Makanan dalam kemasan aluminium foil tidak dapat dideteksi secara akurat dengan metal detector biasa; diperlukan mesin X-ray (X線異物検出機)." },
        { id: 104, level: "senmonkyu", year: 2023, question: "しょくひんてんかぶつ は、ほうりつ で さだめられた しようきじゅん や たいしょうしょくひん を まもって しよう します。", reading: "Shokuhin tenkabutsu wa, hōritsu de sadamerareta shiyō kijun ya taishō shokuhin o mamotte shiyō shimasu.", image: "", answer: "○", explanation: "Benar. Bahan Tambahan Pangan (BTP) wajib digunakan secara ketat sesuai standar batasan dan peruntukan makanan yang diatur undang-undang." }
    ];
}
