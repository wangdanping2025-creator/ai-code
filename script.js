/**
 * 中文名生成器前端交互脚本
 * 处理用户输入、API调用和结果展示
 */

// 全局变量和配置
const CONFIG = {
    API_ENDPOINT: '/api/generate-name', // 后端API端点
    MAX_NAME_LENGTH: 50, // 最大英文名长度
    GENERATION_TIMEOUT: 30000, // API调用超时时间（30秒）
};

// DOM元素引用
const elements = {
    englishNameInput: null,
    generateBtn: null,
    loading: null,
    results: null,
    namesGrid: null,
};

// 应用状态
const state = {
    isGenerating: false,
    lastGeneratedName: '',
};

/**
 * 页面加载完成后初始化应用
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 获取DOM元素引用
    elements.englishNameInput = document.getElementById('englishName');
    elements.generateBtn = document.getElementById('generateBtn');
    elements.loading = document.getElementById('loading');
    elements.results = document.getElementById('results');
    elements.namesGrid = document.getElementById('namesGrid');

    // 检查必要元素是否存在
    if (!validateElements()) {
        console.error('关键DOM元素未找到，应用无法正常工作');
        return;
    }

    // 绑定事件监听器
    bindEventListeners();
    
    // 设置初始状态
    resetUI();
    
    console.log('中文名生成器初始化完成');
}

/**
 * 验证必要的DOM元素是否存在
 */
function validateElements() {
    const requiredElements = ['englishNameInput', 'generateBtn', 'loading', 'results', 'namesGrid'];
    
    for (const elementName of requiredElements) {
        if (!elements[elementName]) {
            console.error(`必要元素未找到: ${elementName}`);
            return false;
        }
    }
    
    return true;
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 生成按钮点击事件
    elements.generateBtn.addEventListener('click', handleGenerateClick);
    
    // 输入框回车事件
    elements.englishNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !state.isGenerating) {
            handleGenerateClick();
        }
    });
    
    // 输入框输入事件 - 实时验证
    elements.englishNameInput.addEventListener('input', handleInputChange);
    
    // 输入框焦点事件
    elements.englishNameInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    elements.englishNameInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

/**
 * 处理输入框内容变化
 */
function handleInputChange() {
    const inputValue = elements.englishNameInput.value.trim();
    
    // 更新按钮状态
    updateGenerateButtonState(inputValue);
    
    // 清除之前的错误状态
    clearInputError();
}

/**
 * 更新生成按钮状态
 */
function updateGenerateButtonState(inputValue) {
    const isValid = inputValue.length > 0 && inputValue.length <= CONFIG.MAX_NAME_LENGTH;
    const isEnabled = isValid && !state.isGenerating;
    
    elements.generateBtn.disabled = !isEnabled;
    
    if (!isValid && inputValue.length > 0) {
        if (inputValue.length > CONFIG.MAX_NAME_LENGTH) {
            showInputError('Name length cannot exceed 50 characters');
        }
    }
}

/**
 * 显示输入错误
 */
function showInputError(message) {
    elements.englishNameInput.style.borderColor = '#dc3545';
    elements.englishNameInput.style.backgroundColor = '#fff5f5';
    
    // 如果错误提示不存在，创建一个
    let errorElement = elements.englishNameInput.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.textAlign = 'center';
        elements.englishNameInput.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * 清除输入错误状态
 */
function clearInputError() {
    elements.englishNameInput.style.borderColor = '';
    elements.englishNameInput.style.backgroundColor = '';
    
    const errorElement = elements.englishNameInput.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * 处理生成按钮点击
 */
async function handleGenerateClick() {
    const englishName = elements.englishNameInput.value.trim();
    
    // 验证输入
    if (!validateInput(englishName)) {
        return;
    }
    
    // 防止重复生成相同的名字
    if (englishName === state.lastGeneratedName && elements.results.style.display !== 'none') {
        showMessage('You just generated names for this name. Please try a different name or wait a moment.');
        return;
    }
    
    try {
        // 开始生成流程
        await startGeneration(englishName);
    } catch (error) {
        console.error('生成中文名时发生错误:', error);
        handleGenerationError(error);
    }
}

/**
 * 验证用户输入
 */
function validateInput(englishName) {
    if (!englishName) {
        showInputError('Please enter your English name');
        elements.englishNameInput.focus();
        return false;
    }
    
    if (englishName.length > CONFIG.MAX_NAME_LENGTH) {
        showInputError(`Name length cannot exceed ${CONFIG.MAX_NAME_LENGTH} characters`);
        elements.englishNameInput.focus();
        return false;
    }
    
    // 检查是否包含特殊字符（只允许字母、空格、连字符、撇号）
    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(englishName)) {
        showInputError('Please enter a valid English name (letters, spaces, hyphens, and apostrophes only)');
        elements.englishNameInput.focus();
        return false;
    }
    
    return true;
}

/**
 * 开始生成中文名
 */
async function startGeneration(englishName) {
    // 更新UI状态
    setGeneratingState(true);
    
    // 隐藏之前的结果
    hideResults();
    
    // 显示加载动画
    showLoading();
    
    try {
        // 调用API生成中文名
        const chineseNames = await generateChineseNames(englishName);
        
        // 显示结果
        displayResults(chineseNames);
        
        // 记录最后生成的名字
        state.lastGeneratedName = englishName;
        
        // 显示成功消息
        showMessage('Chinese names generated successfully! Check out the recommendations below.', 'success');
        
    } catch (error) {
        throw error;
    } finally {
        // 恢复UI状态
        setGeneratingState(false);
        hideLoading();
    }
}

/**
 * 设置生成状态
 */
function setGeneratingState(isGenerating) {
    state.isGenerating = isGenerating;
    
    // 更新按钮状态
    elements.generateBtn.disabled = isGenerating;
    elements.englishNameInput.disabled = isGenerating;
    
    if (isGenerating) {
        elements.generateBtn.innerHTML = `
            <span class="btn-icon">⏳</span>
            <span class="btn-text">Generating...</span>
        `;
    } else {
        elements.generateBtn.innerHTML = `
            <span class="btn-icon">✨</span>
            <span class="btn-text">Generate Names</span>
        `;
    }
}

/**
 * 显示加载动画
 */
function showLoading() {
    elements.loading.classList.remove('hidden');
    elements.loading.classList.add('visible');
}

/**
 * 隐藏加载动画
 */
function hideLoading() {
    elements.loading.classList.remove('visible');
    elements.loading.classList.add('hidden');
}

/**
 * 调用API生成中文名
 */
async function generateChineseNames(englishName) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.GENERATION_TIMEOUT);
    
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                englishName: englishName
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP错误: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || '生成中文名失败');
        }
        
        return data.names;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请检查网络连接后重试');
        }
        
        throw error;
    }
}

/**
 * 显示生成结果
 */
function displayResults(chineseNames) {
    // 清空之前的结果
    elements.namesGrid.innerHTML = '';
    
    // 验证数据
    if (!Array.isArray(chineseNames) || chineseNames.length === 0) {
        throw new Error('未收到有效的中文名数据');
    }
    
    // 为每个中文名创建卡片
    chineseNames.forEach((nameData, index) => {
        const nameCard = createNameCard(nameData, index);
        elements.namesGrid.appendChild(nameCard);
    });
    
    // 显示结果区域
    showResults();
    
    // 滚动到结果区域
    setTimeout(() => {
        elements.results.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

/**
 * 创建中文名卡片 - Apple风格
 */
function createNameCard(nameData, index) {
    const card = document.createElement('div');
    card.className = 'name-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="chinese-name">${nameData.chineseName}</div>
        <div class="pinyin">${nameData.pinyin}</div>
        
        <div class="meaning-section">
            <div class="meaning-title">Chinese Meaning</div>
            <div class="meaning-text">${nameData.chineseMeaning}</div>
        </div>
        
        <div class="meaning-section">
            <div class="meaning-title">English Meaning</div>
            <div class="meaning-text">${nameData.englishMeaning}</div>
        </div>
    `;
    
    // 添加点击复制功能
    card.addEventListener('click', () => {
        copyToClipboard(nameData.chineseName);
        showMessage(`Copied "${nameData.chineseName}" to clipboard`, 'success');
    });
    
    return card;
}

/**
 * 显示结果区域
 */
function showResults() {
    elements.results.classList.remove('hidden');
    elements.results.classList.add('visible');
}

/**
 * 隐藏结果区域
 */
function hideResults() {
    elements.results.classList.remove('visible');
    elements.results.classList.add('hidden');
}

/**
 * 处理生成错误
 */
function handleGenerationError(error) {
    console.error('生成错误:', error);
    
    let errorMessage = '生成中文名时发生错误，请稍后重试。';
    
    if (error.message) {
        if (error.message.includes('网络') || error.message.includes('超时')) {
            errorMessage = '网络连接异常，请检查网络后重试。';
        } else if (error.message.includes('API')) {
            errorMessage = 'AI服务暂时不可用，请稍后重试。';
        } else {
            errorMessage = error.message;
        }
    }
    
    showMessage(errorMessage, 'error');
}

/**
 * 显示消息提示
 */
function showMessage(message, type = 'info') {
    // 移除之前的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message-toast message-${type}`;
    messageElement.textContent = message;
    
    // 设置样式
    Object.assign(messageElement.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease',
    });
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            messageElement.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageElement.style.backgroundColor = '#dc3545';
            break;
        default:
            messageElement.style.backgroundColor = '#17a2b8';
    }
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }
    }, 3000);
}

/**
 * 复制文本到剪贴板
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    } catch (error) {
        console.error('复制失败:', error);
    }
}

/**
 * 重置UI到初始状态
 */
function resetUI() {
    elements.englishNameInput.value = '';
    elements.englishNameInput.disabled = false;
    elements.generateBtn.disabled = false;
    hideLoading();
    hideResults();
    clearInputError();
    state.isGenerating = false;
    state.lastGeneratedName = '';
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .name-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .name-card:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    .error-message {
        animation: fadeInUp 0.3s ease;
    }
`;
document.head.appendChild(style);
