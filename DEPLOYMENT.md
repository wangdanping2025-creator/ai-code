# 🚀 Deployment Guide | 部署指南

This guide will help you deploy the Chinese Name Generator to various platforms.

## 🌟 Recommended: Vercel Deployment

Vercel is the easiest and most reliable way to deploy this application.

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   After deployment, go to your Vercel dashboard and add:
   ```
   SILICONFLOW_API_KEY=your_api_key_here
   DEEPSEEK_MODEL=deepseek-ai/DeepSeek-R1
   NODE_ENV=production
   ```

### Method 2: Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import from GitHub**
   - Connect your GitHub account
   - Select the repository: `wangdanping2025-creator/ai-code`

4. **Configure Project**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

5. **Add Environment Variables**
   ```
   SILICONFLOW_API_KEY=your_api_key_here
   DEEPSEEK_MODEL=deepseek-ai/DeepSeek-R1
   NODE_ENV=production
   ```

6. **Deploy**
   Click "Deploy" and wait for the build to complete.

## 🔧 Alternative Deployment Options

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   netlify deploy --prod
   ```

### Railway

1. **Connect GitHub Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub account
   - Select the repository

2. **Add Environment Variables**
   ```
   SILICONFLOW_API_KEY=your_api_key_here
   DEEPSEEK_MODEL=deepseek-ai/DeepSeek-R1
   NODE_ENV=production
   PORT=3000
   ```

### Heroku

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku create chinese-name-generator-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SILICONFLOW_API_KEY=your_api_key_here
   heroku config:set DEEPSEEK_MODEL=deepseek-ai/DeepSeek-R1
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔐 Environment Variables Setup

Make sure to set these environment variables in your deployment platform:

| Variable | Value | Description |
|----------|-------|-------------|
| `SILICONFLOW_API_KEY` | Your API key | Required for AI name generation |
| `DEEPSEEK_MODEL` | `deepseek-ai/DeepSeek-R1` | AI model to use |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Server port (auto-set by most platforms) |

## 🌐 Custom Domain (Optional)

### Vercel Custom Domain

1. Go to your project dashboard on Vercel
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### SSL Certificate

Most platforms (Vercel, Netlify, Railway) provide automatic SSL certificates.

## 🔍 Post-Deployment Checklist

- [ ] ✅ Website loads correctly
- [ ] 🔤 Name input field works
- [ ] 🤖 AI generation functions properly
- [ ] 📱 Mobile responsiveness
- [ ] 🎊 National Day animations display
- [ ] 🔒 HTTPS enabled
- [ ] 🌐 Custom domain configured (if applicable)

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correctly set in environment variables
   - Check if the key has sufficient credits

2. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

3. **Static Files Not Loading**
   - Verify vercel.json routing configuration
   - Check file paths are correct

### Getting Help

- Check deployment logs in your platform dashboard
- Verify environment variables are set correctly
- Test locally first with `npm start`

## 🎉 Success!

Once deployed, your Chinese Name Generator will be live and accessible to users worldwide! 

Share your deployment URL and let people discover their beautiful Chinese names! 🇨🇳✨

---

**Happy National Day! 🎊 祝您部署成功！**
