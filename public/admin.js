import { db } from "./app.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const COLLECTION_NAME = "zodiacs"; // Assuming 'zodiacs' collection inside 'zodia1' db

document.getElementById('btn-load').addEventListener('click', loadData);
document.getElementById('btn-save').addEventListener('click', saveData);

async function loadData() {
    const signId = document.getElementById('zodiac-select').value;
    const statusMsg = document.getElementById('status-msg');

    statusMsg.textContent = "Loading...";
    statusMsg.style.color = "#a0a3b1";

    try {
        const docRef = doc(db, COLLECTION_NAME, signId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            populateForm(data);
            statusMsg.textContent = "Loaded successfully.";
            statusMsg.style.color = "#4caf50";
        } else {
            // Clear form if no data
            document.getElementById('zodiac-form').reset();
            statusMsg.textContent = "No data found for this sign. You can create it now.";
            statusMsg.style.color = "#ff9800";
        }
    } catch (error) {
        console.error("Error loading document:", error);
        statusMsg.textContent = "Error loading data: " + error.message;
        statusMsg.style.color = "#f44336";
    }
}

function populateForm(data) {
    document.getElementById('name').value = data.name || '';
    document.getElementById('chineseChar').value = data.chineseChar || '';
    document.getElementById('earthlyBranch').value = data.earthlyBranch || '';
    document.getElementById('years').value = data.years ? data.years.join(', ') : '';

    document.getElementById('introduction').value = data.introduction || '';
    document.getElementById('lifetimeFortune').value = data.lifetimeFortune || '';
    document.getElementById('loveMarriage').value = data.loveMarriage || '';
    document.getElementById('wealth').value = data.wealth || '';
    document.getElementById('health').value = data.health || '';
    document.getElementById('origin').value = data.origin || '';

    document.getElementById('personality').value = data.personality ? data.personality.join(', ') : '';
    document.getElementById('strengths').value = data.strengths ? data.strengths.join(', ') : '';
    document.getElementById('weaknesses').value = data.weaknesses ? data.weaknesses.join(', ') : '';

    if (data.attributes) {
        document.getElementById('attr-element').value = data.attributes.element || '';
        document.getElementById('attr-yinyang').value = data.attributes.yinyang || '';
        document.getElementById('attr-numbers').value = data.attributes.luckyNumbers ? data.attributes.luckyNumbers.join(', ') : '';
        document.getElementById('attr-colors').value = data.attributes.luckyColors ? data.attributes.luckyColors.join(', ') : '';
        document.getElementById('attr-directions').value = data.attributes.auspiciousDirections ? data.attributes.auspiciousDirections.join(', ') : '';
        document.getElementById('attr-flowers').value = data.attributes.luckyFlowers ? data.attributes.luckyFlowers.join(', ') : '';
    }
}

async function saveData() {
    const signId = document.getElementById('zodiac-select').value;
    const statusMsg = document.getElementById('status-msg');

    statusMsg.textContent = "Saving...";
    statusMsg.style.color = "#a0a3b1";

    const data = {
        id: signId,
        name: document.getElementById('name').value,
        chineseChar: document.getElementById('chineseChar').value,
        earthlyBranch: document.getElementById('earthlyBranch').value,
        years: parseArray(document.getElementById('years').value, true), // true for numbers

        introduction: document.getElementById('introduction').value,
        lifetimeFortune: document.getElementById('lifetimeFortune').value,
        loveMarriage: document.getElementById('loveMarriage').value,
        wealth: document.getElementById('wealth').value,
        health: document.getElementById('health').value,
        origin: document.getElementById('origin').value,

        personality: parseArray(document.getElementById('personality').value),
        strengths: parseArray(document.getElementById('strengths').value),
        weaknesses: parseArray(document.getElementById('weaknesses').value),

        attributes: {
            element: document.getElementById('attr-element').value,
            yinyang: document.getElementById('attr-yinyang').value,
            luckyNumbers: parseArray(document.getElementById('attr-numbers').value, true),
            luckyColors: parseArray(document.getElementById('attr-colors').value),
            auspiciousDirections: parseArray(document.getElementById('attr-directions').value),
            luckyFlowers: parseArray(document.getElementById('attr-flowers').value)
        }
    };

    try {
        await setDoc(doc(db, COLLECTION_NAME, signId), data);
        statusMsg.textContent = "Saved successfully!";
        statusMsg.style.color = "#4caf50";
    } catch (error) {
        console.error("Error saving document:", error);
        statusMsg.textContent = "Error saving data: " + error.message;
        statusMsg.style.color = "#f44336";
    }
}

function parseArray(str, isNumber = false) {
    if (!str) return [];
    return str.split(',').map(item => {
        const trimmed = item.trim();
        return isNumber ? Number(trimmed) : trimmed;
    }).filter(item => item !== "" && (isNumber ? !isNaN(item) : true));
}
