// Admin Matching Data Management - Gender-Specific Version
import { auth, db } from './app.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

const PASSWORD = '1234';
let currentData = null;
let currentPairId = null;
let currentGenderCombination = null;

// Check login status on page load
window.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadData();
    }
});

// Login function
window.login = function () {
    const password = document.getElementById('passwordInput').value;
    const loginError = document.getElementById('loginError');

    if (password === PASSWORD) {
        // Save login state to localStorage
        localStorage.setItem('adminLoggedIn', 'true');

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
    // Clear login state from localStorage
    localStorage.removeItem('adminLoggedIn');

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
    const genderCombination = document.getElementById('genderCombinationSelect').value;

    currentPairId = generatePairId(zodiac1, zodiac2);
    currentGenderCombination = genderCombination;

    try {
        showMessage('loading', 'Loading data...');

        const docRef = doc(db, 'zodiac-compatibility', currentPairId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentData = docSnap.data();
            renderForms();
            showMessage('success', 'Data loaded successfully!');
        } else {
            showMessage('error', 'No data found for this pairing');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showMessage('error', 'Failed to load data: ' + error.message);
    }
};

// Render forms for the selected gender combination
function renderForms() {
    if (!currentData || !currentGenderCombination) return;

    // Get or initialize gender-specific data
    if (!currentData.genderSpecificMatching) {
        currentData.genderSpecificMatching = {};
    }
    if (!currentData.genderSpecificMatching[currentGenderCombination]) {
        currentData.genderSpecificMatching[currentGenderCombination] = createDefaultGenderData();
    }

    const genderData = currentData.genderSpecificMatching[currentGenderCombination];

    // Ensure romance and business data structures are complete
    if (!genderData.romance) {
        genderData.romance = createDefaultMatchTypeData('romance');
    } else {
        // Ensure premium structure exists
        if (!genderData.romance.premium) {
            genderData.romance.premium = createDefaultMatchTypeData('romance').premium;
        }
        // Ensure all required fields exist
        ensureCompleteMatchTypeData(genderData.romance, 'romance');
    }

    if (!genderData.business) {
        genderData.business = createDefaultMatchTypeData('business');
    } else {
        // Ensure premium structure exists
        if (!genderData.business.premium) {
            genderData.business.premium = createDefaultMatchTypeData('business').premium;
        }
        // Ensure all required fields exist
        ensureCompleteMatchTypeData(genderData.business, 'business');
    }

    // Update current selection display
    updateSelectionDisplay();

    // Render Romance tab
    document.getElementById('romanceContent').innerHTML = renderMatchTypeContent('romance', genderData.romance);

    // Render Business tab
    document.getElementById('businessContent').innerHTML = renderMatchTypeContent('business', genderData.business);
}

// Ensure match type data has all required fields
function ensureCompleteMatchTypeData(data, type) {
    // Ensure basic fields
    if (data.score === undefined) data.score = 70;
    if (!data.rating) data.rating = 'Good';
    if (data.summary === undefined) data.summary = '';

    // Ensure premium object exists
    if (!data.premium) {
        data.premium = createDefaultMatchTypeData(type).premium;
        return;
    }

    // Ensure all compatibility sections exist
    const compatibilityKeys = type === 'romance'
        ? ['emotionalCompatibility', 'intellectualAlignment', 'longTermPotential', 'others1', 'others2']
        : ['workStyleCompatibility', 'leadershipDynamics', 'financialAlignment', 'others1', 'others2'];

    compatibilityKeys.forEach(key => {
        if (!data.premium[key]) {
            data.premium[key] = {
                title: '',
                content: '',
                score: 0,
                highlights: []
            };
        } else {
            // Ensure all fields exist
            if (!data.premium[key].title) data.premium[key].title = '';
            if (!data.premium[key].content) data.premium[key].content = '';
            if (data.premium[key].score === undefined) data.premium[key].score = 0;
            if (!data.premium[key].highlights) data.premium[key].highlights = [];
        }
    });

    // Ensure conflicts array exists and has 5 elements
    if (!Array.isArray(data.premium.conflicts) || data.premium.conflicts.length !== 5) {
        data.premium.conflicts = Array(5).fill(null).map(() => ({
            type: '',
            severity: 0,
            description: '',
            resolution: ''
        }));
    } else {
        // Ensure each conflict has all fields
        data.premium.conflicts = data.premium.conflicts.map(conflict => ({
            type: conflict?.type || '',
            severity: conflict?.severity || 0,
            description: conflict?.description || '',
            resolution: conflict?.resolution || ''
        }));
    }
}

// Create default gender data structure
function createDefaultGenderData() {
    return {
        romance: createDefaultMatchTypeData('romance'),
        business: createDefaultMatchTypeData('business')
    };
}

// Create default match type data
function createDefaultMatchTypeData(type) {
    const compatibilityKeys = type === 'romance'
        ? ['emotionalCompatibility', 'intellectualAlignment', 'longTermPotential', 'others1', 'others2']
        : ['workStyleCompatibility', 'leadershipDynamics', 'financialAlignment', 'others1', 'others2'];

    const premium = {};
    compatibilityKeys.forEach(key => {
        premium[key] = {
            title: '',
            content: '',
            score: 0,
            highlights: []
        };
    });

    premium.conflicts = Array(5).fill(null).map(() => ({
        type: '',
        severity: 0,
        description: '',
        resolution: ''
    }));

    return {
        score: 70,
        rating: 'Good',
        summary: '',
        premium: premium
    };
}

// Update selection display
function updateSelectionDisplay() {
    const selectionDisplay = document.getElementById('currentSelection');
    const selectionText = document.getElementById('selectionText');
    if (selectionDisplay && selectionText) {
        const zodiac1 = document.getElementById('zodiac1Select').value;
        const zodiac2 = document.getElementById('zodiac2Select').value;
        const genderLabel = document.querySelector(`#genderCombinationSelect option[value="${currentGenderCombination}"]`).textContent;
        selectionText.textContent = `${zodiac1}-${zodiac2} (${genderLabel})`;
        selectionDisplay.style.display = 'block';
    }
}

// Render match type content (romance or business)
function renderMatchTypeContent(type, data) {
    const color = type === 'romance' ? '#ff6b9d' : '#6b9dff';
    const bgColor = type === 'romance' ? 'rgba(255, 100, 100, 0.05)' : 'rgba(100, 150, 255, 0.05)';
    const borderColor = type === 'romance' ? 'rgba(255, 100, 100, 0.3)' : 'rgba(100, 150, 255, 0.3)';
    const icon = type === 'romance' ? 'fa-heart' : 'fa-briefcase';
    const typeName = type === 'romance' ? 'Romance' : 'Business';

    return `
        <!-- Basic Info Section -->
        <div class="form-section" style="background: ${bgColor}; border: 2px solid ${borderColor}; margin-bottom: 30px;">
            <h2 style="color: ${color}; margin-bottom: 20px;">
                <i class="fas ${icon}"></i> Basic ${typeName} Info (Free Content)
            </h2>
            <p style="color: #aaa; margin-bottom: 20px; font-size: 14px;">
                This is the free content shown to all users.
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="form-group">
                    <label>Score (0-100)</label>
                    <input type="number" 
                           id="${type}_score" 
                           value="${data.score}" 
                           min="0" 
                           max="100" />
                </div>
                
                <div class="form-group">
                    <label>Rating</label>
                    <select id="${type}_rating">
                        <option value="Perfect" ${data.rating === 'Perfect' ? 'selected' : ''}>Perfect</option>
                        <option value="Excellent" ${data.rating === 'Excellent' ? 'selected' : ''}>Excellent</option>
                        <option value="Good" ${data.rating === 'Good' ? 'selected' : ''}>Good</option>
                        <option value="Fair" ${data.rating === 'Fair' ? 'selected' : ''}>Fair</option>
                        <option value="Poor" ${data.rating === 'Poor' ? 'selected' : ''}>Poor</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>Summary (Quick Overview)</label>
                <textarea id="${type}_summary" rows="3">${data.summary}</textarea>
            </div>
        </div>

        <!-- Premium Details Section -->
        ${renderPremiumSection(type, data.premium, color, bgColor, borderColor)}
    `;
}

// Render premium section
function renderPremiumSection(type, premiumData, color, bgColor, borderColor) {
    const sections = type === 'romance'
        ? [
            { key: 'emotionalCompatibility', label: 'Emotional Compatibility', icon: 'fa-heart-pulse' },
            { key: 'intellectualAlignment', label: 'Intellectual Alignment', icon: 'fa-brain' },
            { key: 'longTermPotential', label: 'Long-term Potential', icon: 'fa-chart-line' },
            { key: 'others1', label: 'Others 1 (Backup)', icon: 'fa-tools' },
            { key: 'others2', label: 'Others 2 (Backup)', icon: 'fa-tools' }
        ]
        : [
            { key: 'workStyleCompatibility', label: 'Work Style Compatibility', icon: 'fa-briefcase' },
            { key: 'leadershipDynamics', label: 'Leadership Dynamics', icon: 'fa-users' },
            { key: 'financialAlignment', label: 'Financial Alignment', icon: 'fa-dollar-sign' },
            { key: 'others1', label: 'Others 1 (Backup)', icon: 'fa-tools' },
            { key: 'others2', label: 'Others 2 (Backup)', icon: 'fa-tools' }
        ];

    return `
        <div class="form-section" style="background: ${bgColor}; border: 2px solid ${borderColor};">
            <h2 style="color: ${color}; margin-bottom: 20px;">
                <i class="fas fa-crown"></i> Premium Details (Paid Content)
            </h2>
            <p style="color: #aaa; margin-bottom: 20px; font-size: 14px;">
                Detailed analysis sections for premium users (5 compatibility sections + 5 conflicts).
            </p>
            
            ${sections.map(section => renderCompatibilitySection(type, section.key, section.label, section.icon, premiumData[section.key])).join('')}
            ${renderConflictsSection(type, premiumData.conflicts)}
        </div>
    `;
}

// Render compatibility section
function renderCompatibilitySection(type, key, label, icon, data) {
    return `
        <div class="form-section" style="background: rgba(255, 255, 255, 0.02); margin-bottom: 20px;">
            <h3><i class="fas ${icon}"></i> ${label}</h3>
            
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="${type}_${key}_title" value="${data.title}" />
            </div>
            
            <div class="form-group">
                <label>Content</label>
                <textarea id="${type}_${key}_content" rows="4">${data.content}</textarea>
            </div>
            
            <div class="form-group">
                <label>Score (0-100)</label>
                <input type="number" id="${type}_${key}_score" value="${data.score}" min="0" max="100" />
            </div>
            
            <div class="form-group">
                <label>Highlights</label>
                <div id="${type}_${key}_highlights">
                    ${(data.highlights || []).map((h, i) => `
                        <div class="highlights-input" style="margin-bottom: 10px;">
                            <input type="text" value="${h}" data-index="${i}" style="width: 90%; display: inline-block;" />
                            <button onclick="removeHighlight('${type}_${key}_highlights', ${i})" style="width: 8%; display: inline-block; background: #ff4444; border: none; color: white; padding: 8px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-highlight-btn" onclick="addHighlight('${type}_${key}_highlights')">
                    <i class="fas fa-plus"></i> Add Highlight
                </button>
            </div>
        </div>
    `;
}

// Render conflicts section
function renderConflictsSection(type, conflicts) {
    return `
        <div class="form-section" style="background: rgba(255, 255, 255, 0.02); margin-top: 20px;">
            <h3><i class="fas fa-triangle-exclamation"></i> Conflicts (5 Total)</h3>
            <p style="color: #aaa; margin-bottom: 20px; font-size: 14px;">
                Define potential conflicts and their resolutions.
            </p>
            ${conflicts.map((conflict, index) => `
                <div class="form-section" style="background: rgba(255, 100, 100, 0.03); margin-bottom: 15px; padding: 20px; border: 1px solid rgba(255, 100, 100, 0.2); border-radius: 10px;">
                    <h4 style="color: #fdd56a; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-circle"></i> Conflict ${index + 1}
                    </h4>
                    
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" id="${type}_conflict_${index}_type" value="${conflict.type}" placeholder="e.g., Communication Style" />
                    </div>
                    
                    <div class="form-group">
                        <label>Severity (0-100)</label>
                        <input type="number" id="${type}_conflict_${index}_severity" value="${conflict.severity}" min="0" max="100" />
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="${type}_conflict_${index}_description" rows="3">${conflict.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Resolution</label>
                        <textarea id="${type}_conflict_${index}_resolution" rows="3">${conflict.resolution}</textarea>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Add highlight
window.addHighlight = function (containerId) {
    const container = document.getElementById(containerId);
    const index = container.querySelectorAll('.highlights-input').length;
    const newInput = document.createElement('div');
    newInput.className = 'highlights-input';
    newInput.style.marginBottom = '10px';
    newInput.innerHTML = `
        <input type="text" value="" data-index="${index}" style="width: 90%; display: inline-block;" placeholder="Enter highlight..." />
        <button onclick="removeHighlight('${containerId}', ${index})" style="width: 8%; display: inline-block; background: #ff4444; border: none; color: white; padding: 8px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newInput);
};

// Remove highlight
window.removeHighlight = function (containerId, index) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('.highlights-input');
    if (inputs[index]) {
        inputs[index].remove();
    }
};

// Collect form data
function collectFormData() {
    if (!currentData || !currentGenderCombination) return;

    // Collect romance data
    currentData.genderSpecificMatching[currentGenderCombination].romance = collectMatchTypeData('romance');

    // Collect business data
    currentData.genderSpecificMatching[currentGenderCombination].business = collectMatchTypeData('business');

    // Update metadata
    if (!currentData.metadata) {
        currentData.metadata = {};
    }
    currentData.metadata.hasGenderSpecificData = true;
    currentData.metadata.lastUpdated = new Date().toISOString();
}

// Collect match type data
function collectMatchTypeData(type) {
    const data = {
        score: parseInt(document.getElementById(`${type}_score`).value) || 70,
        rating: document.getElementById(`${type}_rating`).value,
        summary: document.getElementById(`${type}_summary`).value.trim(),
        premium: {}
    };

    // Collect compatibility sections
    const compatibilityKeys = type === 'romance'
        ? ['emotionalCompatibility', 'intellectualAlignment', 'longTermPotential', 'others1', 'others2']
        : ['workStyleCompatibility', 'leadershipDynamics', 'financialAlignment', 'others1', 'others2'];

    compatibilityKeys.forEach(key => {
        const titleEl = document.getElementById(`${type}_${key}_title`);
        const contentEl = document.getElementById(`${type}_${key}_content`);
        const scoreEl = document.getElementById(`${type}_${key}_score`);
        const highlightsContainer = document.getElementById(`${type}_${key}_highlights`);

        const highlights = [];
        if (highlightsContainer) {
            highlightsContainer.querySelectorAll('input').forEach(input => {
                const value = input.value.trim();
                if (value) highlights.push(value);
            });
        }

        data.premium[key] = {
            title: titleEl ? titleEl.value.trim() : '',
            content: contentEl ? contentEl.value.trim() : '',
            score: scoreEl ? parseInt(scoreEl.value) || 0 : 0,
            highlights: highlights
        };
    });

    // Collect conflicts
    data.premium.conflicts = [];
    for (let i = 0; i < 5; i++) {
        const typeEl = document.getElementById(`${type}_conflict_${i}_type`);
        const severityEl = document.getElementById(`${type}_conflict_${i}_severity`);
        const descEl = document.getElementById(`${type}_conflict_${i}_description`);
        const resEl = document.getElementById(`${type}_conflict_${i}_resolution`);

        data.premium.conflicts.push({
            type: typeEl ? typeEl.value.trim() : '',
            severity: severityEl ? parseInt(severityEl.value) || 0 : 0,
            description: descEl ? descEl.value.trim() : '',
            resolution: resEl ? resEl.value.trim() : ''
        });
    }

    return data;
}

// Save data to Firestore
window.saveData = async function () {
    if (!currentData || !currentPairId) {
        showMessage('error', 'No data to save');
        return;
    }

    try {
        showMessage('loading', 'Saving data...');

        // Collect current form data
        collectFormData();

        const docRef = doc(db, 'zodiac-compatibility', currentPairId);
        await setDoc(docRef, currentData, { merge: true });

        showMessage('success', 'Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        showMessage('error', 'Failed to save data: ' + error.message);
    }
};

// Switch tab
window.switchTab = function (tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
};

// Show message
function showMessage(type, message) {
    // Use existing message elements from HTML
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Hide both messages first
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    if (type === 'success') {
        if (successMsg) {
            successMsg.textContent = message;
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
        }
    } else if (type === 'error') {
        if (errorMsg && errorText) {
            errorText.textContent = message;
            errorMsg.style.display = 'block';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }
    } else if (type === 'loading') {
        // For loading, we can use success message temporarily
        if (successMsg) {
            successMsg.textContent = message;
            successMsg.style.display = 'block';
        }
    }

    console.log(`[${type.toUpperCase()}] ${message}`);
}

