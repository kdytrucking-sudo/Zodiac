# 🚀 本地测试启动指南

本指南将帮助你在本地环境中启动和测试 Zodiac 项目。

## 📋 前置要求

- **Node.js**: v18 或更高版本
- **npm**: 通常随 Node.js 一起安装
- **浏览器**: Chrome、Firefox、Safari 或 Edge

## 🔧 环境配置

### 1. 检查环境变量

项目根目录应该有一个 `.env` 文件。如果没有，请从示例文件复制：

```bash
cp .env.webhook.example .env
```

确保 `.env` 文件包含以下配置：

```env
# Google AI API Key (必需 - 用于 Genkit AI 功能)
GOOGLE_GENAI_API_KEY=your_api_key_here

# Webhook Secret Token (可选 - 用于 webhook 安全)
WEBHOOK_SECRET_TOKEN=wh_your_secret_token_here_change_this_12345

# Base URL (本地测试使用)
BASE_URL=http://localhost:8080
```

> ⚠️ **重要**: 如果你需要使用 AI 功能，请确保 `GOOGLE_GENAI_API_KEY` 已正确配置。

## 🚀 启动步骤

### 第一次启动

如果这是你第一次运行项目，或者遇到依赖问题，请执行以下步骤：

#### 1. 清理并安装依赖

```bash
# 删除旧的依赖和锁文件
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

这个过程可能需要 1-2 分钟。

#### 2. 启动服务器

```bash
npm start
```

你应该会看到类似以下的输出：

```
> zodiac@1.0.0 start
> node server.js

KEY CHECK (runtime): true / prefix: AIzaSyBR / suffix: nINY
✅ Webhook routes loaded
Zodiac backend listening on port 8080
```

### 日常启动

如果依赖已经安装好，只需运行：

```bash
npm start
```

## 🌐 访问应用

服务器启动后，在浏览器中访问：

```
http://localhost:8080
```

### 可用页面和功能

- **首页**: `http://localhost:8080/` - 十二生肖卡片展示
- **归档**: 点击导航栏的 "Archive"
- **查询**: 点击导航栏的 "Query" - 生肖查询功能
- **运势**: 点击导航栏的 "Fortune" - 运势预测
- **匹配**: `http://localhost:8080/matching.html` - 生肖配对功能
- **文章**: 点击导航栏的 "Article" - 文章列表
- **论坛**: 点击导航栏的 "Forum" - 社区论坛

### 管理面板

- **匹配数据管理**: `http://localhost:8080/admin-matching.html` - 管理生肖配对数据和性别修正系数

## 🧪 测试 API 端点

项目提供了多个 API 端点，你可以使用工具（如 Postman、curl 或浏览器）进行测试：

### 1. 测试基础 API

```bash
curl http://localhost:8080/api/zodiac/today
```

预期响应：
```json
{
  "sign": "dragon",
  "date": "2025-12-28",
  "luck": "high",
  "message": "Today is a good day to build your Zodiac AI backend 🐉"
}
```

### 2. 测试 Genkit AI

```bash
curl -X POST http://localhost:8080/api/genkit/zodiac \
  -H "Content-Type: application/json" \
  -d '{"sign": "dragon"}'
```

### 3. 测试自定义 AI 生成

```bash
curl -X POST http://localhost:8080/api/genkit/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Tell me about the Dragon zodiac sign",
    "temperature": 0.7,
    "maxTokens": 200
  }'
```

### 4. 使用测试脚本

项目包含了预制的测试脚本：

```bash
# 测试性别修正功能
./test-gender-modifiers.sh

# 测试 Webhook
./test-webhook.sh

# 测试 Firebase API
./test-firebase-api.sh
```

## 🔍 常见问题

### 问题 1: 端口 8080 已被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::8080`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :8080

# 终止该进程（替换 <PID> 为实际进程 ID）
kill -9 <PID>

# 或者修改端口
PORT=3000 npm start
```

### 问题 2: 模块找不到错误

**错误信息**: `Error: Cannot find module ...`

**解决方案**:
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: Firebase 连接错误

**解决方案**: 
- 检查 `.env` 文件中的 Firebase 配置
- 确保 Firebase 项目已正确设置
- 查看 `public/firebase-config.js` 确认配置正确

### 问题 4: AI 功能不工作

**解决方案**:
- 确认 `.env` 中的 `GOOGLE_GENAI_API_KEY` 已设置
- 检查 API key 是否有效
- 查看服务器启动日志中的 "KEY CHECK" 信息

## 📊 项目结构

```
Zodiac/
├── server.js              # Express 服务器主文件
├── package.json           # 项目依赖配置
├── .env                   # 环境变量（不提交到 Git）
├── public/                # 前端静态文件
│   ├── index.html        # 首页
│   ├── matching.html     # 配对页面
│   ├── admin-matching.html # 管理面板
│   ├── matching.js       # 配对逻辑
│   └── ...               # 其他前端文件
├── server/                # 后端路由和逻辑
│   └── routes/           # API 路由
└── scripts/              # 工具脚本
```

## 🛠️ 开发工具

### 实时日志监控

服务器运行时，你会在终端看到实时日志：
- API 请求日志
- 错误信息
- Webhook 事件

### 浏览器开发者工具

按 `F12` 或 `Cmd+Option+I` (Mac) 打开浏览器开发者工具：
- **Console**: 查看 JavaScript 错误和日志
- **Network**: 监控 API 请求和响应
- **Application**: 查看 localStorage 和 Firebase 数据

## 🔄 停止服务器

在运行 `npm start` 的终端中按 `Ctrl+C` 即可停止服务器。

## 📝 下一步

- 查看 `MATCHING_FEATURE_COMPLETE.md` 了解配对功能
- 查看 `GENDER_MODIFIERS_COMPLETE.md` 了解性别修正功能
- 查看 `DATABASE_SETUP_GUIDE.md` 了解数据库配置
- 查看 `DEPLOYMENT_CONFIG_GUIDE.md` 了解部署流程

## 💡 提示

- 修改前端代码后，只需刷新浏览器即可看到更改
- 修改后端代码后，需要重启服务器（`Ctrl+C` 然后 `npm start`）
- 使用 `nodemon` 可以实现后端代码自动重载：
  ```bash
  npm install -g nodemon
  nodemon server.js
  ```

---

**祝测试愉快！** 🎉

如有问题，请查看项目中的其他文档或联系开发团队。
