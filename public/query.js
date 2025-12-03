import { auth, db } from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { solarToLunar, calculateZodiac } from "./lunar-utils.js";

const queryForm = document.getElementById('zodiac-query-form');
const resultsContainer = document.getElementById('results-container');
const unlockSection = document.getElementById('unlock-section');
const paidContent = document.getElementById('paid-content');
const purchaseBtn = document.getElementById('purchase-btn');

// Result Elements
const resultZodiacImg = document.getElementById('result-zodiac-img');
const resultZodiacName = document.getElementById('result-zodiac-name');
const resultLunarInfo = document.getElementById('result-lunar-info');
const resultZodiacDesc = document.getElementById('result-zodiac-desc');

let currentUser = null;
let userLevel = 0;

// Zodiac Data (Mock descriptions)
const zodiacDescriptions = {
    Rat: "Rats are quick-witted, resourceful, and versatile. With strong intuition and quick response, they always easily adapt themselves to a new environment.",
    Ox: "Oxen are known for diligence, dependability, strength and determination. Having an honest nature, Oxen are strongly patriotic, have ideals and ambitions for life, and attach importance to family and work.",
    Tiger: "Tigers are brave, competitive, unpredictable, and confident. They are very charming and well-liked by others. But sometimes they are likely to be impetuous, irritable, and overindulged.",
    Rabbit: "Rabbits are tend to be gentle, quiet, elegant, and alert as well as quick, skillful, kind, patient, and very responsible. However, they might be superficial, stubborn, melancholy, and overly discreet.",
    Dragon: "Dragons are powerful, kind-hearted, successful, innovative, brave, healthy courageous and enterprising. However, they tend to be conceited, scrutinizing, tactless, quick-tempered and overconfident.",
    Snake: "Snakes are regarded as the symbol of wisdom. They are intelligent and wise. They are good at communication but say little. Snakes are usually regarded as great thinkers.",
    Horse: "Horses are extremely animated, active and energetic. Horses love to be in a crowd, and they can usually be seen on such occasions as concerts, theater performances, meetings, sporting events, and parties.",
    Goat: "Goats are generally believed to be gentle, mild-mannered, shy, stable, sympathetic, amicable, and brimming with a strong sense of kindheartedness and justice.",
    Monkey: "Monkeys have a magnetic personality and are witty and intelligent. Personality traits like mischievousness, curiosity, and cleverness, make them very naughty.",
    Rooster: "Roosters are observant, hardworking, courageous, and talented. Roosters are very confident about themselves.",
    Dog: "Dogs are loyal and honest, amiable and kind, cautious and prudent. Due to having a strong sense of loyalty and sincerity, Dogs will do everything for the person who they think is most important.",
    Pig: "Pigs are diligent, compassionate, and generous. They have great concentration: once they set a goal, they will devote all their energy to achieving it."
};

// Set default values on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set default date: 07/18/1975 (format: yyyy-mm-dd for input type="date")
    document.getElementById('query-date').value = '1975-07-18';

    // Set default time: 02:22 AM (format: HH:mm for input type="time")
    document.getElementById('query-time').value = '02:22';

    // Set default location: Los Angeles
    document.getElementById('query-location').value = 'Los Angeles';
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        // Fetch user level
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                userLevel = docSnap.data().level || 0;
            }
        } catch (e) {
            console.error("Error fetching user data:", e);
        }
    } else {
        currentUser = null;
        userLevel = 0;
    }
});

queryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dateStr = document.getElementById('query-date').value;
    if (!dateStr) return;

    // 1. Calculate Zodiac
    const lunarInfo = solarToLunar(dateStr);
    const zodiac = calculateZodiac(lunarInfo.lunarYear);

    // 2. Update Free Result UI
    updateFreeResult(zodiac, lunarInfo);

    // 3. Handle Paid/Free View
    resultsContainer.style.display = 'block';

    if (currentUser && userLevel > 0) {
        // Paid User
        unlockSection.style.display = 'none';
        paidContent.style.display = 'block';
        updatePaidContent(zodiac);
    } else {
        // Free User or Not Logged In
        unlockSection.style.display = 'block';
        paidContent.style.display = 'none';
    }

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
});

function updateFreeResult(zodiac, lunarInfo) {
    resultZodiacName.textContent = zodiac;
    resultZodiacImg.src = `images/${zodiac.toLowerCase()}.png`;
    resultLunarInfo.textContent = `Lunar Calendar: Year of the ${lunarInfo.lunarYear} (${zodiac}), ${lunarInfo.lunarDate}`;
    resultZodiacDesc.textContent = zodiacDescriptions[zodiac] || "Description not available.";
}

function updatePaidContent(zodiac) {
    // In a real app, this would fetch specific data from the backend.
    // Here we just update the titles to reflect the zodiac for demo purposes.

    // Update dynamic text in paid sections if needed
    // For now, the static HTML placeholder is generic enough, 
    // but we could inject specific zodiac traits here.

    const introText = paidContent.querySelector('.two-col-text p:first-child');
    if (introText) {
        introText.innerHTML = `As a <strong>${zodiac}</strong>, your personality is unique. (This is a sample detailed analysis for ${zodiac}. In the full version, this would contain specific generated content based on your birth chart.)`;
    }
}

purchaseBtn.addEventListener('click', () => {
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        // Redirect to payment or upgrade page
        alert("Redirecting to payment gateway...");
        // window.location.href = 'upgrade.html';
    }
});
