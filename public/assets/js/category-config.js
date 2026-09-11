export const getQuestionBankUrl = (filename) => new URL(`../../data/question-bank/${filename}`, import.meta.url).href;
export const getImageUrl = (filename) => new URL(`../images/${filename}`, import.meta.url).href;
const manifestUrl = getQuestionBankUrl("categories.json");

export async function loadCategories() {
    const response = await fetch(`${manifestUrl}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`Gagal memuat manifest kategori: HTTP ${response.status}`);
    }

    const categories = await response.json();
    if (!Array.isArray(categories) || categories.length === 0) {
        throw new Error("Manifest kategori kosong atau tidak valid.");
    }

    return categories.map((category) => ({
        ...category,
        fileUrl: getQuestionBankUrl(category.filename),
        storageKey: `quiz_questions_${category.id}`,
        downloadName: category.filename,
    }));
}

export function buildCategoryMap(categoryList) {
    return Object.fromEntries(categoryList.map((category) => [category.id, category]));
}
