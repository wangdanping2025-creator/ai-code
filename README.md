# 🇨🇳 Chinese Name Generator | 中文名生成器

> 🎊 **Special National Day Edition** - Celebrating 75 Years of the People's Republic of China!

An AI-powered web application that helps foreigners discover meaningful Chinese names with rich cultural heritage and beautiful symbolism. Built with Apple-style design and festive National Day theme.

[🌐 **Live Demo**](https://your-demo-url.com) | [📖 **中文文档**](#中文文档)

![Chinese Name Generator](https://img.shields.io/badge/Chinese%20Name-Generator-red?style=for-the-badge&logo=china&logoColor=white)
![National Day](https://img.shields.io/badge/National%20Day-75th%20Anniversary-gold?style=for-the-badge&logo=fireworks&logoColor=white)
![Apple Design](https://img.shields.io/badge/Apple-Design-blue?style=for-the-badge&logo=apple&logoColor=white)

## ✨ Features | 功能特点

### 🎯 Core Features
- 🔤 **English Name Input** - Simple and intuitive name entry
- 🤖 **AI-Powered Generation** - Uses DeepSeek-R1 model for intelligent name creation
- 🏮 **Cultural Heritage** - Every name reflects authentic Chinese cultural values
- 📖 **Bilingual Meanings** - Detailed explanations in both Chinese and English
- 🎊 **National Day Theme** - Special 75th anniversary celebration design

### 🛠 Technical Highlights
- 🍎 **Apple-Style Design** - Clean, modern, and elegant interface
- 📱 **Responsive Layout** - Perfect on desktop, tablet, and mobile
- 🇨🇳 **Chinese Red Theme** - Beautiful integration of traditional colors
- ⚡ **Real-time Generation** - Fast and reliable AI processing
- 🌐 **Bilingual Support** - English-first with Chinese assistance

## 项目架构

### 前端文件
- `index.html` - 主页面，包含输入框和结果展示
- `style.css` - 样式文件，现代化UI设计
- `script.js` - 前端交互逻辑

### 后端文件
- `server.js` - Node.js服务器，处理API请求
- `package.json` - 项目依赖配置
- `.env` - 环境变量配置（API密钥等）

## 页面布局

### 主页面结构
1. **头部区域**
   - 网站标题：中文名生成器
   - 副标题：为外国朋友起一个有意义的中文名

2. **输入区域**
   - 英文名输入框
   - 生成按钮

3. **结果展示区域**
   - 三个中文名卡片
   - 每个卡片包含：
     - 中文名（大字体显示）
     - 拼音标注
     - 中文寓意解释
     - 英文寓意解释

4. **底部区域**
   - 版权信息
   - 使用说明

### 样式设计
- 采用现代化渐变背景
- 卡片式布局，阴影效果
- 响应式设计，移动端友好
- 中国风色彩搭配（红色、金色等）
- 优雅的字体选择

## API集成

### SiliconFlow API
- 接口地址：`https://api.siliconflow.cn/v1/chat/completions`
- 模型：`Pro/deepseek-ai/DeepSeek-R1`
- 认证方式：Bearer Token

### 提示词设计
精心设计的提示词，确保生成的中文名：
- 符合中国文化传统
- 寓意美好吉祥
- 音韵和谐
- 适合外国人使用

## 开发计划

1. ✅ 项目规划和文档编写
2. ✅ 创建前端页面和样式
3. ✅ 开发后端API服务
4. ✅ 集成DeepSeek模型
5. ✅ 测试和优化
6. 🔄 Apple风格UI重设计（中国红主题）

## 🚀 Quick Start | 快速开始

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- SiliconFlow API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wangdanping2025-creator/ai-code.git
   cd ai-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your SiliconFlow API key
   SILICONFLOW_API_KEY=your_api_key_here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Usage
1. 🔤 Enter your English name in the input field
2. ✨ Click the "Generate Names" button
3. ⏳ Wait for AI to create your Chinese names
4. 🎉 Explore three unique names with cultural meanings

## 🛠 Tech Stack | 技术栈

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **AI Model** | DeepSeek-R1 (via SiliconFlow API) |
| **Design** | Apple-inspired UI with Chinese elements |
| **Deployment** | Any Node.js compatible platform |

## 🎨 Design Philosophy | 设计理念

This project combines the best of both worlds:
- 🍎 **Apple's Design Language**: Clean, minimalist, and user-friendly
- 🇨🇳 **Chinese Cultural Elements**: Traditional colors, symbols, and meanings
- 🎊 **Festive Atmosphere**: Special National Day celebration theme

## 📝 API Reference

### Generate Chinese Names
```http
POST /api/generate-name
Content-Type: application/json

{
  "englishName": "John"
}
```

### Response
```json
{
  "success": true,
  "names": [
    {
      "chineseName": "强安",
      "pinyin": "qiáng ān",
      "chineseMeaning": "强大平安，寓意力量与安宁",
      "englishMeaning": "Strong and peaceful, symbolizing strength and tranquility"
    }
  ]
}
```

## 🤝 Contributing | 贡献

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License | 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments | 致谢

- DeepSeek AI for providing the powerful language model
- SiliconFlow for the API infrastructure
- The Chinese cultural heritage that inspires meaningful names
- Apple for the design inspiration

---

<div align="center">

**🎊 Happy 75th National Day of China! 🇨🇳**

*Made with ❤️ for cultural bridge-building*

</div>
