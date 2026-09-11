// Metadata Daftar Bidang
const CATEGORIES = {
    "sozai-kako": {
        id: "sozai-kako",
        name: "🍱 惣菜製造業 (Sozai Kako)",
        shortName: "🍱 惣菜製造業",
        file: "questions-sozai-kako.json",
        storageKey: "quiz_questions_sozai-kako",
    },
    "shisetsu-engei": {
        id: "shisetsu-engei",
        name: "🌱 施設園芸 (Shisetsu Engei)",
        shortName: "🌱 施設園芸",
        file: "questions-shisetsu-engei.json",
        storageKey: "quiz_questions_shisetsu-engei",
    },
};

// State Konfigurasi & Kuis
let currentCategory = null;
let selectedLevel = "shokyu";
let selectedYear = "all";
let rawCategoryQuestions = [];
let allQuestions = []; // Soal yang sudah difilter berdasarkan level & tahun
let history = [];
let position = -1;
let unseen = new Set();
let userAnswers = {};
let secretAdminClicks = 0;

document.addEventListener("DOMContentLoaded", async () => {
    setupEventListeners();
    setupSecretAdminAccess();
    await updateCategoryCounts();
});

// Update jumlah total soal di kartu bidang
async function updateCategoryCounts() {
    for (const catId in CATEGORIES) {
        const cat = CATEGORIES[catId];
        const countBadge = document.getElementById("count-" + catId);
        if (!countBadge) continue;

        const questions = await getQuestionsForCategory(catId);
        countBadge.textContent = questions.length + " Soal";
    }
}

// Ambil bank soal untuk bidang tertentu
async function getQuestionsForCategory(catId) {
    const cat = CATEGORIES[catId];
    if (!cat) return [];

    const localData = localStorage.getItem(cat.storageKey);

    try {
        // JSON di GitHub Pages adalah sumber utama; query unik menghindari cache lama.
        const response = await fetch(`${cat.file}?v=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Format JSON tidak valid");
        }
        localStorage.setItem(cat.storageKey, JSON.stringify(data));
        return data;
    } catch (err) {
        console.warn(`Gagal memuat ${cat.file} via fetch. Mencoba data tersimpan.`, err);

        // Tetap bisa dipakai saat offline atau ketika GitHub Pages belum tersedia.
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (storageErr) {
                console.error("Gagal parse localStorage:", storageErr);
            }
        }

        console.warn(`Data tersimpan tidak tersedia. Memakai fallback default untuk ${cat.file}.`);
        const fallbackData = getDefaultFallbackForCategory(catId);
        localStorage.setItem(cat.storageKey, JSON.stringify(fallbackData));
        return fallbackData;
    }
}

// Buka Halaman Pengaturan Level & Tahun Soal
async function openCategoryConfig(catId) {
    const cat = CATEGORIES[catId];
    if (!cat) return;

    currentCategory = catId;
    rawCategoryQuestions = await getQuestionsForCategory(catId);

    document.getElementById("screen-categories").style.display = "none";
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-config").style.display = "block";

    document.getElementById("config-cat-title").textContent = cat.name;

    // Reset pilihan
    selectedLevel = "shokyu";
    selectedYear = "all";

    renderLevelOptions();
    renderYearOptions();
    updateConfigSummary();
}

function selectLevel(level) {
    selectedLevel = level;
    renderLevelOptions();
    renderYearOptions();
    updateConfigSummary();
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

    // Ambil daftar tahun yang tersedia untuk level yang dipilih
    const levelQuestions = rawCategoryQuestions.filter((q) => (q.level || "shokyu") === selectedLevel);
    const yearsSet = new Set();
    levelQuestions.forEach((q) => {
        if (q.year) yearsSet.add(Number(q.year));
    });

    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

    // Pill: Semua Tahun
    const allPill = document.createElement("button");
    allPill.className = "year-pill" + (selectedYear === "all" ? " selected" : "");
    allPill.innerHTML = `🌟 Semua Tahun (${levelQuestions.length})`;
    allPill.onclick = () => selectYear("all");
    container.appendChild(allPill);

    // Pill untuk tiap tahun
    sortedYears.forEach((yr) => {
        const count = levelQuestions.filter((q) => Number(q.year) === yr).length;
        const pill = document.createElement("button");
        pill.className = "year-pill" + (selectedYear === String(yr) ? " selected" : "");
        pill.innerHTML = `📅 Tahun ${yr} (${count})`;
        pill.onclick = () => selectYear(String(yr));
        container.appendChild(pill);
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
    detailEl.textContent = `${levelText} • ${yearText}`;

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
        const matchYear = selectedYear === "all" || String(q.year) === String(selectedYear);
        return matchLevel && matchYear;
    });
}

// Mulai Kuis dengan Soal yang Terfilter
function launchQuiz() {
    allQuestions = getFilteredQuestions();
    if (allQuestions.length === 0) {
        alert("Tidak ada soal yang cocok dengan pilihan level dan tahun tersebut.");
        return;
    }

    const cat = CATEGORIES[currentCategory];
    document.getElementById("screen-config").style.display = "none";
    document.getElementById("screen-quiz").style.display = "block";

    document.getElementById("quiz-cat-name").textContent = cat.shortName;

    const levelName = selectedLevel === "shokyu" ? "🔰 初級" : "⭐ 専門級";
    const yearName = selectedYear === "all" ? "Semua Tahun" : selectedYear;
    document.getElementById("quiz-level-year-badge").textContent = `${levelName} • ${yearName}`;

    history = [];
    position = -1;
    unseen = new Set(allQuestions.map((q) => q.id));
    userAnswers = {};

    nextQuestion();
}

// Kembali dari Kuis ke Pengaturan Level/Tahun
function backToConfig() {
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-config").style.display = "block";
    updateConfigSummary();
}

// Kembali dari Pengaturan ke Halaman Utama
function backToCategories() {
    document.getElementById("screen-config").style.display = "none";
    document.getElementById("screen-quiz").style.display = "none";
    document.getElementById("screen-categories").style.display = "block";
    currentCategory = null;
    updateCategoryCounts();
}

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

    const levelText = q.level === "senmonkyu" ? "[専門級] " : "[初級] ";
    const yearText = q.year ? `(${q.year})` : "";
    document.getElementById("meta").textContent = `Soal #${q.id} ${yearText}`;
    document.getElementById("question").textContent = q.question;
    document.getElementById("reading").textContent = q.reading || "";

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

    btnTrue.className = "choice-btn";
    btnFalse.className = "choice-btn";
    btnTrue.disabled = false;
    btnFalse.disabled = false;
    feedback.style.display = "none";
    feedback.className = "feedback-box";

    const record = userAnswers[q.id];
    if (record) {
        applyAnswerVisuals(q, record.chosen, record.isCorrect);
    }

    document.getElementById("back").disabled = position <= 0;
    document.getElementById("progress").textContent =
        "Sudah muncul: " + history.length + " / " + allQuestions.length;

    updateScoreStats();
}

function selectAnswer(choice) {
    const q = allQuestions.find((x) => x.id === history[position]);
    if (!q) return;

    const isCorrect = choice === q.answer;

    userAnswers[q.id] = {
        chosen: choice,
        isCorrect: isCorrect,
    };

    applyAnswerVisuals(q, choice, isCorrect);
    updateScoreStats();
}

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
    }</strong><br>${q.explanation || ""}`;
    feedback.style.display = "block";
}

function nextQuestion() {
    if (position < history.length - 1) {
        position++;
        render();
        return;
    }
    if (unseen.size === 0) {
        alert("🎉 Selamat! Semua soal dalam sesi ini telah selesai dikerjakan.");
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

function setupEventListeners() {
    document.getElementById("next").onclick = nextQuestion;
    document.getElementById("back").onclick = prevQuestion;

    window.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

        if (e.key === "Escape") {
            closeImageLightbox();
        }

        // Shortcut rahasia admin: Alt + A atau Ctrl + Shift + A
        if ((e.altKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a")) {
            e.preventDefault();
            window.location.href = "admin.html";
            return;
        }

        if (document.getElementById("screen-quiz").style.display !== "none") {
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

// Fallback dataset
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
}
