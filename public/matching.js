// Matching Page JavaScript - Connected to Firestore
import { auth, db } from './app.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

// State management
const state = {
    personA: {
        zodiac: 'Rabbit',
        gender: 'female'
    },
    personB: {
        zodiac: 'Snake',
        gender: 'female'
    },
    matchType: 'romance',
    user: null,
    isPremium: false,
    currentData: null,
    isLoading: false
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    checkAuthState();
    // Initial analysis with default values
    analyzeCompatibility();
});

// Check authentication state and premium status
function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            state.user = user;
            // Check if user has premium membership
            await checkPremiumStatus(user.uid);
        } else {
            state.user = null;
            state.isPremium = false;
        }

        // Update UI based on premium status
        updatePremiumUI();
    });
}

// Check if user has premium membership
async function checkPremiumStatus(userId) {
    try {
        // Check user's level from users collection (same as fortune.js)
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Check level field (level > 0 means premium)
            const userLevel = userData.level || 0;
            state.isPremium = userLevel > 0;

            console.log('User level:', userLevel, 'isPremium:', state.isPremium);
        } else {
            state.isPremium = false;
            console.log('User document not found');
        }
    } catch (error) {
        console.error('Error checking premium status:', error);
        state.isPremium = false;
    }
    
    // Refresh display if data is already loaded
    if (state.currentData) {
        console.log('Premium status updated, refreshing display...');
        updateDisplay();
    }
}

// Generate pair ID (alphabetically sorted)
function generatePairId(zodiac1, zodiac2) {
    const sorted = [zodiac1, zodiac2].sort();
    return `${sorted[0]}-${sorted[1]}`;
}

// Initialize event listeners
function initializeEventListeners() {
    // Zodiac select dropdowns
    const zodiacSelects = document.querySelectorAll('.zodiac-select-compact');
    zodiacSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const person = e.target.dataset.person;
            const zodiac = e.target.value;

            // Update state
            if (person === 'A') {
                state.personA.zodiac = zodiac;
            } else {
                state.personB.zodiac = zodiac;
            }

            console.log('Selected zodiac:', person, zodiac);

            // Auto-trigger analysis when selection changes
            analyzeCompatibility();
        });
    });

    // Gender select dropdowns
    const genderSelects = document.querySelectorAll('.gender-select-compact');
    genderSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const person = e.target.dataset.person;
            const gender = e.target.value;

            // Update state
            if (person === 'A') {
                state.personA.gender = gender;
            } else {
                state.personB.gender = gender;
            }

            console.log('Selected gender:', person, gender);

            // Auto-trigger analysis when selection changes
            analyzeCompatibility();
        });
    });

    // Match type buttons
    const matchTypeButtons = document.querySelectorAll('.btn-match-type');
    matchTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;

            // Remove active class from all buttons
            matchTypeButtons.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Update state
            state.matchType = type;

            console.log('Selected match type:', type);

            // Auto-trigger analysis when type changes
            analyzeCompatibility();
        });
    });

    // Unlock buttons
    const unlockBtns = document.querySelectorAll('.btn-unlock-main');
    unlockBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleUnlock();
        });
    });
}

// Analyze compatibility - Fetch from Firestore
async function analyzeCompatibility() {
    if (state.isLoading) return;

    state.isLoading = true;
    showLoading();

    try {
        console.log('Analyzing compatibility...', state);

        // Generate pair ID
        const pairId = generatePairId(state.personA.zodiac, state.personB.zodiac);
        console.log('Fetching data for:', pairId);

        // Fetch from Firestore
        const docRef = doc(db, 'zodiac-compatibility', pairId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            state.currentData = docSnap.data();
            console.log('Data fetched successfully:', state.currentData);

            // Update display with fetched data
            updateDisplay();
        } else {
            console.error('No data found for pair:', pairId);
            showError('Compatibility data not found for this pairing.');
        }

    } catch (error) {
        console.error('Error fetching compatibility data:', error);
        showError('Failed to load compatibility data. Please try again.');
    } finally {
        state.isLoading = false;
        hideLoading();
    }
}

// Show loading state
function showLoading() {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.style.opacity = '0.5';
        resultsContainer.style.pointerEvents = 'none';
    }
}

// Hide loading state
function hideLoading() {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.style.opacity = '1';
        resultsContainer.style.pointerEvents = 'auto';
    }
}

// Show error message
function showError(message) {
    // You can implement a more sophisticated error display
    alert(message);
}

// Update display with current data
function updateDisplay() {
    if (!state.currentData) return;

    const matchData = state.currentData[state.matchType]; // 'romance' or 'business'

    // Update zodiac pair name
    updatePairName();

    // Update free content
    updateFreeContent(matchData.free);

    // Update premium content based on user status
    console.log('Checking premium status before update:', state.isPremium);
    if (state.isPremium) {
        console.log('Calling updatePremiumContent...');
        updatePremiumContent(matchData.premium);
    } else {
        console.log('Calling updatePremiumPreview...');
        updatePremiumPreview(matchData.premium);
    }

    // Update UI based on premium status
    updatePremiumUI();
}

// Update pair name display
function updatePairName() {
    const pairNameElement = document.querySelector('.zodiac-pair-display');
    if (pairNameElement) {
        pairNameElement.textContent = `${state.personA.zodiac} & ${state.personB.zodiac}`;
    }
}

// Update free content
function updateFreeContent(freeData) {
    // Update matching score
    const scoreNumber = document.querySelector('.score-number');
    const scoreLabel = document.querySelector('.score-label');
    const scoreFill = document.querySelector('.score-fill');

    if (scoreNumber && scoreLabel && scoreFill) {
        const score = freeData.matchingScore;
        scoreNumber.textContent = `${score}%`;
        scoreLabel.textContent = freeData.rating;

        // Update circular progress
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference - (score / 100) * circumference;
        scoreFill.style.strokeDasharray = circumference;
        scoreFill.style.strokeDashoffset = offset;
    }

    // Update overview
    const overviewText = document.querySelector('.score-description p');
    if (overviewText) {
        overviewText.textContent = freeData.quickOverview;
    }

    // Update compatibility tags
    const tagsContainer = document.querySelector('.compatibility-tags');
    if (tagsContainer && freeData.compatibilityTags) {
        tagsContainer.innerHTML = freeData.compatibilityTags.map(tag => {
            const icon = tag.status === 'positive' ? 'fa-check' :
                tag.status === 'negative' ? 'fa-times' : 'fa-circle';
            return `<span class="tag tag-${tag.status}">
                <i class="fas ${icon}"></i> ${tag.tag}
            </span>`;
        }).join('');
    }
}

// Update premium content (for premium users)
function updatePremiumContent(premiumData) {
    console.log('Updating premium content with data:', premiumData);
    
    // Update detailed analysis card content
    const analysisCard = document.querySelector('.detailed-analysis-card');
    if (analysisCard && premiumData) {
        const previewContainer = analysisCard.querySelector('.premium-content-preview');
        if (previewContainer) {
            // Select sections based on match type
            let sections;
            if (state.matchType === 'romance') {
                sections = [
                    { icon: 'fa-heart-pulse', data: premiumData.emotionalCompatibility },
                    { icon: 'fa-brain', data: premiumData.intellectualAlignment },
                    { icon: 'fa-chart-line', data: premiumData.longTermPotential },
                    { icon: 'fa-tools', data: premiumData.others1, isConstruction: true },
                    { icon: 'fa-tools', data: premiumData.others2, isConstruction: true }
                ];
            } else {
                // business
                sections = [
                    { icon: 'fa-briefcase', data: premiumData.workStyleCompatibility },
                    { icon: 'fa-users', data: premiumData.leadershipDynamics },
                    { icon: 'fa-dollar-sign', data: premiumData.financialAlignment },
                    { icon: 'fa-tools', data: premiumData.others1, isConstruction: true },
                    { icon: 'fa-tools', data: premiumData.others2, isConstruction: true }
                ];
            }
            
            const validSections = sections.filter(s => s.data);
            
            previewContainer.innerHTML = validSections.map(section => `
                <div class="preview-section unlocked" style="display: flex; align-items: flex-start; gap: 20px; padding: 20px; margin-bottom: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid ${section.isConstruction ? 'rgba(253, 213, 106, 0.3)' : 'rgba(253, 213, 106, 0.1)'}; ${section.isConstruction ? 'opacity: 0.7; border-style: dashed;' : ''}">
                    <div style="flex-shrink: 0; width: 80px; text-align: center;">
                        <div class="section-icon" style="width: 60px; height: 60px; background: rgba(253, 213, 106, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                            <i class="fas ${section.icon}" style="font-size: 24px; color: #fdd56a;"></i>
                        </div>
                        <div class="section-score" style="font-weight: bold; color: #fdd56a; font-size: 18px;">
                            ${section.data.score}
                        </div>
                        <div style="font-size: 12px; color: #888; margin-top: 2px;">/ 100</div>
                    </div>
                    <div class="section-info" style="flex: 1; min-width: 0;">
                        <h4 style="margin: 0 0 10px 0; color: #fff; font-size: 18px;">${section.data.title}</h4>
                        <p style="margin: 0 0 12px 0; color: #ccc; line-height: 1.6;">${section.data.content}</p>
                        <ul class="section-highlights" style="margin: 0; padding-left: 20px; color: #aaa;">
                            ${section.data.highlights.map(h => `<li style="margin: 5px 0;">${h}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update conflicts with full details
    const conflictPreview = document.querySelector('.conflict-preview');
    if (conflictPreview && premiumData.conflicts) {
        // Show all conflicts including "On Construction" ones
        conflictPreview.innerHTML = premiumData.conflicts.map(conflict => `
            <div class="conflict-item-preview unlocked" style="${conflict.description === 'On Construction' ? 'opacity: 0.7; border: 1px dashed rgba(253, 213, 106, 0.3);' : ''}">
                <div class="conflict-bar-wrapper">
                    <div class="conflict-bar-bg">
                        <div class="conflict-bar-fill" style="width: ${conflict.severity}%;"></div>
                    </div>
                    <span class="conflict-percentage">${conflict.severity}%</span>
                </div>
                <div class="conflict-details">
                    <h5>${conflict.type} ${conflict.description === 'On Construction' ? '🚧' : ''}</h5>
                    <p><strong>Issue:</strong> ${conflict.description === 'On Construction' ? 'Content under development - Coming soon!' : conflict.description}</p>
                    ${conflict.description !== 'On Construction' ? `<p style="margin-top: 10px;"><strong>Resolution:</strong> ${conflict.resolution}</p>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    // Remove locked state and hide lock elements
    document.querySelectorAll('.premium-locked').forEach(el => el.classList.remove('premium-locked'));
    document.querySelectorAll('.btn-unlock-main').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.lock-indicator').forEach(el => el.style.display = 'none');
    
    console.log('Premium content updated successfully');
}

// Update premium preview (for non-premium users)
function updatePremiumPreview(premiumData) {
    // Keep locked state
    document.querySelectorAll('.premium-locked').forEach(el => {
        el.classList.add('premium-locked');
    });

    // Show unlock buttons
    document.querySelectorAll('.btn-unlock-main').forEach(btn => {
        btn.style.display = 'flex';
    });
}

// Update conflicts display
function updateConflicts(conflicts) {
    const conflictPreview = document.querySelector('.conflict-preview');
    if (!conflictPreview || !conflicts) return;

    // Filter out "On Construction" conflicts
    const realConflicts = conflicts.filter(c => c.description !== 'On Construction');

    conflictPreview.innerHTML = realConflicts.map(conflict => `
        <div class="conflict-item-preview">
            <div class="conflict-bar-wrapper">
                <div class="conflict-bar-bg">
                    <div class="conflict-bar-fill" style="width: ${conflict.severity}%;"></div>
                </div>
                <span class="conflict-percentage">${conflict.severity}%</span>
            </div>
            <div class="conflict-details">
                <h5>${conflict.type}</h5>
                <p>${state.isPremium ? conflict.description : 'Unlock to see details...'}</p>
            </div>
            ${!state.isPremium ? '<div class="lock-indicator"><i class="fas fa-lock"></i></div>' : ''}
        </div>
    `).join('');
}

// Update premium UI based on user status
function updatePremiumUI() {
    console.log('updatePremiumUI called, isPremium:', state.isPremium);

    if (state.isPremium) {
        // User is premium - show all content
        console.log('Unlocking premium content...');
        document.querySelectorAll('.premium-locked').forEach(el => {
            el.classList.remove('premium-locked');
            console.log('Removed premium-locked from:', el);
        });
        document.querySelectorAll('.btn-unlock-main').forEach(btn => {
            btn.style.display = 'none';
            console.log('Hidden unlock button:', btn);
        });
    } else {
        // User is not premium - show locked state
        console.log('Locking premium content...');
        document.querySelectorAll('.detailed-analysis-card, .conflict-analysis-card').forEach(el => {
            el.classList.add('premium-locked');
        });
        document.querySelectorAll('.btn-unlock-main').forEach(btn => {
            btn.style.display = 'flex';
        });
    }
}

// Handle unlock premium content
function handleUnlock() {
    if (!state.user) {
        alert('Please login to unlock premium content');
        window.location.href = 'login.html';
        return;
    }

    if (!state.isPremium) {
        alert('Please upgrade to premium membership to unlock detailed analysis and conflict information');
        // TODO: Redirect to payment/upgrade page
        // window.location.href = 'upgrade.html';
        return;
    }
}

// Export for debugging
window.matchingState = state;
window.analyzeCompatibility = analyzeCompatibility;
