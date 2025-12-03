import { auth, db } from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let currentUser = null;
let userLevel = 0;
let selectedZodiac = 'tiger';
let selectedPeriod = 'week';

// Fortune data (mock data - in production this would come from backend/API)
const fortuneData = {
    tiger: {
        week: {
            overview: "A brief summary of your fortune for this week. Opportunities may arise, but caution is advised in financial matters.",
            career: "A project will demand your full attention.",
            love: "Communication is key with your partner.",
            health: "Focus on maintaining a balanced diet.",
            wealth: "Avoid impulsive spending this week.",
            luckyColor: "Azure",
            luckyNumber: "7",
            do: "Take initiative on new projects.",
            dont: "Engage in unnecessary arguments.",
            // Paid content
            careerDetailed: "This is a pivotal week for your professional life. A major project will demand your full attention, and your leadership qualities will be put to the test. Collaboration with colleagues will be fruitful, but be mindful of asserting your ideas without overshadowing others. An unexpected opportunity for advancement may present itself towards the end of the week. Be prepared to act swiftly and decisively, as hesitation could mean missing out on a significant career boost.",
            careerAdvice: "Focus on completing one task at a time to avoid feeling overwhelmed. Schedule a meeting to present your innovative ideas this week. Trust your intuition when evaluating new opportunities, but don't neglect due diligence. Networking with senior colleagues could open doors.",
            healthDetailed: "Your energy levels may fluctuate, so it's crucial to prioritize rest and nutrition. Focus on maintaining a balanced diet, incorporating more green vegetables and lean proteins. Stress from work could affect you physically, so incorporating relaxation techniques such as meditation or a gentle walk in nature is highly recommended. Pay attention to your body's signals and avoid pushing yourself to the extreme.",
            healthAdvice: "Aim for 7-8 hours of sleep each night. Prepare healthy meals in advance to avoid unhealthy snacking. Dedicate at least 15 minutes each day to mindfulness or deep breathing exercises. Listen to calming music before bed to improve sleep quality.",
            loveDetailed: "Communication is the cornerstone of your relationships this week. For those in a relationship, open and honest dialogue will strengthen your bond. Don't shy away from discussing deeper emotions or future plans. Singles may encounter someone intriguing through a social or professional gathering, so be open to new connections. However, avoid letting favor genuine emotional expression over superficial charm. It's a time for building trust and understanding.",
            loveAdvice: "Set aside quality time with your partner without distractions. For singles, accept social invitations that generally interest you. Express your feelings honestly, but kindly. Listen actively to what others are saying, both verbally and non-verbally.",
            wealthDetailed: "Financial prudence is essential this week. While your income streams remain stable, there is a temptation for impulsive purchases or investments. Exercise caution and thoroughly vet any financial opportunities before committing. Stick to your budget and long-term financial goals. Avoid high-risk investments and seek professional advice if you are considering any significant financial decisions. An unexpected expense may arise, so having a contingency fund will be beneficial.",
            wealthAdvice: "Review your monthly budget and stick to it. Delay any non-essential large purchases for a few weeks. Research thoroughly before making any investments. Set aside a small amount of money into your savings account.",
            luckyColors: "Azure, Silver",
            luckyNumbers: "3, 7, 18",
            luckyDirections: "East, Southeast",
            luckyFlower: "Yellow Lily",
            luckyMineral: "Sapphire",
            dos: [
                "Take initiative on new projects and showcase your leadership skills.",
                "Engage in open and honest communication with your loved ones.",
                "Prioritize self-care and listen to your body's need for rest.",
                "Review your finances and create a solid budget for the week."
            ],
            donts: [
                "Engage in unnecessary arguments or workplace gossip.",
                "Make impulsive purchases or high-risk financial decisions.",
                "Ignore feelings of stress or fatigue; avoid overexertion.",
                "Hesitate to express your true feelings in personal relationships."
            ]
        }
    }
};

// Check user authentication and level
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
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

    // Show appropriate content based on user level
    toggleContentView();
});

function toggleContentView() {
    const freeContent = document.getElementById('free-content');
    const paidContent = document.getElementById('paid-content');

    if (currentUser && userLevel > 0) {
        // Paid user - show detailed content
        freeContent.style.display = 'none';
        paidContent.style.display = 'block';
        updatePaidContent();
    } else {
        // Free user or not logged in - show basic content with unlock option
        freeContent.style.display = 'block';
        paidContent.style.display = 'none';
        updateFreeContent();
    }
}

function updateFreeContent() {
    const data = fortuneData[selectedZodiac]?.[selectedPeriod] || fortuneData.tiger.week;

    document.getElementById('free-zodiac-name').textContent = capitalizeFirst(selectedZodiac);
    document.getElementById('free-overview-text').textContent = data.overview;
    document.getElementById('free-career').textContent = data.career;
    document.getElementById('free-love').textContent = data.love;
    document.getElementById('free-health').textContent = data.health;
    document.getElementById('free-wealth').textContent = data.wealth;
    document.getElementById('free-lucky-color').textContent = data.luckyColor;
    document.getElementById('free-lucky-number').textContent = data.luckyNumber;
    document.getElementById('free-do').textContent = `Do: ${data.do}`;
    document.getElementById('free-dont').textContent = `Don't: ${data.dont}`;
}

function updatePaidContent() {
    const data = fortuneData[selectedZodiac]?.[selectedPeriod] || fortuneData.tiger.week;

    document.getElementById('paid-zodiac-name').textContent = capitalizeFirst(selectedZodiac);
    document.getElementById('paid-career-desc').textContent = data.careerDetailed;
    document.getElementById('paid-career-advice').textContent = data.careerAdvice;
    document.getElementById('paid-health-desc').textContent = data.healthDetailed;
    document.getElementById('paid-health-advice').textContent = data.healthAdvice;
    document.getElementById('paid-love-desc').textContent = data.loveDetailed;
    document.getElementById('paid-love-advice').textContent = data.loveAdvice;
    document.getElementById('paid-wealth-desc').textContent = data.wealthDetailed;
    document.getElementById('paid-wealth-advice').textContent = data.wealthAdvice;

    document.getElementById('paid-lucky-colors').textContent = data.luckyColors;
    document.getElementById('paid-lucky-numbers').textContent = data.luckyNumbers;
    document.getElementById('paid-lucky-directions').textContent = data.luckyDirections;
    document.getElementById('paid-lucky-flower').textContent = data.luckyFlower;
    document.getElementById('paid-lucky-mineral').textContent = data.luckyMineral;

    // Update Do's list
    const dosList = document.getElementById('paid-dos-list');
    dosList.innerHTML = data.dos.map(item => `<li>${item}</li>`).join('');

    // Update Don'ts list
    const dontsList = document.getElementById('paid-donts-list');
    dontsList.innerHTML = data.donts.map(item => `<li>${item}</li>`).join('');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Unified Zodiac Selection
const zodiacSelect = document.getElementById('zodiac-select');
if (zodiacSelect) {
    zodiacSelect.addEventListener('change', (e) => {
        selectedZodiac = e.target.value;
        updateContent();
    });
}

// Unified Period Selection
document.querySelectorAll('.period-btn-small').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn-small').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPeriod = btn.dataset.period;
        updateContent();
    });
});

function updateContent() {
    if (currentUser && userLevel > 0) {
        updatePaidContent();
    } else {
        updateFreeContent();
    }
}

// Unlock button
const unlockBtn = document.getElementById('unlock-btn');
if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
        if (!currentUser) {
            // Redirect to login
            window.location.href = 'login.html';
        } else {
            // Redirect to upgrade/payment page
            alert('Redirecting to payment gateway...');
            // window.location.href = 'upgrade.html';
        }
    });
}

// Initialize content on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial values if needed
    if (zodiacSelect) zodiacSelect.value = selectedZodiac;
});
