import { db, auth } from "./app.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const sampleArticles = [
    { id: "article_001", title: "Detailed Fortune for the Year of the Snake 2025" },
    { id: "article_005", title: "How to Choose the Best Partner Based on Zodiac Sign" },
    { id: "article_012", title: "Office Feng Shui Layout to Enhance Career Luck" },
    { id: "article_008", title: "The Legend of the 12 Zodiac Animals" },
    { id: "article_015", title: "Weekly Horoscope: What the Stars Say" },
    { id: "article_020", title: "Understanding Your Moon Sign" },
    { id: "article_022", title: "Top 5 Lucky Colors for 2025" }
];

function getRandomItems(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function seedFavoritesData() {
    const user = auth.currentUser;

    if (!user) {
        alert("Please log in first to seed favorites for your account.");
        return;
    }

    await addFavoritesForUser(user.uid);
    alert("Successfully added sample favorites to your account!");
}

export async function seedAllUsersFavorites() {
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        if (snapshot.empty) {
            alert("No users found in the database.");
            return;
        }

        let count = 0;
        for (const doc of snapshot.docs) {
            await addFavoritesForUser(doc.id);
            count++;
        }

        console.log(`Seeded favorites for ${count} users.`);
        alert(`Successfully seeded favorites for all ${count} users!`);

    } catch (error) {
        console.error("Error seeding all users:", error);
        alert("Error: " + error.message);
    }
}

async function addFavoritesForUser(uid) {
    const favoritesRef = collection(db, "favorites");
    const articles = getRandomItems(sampleArticles, 3); // Pick 3 random articles

    for (const article of articles) {
        await addDoc(favoritesRef, {
            uid: uid,
            articleId: article.id,
            articleTitle: article.title,
            timestamp: new Date().toISOString()
        });
    }
}
