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

// Lucky Data Elements
const luckyBenefactorEl = document.getElementById('lucky-benefactor');
const luckyColorEl = document.getElementById('lucky-color');
const luckyNumbersEl = document.getElementById('lucky-numbers');
const luckyTimeEl = document.getElementById('lucky-time'); // New
const luckyLoveDirectionEl = document.getElementById('lucky-direction'); // ID in HTML is lucky-direction for Love
const luckyJoyEl = document.getElementById('lucky-joy');
const luckyWealthEl = document.getElementById('lucky-wealth');
const luckyGeneralDirectionEl = document.getElementById('lucky-general-direction'); // New

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
        const docRef = doc(db, "fortune", zodiac.toLowerCase()); // Ensure lowercase for ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const fullData = docSnap.data();
            let periodData = null;

            // Map period to field name
            // Tabs are: Daily, Weekly, Monthly, Yearly
            // Database keys are: today, week, month, year
            const periodMap = {
                'daily': 'today',
                'weekly': 'week',
                'monthly': 'month',
                'yearly': 'year'
            };
            const fieldName = periodMap[period.toLowerCase()];

            if (fullData[fieldName] && fullData[fieldName].free) {
                periodData = fullData[fieldName].free;
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
    // Overall Score
    if (data.overallScore) {
        bigScoreEl.textContent = data.overallScore;
    } else {
        // Fallback calculation if overallScore is missing
        const avgRating = (data.ratingCareer + data.ratingLove + data.ratingHealth + data.ratingWealth) / 4;
        bigScoreEl.textContent = Math.round(avgRating * 20);
    }

    // Overview Quote
    fortuneQuoteEl.textContent = data.overview ? `"${data.overview}"` : "Data not available";

    // Stars (based on overall score or ratings)
    let starsHtml = '';
    // Calculate stars from overall score (0-100 -> 0-5)
    const score = data.overallScore || ((data.ratingCareer + data.ratingLove + data.ratingHealth + data.ratingWealth) / 4 * 20);
    const starCount = Math.round(score / 20);

    for (let i = 0; i < 5; i++) {
        if (i < starCount) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }
    starsContainer.innerHTML = starsHtml;

    // Progress Bars (Ratings are 1-5, convert to %)
    pFillCareer.style.width = `${data.ratingCareer * 20}%`;
    pFillLove.style.width = `${data.ratingLove * 20}%`;
    pFillHealth.style.width = `${data.ratingHealth * 20}%`;
    pFillWealth.style.width = `${data.ratingWealth * 20}%`;

    // Lucky Grid
    luckyBenefactorEl.textContent = data.benefactor || '-';
    luckyColorEl.textContent = data.luckyColor || '-';
    luckyNumbersEl.textContent = data.luckyNumber || '-';
    if (luckyTimeEl) luckyTimeEl.textContent = data.luckyTime || '-';

    // Map specific directions
    luckyLoveDirectionEl.textContent = data.loveDirection || data.luckyDirection || '-';
    luckyJoyEl.textContent = data.joyDirection || data.luckyDirection || '-';
    luckyWealthEl.textContent = data.wealthDirection || data.luckyDirection || '-';
    if (luckyGeneralDirectionEl) luckyGeneralDirectionEl.textContent = data.luckyDirection || '-';

    // Do's and Don'ts
    doItemEl.textContent = data.do || '-';
    dontItemEl.textContent = data.dont || '-';
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

        // Fetch article details for each favorite
        const favoritePromises = [];
        querySnapshot.forEach((favoriteDoc) => {
            const favoriteData = favoriteDoc.data();
            favoritePromises.push(
                getDoc(doc(db, "articles", favoriteData.articleId))
                    .then(articleDoc => ({
                        favoriteData,
                        articleData: articleDoc.exists() ? articleDoc.data() : null,
                        articleId: favoriteData.articleId
                    }))
            );
        });

        const favorites = await Promise.all(favoritePromises);

        favorites.forEach(({ favoriteData, articleData, articleId }) => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const viewCount = articleData?.viewCount || 0;
            const commentCount = articleData?.commentCount || 0;

            item.innerHTML = `
                <span class="favorite-title">${favoriteData.articleTitle}</span>
                <div class="favorite-stats">
                    <span class="stat-item"><i class="fas fa-eye"></i> ${viewCount}</span>
                    <span class="stat-item"><i class="fas fa-comments"></i> ${commentCount}</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
            // Add click handler to navigate to article detail
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                window.location.href = `article-detail.html?id=${articleId}`;
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

                // Fetch article details for fallback
                const fallbackPromises = [];
                snapSimple.forEach((favoriteDoc) => {
                    const favoriteData = favoriteDoc.data();
                    fallbackPromises.push(
                        getDoc(doc(db, "articles", favoriteData.articleId))
                            .then(articleDoc => ({
                                favoriteData,
                                articleData: articleDoc.exists() ? articleDoc.data() : null,
                                articleId: favoriteData.articleId
                            }))
                    );
                });

                const fallbackFavorites = await Promise.all(fallbackPromises);

                fallbackFavorites.forEach(({ favoriteData, articleData, articleId }) => {
                    const item = document.createElement('div');
                    item.className = 'list-item';

                    const viewCount = articleData?.viewCount || 0;
                    const commentCount = articleData?.commentCount || 0;

                    item.innerHTML = `
                        <span class="favorite-title">${favoriteData.articleTitle}</span>
                        <div class="favorite-stats">
                            <span class="stat-item"><i class="fas fa-eye"></i> ${viewCount}</span>
                            <span class="stat-item"><i class="fas fa-comments"></i> ${commentCount}</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    `;
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        window.location.href = `article-detail.html?id=${articleId}`;
                    });
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
