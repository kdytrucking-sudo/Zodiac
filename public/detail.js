import { db } from "./app.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Get the zodiac sign from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const sign = urlParams.get('sign'); // e.g. ?sign=rat

async function loadZodiacDetail() {
    if (!sign) {
        document.getElementById('zodiac-name').textContent = "No Zodiac Selected";
        return;
    }

    // Normalize sign to lowercase for ID
    const signId = sign.toLowerCase();

    // Reference to the document in 'zodiacs' collection (assuming user meant collection name)
    const docRef = doc(db, "zodiacs", signId);

    // Timeout promise to prevent infinite loading
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    try {
        const docSnap = await Promise.race([getDoc(docRef), timeout]);

        if (docSnap.exists()) {
            const data = docSnap.data();
            renderZodiac(data);
        } else {
            console.log("No such document!");
            document.getElementById('zodiac-name').textContent = "Zodiac Not Found";

            // Offer to seed data if it's the Rat (for testing)
            if (signId === 'rat') {
                const seedBtn = document.createElement('button');
                seedBtn.textContent = "Seed Rat Data (Test)";
                seedBtn.onclick = seedRatData;
                seedBtn.style.marginTop = "20px";
                seedBtn.style.padding = "10px";
                document.querySelector('.detail-header').appendChild(seedBtn);
            }
        }
    } catch (error) {
        console.error("Error getting document:", error);
        document.getElementById('zodiac-name').textContent = "Error Loading Data: " + error.message;
    }
}

function renderZodiac(data) {
    // Header
    document.title = `${data.name} - Larak's Zodiac`;
    document.getElementById('zodiac-name').textContent = data.name;
    document.getElementById('chinese-char').textContent = data.chineseChar || '';
    document.getElementById('earthly-branch').textContent = `Earthly Branch: ${data.earthlyBranch || '-'}`;
    document.getElementById('years').textContent = data.years ? data.years.join(' • ') : '';

    // Image
    const imgEl = document.getElementById('header-img');
    imgEl.src = `images/${data.id}.png`; // Assumes images are named rat.png, ox.png etc.
    imgEl.alt = data.name;

    // Sections
    document.getElementById('introduction').textContent = data.introduction || 'No introduction available.';
    document.getElementById('lifetime-fortune').textContent = data.lifetimeFortune || 'No fortune data.';
    document.getElementById('love-marriage').textContent = data.loveMarriage || '-';
    document.getElementById('wealth').textContent = data.wealth || '-';
    document.getElementById('health').textContent = data.health || '-';
    document.getElementById('origin').textContent = data.origin || '-';

    // Lists (Personality, etc.)
    renderList('personality-list', data.personality);
    renderList('strengths-list', data.strengths);
    renderList('weaknesses-list', data.weaknesses);

    // Attributes
    if (data.attributes) {
        document.getElementById('attr-element').textContent = data.attributes.element || '-';
        document.getElementById('attr-yinyang').textContent = data.attributes.yinyang || '-';
        document.getElementById('attr-numbers').textContent = data.attributes.luckyNumbers ? data.attributes.luckyNumbers.join(', ') : '-';
        document.getElementById('attr-colors').textContent = data.attributes.luckyColors ? data.attributes.luckyColors.join(', ') : '-';
        document.getElementById('attr-directions').textContent = data.attributes.auspiciousDirections ? data.attributes.auspiciousDirections.join(', ') : '-';
        document.getElementById('attr-flowers').textContent = data.attributes.luckyFlowers ? data.attributes.luckyFlowers.join(', ') : '-';
    }
}

function renderList(elementId, items) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    if (items && Array.isArray(items)) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }
}

// --- Seed Data Function (For User to Populate DB) ---
async function seedRatData() {
    const ratData = {
        id: 'rat',
        name: 'The Rat',
        chineseChar: '鼠',
        earthlyBranch: '子 (Zi)',
        years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
        introduction: "The Rat is the first of the repeating 12-year cycle of animals which appear in the Chinese zodiac. Known for its wit, charm, and intelligence, the Rat is a symbol of resourcefulness and adaptability. Those born under this sign are often seen as pioneers and leaders, capable of navigating complex situations with a sharp mind and keen intuition. Their sociable nature makes them excellent friends and partners, though they can be private about their own emotions.",
        lifetimeFortune: "The Rat's life is one of constant activity and progress. They are destined for success through their diligence and cleverness. Early years may be spent building a foundation, but their efforts pay off, leading to a stable and prosperous middle age. They have a natural talent for accumulating wealth and are often financially secure. Their fortune is not just material; they also build a rich life filled with strong relationships and intellectual pursuits.",
        loveMarriage: "In romance, the Rat is a passionate and devoted partner. They seek a deep and meaningful connection. Their ideal partners are often the Dragon, Monkey, or Ox, who appreciate their intelligence and support their ambitions. A relationship with a Rat is never dull, filled with lively conversations and shared adventures.",
        wealth: "Rats have a keen sense of finance and are excellent at spotting opportunities. They are not extravagant spenders but prefer to invest wisely for long-term security. Their wealth often comes from their own hard work and smart decisions, rather than from luck alone. They are cautious but will take calculated risks that usually pay off.",
        health: "Generally, Rats enjoy good health due to their active lifestyle. However, their tendency to work hard and take on stress can sometimes lead to nervous tension or related issues. A balanced diet, regular exercise, and finding healthy ways to unwind are crucial for maintaining their well-being throughout their lives. They should pay attention to their respiratory and digestive systems.",
        origin: "The Rat's position as the first animal in the zodiac comes from a famous legend. The Jade Emperor announced a great race to determine the order of the zodiac animals. The clever Rat, knowing it couldn't outrun the larger animals, hitched a ride on the back of the diligent Ox. Just as the Ox was about to cross the finish line, the Rat leaped off its back and claimed first place, securing its prestigious position for all time.",
        personality: ["Intelligent", "Resourceful", "Charming", "Ambitious"],
        strengths: ["Adaptable", "Quick-witted", "Sociable", "Persuasive"],
        weaknesses: ["Timid", "Stubborn", "Critical", "Sometimes Greedy"],
        attributes: {
            element: "Water (Shui)",
            yinyang: "Yang",
            luckyNumbers: [2, 3],
            luckyColors: ["Blue", "Gold", "Green"],
            auspiciousDirections: ["West", "Northwest"],
            luckyFlowers: ["Lily", "African Violet"]
        }
    };

    try {
        await setDoc(doc(db, "zodiacs", "rat"), ratData);
        alert("Rat data seeded successfully! Refresh the page.");
        window.location.reload();
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error seeding data. Check console.");
    }
}

// Expose seed function to global scope so user can call it from console if needed
window.seedRatData = seedRatData;

window.addEventListener('DOMContentLoaded', loadZodiacDetail);
