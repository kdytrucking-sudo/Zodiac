// 状态管理
const state = {
    totalRequests: 0,
    successCount: 0,
    failCount: 0,
    responseTimes: [],
    isGenerating: false
};

// DOM 元素
const elements = {
    promptInput: document.getElementById('promptInput'),
    generateBtn: document.getElementById('generateBtn'),
    resetParamsBtn: document.getElementById('resetParams'),
    copyBtn: document.getElementById('copyBtn'),
    outputArea: document.getElementById('outputArea'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    configCard: document.getElementById('configCard'),
    configDisplay: document.getElementById('configDisplay'),

    // 参数滑块
    temperature: document.getElementById('temperature'),
    topK: document.getElementById('topK'),
    topP: document.getElementById('topP'),
    maxTokens: document.getElementById('maxTokens'),

    // 参数值显示
    temperatureValue: document.getElementById('temperatureValue'),
    topKValue: document.getElementById('topKValue'),
    topPValue: document.getElementById('topPValue'),
    maxTokensValue: document.getElementById('maxTokensValue'),

    // 统计信息
    totalRequests: document.getElementById('totalRequests'),
    successCountEl: document.getElementById('successCount'),
    failCountEl: document.getElementById('failCount'),
    avgTime: document.getElementById('avgTime')
};

// 默认参数
const defaultParams = {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxTokens: 1024
};

// 初始化
function init() {
    setupEventListeners();
    updateAllParamDisplays();
    loadStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 生成按钮
    elements.generateBtn.addEventListener('click', handleGenerate);

    // 重置参数按钮
    elements.resetParamsBtn.addEventListener('click', resetParameters);

    // 复制按钮
    elements.copyBtn.addEventListener('click', copyOutput);

    // 参数滑块
    elements.temperature.addEventListener('input', (e) => {
        elements.temperatureValue.textContent = parseFloat(e.target.value).toFixed(1);
    });

    elements.topK.addEventListener('input', (e) => {
        elements.topKValue.textContent = e.target.value;
    });

    elements.topP.addEventListener('input', (e) => {
        elements.topPValue.textContent = parseFloat(e.target.value).toFixed(2);
    });

    elements.maxTokens.addEventListener('input', (e) => {
        elements.maxTokensValue.textContent = e.target.value;
    });

    // 回车键快捷生成 (Ctrl/Cmd + Enter)
    elements.promptInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate();
        }
    });
}

// 处理生成请求
async function handleGenerate() {
    const prompt = elements.promptInput.value.trim();

    if (!prompt) {
        showMessage('请输入提示词', 'error');
        elements.promptInput.focus();
        return;
    }

    if (state.isGenerating) {
        return;
    }

    state.isGenerating = true;
    setGeneratingState(true);

    const params = {
        prompt,
        temperature: parseFloat(elements.temperature.value),
        topK: parseInt(elements.topK.value),
        topP: parseFloat(elements.topP.value),
        maxTokens: parseInt(elements.maxTokens.value)
    };

    const startTime = Date.now();

    try {
        const response = await fetch('/api/genkit/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '生成失败');
        }

        const data = await response.json();

        // 更新输出
        displayOutput(data.result);
        displayConfig(data.config);

        // 更新统计
        updateStats(true, responseTime);

        showMessage('生成成功！', 'success');

    } catch (error) {
        console.error('Generation error:', error);
        displayError(error.message);
        updateStats(false, 0);
        showMessage('生成失败: ' + error.message, 'error');
    } finally {
        state.isGenerating = false;
        setGeneratingState(false);
    }
}

// 设置生成状态
function setGeneratingState(isGenerating) {
    elements.generateBtn.disabled = isGenerating;

    if (isGenerating) {
        elements.generateBtn.innerHTML = '<span class="btn-icon">⏳</span>生成中...';
        elements.outputArea.style.display = 'none';
        elements.loadingIndicator.style.display = 'flex';
    } else {
        elements.generateBtn.innerHTML = '<span class="btn-icon">✨</span>生成内容';
        elements.outputArea.style.display = 'block';
        elements.loadingIndicator.style.display = 'none';
    }
}

// 显示输出
function displayOutput(text) {
    elements.outputArea.innerHTML = '';
    elements.outputArea.textContent = text;
    elements.outputArea.classList.add('fade-in');

    // 移除占位符样式
    elements.outputArea.style.display = 'block';
}

// 显示配置
function displayConfig(config) {
    elements.configDisplay.textContent = JSON.stringify(config, null, 2);
    elements.configCard.style.display = 'block';
    elements.configCard.classList.add('fade-in');
}

// 显示错误
function displayError(message) {
    elements.outputArea.innerHTML = `
        <div class="message error">
            <span>❌</span>
            <span>${message}</span>
        </div>
    `;
}

// 显示消息
function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;

    // 插入到输出区域上方
    const outputSection = document.querySelector('.output-section');
    outputSection.insertBefore(messageEl, outputSection.firstChild);

    // 3秒后自动移除
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// 复制输出
function copyOutput() {
    const text = elements.outputArea.textContent;

    if (!text || text.includes('AI 生成的内容将在这里显示')) {
        showMessage('没有可复制的内容', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showMessage('已复制到剪贴板！', 'success');

        // 按钮反馈
        const originalText = elements.copyBtn.textContent;
        elements.copyBtn.textContent = '✅';
        setTimeout(() => {
            elements.copyBtn.textContent = originalText;
        }, 1000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showMessage('复制失败', 'error');
    });
}

// 重置参数
function resetParameters() {
    elements.temperature.value = defaultParams.temperature;
    elements.topK.value = defaultParams.topK;
    elements.topP.value = defaultParams.topP;
    elements.maxTokens.value = defaultParams.maxTokens;

    updateAllParamDisplays();
    showMessage('参数已重置为默认值', 'success');
}

// 更新所有参数显示
function updateAllParamDisplays() {
    elements.temperatureValue.textContent = parseFloat(elements.temperature.value).toFixed(1);
    elements.topKValue.textContent = elements.topK.value;
    elements.topPValue.textContent = parseFloat(elements.topP.value).toFixed(2);
    elements.maxTokensValue.textContent = elements.maxTokens.value;
}

// 更新统计信息
function updateStats(success, responseTime) {
    state.totalRequests++;

    if (success) {
        state.successCount++;
        state.responseTimes.push(responseTime);
    } else {
        state.failCount++;
    }

    // 计算平均响应时间
    const avgTime = state.responseTimes.length > 0
        ? Math.round(state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length)
        : 0;

    // 更新显示
    elements.totalRequests.textContent = state.totalRequests;
    elements.successCountEl.textContent = state.successCount;
    elements.failCountEl.textContent = state.failCount;
    elements.avgTime.textContent = avgTime + 'ms';

    // 保存到 localStorage
    saveStats();
}

// 保存统计到 localStorage
function saveStats() {
    localStorage.setItem('aiTestStats', JSON.stringify({
        totalRequests: state.totalRequests,
        successCount: state.successCount,
        failCount: state.failCount,
        responseTimes: state.responseTimes
    }));
}

// 从 localStorage 加载统计
function loadStats() {
    const saved = localStorage.getItem('aiTestStats');
    if (saved) {
        try {
            const stats = JSON.parse(saved);
            state.totalRequests = stats.totalRequests || 0;
            state.successCount = stats.successCount || 0;
            state.failCount = stats.failCount || 0;
            state.responseTimes = stats.responseTimes || [];

            // 更新显示
            elements.totalRequests.textContent = state.totalRequests;
            elements.successCountEl.textContent = state.successCount;
            elements.failCountEl.textContent = state.failCount;

            const avgTime = state.responseTimes.length > 0
                ? Math.round(state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length)
                : 0;
            elements.avgTime.textContent = avgTime + 'ms';
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
