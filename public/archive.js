import { db } from "./app.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const COLLECTION_NAME = "zodiacs";

// Get the select element
const zodiacSelect = document.getElementById('zodiac-select');
const zodiacContent = document.getElementById('zodiac-content');
const emptyState = document.getElementById('empty-state');

// Listen for selection changes
zodiacSelect.addEventListener('change', async (e) => {
    const selectedSign = e.target.value;

    if (!selectedSign) {
        // Show empty state
        zodiacContent.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    // Hide empty state and show loading
    emptyState.style.display = 'none';
    zodiacContent.style.display = 'block';

    // Load the zodiac data
    await loadZodiacData(selectedSign);
});

async function loadZodiacData(signId) {
    try {
        const docRef = doc(db, COLLECTION_NAME, signId);

        // Timeout promise
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 5000)
        );

        const docSnap = await Promise.race([getDoc(docRef), timeout]);

        if (docSnap.exists()) {
            const data = docSnap.data();
            renderZodiac(data, signId);
        } else {
            showNoDataMessage(signId);
        }
    } catch (error) {
        console.error("Error loading document:", error);
        showErrorMessage(error.message);
    }
}

function renderZodiac(data, signId) {
    // Header image
    document.getElementById('header-img').src = `images/${signId}.png`;

    // Title section
    document.getElementById('chinese-char').textContent = data.chineseChar || '';
    document.getElementById('zodiac-name').textContent = data.name || 'Unknown';
    document.getElementById('earthly-branch').textContent = data.earthlyBranch || '';

    // Years
    if (data.years && data.years.length > 0) {
        document.getElementById('years').textContent = `Years: ${data.years.join(', ')}`;
    } else {
        document.getElementById('years').textContent = '';
    }

    // Content sections
    document.getElementById('introduction').textContent = data.introduction || 'No introduction available.';
    document.getElementById('lifetime-fortune').textContent = data.lifetimeFortune || 'No fortune information available.';
    document.getElementById('love-marriage').textContent = data.loveMarriage || 'No information available.';
    document.getElementById('wealth').textContent = data.wealth || 'No information available.';
    document.getElementById('health').textContent = data.health || 'No information available.';
    document.getElementById('origin').textContent = data.origin || 'No origin story available.';

    // Personality lists
    renderList('personality-list', data.personality);
    renderList('strengths-list', data.strengths);
    renderList('weaknesses-list', data.weaknesses);

    // Attributes
    if (data.attributes) {
        document.getElementById('attr-element').textContent = data.attributes.element || '-';
        document.getElementById('attr-yinyang').textContent = data.attributes.yinyang || '-';
        document.getElementById('attr-numbers').textContent =
            data.attributes.luckyNumbers ? data.attributes.luckyNumbers.join(', ') : '-';
        document.getElementById('attr-colors').textContent =
            data.attributes.luckyColors ? data.attributes.luckyColors.join(', ') : '-';
        document.getElementById('attr-directions').textContent =
            data.attributes.auspiciousDirections ? data.attributes.auspiciousDirections.join(', ') : '-';
        document.getElementById('attr-flowers').textContent =
            data.attributes.luckyFlowers ? data.attributes.luckyFlowers.join(', ') : '-';
    }
}

function renderList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '';

    if (items && items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No data available';
        li.style.opacity = '0.5';
        listElement.appendChild(li);
    }
}

function showNoDataMessage(signId) {
    document.getElementById('zodiac-name').textContent = `No Data for ${signId.charAt(0).toUpperCase() + signId.slice(1)}`;
    document.getElementById('introduction').innerHTML =
        `<em>Data for this zodiac sign is not yet available in the database. Please check back later or contact us to add this information.</em>`;

    // Clear other sections
    document.getElementById('chinese-char').textContent = '';
    document.getElementById('earthly-branch').textContent = '';
    document.getElementById('years').textContent = '';
    document.getElementById('lifetime-fortune').textContent = '';
    document.getElementById('love-marriage').textContent = '';
    document.getElementById('wealth').textContent = '';
    document.getElementById('health').textContent = '';
    document.getElementById('origin').textContent = '';

    ['personality-list', 'strengths-list', 'weaknesses-list'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });
}

function showErrorMessage(message) {
    document.getElementById('zodiac-name').textContent = 'Error Loading Data';
    document.getElementById('introduction').innerHTML =
        `<em style="color: #e54d42;">An error occurred: ${message}</em>`;
}

// Check if there's a sign parameter in URL
const urlParams = new URLSearchParams(window.location.search);
const signParam = urlParams.get('sign');
if (signParam) {
    zodiacSelect.value = signParam;
    zodiacSelect.dispatchEvent(new Event('change'));
}
