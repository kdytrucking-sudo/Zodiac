// Admin Matching Data Management
import { auth, db } from './app.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

const PASSWORD = '1234';
let currentData = null;
let currentPairId = null;

// Login function
window.login = function () {
    const password = document.getElementById('passwordInput').value;
    const loginError = document.getElementById('loginError');

    if (password === PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loginError.style.display = 'none';
        loadData();
    } else {
        loginError.style.display = 'block';
    }
};

// Logout function
window.logout = function () {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('passwordInput').value = '';
};

// Generate pair ID
function generatePairId(zodiac1, zodiac2) {
    const sorted = [zodiac1, zodiac2].sort();
    return `${sorted[0]}-${sorted[1]}`;
}

// Load data from Firestore
window.loadData = async function () {
    const zodiac1 = document.getElementById('zodiac1Select').value;
    const zodiac2 = document.getElementById('zodiac2Select').value;
    const gender1 = document.getElementById('gender1Select').value;
    const gender2 = document.getElementById('gender2Select').value;

    currentPairId = generatePairId(zodiac1, zodiac2);

    // Store current gender selection
    window.currentGenderCombo = getGenderKey(gender1, gender2);

    try {
        showMessage('loading', 'Loading data...');

        const docRef = doc(db, 'zodiac-compatibility', currentPairId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentData = docSnap.data();
            renderForms();
            showMessage('success', `Data loaded successfully! Editing: ${zodiac1} (${gender1}) & ${zodiac2} (${gender2})`);
        } else {
            showMessage('error', 'No data found for this pairing');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showMessage('error', 'Failed to load data: ' + error.message);
    }
};

// Get gender modifier key
function getGenderKey(gender1, gender2) {
    if (gender1 === 'male' && gender2 === 'male') return 'male-male';
    if (gender1 === 'female' && gender2 === 'female') return 'female-female';
    return 'male-female';  // covers male-female and female-male
}

// Show gender-specific information
function showGenderInfo() {
    const genderInfoDiv = document.getElementById('genderInfo');
    const genderInfoContent = document.getElementById('genderInfoContent');

    if (!currentData || !window.currentGenderCombo) {
        genderInfoDiv.style.display = 'none';
        return;
    }

    const gender1 = document.getElementById('gender1Select').value;
    const gender2 = document.getElementById('gender2Select').value;
    const zodiac1 = document.getElementById('zodiac1Select').value;
    const zodiac2 = document.getElementById('zodiac2Select').value;

    genderInfoContent.innerHTML = `
        <p><strong>Combination:</strong> ${zodiac1} (${gender1}) + ${zodiac2} (${gender2})</p>
        <p><strong>Gender Key:</strong> ${window.currentGenderCombo}</p>
        <p style="margin-top: 10px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 5px; font-size: 12px;">
            <i class="fas fa-lightbulb"></i> <strong>Note:</strong> You are editing content specific to this gender combination. 
            Each gender combination (male-male, female-female, male-female) has its own independent content.
        </p>
    `;
    genderInfoDiv.style.display = 'block';

    // Also log to console for debugging
    console.log(`Editing gender combination: ${gender1} + ${gender2} (${window.currentGenderCombo})`);
}

// Render forms
function renderForms() {
    if (!currentData || !window.currentGenderCombo) return;

    // Get gender-specific data
    const romanceData = currentData.romance[window.currentGenderCombo];
    const businessData = currentData.business[window.currentGenderCombo];

    if (!romanceData || !businessData) {
        showMessage('error', `No data found for gender combination: ${window.currentGenderCombo}`);
        return;
    }

    // Render Romance forms
    const romanceContent = document.getElementById('romanceContent');
    romanceContent.innerHTML = `
        ${renderFreeSection('romance', romanceData.free)}
        <h2 style="color: #fdd56a; margin: 30px 0 20px 0; padding-top: 20px; border-top: 2px solid rgba(253, 213, 106, 0.3);">
            <i class="fas fa-crown"></i> Premium Content
        </h2>
        ${renderPremiumSection('romance', 'emotionalCompatibility', 'Emotional Compatibility', 'fa-heart-pulse', romanceData.premium)}
        ${renderPremiumSection('romance', 'intellectualAlignment', 'Intellectual Alignment', 'fa-brain', romanceData.premium)}
        ${renderPremiumSection('romance', 'longTermPotential', 'Long-term Potential', 'fa-chart-line', romanceData.premium)}
        ${renderPremiumSection('romance', 'others1', 'Others 1', 'fa-tools', romanceData.premium)}
        ${renderPremiumSection('romance', 'others2', 'Others 2', 'fa-tools', romanceData.premium)}
        ${renderConflictsSection('romance', romanceData.premium.conflicts)}
    `;

    // Render Business forms
    const businessContent = document.getElementById('businessContent');
    businessContent.innerHTML = `
        ${renderFreeSection('business', businessData.free)}
        <h2 style="color: #fdd56a; margin: 30px 0 20px 0; padding-top: 20px; border-top: 2px solid rgba(253, 213, 106, 0.3);">
            <i class="fas fa-crown"></i> Premium Content
        </h2>
        ${renderPremiumSection('business', 'workStyleCompatibility', 'Work Style Compatibility', 'fa-briefcase', businessData.premium)}
        ${renderPremiumSection('business', 'leadershipDynamics', 'Leadership Dynamics', 'fa-users', businessData.premium)}
        ${renderPremiumSection('business', 'financialAlignment', 'Financial Alignment', 'fa-dollar-sign', businessData.premium)}
        ${renderPremiumSection('business', 'others1', 'Others 1', 'fa-tools', businessData.premium)}
        ${renderPremiumSection('business', 'others2', 'Others 2', 'fa-tools', businessData.premium)}
        ${renderConflictsSection('business', businessData.premium.conflicts)}
    `;
}

// Render free content section
function renderFreeSection(type, freeData) {

    return `
        <div class="form-section" style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3);">
            <h3><i class="fas fa-unlock"></i> Free Content</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Left Column -->
                <div>
                    <!-- Score and Rating in one row -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Matching Score (0-100)</label>
                            <input type="number" id="${type}_free_matchingScore" value="${freeData.matchingScore}" min="0" max="100" />
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Rating</label>
                            <select id="${type}_free_rating">
                                <option value="Poor" ${freeData.rating === 'Poor' ? 'selected' : ''}>Poor</option>
                                <option value="Fair" ${freeData.rating === 'Fair' ? 'selected' : ''}>Fair</option>
                                <option value="Good" ${freeData.rating === 'Good' ? 'selected' : ''}>Good</option>
                                <option value="Very Good" ${freeData.rating === 'Very Good' ? 'selected' : ''}>Very Good</option>
                                <option value="Excellent" ${freeData.rating === 'Excellent' ? 'selected' : ''}>Excellent</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Quick Overview -->
                    <div class="form-group">
                        <label>Quick Overview</label>
                        <textarea id="${type}_free_quickOverview" style="min-height: 120px;">${freeData.quickOverview}</textarea>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div>
                    <div class="form-group">
                        <label>Compatibility Tags</label>
                        <div id="${type}_free_tags">
                            ${freeData.compatibilityTags.map((tag, i) => `
                                <div style="display: grid; grid-template-columns: 1fr 120px; gap: 10px; margin-bottom: 10px;">
                                    <input type="text" placeholder="Tag name" value="${tag.tag}" 
                                           id="${type}_free_tag_${i}_name" />
                                    <select id="${type}_free_tag_${i}_status">
                                        <option value="positive" ${tag.status === 'positive' ? 'selected' : ''}>Positive</option>
                                        <option value="neutral" ${tag.status === 'neutral' ? 'selected' : ''}>Neutral</option>
                                        <option value="negative" ${tag.status === 'negative' ? 'selected' : ''}>Negative</option>
                                    </select>
                                </div>
                            `).join('')}
                        </div>
                        <button class="add-highlight-btn" onclick="addTag('${type}_free_tags', '${type}')">
                            <i class="fas fa-plus"></i> Add Tag
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render premium section form
function renderPremiumSection(type, key, title, icon, premiumData) {
    const data = premiumData[key];

    return `
        <div class="form-section">
            <h3><i class="fas ${icon}"></i> ${title}</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Left Column -->
                <div>
                    <!-- Title and Score in one row -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Title</label>
                            <input type="text" id="${type}_${key}_title" value="${data.title}" />
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Score (0-100)</label>
                            <input type="number" id="${type}_${key}_score" value="${data.score}" min="0" max="100" />
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="form-group">
                        <label>Content</label>
                        <textarea id="${type}_${key}_content" style="min-height: 120px;">${data.content}</textarea>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div>
                    <div class="form-group">
                        <label>Highlights</label>
                        <div id="${type}_${key}_highlights">
                            ${data.highlights.map((h, i) => `
                                <div class="highlights-input">
                                    <input type="text" value="${h}" data-index="${i}" />
                                </div>
                            `).join('')}
                        </div>
                        <button class="add-highlight-btn" onclick="addHighlight('${type}_${key}_highlights')">
                            <i class="fas fa-plus"></i> Add Highlight
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render conflicts section
function renderConflictsSection(type, conflicts) {
    return `
        <div class="form-section">
            <h3><i class="fas fa-triangle-exclamation"></i> Conflicts</h3>
            ${conflicts.map((conflict, index) => `
                <div class="form-section" style="background: rgba(255, 255, 255, 0.02); margin-bottom: 15px;">
                    <h4 style="color: #fdd56a; margin-bottom: 15px;">Conflict ${index + 1}: ${conflict.type}</h4>
                    
                    <!-- First Row: Type and Severity -->
                    <div style="display: grid; grid-template-columns: 4fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Type</label>
                            <input type="text" id="${type}_conflict_${index}_type" value="${conflict.type}" />
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Severity (0-100)</label>
                            <input type="number" id="${type}_conflict_${index}_severity" value="${conflict.severity}" min="0" max="100" />
                        </div>
                    </div>
                    
                    <!-- Second Row: Description and Resolution -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Description</label>
                            <textarea id="${type}_conflict_${index}_description" style="min-height: 80px;">${conflict.description}</textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Resolution</label>
                            <textarea id="${type}_conflict_${index}_resolution" style="min-height: 80px;">${conflict.resolution}</textarea>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Add highlight
window.addHighlight = function (containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input');
    const newIndex = inputs.length;

    const div = document.createElement('div');
    div.className = 'highlights-input';
    div.innerHTML = `<input type="text" placeholder="New highlight" data-index="${newIndex}" />`;
    container.appendChild(div);
};

// Add tag
window.addTag = function (containerId, type) {
    const container = document.getElementById(containerId);
    const existingTags = container.querySelectorAll('div[style*="display: grid"]');
    const newIndex = existingTags.length;

    const div = document.createElement('div');
    div.style.cssText = 'display: grid; grid-template-columns: 1fr 120px; gap: 10px; margin-bottom: 10px;';
    div.innerHTML = `
        <input type="text" placeholder="Tag name" id="${type}_free_tag_${newIndex}_name" />
        <select id="${type}_free_tag_${newIndex}_status">
            <option value="positive">Positive</option>
            <option value="neutral" selected>Neutral</option>
            <option value="negative">Negative</option>
        </select>
    `;
    container.appendChild(div);
};

// Save data
window.saveData = async function () {
    if (!currentData || !currentPairId) {
        showMessage('error', 'No data loaded');
        return;
    }

    try {
        showMessage('loading', 'Saving data...');

        // Collect data from forms
        collectFormData('romance');
        collectFormData('business');

        // Update metadata
        currentData.metadata.updatedAt = new Date().toISOString();

        // Save to Firestore
        const docRef = doc(db, 'zodiac-compatibility', currentPairId);
        await setDoc(docRef, currentData);

        showMessage('success', 'Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        showMessage('error', 'Failed to save data: ' + error.message);
    }
};

// Collect form data
function collectFormData(type) {
    if (!window.currentGenderCombo) {
        console.error('No gender combination selected');
        return;
    }

    // Get gender-specific data reference
    const genderData = currentData[type][window.currentGenderCombo];

    if (!genderData) {
        console.error('No data found for gender combination:', window.currentGenderCombo);
        return;
    }

    // Collect free content
    const matchingScoreEl = document.getElementById(`${type}_free_matchingScore`);
    const ratingEl = document.getElementById(`${type}_free_rating`);
    const quickOverviewEl = document.getElementById(`${type}_free_quickOverview`);

    if (matchingScoreEl && ratingEl && quickOverviewEl) {
        genderData.free.matchingScore = parseInt(matchingScoreEl.value);
        genderData.free.rating = ratingEl.value;
        genderData.free.quickOverview = quickOverviewEl.value;

        // Collect compatibility tags
        const tagsContainer = document.getElementById(`${type}_free_tags`);
        const tagDivs = tagsContainer.querySelectorAll('div[style*="display: grid"]');
        genderData.free.compatibilityTags = Array.from(tagDivs).map((div, i) => {
            const nameEl = document.getElementById(`${type}_free_tag_${i}_name`);
            const statusEl = document.getElementById(`${type}_free_tag_${i}_status`);
            if (nameEl && statusEl && nameEl.value.trim()) {
                return {
                    tag: nameEl.value,
                    status: statusEl.value
                };
            }
            return null;
        }).filter(tag => tag !== null);
    }

    const sections = type === 'romance'
        ? ['emotionalCompatibility', 'intellectualAlignment', 'longTermPotential', 'others1', 'others2']
        : ['workStyleCompatibility', 'leadershipDynamics', 'financialAlignment', 'others1', 'others2'];

    // Collect premium sections
    sections.forEach(key => {
        const titleEl = document.getElementById(`${type}_${key}_title`);
        const contentEl = document.getElementById(`${type}_${key}_content`);
        const scoreEl = document.getElementById(`${type}_${key}_score`);
        const highlightsContainer = document.getElementById(`${type}_${key}_highlights`);

        if (titleEl && contentEl && scoreEl) {
            genderData.premium[key].title = titleEl.value;
            genderData.premium[key].content = contentEl.value;
            genderData.premium[key].score = parseInt(scoreEl.value);

            // Collect highlights
            const highlightInputs = highlightsContainer.querySelectorAll('input');
            genderData.premium[key].highlights = Array.from(highlightInputs)
                .map(input => input.value)
                .filter(v => v.trim() !== '');
        }
    });

    // Collect conflicts
    const conflicts = genderData.premium.conflicts;
    conflicts.forEach((conflict, index) => {
        const typeEl = document.getElementById(`${type}_conflict_${index}_type`);
        const severityEl = document.getElementById(`${type}_conflict_${index}_severity`);
        const descEl = document.getElementById(`${type}_conflict_${index}_description`);
        const resEl = document.getElementById(`${type}_conflict_${index}_resolution`);

        if (typeEl && severityEl && descEl && resEl) {
            conflict.type = typeEl.value;
            conflict.severity = parseInt(severityEl.value);
            conflict.description = descEl.value;
            conflict.resolution = resEl.value;
        }
    });
}

// Switch tab
window.switchTab = function (tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
};

// Show message
function showMessage(type, message) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    if (type === 'success') {
        successMsg.textContent = message;
        successMsg.style.display = 'block';
        setTimeout(() => successMsg.style.display = 'none', 3000);
    } else if (type === 'error') {
        errorText.textContent = message;
        errorMsg.style.display = 'block';
    }
}

// Allow Enter key to login
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
});
