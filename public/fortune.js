import { auth, db } from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let currentUser = null;
let userLevel = 0;
let selectedZodiac = 'tiger';
let selectedPeriod = 'week';
let currentFortuneData = null; // Store fetched data for the current zodiac

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
    await updateContent();
});

async function fetchFortuneData(zodiac) {
    try {
        const docRef = doc(db, "fortune", zodiac);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentFortuneData = docSnap.data();
            return currentFortuneData;
        } else {
            console.error("No fortune data found for zodiac:", zodiac);
            return null;
        }
    } catch (error) {
        console.error("Error fetching fortune data:", error);
        return null;
    }
}

async function updateContent() {
    // Fetch data if it's not loaded or if the zodiac changed (logic handled by caller usually, but safe to check)
    // For simplicity, we'll fetch if currentFortuneData is null or doesn't match selectedZodiac (if we tracked it)
    // Since we don't track which zodiac is in currentFortuneData explicitly in a var, we can just fetch.
    // Optimization: We could store loadedZodiac.

    // Always fetch for now to ensure freshness and simplicity
    await fetchFortuneData(selectedZodiac);

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
    if (!currentFortuneData || !currentFortuneData[selectedPeriod]) {
        console.warn("Data not available for", selectedZodiac, selectedPeriod);
        return;
    }

    const data = currentFortuneData[selectedPeriod].free;

    // Update last updated time
    updateLastUpdatedTime();

    document.getElementById('free-zodiac-name').textContent = capitalizeFirst(selectedZodiac);
    document.getElementById('free-overview-text').textContent = data.overview;
    document.getElementById('free-career').textContent = data.career;
    document.getElementById('free-love').textContent = data.love;
    document.getElementById('free-health').textContent = data.health;
    document.getElementById('free-wealth').textContent = data.wealth;
    document.getElementById('free-lucky-color').textContent = data.luckyColor;
    document.getElementById('free-lucky-number').textContent = data.luckyNumber;

    // New fields
    if (document.getElementById('free-lucky-direction'))
        document.getElementById('free-lucky-direction').textContent = data.luckyDirection || 'N/A';
    if (document.getElementById('free-lucky-time'))
        document.getElementById('free-lucky-time').textContent = data.luckyTime || 'N/A';
    if (document.getElementById('free-benefactor'))
        document.getElementById('free-benefactor').textContent = capitalizeFirst(data.benefactor || 'N/A');

    // Ratings
    if (document.getElementById('free-career-rating'))
        document.getElementById('free-career-rating').textContent = `(${data.ratingCareer}/5)`;
    if (document.getElementById('free-love-rating'))
        document.getElementById('free-love-rating').textContent = `(${data.ratingLove}/5)`;
    if (document.getElementById('free-health-rating'))
        document.getElementById('free-health-rating').textContent = `(${data.ratingHealth}/5)`;
    if (document.getElementById('free-wealth-rating'))
        document.getElementById('free-wealth-rating').textContent = `(${data.ratingWealth}/5)`;

    document.getElementById('free-do').textContent = `Do: ${data.do}`;
    document.getElementById('free-dont').textContent = `Don't: ${data.dont}`;
}

function updatePaidContent() {
    if (!currentFortuneData || !currentFortuneData[selectedPeriod]) {
        console.warn("Data not available for", selectedZodiac, selectedPeriod);
        return;
    }

    const data = currentFortuneData[selectedPeriod].paid;

    // Update last updated time
    updateLastUpdatedTime();

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

    // New fields
    if (document.getElementById('paid-lucky-time'))
        document.getElementById('paid-lucky-time').textContent = data.luckyTime || 'N/A';
    if (document.getElementById('paid-benefactor'))
        document.getElementById('paid-benefactor').textContent = capitalizeFirst(data.benefactor || 'N/A');

    // Ratings
    if (document.getElementById('paid-career-rating'))
        document.getElementById('paid-career-rating').textContent = `(${data.ratingCareer}/5)`;
    if (document.getElementById('paid-love-rating'))
        document.getElementById('paid-love-rating').textContent = `(${data.ratingLove}/5)`;
    if (document.getElementById('paid-health-rating'))
        document.getElementById('paid-health-rating').textContent = `(${data.ratingHealth}/5)`;
    if (document.getElementById('paid-wealth-rating'))
        document.getElementById('paid-wealth-rating').textContent = `(${data.ratingWealth}/5)`;

    // Update Do's list
    const dosList = document.getElementById('paid-dos-list');
    if (data.dos && Array.isArray(data.dos)) {
        dosList.innerHTML = data.dos.map(item => `<li>${item}</li>`).join('');
    }

    // Update Don'ts list
    const dontsList = document.getElementById('paid-donts-list');
    if (data.donts && Array.isArray(data.donts)) {
        dontsList.innerHTML = data.donts.map(item => `<li>${item}</li>`).join('');
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format and update last updated time
function updateLastUpdatedTime() {
    if (!currentFortuneData || !currentFortuneData[selectedPeriod]) {
        return;
    }

    const updatedAt = currentFortuneData[selectedPeriod].updatedAt;
    const lastUpdatedElement = document.getElementById('last-updated');

    if (!lastUpdatedElement) return;

    if (updatedAt) {
        const date = new Date(updatedAt);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeText = '';
        if (diffHours < 1) {
            timeText = 'Updated just now';
        } else if (diffHours < 24) {
            timeText = `Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            timeText = `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            // Format as date
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            timeText = `Updated ${date.toLocaleDateString('en-US', options)}`;
        }

        lastUpdatedElement.textContent = `(${timeText})`;
    } else {
        lastUpdatedElement.textContent = '';
    }
}

// Unified Zodiac Selection
const zodiacSelect = document.getElementById('zodiac-select');
if (zodiacSelect) {
    zodiacSelect.addEventListener('change', async (e) => {
        selectedZodiac = e.target.value;
        await updateContent();
    });
}

// Unified Period Selection
document.querySelectorAll('.period-btn-small').forEach(btn => {
    btn.addEventListener('click', async () => {
        document.querySelectorAll('.period-btn-small').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPeriod = btn.dataset.period;
        // No need to fetch again if we have the whole zodiac doc, just update view
        if (currentFortuneData) {
            if (currentUser && userLevel > 0) {
                updatePaidContent();
            } else {
                updateFreeContent();
            }
        } else {
            await updateContent();
        }
    });
});

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
    // Initial load handled by auth state change or manual call if auth is slow
    // But auth listener will fire eventually.
});
