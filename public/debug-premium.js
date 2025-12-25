// 在浏览器控制台运行这个调试脚本

console.log('=== 调试信息 ===');
console.log('1. isPremium:', window.matchingState?.isPremium);
console.log('2. currentData:', window.matchingState?.currentData ? 'Loaded' : 'Not loaded');
console.log('3. matchType:', window.matchingState?.matchType);

if (window.matchingState?.currentData) {
    const premiumData = window.matchingState.currentData[window.matchingState.matchType]?.premium;
    console.log('4. Premium data:', premiumData ? 'Exists' : 'Missing');

    if (premiumData) {
        console.log('5. emotionalCompatibility:', premiumData.emotionalCompatibility);
        console.log('6. conflicts:', premiumData.conflicts);
    }
}

console.log('7. Analysis card:', document.querySelector('.detailed-analysis-card'));
console.log('8. Preview container:', document.querySelector('.premium-content-preview'));
console.log('9. Conflict preview:', document.querySelector('.conflict-preview'));

// 手动触发更新
console.log('\n=== 手动触发更新 ===');
if (window.matchingState?.currentData && window.matchingState?.isPremium) {
    const premiumData = window.matchingState.currentData[window.matchingState.matchType]?.premium;

    // 直接调用函数
    console.log('调用 updatePremiumContent...');

    const analysisCard = document.querySelector('.detailed-analysis-card');
    const previewContainer = analysisCard?.querySelector('.premium-content-preview');

    console.log('analysisCard:', analysisCard);
    console.log('previewContainer:', previewContainer);

    if (previewContainer && premiumData) {
        console.log('开始填充内容...');

        const sections = [
            { icon: 'fa-heart-pulse', data: premiumData.emotionalCompatibility },
            { icon: 'fa-brain', data: premiumData.intellectualAlignment },
            { icon: 'fa-chart-line', data: premiumData.longTermPotential }
        ];

        const validSections = sections.filter(s => s.data && s.data.content !== 'On Construction');
        console.log('Valid sections:', validSections.length);

        const html = validSections.map(section => `
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

        console.log('生成的HTML长度:', html.length);
        previewContainer.innerHTML = html;
        console.log('✅ 内容已填充');
    } else {
        console.error('❌ 缺少必要元素');
    }

    // 更新冲突
    const conflictPreview = document.querySelector('.conflict-preview');
    if (conflictPreview && premiumData.conflicts) {
        const realConflicts = premiumData.conflicts.filter(c => c.description !== 'On Construction');
        console.log('Real conflicts:', realConflicts.length);

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
        console.log('✅ 冲突已更新');
    }

    // 移除锁定
    document.querySelectorAll('.premium-locked').forEach(el => el.classList.remove('premium-locked'));
    document.querySelectorAll('.btn-unlock-main').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.lock-indicator').forEach(el => el.style.display = 'none');

    console.log('✅ 完成！');
}
