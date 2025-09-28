/**
 * 中文名生成器后端服务
 * 使用Express.js和SiliconFlow API (DeepSeek-R1模型)
 */

// 导入必要的模块
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use(express.static(path.join(__dirname), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// API请求限制
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 限制每个IP 15分钟内最多10次请求
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试',
        error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// SiliconFlow API配置
const SILICONFLOW_CONFIG = {
    apiKey: process.env.SILICONFLOW_API_KEY,
    apiUrl: process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-ai/DeepSeek-R1', // 改用免费版本
    maxTokens: parseInt(process.env.MAX_TOKENS) || 4096,
    temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    topP: parseFloat(process.env.TOP_P) || 0.9,
};

/**
 * 生成中文名的提示词模板
 */
function createPrompt(englishName) {
    return `为英文名"${englishName}"生成3个中文名字。要求：
1. 2-3个汉字
2. 有美好寓意
3. 音韵和谐
4. 适合外国人

请严格按照JSON格式返回：
{
  "names": [
    {
      "chineseName": "中文名",
      "pinyin": "拼音",
      "chineseMeaning": "中文寓意",
      "englishMeaning": "English meaning"
    }
  ]
}

只返回JSON，不要其他内容。`;
}

/**
 * 调用SiliconFlow API生成中文名
 */
async function generateChineseNames(englishName) {
    try {
        console.log(`开始为"${englishName}"生成中文名...`);
        
        const prompt = createPrompt(englishName);
        
        const requestData = {
            model: SILICONFLOW_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 2000, // 减少token数量
            temperature: 0.3, // 降低温度提高稳定性
            top_p: 0.8,
            stream: false
        };

        console.log('发送请求到SiliconFlow API...');
        
        const response = await axios.post(SILICONFLOW_CONFIG.apiUrl, requestData, {
            headers: {
                'Authorization': `Bearer ${SILICONFLOW_CONFIG.apiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 60000, // 增加到60秒超时
        });

        console.log('收到API响应');

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            throw new Error('API返回数据格式错误');
        }

        const content = response.data.choices[0].message.content.trim();
        console.log('API返回内容:', content);

        // 尝试解析JSON响应
        let parsedResult;
        try {
            // 清理可能的markdown代码块标记
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            parsedResult = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError);
            console.error('原始内容:', content);
            throw new Error('AI返回的数据格式不正确');
        }

        // 验证返回数据结构
        if (!parsedResult.names || !Array.isArray(parsedResult.names)) {
            throw new Error('AI返回的数据结构不正确');
        }

        // 验证每个名字的数据完整性
        const validNames = parsedResult.names.filter(name => {
            return name.chineseName && 
                   name.pinyin && 
                   name.chineseMeaning && 
                   name.englishMeaning;
        });

        if (validNames.length === 0) {
            throw new Error('AI生成的名字数据不完整');
        }

        // 确保返回3个名字，如果不足则重复最后一个
        while (validNames.length < 3 && validNames.length > 0) {
            const lastName = validNames[validNames.length - 1];
            validNames.push({
                ...lastName,
                chineseName: lastName.chineseName + '（备选）'
            });
        }

        console.log(`成功生成${validNames.length}个中文名`);
        return validNames.slice(0, 3); // 只返回前3个

    } catch (error) {
        console.error('生成中文名时发生错误:', error);
        
        // 如果API调用失败，返回备用的中文名
        console.log('使用备用中文名生成方案...');
        return generateFallbackNames(englishName);
    }
}

/**
 * 备用中文名生成方案
 */
function generateFallbackNames(englishName) {
    const fallbackNames = {
        'john': [
            { chineseName: '约翰', pinyin: 'Yuē hàn', chineseMeaning: '寓意诚实守信，品格高尚的君子', englishMeaning: 'Represents honesty and noble character' },
            { chineseName: '俊涵', pinyin: 'Jùn hán', chineseMeaning: '俊秀有才华，内涵丰富', englishMeaning: 'Handsome and talented with rich inner qualities' },
            { chineseName: '君瀚', pinyin: 'Jūn hàn', chineseMeaning: '君子风范，学识如海般深广', englishMeaning: 'Gentlemanly demeanor with vast knowledge like the sea' }
        ],
        'mary': [
            { chineseName: '玛丽', pinyin: 'Mǎ lì', chineseMeaning: '美丽优雅，如珍珠般珍贵', englishMeaning: 'Beautiful and elegant, precious like a pearl' },
            { chineseName: '美莉', pinyin: 'Měi lì', chineseMeaning: '美丽如花，茉莉花般纯洁', englishMeaning: 'Beautiful like a flower, pure as jasmine' },
            { chineseName: '慧琳', pinyin: 'Huì lín', chineseMeaning: '智慧如林，才华横溢', englishMeaning: 'Wise as a forest, exceptionally talented' }
        ],
        'david': [
            { chineseName: '大卫', pinyin: 'Dà wèi', chineseMeaning: '伟大的守护者，勇敢坚强', englishMeaning: 'Great guardian, brave and strong' },
            { chineseName: '达维', pinyin: 'Dá wéi', chineseMeaning: '通达事理，维护正义', englishMeaning: 'Understanding and upholding justice' },
            { chineseName: '德威', pinyin: 'Dé wēi', chineseMeaning: '品德高尚，威望卓著', englishMeaning: 'Noble character with distinguished reputation' }
        ]
    };
    
    const lowerName = englishName.toLowerCase();
    
    if (fallbackNames[lowerName]) {
        return fallbackNames[lowerName];
    }
    
    // 通用备用名字
    return [
        { chineseName: '文华', pinyin: 'Wén huá', chineseMeaning: '文采斐然，才华横溢', englishMeaning: 'Literary talent and exceptional ability' },
        { chineseName: '志远', pinyin: 'Zhì yuǎn', chineseMeaning: '志向远大，前程似锦', englishMeaning: 'Ambitious with a bright future' },
        { chineseName: '雅韵', pinyin: 'Yǎ yùn', chineseMeaning: '优雅有韵味，气质非凡', englishMeaning: 'Elegant and graceful with extraordinary temperament' }
    ];
}

/**
 * 验证输入参数
 */
function validateInput(englishName) {
    if (!englishName || typeof englishName !== 'string') {
        return { valid: false, message: '请提供有效的英文名' };
    }

    const trimmedName = englishName.trim();
    if (trimmedName.length === 0) {
        return { valid: false, message: '英文名不能为空' };
    }

    if (trimmedName.length > 50) {
        return { valid: false, message: '英文名长度不能超过50个字符' };
    }

    // 检查是否只包含字母、空格、连字符和撇号
    const namePattern = /^[a-zA-Z\s\-']+$/;
    if (!namePattern.test(trimmedName)) {
        return { valid: false, message: '英文名只能包含字母、空格、连字符和撇号' };
    }

    return { valid: true, name: trimmedName };
}

// API路由

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '1.0.0'
    });
});

/**
 * 生成中文名接口
 */
app.post('/api/generate-name', apiLimiter, async (req, res) => {
    try {
        const { englishName } = req.body;
        
        // 验证输入
        const validation = validateInput(englishName);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message,
                error: 'INVALID_INPUT'
            });
        }

        // 生成中文名
        const chineseNames = await generateChineseNames(validation.name);

        // 返回结果
        res.json({
            success: true,
            message: '中文名生成成功',
            names: chineseNames,
            englishName: validation.name,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('API错误:', error);
        
        res.status(500).json({
            success: false,
            message: error.message || '生成中文名时发生错误',
            error: 'GENERATION_ERROR'
        });
    }
});

/**
 * 主页路由
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: 'INTERNAL_SERVER_ERROR'
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在',
        error: 'NOT_FOUND'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 中文名生成器服务已启动`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`🔧 环境: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 AI模型: ${SILICONFLOW_CONFIG.model}`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
    
    // 验证必要的环境变量
    if (!SILICONFLOW_CONFIG.apiKey) {
        console.warn('⚠️  警告: 未设置SILICONFLOW_API_KEY环境变量');
    }
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，正在优雅关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到SIGINT信号，正在优雅关闭服务器...');
    process.exit(0);
});

module.exports = app;
