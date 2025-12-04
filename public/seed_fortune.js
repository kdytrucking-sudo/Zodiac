import { db } from "./app.js";
import { doc, writeBatch } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const zodiacs = ['tiger', 'rat', 'ox', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const periods = ['today', 'week', 'month', 'year'];
const directions = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
const colors = ['Red', 'Blue', 'Green', 'Gold', 'Silver', 'Purple', 'Orange', 'White', 'Black', 'Yellow', 'Azure', 'Crimson', 'Teal'];
const flowers = ['Rose', 'Lily', 'Lotus', 'Orchid', 'Peony', 'Sunflower', 'Tulip', 'Daisy'];
const minerals = ['Gold', 'Silver', 'Jade', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Diamond'];
const times = ['7:00 AM - 9:00 AM', '1:00 PM - 3:00 PM', '5:00 PM - 7:00 PM', '9:00 PM - 11:00 PM', 'All Day'];

// --- Content Arrays (Simulating a rich content generation engine) ---
const careerTexts = [
    "A new opportunity will present itself unexpectedly.",
    "Your hard work is about to be recognized by superiors.",
    "Be cautious of office politics this period.",
    "It's a great time to learn a new skill.",
    "Stay focused on your current tasks; distraction is high.",
    "Collaboration is key to your success right now."
];
const loveTexts = [
    "Romance is in the air; be open to new connections.",
    "Communication with your partner will improve significantly.",
    "A misunderstanding may arise; handle it with patience.",
    "Take time to appreciate your loved ones.",
    "An old flame might reappear in your life.",
    "Focus on self-love and personal growth this period."
];
const healthTexts = [
    "Energy levels are high; use them wisely.",
    "Make sure to get enough sleep this period.",
    "A good time to start a new fitness routine.",
    "Watch your diet; avoid too much sugar.",
    "Stress management is crucial right now.",
    "You might feel a bit lethargic; rest is needed."
];
const wealthTexts = [
    "Unexpected income may come your way.",
    "Avoid making large purchases for now.",
    "A good time to review your investment portfolio.",
    "Financial stability is within reach.",
    "Be careful with lending money to friends.",
    "An opportunity for a side hustle might appear."
];
const doTexts = [
    "Take initiative on new projects.",
    "Call an old friend you haven't spoken to.",
    "Clean your living space for better energy.",
    "Meditate for at least 10 minutes.",
    "Wear your lucky color today.",
    "Trust your intuition."
];
const dontTexts = [
    "Engage in unnecessary arguments.",
    "Make impulsive financial decisions.",
    "Stay up too late scrolling on your phone.",
    "Ignore your body's signs of fatigue.",
    "Share secrets with people you don't trust.",
    "Procrastinate on important tasks."
];

// Detailed Texts for Paid Section
const careerDetailedTexts = [
    "This period marks a significant turning point in your professional journey. The stars align to favor bold moves and leadership. If you've been considering a pitch or a promotion request, the energy is supportive. However, ensure all your data is accurate before presenting.",
    "Stability is the theme for your career right now. While it may feel like things are moving slowly, this foundation is necessary for future growth. Use this time to refine your skills and build stronger relationships with your colleagues.",
    "Challenges may arise in the workplace, likely due to miscommunication. It is vital to document everything and communicate clearly. Your ability to remain calm under pressure will be noticed and rewarded in the long run."
];
const careerAdviceTexts = [
    "Schedule a meeting with your mentor to discuss long-term goals.",
    "Update your resume and LinkedIn profile; opportunities are looking for you.",
    "Focus on one major task at a time to avoid burnout."
];
const loveDetailedTexts = [
    "In-depth look: The stars suggest a time of deep emotional connection. If you are single, you might meet someone who shares your core values. For couples, it's a perfect time to plan a future together.",
    "You may feel a need for solitude to process your emotions. This is healthy. Don't force social interactions if you aren't feeling up to it. Your partner will understand if you communicate clearly.",
    "Passion is high this period! Use this energy to reignite the spark in your relationship. A surprise date or a thoughtful gift will go a long way."
];
const loveAdviceTexts = [
    "Plan a special date or a self-care evening.",
    "Be honest about your feelings, even if it's uncomfortable.",
    "Listen more than you speak this week."
];
const healthDetailedTexts = [
    "Detailed analysis: Your physical state is linked to your emotional well-being. Any stress you are feeling might manifest as physical tension. Yoga or meditation is highly recommended.",
    "Your vitality is returning. It's an excellent time to push yourself physically, perhaps with a more intense workout routine. Just be sure to warm up properly.",
    "Pay attention to your digestive system. Small changes in your diet could lead to significant improvements in your energy levels."
];
const healthAdviceTexts = [
    "Prioritize sleep and hydration. Consider yoga or light stretching.",
    "Try a new healthy recipe this week.",
    "Take a 30-minute walk outside every day."
];
const wealthDetailedTexts = [
    "Financial outlook: Long-term planning is favored over short-term gains. It's a good time to sit down and review your budget for the coming months.",
    "You might be tempted to splurge on luxury items. While it's okay to treat yourself, ensure it doesn't derail your savings goals.",
    "An investment opportunity may arise. Do your due diligence before committing any funds. Consult with a financial advisor if possible."
];
const wealthAdviceTexts = [
    "Review your monthly subscriptions and cut what you don't use.",
    "Set up an automatic transfer to your savings account.",
    "Avoid lending money to family members this week."
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateFortuneData(zodiac, period) {
    const luckyColor = getRandomItem(colors);
    const luckyNumber = getRandomInt(1, 9).toString();
    const luckyDirection = getRandomItem(directions);
    const luckyTime = getRandomItem(times);
    const benefactor = getRandomItem(zodiacs);

    // Ratings out of 5
    const careerRating = getRandomInt(3, 5);
    const healthRating = getRandomInt(3, 5);
    const loveRating = getRandomInt(3, 5);
    const wealthRating = getRandomInt(3, 5);

    const generatedData = {
        free: {
            overview: `A brief summary of your ${period} fortune for ${zodiac}. ${getRandomItem(careerTexts)} ${getRandomItem(wealthTexts)}`,
            career: getRandomItem(careerTexts),
            love: getRandomItem(loveTexts),
            health: getRandomItem(healthTexts),
            wealth: getRandomItem(wealthTexts),
            luckyColor: luckyColor,
            luckyNumber: luckyNumber,
            // Specific directions for dashboard
            loveDirection: getRandomItem(directions),
            joyDirection: getRandomItem(directions),
            wealthDirection: getRandomItem(directions),
            // Keep generic for other views if needed
            luckyDirection: luckyDirection,
            luckyTime: luckyTime,
            benefactor: benefactor,
            ratingCareer: careerRating,
            ratingHealth: healthRating,
            ratingLove: loveRating,
            ratingWealth: wealthRating,
            overallScore: getRandomInt(60, 100), // Added overallScore
            do: getRandomItem(doTexts),
            dont: getRandomItem(dontTexts)
        },
        paid: {
            // Detailed Descriptions
            careerDetailed: getRandomItem(careerDetailedTexts),
            loveDetailed: getRandomItem(loveDetailedTexts),
            healthDetailed: getRandomItem(healthDetailedTexts),
            wealthDetailed: getRandomItem(wealthDetailedTexts),

            // Personalized Advice
            careerAdvice: getRandomItem(careerAdviceTexts),
            loveAdvice: getRandomItem(loveAdviceTexts),
            healthAdvice: getRandomItem(healthAdviceTexts),
            wealthAdvice: getRandomItem(wealthAdviceTexts),

            // Ratings (can be same as free or more granular, using same for consistency here)
            ratingCareer: careerRating,
            ratingHealth: healthRating,
            ratingLove: loveRating,
            ratingWealth: wealthRating,

            // Lucky Elements (More comprehensive for paid)
            luckyColors: `${luckyColor}, ${getRandomItem(colors)}`,
            luckyNumbers: `${luckyNumber}, ${getRandomInt(10, 99)}, ${getRandomInt(1, 9)}`,
            luckyDirections: `${luckyDirection}, ${getRandomItem(directions)}`,
            luckyFlower: getRandomItem(flowers),
            luckyMineral: getRandomItem(minerals),
            luckyTime: luckyTime,
            benefactor: benefactor,

            // Specific directions for consistency
            loveDirection: getRandomItem(directions),
            joyDirection: getRandomItem(directions),
            wealthDirection: getRandomItem(directions),

            // Lists
            dos: getRandomItems(doTexts, 4),
            donts: getRandomItems(dontTexts, 4)
        }
    };

    console.log(`Generated data for ${zodiac} (${period}):`, generatedData);
    return generatedData;
}

export async function seedFortuneData() {
    const batch = writeBatch(db);
    let count = 0;
    let sampleData = null;

    console.log("Starting seeding process...");

    for (const zodiac of zodiacs) {
        const docRef = doc(db, "fortune", zodiac);
        const data = {};
        for (const period of periods) {
            data[period] = generateFortuneData(zodiac, period);
        }

        // Capture sample data for the first zodiac (Tiger) to show user
        if (count === 0) {
            sampleData = { zodiac: zodiac, data: data };
        }

        batch.set(docRef, data);
        count++;
    }

    try {
        await batch.commit();
        console.log(`Successfully seeded ${count} zodiac documents.`);

        // Log to console
        console.log("Sample Data Written (Tiger):", JSON.stringify(sampleData, null, 2));

        // Display on page for user verification
        const outputDiv = document.createElement('div');
        outputDiv.style.padding = '20px';
        outputDiv.style.backgroundColor = '#f0f0f0';
        outputDiv.style.marginTop = '20px';
        outputDiv.style.whiteSpace = 'pre-wrap';
        outputDiv.style.fontFamily = 'monospace';
        outputDiv.innerHTML = `<h3>Seeding Complete!</h3><p>Inserted ${count} documents into 'fortune' collection.</p><h4>Sample Data (Tiger):</h4><pre>${JSON.stringify(sampleData, null, 2)}</pre>`;
        document.body.appendChild(outputDiv);

        alert(`Successfully seeded ${count} zodiac documents! Scroll down to see sample data.`);
    } catch (error) {
        console.error("Error seeding fortune data:", error);
        alert("Error seeding data. Check console for details.");
    }
}
