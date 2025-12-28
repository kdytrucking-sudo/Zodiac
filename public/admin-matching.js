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

    currentPairId = generatePairId(zodiac1, zodiac2);

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

// Render forms
function renderForms() {
    if (!currentData) return;

    // Render Romance forms
    const romanceContent = document.getElementById('romanceContent');
    romanceContent.innerHTML = `
        ${renderPremiumSection('romance', 'emotionalCompatibility', 'Emotional Compatibility', 'fa-heart-pulse')}
        ${renderPremiumSection('romance', 'intellectualAlignment', 'Intellectual Alignment', 'fa-brain')}
        ${renderPremiumSection('romance', 'longTermPotential', 'Long-term Potential', 'fa-chart-line')}
        ${renderPremiumSection('romance', 'others1', 'Others 1', 'fa-tools')}
        ${renderPremiumSection('romance', 'others2', 'Others 2', 'fa-tools')}
        ${renderConflictsSection('romance')}
    `;

    // Render Business forms
    const businessContent = document.getElementById('businessContent');
    businessContent.innerHTML = `
        ${renderPremiumSection('business', 'workStyleCompatibility', 'Work Style Compatibility', 'fa-briefcase')}
        ${renderPremiumSection('business', 'leadershipDynamics', 'Leadership Dynamics', 'fa-users')}
        ${renderPremiumSection('business', 'financialAlignment', 'Financial Alignment', 'fa-dollar-sign')}
        ${renderPremiumSection('business', 'others1', 'Others 1', 'fa-tools')}
        ${renderPremiumSection('business', 'others2', 'Others 2', 'fa-tools')}
        ${renderConflictsSection('business')}
    `;

    // Render Gender Modifiers forms
    const genderContent = document.getElementById('genderContent');
    genderContent.innerHTML = renderGenderModifiersSection();
}

// Render premium section form
function renderPremiumSection(type, key, title, icon) {
    const data = currentData[type].premium[key];

    return `
        <div class="form-section">
            <h3><i class="fas ${icon}"></i> ${title}</h3>
            
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="${type}_${key}_title" value="${data.title}" />
            </div>
            
            <div class="form-group">
                <label>Content</label>
                <textarea id="${type}_${key}_content">${data.content}</textarea>
            </div>
            
            <div class="form-group">
                <label>Score (0-100)</label>
                <input type="number" id="${type}_${key}_score" value="${data.score}" min="0" max="100" />
            </div>
            
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
    `;
}

// Render conflicts section
function renderConflictsSection(type) {
    const conflicts = currentData[type].premium.conflicts;

    return `
        <div class="form-section">
            <h3><i class="fas fa-triangle-exclamation"></i> Conflicts</h3>
            ${conflicts.map((conflict, index) => `
                <div class="form-section" style="background: rgba(255, 255, 255, 0.02); margin-bottom: 15px;">
                    <h4 style="color: #fdd56a; margin-bottom: 15px;">Conflict ${index + 1}: ${conflict.type}</h4>
                    
                    <div class="form-group">
                        <label>Type</label>
                        <input type="text" id="${type}_conflict_${index}_type" value="${conflict.type}" />
                    </div>
                    
                    <div class="form-group">
                        <label>Severity (0-100)</label>
                        <input type="number" id="${type}_conflict_${index}_severity" value="${conflict.severity}" min="0" max="100" />
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="${type}_conflict_${index}_description">${conflict.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Resolution</label>
                        <textarea id="${type}_conflict_${index}_resolution">${conflict.resolution}</textarea>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render gender-specific data section (new structure)
function renderGenderModifiersSection() {
    // Get gender-specific matching data
    const genderSpecificMatching = currentData.genderSpecificMatching || {};

    const genderTypes = [
        { key: 'male-male', label: 'Male - Male', icon: 'fa-mars-double' },
        { key: 'male-female', label: 'Male - Female', icon: 'fa-mars-and-venus' },
        { key: 'male-others', label: 'Male - Others', icon: 'fa-mars' },
        { key: 'female-female', label: 'Female - Female', icon: 'fa-venus-double' },
        { key: 'female-others', label: 'Female - Others', icon: 'fa-venus' },
        { key: 'others-others', label: 'Others - Others', icon: 'fa-genderless' }
    ];

    return `
        <div class="form-section">
            <h3><i class="fas fa-venus-mars"></i> Gender-Specific Matching Data</h3>
            <p style="color: #aaa; margin-bottom: 20px; font-size: 14px;">
                Edit romance and business compatibility data for each gender combination. 
                Each combination has its own scores, descriptions, and analysis.
            </p>
            
            ${genderTypes.map(type => {
        const genderData = genderSpecificMatching[type.key] || {
            romance: { score: 70, rating: 'Good', summary: '', detailedAnalysis: '', highlights: [], challenges: [], advice: '' },
            business: { score: 70, rating: 'Good', summary: '', detailedAnalysis: '', highlights: [], challenges: [], advice: '' }
        };

        return `
                    <div class="form-section" style="background: rgba(255, 255, 255, 0.02); margin-bottom: 30px; border: 2px solid rgba(253, 213, 106, 0.2);">
                        <h4 style="color: #fdd56a; margin-bottom: 20px; font-size: 20px;">
                            <i class="fas ${type.icon}"></i> ${type.label}
                        </h4>
                        
                        <!-- Romance Data -->
                        <div style="background: rgba(255, 100, 100, 0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <h5 style="color: #ff6b9d; margin-bottom: 15px;">
                                <i class="fas fa-heart"></i> Romance Compatibility
                            </h5>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                <div class="form-group">
                                    <label>Score (0-100)</label>
                                    <input type="number" 
                                           id="gender_${type.key}_romance_score" 
                                           value="${genderData.romance.score}" 
                                           min="0" 
                                           max="100" />
                                </div>
                                
                                <div class="form-group">
                                    <label>Rating</label>
                                    <select id="gender_${type.key}_romance_rating">
                                        <option value="Perfect" ${genderData.romance.rating === 'Perfect' ? 'selected' : ''}>Perfect</option>
                                        <option value="Excellent" ${genderData.romance.rating === 'Excellent' ? 'selected' : ''}>Excellent</option>
                                        <option value="Good" ${genderData.romance.rating === 'Good' ? 'selected' : ''}>Good</option>
                                        <option value="Fair" ${genderData.romance.rating === 'Fair' ? 'selected' : ''}>Fair</option>
                                        <option value="Poor" ${genderData.romance.rating === 'Poor' ? 'selected' : ''}>Poor</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Summary</label>
                                <textarea id="gender_${type.key}_romance_summary" rows="3">${genderData.romance.summary}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Detailed Analysis</label>
                                <textarea id="gender_${type.key}_romance_detailedAnalysis" rows="5">${genderData.romance.detailedAnalysis}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Highlights (one per line)</label>
                                <textarea id="gender_${type.key}_romance_highlights" rows="4">${(genderData.romance.highlights || []).join('\n')}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Challenges (one per line)</label>
                                <textarea id="gender_${type.key}_romance_challenges" rows="3">${(genderData.romance.challenges || []).join('\n')}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Advice</label>
                                <textarea id="gender_${type.key}_romance_advice" rows="3">${genderData.romance.advice}</textarea>
                            </div>
                        </div>
                        
                        <!-- Business Data -->
                        <div style="background: rgba(100, 150, 255, 0.05); padding: 20px; border-radius: 10px;">
                            <h5 style="color: #6b9dff; margin-bottom: 15px;">
                                <i class="fas fa-briefcase"></i> Business Compatibility
                            </h5>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                                <div class="form-group">
                                    <label>Score (0-100)</label>
                                    <input type="number" 
                                           id="gender_${type.key}_business_score" 
                                           value="${genderData.business.score}" 
                                           min="0" 
                                           max="100" />
                                </div>
                                
                                <div class="form-group">
                                    <label>Rating</label>
                                    <select id="gender_${type.key}_business_rating">
                                        <option value="Perfect" ${genderData.business.rating === 'Perfect' ? 'selected' : ''}>Perfect</option>
                                        <option value="Excellent" ${genderData.business.rating === 'Excellent' ? 'selected' : ''}>Excellent</option>
                                        <option value="Good" ${genderData.business.rating === 'Good' ? 'selected' : ''}>Good</option>
                                        <option value="Fair" ${genderData.business.rating === 'Fair' ? 'selected' : ''}>Fair</option>
                                        <option value="Poor" ${genderData.business.rating === 'Poor' ? 'selected' : ''}>Poor</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Summary</label>
                                <textarea id="gender_${type.key}_business_summary" rows="3">${genderData.business.summary}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Detailed Analysis</label>
                                <textarea id="gender_${type.key}_business_detailedAnalysis" rows="5">${genderData.business.detailedAnalysis}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Highlights (one per line)</label>
                                <textarea id="gender_${type.key}_business_highlights" rows="4">${(genderData.business.highlights || []).join('\n')}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Challenges (one per line)</label>
                                <textarea id="gender_${type.key}_business_challenges" rows="3">${(genderData.business.challenges || []).join('\n')}</textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>Advice</label>
                                <textarea id="gender_${type.key}_business_advice" rows="3">${genderData.business.advice}</textarea>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
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
        collectGenderModifiers();

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
            currentData[type].premium[key].title = titleEl.value;
            currentData[type].premium[key].content = contentEl.value;
            currentData[type].premium[key].score = parseInt(scoreEl.value);

            // Collect highlights
            const highlightInputs = highlightsContainer.querySelectorAll('input');
            currentData[type].premium[key].highlights = Array.from(highlightInputs)
                .map(input => input.value)
                .filter(v => v.trim() !== '');
        }
    });

    // Collect conflicts
    const conflicts = currentData[type].premium.conflicts;
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

// Collect gender-specific data (new structure)
function collectGenderModifiers() {
    const genderTypes = ['male-male', 'male-female', 'male-others', 'female-female', 'female-others', 'others-others'];

    // Initialize genderSpecificMatching if it doesn't exist
    if (!currentData.genderSpecificMatching) {
        currentData.genderSpecificMatching = {};
    }

    genderTypes.forEach(type => {
        // Collect Romance data
        const romanceScore = document.getElementById(`gender_${type}_romance_score`);
        const romanceRating = document.getElementById(`gender_${type}_romance_rating`);
        const romanceSummary = document.getElementById(`gender_${type}_romance_summary`);
        const romanceDetailedAnalysis = document.getElementById(`gender_${type}_romance_detailedAnalysis`);
        const romanceHighlights = document.getElementById(`gender_${type}_romance_highlights`);
        const romanceChallenges = document.getElementById(`gender_${type}_romance_challenges`);
        const romanceAdvice = document.getElementById(`gender_${type}_romance_advice`);

        // Collect Business data
        const businessScore = document.getElementById(`gender_${type}_business_score`);
        const businessRating = document.getElementById(`gender_${type}_business_rating`);
        const businessSummary = document.getElementById(`gender_${type}_business_summary`);
        const businessDetailedAnalysis = document.getElementById(`gender_${type}_business_detailedAnalysis`);
        const businessHighlights = document.getElementById(`gender_${type}_business_highlights`);
        const businessChallenges = document.getElementById(`gender_${type}_business_challenges`);
        const businessAdvice = document.getElementById(`gender_${type}_business_advice`);

        if (romanceScore && businessScore) {
            currentData.genderSpecificMatching[type] = {
                romance: {
                    score: parseInt(romanceScore.value) || 70,
                    rating: romanceRating.value || 'Good',
                    summary: romanceSummary.value.trim(),
                    detailedAnalysis: romanceDetailedAnalysis.value.trim(),
                    highlights: romanceHighlights.value.split('\n').map(h => h.trim()).filter(h => h !== ''),
                    challenges: romanceChallenges.value.split('\n').map(c => c.trim()).filter(c => c !== ''),
                    advice: romanceAdvice.value.trim()
                },
                business: {
                    score: parseInt(businessScore.value) || 70,
                    rating: businessRating.value || 'Good',
                    summary: businessSummary.value.trim(),
                    detailedAnalysis: businessDetailedAnalysis.value.trim(),
                    highlights: businessHighlights.value.split('\n').map(h => h.trim()).filter(h => h !== ''),
                    challenges: businessChallenges.value.split('\n').map(c => c.trim()).filter(c => c !== ''),
                    advice: businessAdvice.value.trim()
                }
            };
        }
    });

    // Update metadata to indicate gender-specific data is present
    if (!currentData.metadata) {
        currentData.metadata = {};
    }
    currentData.metadata.hasGenderSpecificData = true;
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
