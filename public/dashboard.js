import { auth, db } from "./app.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, fetch data
        await loadUserData(user.uid);
        // Load other data (favorites, transactions) - using mock/sample for now as per requirement
        // In a real app, these would be separate async calls to subcollections
    } else {
        // User is not signed in, redirect to login
        window.location.href = 'login.html';
    }
});

async function loadUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Render User Info
            displayNameEl.textContent = data.name || 'User';

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

                // Calculate Zodiac based on birth year (Simple logic for demo)
                const birthYear = new Date(data.birthdate).getFullYear();
                const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
                // 1900 was Rat. (Year - 1900) % 12
                // Note: This is simplified and doesn't account for Chinese New Year date
                const zIndex = (birthYear - 1900) % 12;
                const myZodiac = zodiacs[zIndex >= 0 ? zIndex : zIndex + 12];

                updateFortuneCard(myZodiac);

            } else {
                // Missing birth info
                displayDobEl.textContent = 'Not set';
                profileWarning.style.display = 'flex'; // Show warning

                // Show sample data
                updateFortuneCard('Rat'); // Default sample
            }

            displayTobEl.textContent = data.birthtime || 'Not set';
            displayLocationEl.textContent = data.location || 'Not set';

        } else {
            console.log("No such user document!");
        }
    } catch (error) {
        console.error("Error getting user document:", error);
    }
}

function updateFortuneCard(zodiac) {
    userZodiacNameEl.textContent = zodiac;
    userZodiacImgEl.src = `images/${zodiac.toLowerCase()}.png`;

    // Update Date
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    currentDayEl.textContent = `(${now.toLocaleDateString('en-US', { weekday: 'long' })})`;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
