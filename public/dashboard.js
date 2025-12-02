import { auth, db } from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const profileWarning = document.getElementById('profile-warning');

// User Info Elements
const displayNameEl = document.getElementById('display-name');
const accountTierEl = document.getElementById('account-tier');
const displayDobEl = document.getElementById('display-dob');
const displayTobEl = document.getElementById('display-tob');
const displayLocationEl = document.getElementById('display-location');

// Fortune Elements
const currentDateEl = document.getElementById('current-date');
const currentDayEl = document.getElementById('current-day');
const userZodiacNameEl = document.getElementById('user-zodiac-name');
const userZodiacImgEl = document.getElementById('user-zodiac-img');

// Fortune Data Elements
const bigScoreEl = document.querySelector('.big-score');
const fortuneQuoteEl = document.querySelector('.fortune-quote');
const starsContainer = document.querySelector('.stars');
const pFillCareer = document.querySelectorAll('.p-fill')[0];
const pFillLove = document.querySelectorAll('.p-fill')[1];
const pFillHealth = document.querySelectorAll('.p-fill')[2];
const pFillWealth = document.querySelectorAll('.p-fill')[3];

const luckyBenefactorEl = document.getElementById('lucky-benefactor');
const luckyColorEl = document.getElementById('lucky-color');
const luckyNumbersEl = document.getElementById('lucky-numbers');
const luckyDirectionEl = document.getElementById('lucky-direction');
const luckyJoyEl = document.getElementById('lucky-joy');
const luckyWealthEl = document.getElementById('lucky-wealth');

const doItemEl = document.querySelector('.do-item span:last-child');
const dontItemEl = document.querySelector('.dont-item span:last-child');

const favoritesListEl = document.getElementById('favorites-list');
const readingLogListEl = document.getElementById('reading-log-list');

// Tabs
const tabs = document.querySelectorAll('.tab-btn');
let currentZodiac = 'Rat'; // Default
let currentPeriod = 'Daily'; // Default

onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadUserData(user.uid);
        await loadFavorites(user.uid);
        await loadReadingLogs(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

// Tab Event Listeners
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active state
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        currentPeriod = tab.textContent;
        loadFortuneData(currentZodiac, currentPeriod);
    });
});

async function loadUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Render User Info
            displayNameEl.textContent = data.name || auth.currentUser.displayName || 'User';

            // Account Tier
            if (data.level === 1) {
                accountTierEl.textContent = 'Gold Member';
                accountTierEl.classList.add('gold');
            } else {
                accountTierEl.textContent = 'Free Member';
                accountTierEl.classList.remove('gold');
            }

            // Birth Info
            if (data.birthdate) {
                displayDobEl.textContent = formatDate(data.birthdate);
                profileWarning.style.display = 'none';

                // Calculate Zodiac
                const birthYear = new Date(data.birthdate).getFullYear();
                const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
                const zIndex = (birthYear - 1900) % 12;
                currentZodiac = zodiacs[zIndex >= 0 ? zIndex : zIndex + 12];

            } else {
                displayDobEl.textContent = 'Not set';
                profileWarning.style.display = 'flex';
                currentZodiac = 'Rat'; // Default
            }

            displayTobEl.textContent = data.birthtime || 'Not set';
            displayLocationEl.textContent = data.location || 'Not set';

            // Initial Load
            updateFortuneHeader(currentZodiac);
            loadFortuneData(currentZodiac, 'Daily');

        } else {
            // Document doesn't exist (legacy user or creation failed)
            console.log("User document not found in Firestore.");
            displayNameEl.textContent = auth.currentUser.displayName || 'User';
            accountTierEl.textContent = 'Free Member';
            displayDobEl.textContent = 'Not set';
            displayTobEl.textContent = 'Not set';
            displayLocationEl.textContent = 'Not set';
            profileWarning.style.display = 'flex';

            // Default load
            currentZodiac = 'Rat';
            updateFortuneHeader(currentZodiac);
            loadFortuneData(currentZodiac, 'Daily');
        }
    } catch (error) {
        console.error("Error getting user document:", error);
        // Fallback on error
        displayNameEl.textContent = auth.currentUser?.displayName || 'User';
    }
}

function updateFortuneHeader(zodiac) {
    userZodiacNameEl.textContent = zodiac;
    userZodiacImgEl.src = `images/${zodiac.toLowerCase()}.png`;

    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    currentDayEl.textContent = `(${now.toLocaleDateString('en-US', { weekday: 'long' })})`;
}

async function loadFortuneData(zodiac, period) {
    try {
        // Fetch the single document for the Zodiac
        const docRef = doc(db, "fortune", zodiac);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const fullData = docSnap.data();
            let periodData = null;

            // Map period to field name
            // Tabs are: Daily, Weekly, Monthly, Yearly
            const fieldName = period.toLowerCase();

            if (fullData[fieldName]) {
                periodData = fullData[fieldName];
                renderFortuneData(periodData);
            } else {
                console.log(`No data for ${fieldName} in ${zodiac}`);
                bigScoreEl.textContent = '--';
                fortuneQuoteEl.textContent = "Data not available";
            }
        } else {
            console.log("No fortune document found for", zodiac);
            bigScoreEl.textContent = '--';
            fortuneQuoteEl.textContent = "Data not available yet";
        }
    } catch (error) {
        console.error("Error loading fortune:", error);
    }
}

function renderFortuneData(data) {
    bigScoreEl.textContent = data.overall_score;
    fortuneQuoteEl.textContent = `"${data.do_text}"`;

    // Stars
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < data.overall_stars) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    starsContainer.innerHTML = starsHtml;

    // Progress Bars
    pFillCareer.style.width = `${data.career_score}%`;
    pFillLove.style.width = `${data.love_score}%`;
    pFillHealth.style.width = `${data.health_score}%`;
    pFillWealth.style.width = `${data.wealth_score}%`;

    // Lucky Grid
    luckyBenefactorEl.textContent = data.benefactor;
    luckyColorEl.textContent = data.lucky_color;
    luckyNumbersEl.textContent = data.lucky_number;
    luckyDirectionEl.textContent = data.love_direction;
    luckyJoyEl.textContent = data.joy_direction;
    luckyWealthEl.textContent = data.wealth_direction;

    // Do's and Don'ts
    doItemEl.textContent = data.do_text;
    dontItemEl.textContent = data.donot_text;
}

async function loadFavorites(uid) {
    try {
        const q = query(
            collection(db, "favorites"),
            where("uid", "==", uid),
            orderBy("timestamp", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(q);

        favoritesListEl.innerHTML = ''; // Clear existing/mock data

        if (querySnapshot.empty) {
            favoritesListEl.innerHTML = '<div class="list-item"><span>No favorites yet.</span></div>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <span>${data.articleTitle}</span>
                <i class="fas fa-chevron-right"></i>
            `;
            // Optional: Add click handler to navigate to article
            item.addEventListener('click', () => {
                // window.location.href = `article.html?id=${data.articleId}`;
                console.log("Navigate to article:", data.articleId);
            });
            favoritesListEl.appendChild(item);
        });

    } catch (error) {
        console.error("Error loading favorites:", error);
        if (error.code === 'failed-precondition') {
            console.warn("Missing index for favorites query. Please create it in Firebase Console.");
            // Fallback: Try without orderBy if index is missing
            try {
                const qSimple = query(
                    collection(db, "favorites"),
                    where("uid", "==", uid),
                    limit(5)
                );
                const snapSimple = await getDocs(qSimple);
                favoritesListEl.innerHTML = '';
                if (snapSimple.empty) {
                    favoritesListEl.innerHTML = '<div class="list-item"><span>No favorites yet.</span></div>';
                    return;
                }
                snapSimple.forEach((doc) => {
                    const data = doc.data();
                    const item = document.createElement('div');
                    item.className = 'list-item';
                    item.innerHTML = `<span>${data.articleTitle}</span><i class="fas fa-chevron-right"></i>`;
                    favoritesListEl.appendChild(item);
                });
            } catch (e) {
                console.error("Fallback failed", e);
            }
        }
    }
}

async function loadReadingLogs(uid) {
    try {
        const q = query(
            collection(db, "reading_logs"),
            where("uid", "==", uid),
            orderBy("timestamp", "desc"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);

        readingLogListEl.innerHTML = ''; // Clear existing/mock data

        if (querySnapshot.empty) {
            readingLogListEl.innerHTML = '<tr><td colspan="4">No reading history found.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.timestamp).toLocaleDateString();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${data.title}</td>
                <td><span class="status-badge">${data.category}</span></td>
                <td>${data.result}</td>
            `;
            readingLogListEl.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading reading logs:", error);
        if (error.code === 'failed-precondition') {
            console.warn("Missing index for reading_logs query. Please create it in Firebase Console.");
            // Fallback: Try without orderBy
            try {
                const qSimple = query(
                    collection(db, "reading_logs"),
                    where("uid", "==", uid),
                    limit(10)
                );
                const snapSimple = await getDocs(qSimple);
                readingLogListEl.innerHTML = '';
                if (snapSimple.empty) {
                    readingLogListEl.innerHTML = '<tr><td colspan="4">No reading history found.</td></tr>';
                    return;
                }
                snapSimple.forEach((doc) => {
                    const data = doc.data();
                    const date = new Date(data.timestamp).toLocaleDateString();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${date}</td>
                        <td>${data.title}</td>
                        <td><span class="status-badge">${data.category}</span></td>
                        <td>${data.result}</td>
                    `;
                    readingLogListEl.appendChild(row);
                });
            } catch (e) {
                console.error("Fallback failed", e);
            }
        }
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
