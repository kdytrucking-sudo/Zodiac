// Quick fix script - paste this in browser console to unlock premium content

console.log('🔓 Premium Content Unlock Script');

// Force premium state
window.matchingState.isPremium = true;

// Get current data
const premiumData = window.matchingState.currentData?.[window.matchingState.matchType]?.premium;

if (!premiumData) {
    console.error('No premium data loaded. Run analyzeCompatibility() first.');
} else {
    console.log('Premium data found:', premiumData);

    // Update detailed analysis card
    const analysisCard = document.querySelector('.detailed-analysis-card');
    if (analysisCard) {
        const previewContainer = analysisCard.querySelector('.premium-content-preview');
        if (previewContainer) {
            const sections = [
                { key: 'emotionalCompatibility', icon: 'fa-heart-pulse', data: premiumData.emotionalCompatibility },
                { key: 'intellectualAlignment', icon: 'fa-brain', data: premiumData.intellectualAlignment },
                { key: 'longTermPotential', icon: 'fa-chart-line', data: premiumData.longTermPotential }
            ];

            const validSections = sections.filter(s => s.data && s.data.content !== 'On Construction');

            previewContainer.innerHTML = validSections.map(section => `
                <div class="preview-section unlocked">
                    <div class="section-icon"><i class="fas ${section.icon}"></i></div>
                    <div class="section-info">
                        <h4>${section.data.title}</h4>
                        <p>${section.data.content}</p>
                        <div class="section-score" style="margin-top: 10px; font-weight: bold; color: #fdd56a;">
                            Score: ${section.data.score}/100
                        </div>
                        <ul class="section-highlights" style="margin-top: 10px; padding-left: 20px;">
                            ${section.data.highlights.map(h => `<li style="margin: 5px 0;">${h}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');

            console.log('✅ Updated analysis sections');
        }
    }

    // Update conflicts
    const conflictCard = document.querySelector('.conflict-analysis-card');
    if (conflictCard && premiumData.conflicts) {
        const conflictPreview = conflictCard.querySelector('.conflict-preview');
        if (conflictPreview) {
            const realConflicts = premiumData.conflicts.filter(c => c.description !== 'On Construction');

            conflictPreview.innerHTML = realConflicts.map(conflict => `
                <div class="conflict-item-preview unlocked">
                    <div class="conflict-bar-wrapper">
                        <div class="conflict-bar-bg">
                            <div class="conflict-bar-fill" style="width: ${conflict.severity}%;"></div>
                        </div>
                        <span class="conflict-percentage">${conflict.severity}%</span>
                    </div>
                    <div class="conflict-details">
                        <h5>${conflict.type}</h5>
                        <p><strong>Issue:</strong> ${conflict.description}</p>
                        <p style="margin-top: 10px;"><strong>Resolution:</strong> ${conflict.resolution}</p>
                    </div>
                </div>
            `).join('');

            console.log('✅ Updated conflicts');
        }
    }

    // Remove all locked classes
    document.querySelectorAll('.premium-locked').forEach(el => {
        el.classList.remove('premium-locked');
    });

    // Hide unlock buttons
    document.querySelectorAll('.btn-unlock-main').forEach(btn => {
        btn.style.display = 'none';
    });

    // Remove lock indicators
    document.querySelectorAll('.lock-indicator').forEach(el => {
        el.style.display = 'none';
    });

    console.log('✅ Premium content unlocked!');
}
