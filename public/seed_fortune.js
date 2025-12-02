import { db } from "./app.js";
import { doc, setDoc, writeBatch, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const types = ['daily', 'weekly', 'monthly'];
const directions = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
const colors = ['Red', 'Blue', 'Green', 'Gold', 'Silver', 'Purple', 'Orange', 'White', 'Black', 'Yellow'];
const benefactors = zodiacs;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateFortuneData(zodiac, type, dateStr) {
    const overallScore = getRandomInt(60, 100);
    return {
        zodiac: zodiac,
        type_of_fortune: type,
        date_of_fortune: dateStr,
        overall_score: overallScore,
        overall_stars: Math.round(overallScore / 20),
        brief_text: type === 'daily' ? `Today is a ${overallScore > 80 ? 'great' : 'good'} day for ${zodiac}s!` : `A promising ${type} ahead.`,
        career_score: getRandomInt(50, 100),
        love_score: getRandomInt(50, 100),
        health_score: getRandomInt(50, 100),
        wealth_score: getRandomInt(50, 100),
        benefactor: getRandomItem(benefactors),
        lucky_color: getRandomItem(colors),
        lucky_number: `${getRandomInt(1, 9)}, ${getRandomInt(1, 9)}`,
        love_direction: getRandomItem(directions),
        joy_direction: getRandomItem(directions),
        wealth_direction: getRandomItem(directions),
        do_text: "Focus on self-improvement",
        donot_text: "Avoid risky investments"
    };
}

export async function seedFortuneData() {
    const batch = writeBatch(db);
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    const dateStr = formatDate(today);

    let count = 0;

    for (const zodiac of zodiacs) {
        // Create one document per Zodiac
        const docRef = doc(db, "fortune", zodiac);

        const data = {
            daily: generateFortuneData(zodiac, 'daily', dateStr),
            weekly: generateFortuneData(zodiac, 'weekly', dateStr),
            monthly: generateFortuneData(zodiac, 'monthly', dateStr),
            yearly: generateFortuneData(zodiac, 'yearly', dateStr) // Assuming 'early' meant yearly
        };

        batch.set(docRef, data);
        count++;
    }

    await batch.commit();
    console.log(`Successfully seeded ${count} zodiac documents.`);
    alert(`Successfully seeded ${count} zodiac documents with new schema!`);
}
