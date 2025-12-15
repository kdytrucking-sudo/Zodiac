import { db } from "./app.js";
import { doc, writeBatch } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const categories = ['Fortune', 'Personality', 'Culture', 'Compatibility', 'History'];
const sources = ["Larak's Zodiac", "Ancient Texts", "Modern Astrology", "Feng Shui Master"];
const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateArticle(index) {
    const zodiac = getRandomItem(zodiacs);
    const category = getRandomItem(categories);
    const id = `article_${String(index + 1).padStart(3, '0')}`;

    return {
        id: id,
        title: `${zodiac} Sign: ${category} Insights for 2025`,
        content: `This is a sample article content for the ${zodiac} sign. It explores the deep connection between the ${zodiac} and the ${category} aspect of life. In traditional Chinese culture, the ${zodiac} is seen as a symbol of ${category === 'Fortune' ? 'luck and prosperity' : 'unique character traits'}. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        category: category,
        zodiacSign: zodiac.toLowerCase(), // Added zodiac sign field
        keywords: [zodiac, category, '2025', 'Zodiac', 'Astrology'],
        source: getRandomItem(sources),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

export async function seedArticlesData() {
    const batch = writeBatch(db);

    for (let i = 0; i < 20; i++) {
        const article = generateArticle(i);
        const docRef = doc(db, "articles", article.id);
        batch.set(docRef, article);
    }

    try {
        await batch.commit();
        console.log("Successfully seeded 20 articles.");
        alert("Successfully seeded 20 articles!");
    } catch (error) {
        console.error("Error seeding articles:", error);
        alert("Error seeding articles. Check console for details.");
    }
}
