# 🚀 生产环境部署配置指南

## 📋 环境变量配置

### 本地开发环境 (.env)

```env
# Google AI API Key
GOOGLE_GENAI_API_KEY=AIzaSyBRQE_kXp6zZyfSfHPzg3o7zqkSqlwnINY

# Webhook Configuration (如果使用 Webhook)
WEBHOOK_SECRET_TOKEN=wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
BASE_URL=http://localhost:8080

# Firebase Configuration
FIREBASE_PROJECT_ID=studio-4395392521-1abeb
```

### 生产环境 (.env.production)

```env
# Google AI API Key
GOOGLE_GENAI_API_KEY=AIzaSyBRQE_kXp6zZyfSfHPzg3o7zqkSqlwnINY

# Webhook Configuration (如果使用 Webhook)
WEBHOOK_SECRET_TOKEN=wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
BASE_URL=https://zodiac.laraks.com

# Firebase Configuration
FIREBASE_PROJECT_ID=studio-4395392521-1abeb

# Node Environment
NODE_ENV=production
PORT=8080
```

---

## 🔧 需要修改的配置

### 1. BASE_URL 影响的功能

#### ✅ 当前使用 Firebase REST API
**影响：** 无
**原因：** 不通过服务器创建文章，直接用 Firebase API

#### ⚠️ 如果将来使用 Webhook
**影响：** 有
**需要修改：** 
```env
# 生产环境
BASE_URL=https://zodiac.laraks.com
```

### 2. Firebase 配置

**不需要修改** - Firebase 配置在客户端（`public/app.js`）：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU",
  authDomain: "studio-4395392521-1abeb.firebaseapp.com",
  projectId: "studio-4395392521-1abeb",
  // ...
};
```

这些配置在本地和生产环境都一样。

### 3. N8N 配置

#### Firebase REST API URL
**不需要修改** - URL 始终相同：
```
https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles
```

#### 如果使用 Webhook（将来）
**需要修改：**
```
本地: http://localhost:8080/api/webhook/articles/create
生产: https://zodiac.laraks.com/api/webhook/articles/create
```

---

## 🌐 域名相关配置

### 1. Webhook 域名白名单

在 `server/routes/webhook.mjs` 中：

```javascript
const allowedDomains = [
    'laraks.com',
    'www.laraks.com',
    /.*\.laraks\.com$/  // 允许所有子域名，包括 zodiac.laraks.com
];
```

**当前配置：** ✅ 已支持 `zodiac.laraks.com`

### 2. CORS 配置

在 `server.js` 中：

```javascript
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://zodiac.laraks.com',
    'https://laraks.com',
    'https://www.laraks.com'
  ],
  credentials: true
}));
```

**当前配置：** ⚠️ 使用默认 CORS（允许所有来源）

**建议：** 生产环境限制来源

---

## 📦 部署步骤

### 步骤 1: 准备生产环境配置

```bash
# 创建生产环境配置文件
cp .env .env.production

# 编辑生产环境配置
nano .env.production

# 修改 BASE_URL
BASE_URL=https://zodiac.laraks.com
```

### 步骤 2: 构建和部署

```bash
# 如果使用 Docker
docker build -t zodiac-app .
docker run -p 8080:8080 --env-file .env.production zodiac-app

# 如果直接部署
NODE_ENV=production npm start
```

### 步骤 3: 验证配置

```bash
# 检查服务器是否运行
curl https://zodiac.laraks.com/

# 检查 API（如果使用）
curl https://zodiac.laraks.com/api/zodiac/today

# 检查 Webhook（如果使用）
curl https://zodiac.laraks.com/api/webhook/health
```

---

## 🔒 安全配置

### 1. 环境变量保护

**不要：**
- ❌ 将 `.env` 提交到 Git
- ❌ 在代码中硬编码敏感信息

**应该：**
- ✅ 使用 `.gitignore` 排除 `.env`
- ✅ 在服务器上设置环境变量
- ✅ 使用密钥管理服务

### 2. API Key 保护

**生产环境建议：**
- 使用 Firebase App Check
- 限制 API Key 的使用域名
- 启用 Firestore 安全规则

### 3. HTTPS 配置

**必须：**
- ✅ 使用 HTTPS（`https://zodiac.laraks.com`）
- ✅ 配置 SSL 证书
- ✅ 强制 HTTPS 重定向

---

## 📊 配置对比表

| 配置项 | 本地开发 | 生产环境 | 是否需要修改 |
|--------|---------|---------|------------|
| BASE_URL | `http://localhost:8080` | `https://zodiac.laraks.com` | ⚠️ 如果使用 Webhook |
| Firebase Config | 相同 | 相同 | ❌ 不需要 |
| Firebase REST API | 相同 | 相同 | ❌ 不需要 |
| Webhook Token | 相同 | 建议重新生成 | ⚠️ 建议 |
| CORS Origin | `*` | 限制域名 | ✅ 建议 |
| NODE_ENV | `development` | `production` | ✅ 需要 |

---

## 🎯 当前项目的实际影响

### 使用 Firebase REST API 方案

**需要修改的：**
- ❌ 无（Firebase API URL 不变）

**不需要修改的：**
- ✅ BASE_URL（不使用）
- ✅ Firebase 配置（客户端配置）
- ✅ N8N 工作流（API URL 相同）

### 如果将来使用 Webhook

**需要修改的：**
- ✅ BASE_URL → `https://zodiac.laraks.com`
- ✅ N8N Webhook URL → `https://zodiac.laraks.com/api/webhook/articles/create`
- ✅ 重新生成 WEBHOOK_SECRET_TOKEN（安全考虑）

---

## ✅ 部署前检查清单

### 环境变量
- [ ] BASE_URL 设置为生产域名（如果使用 Webhook）
- [ ] NODE_ENV 设置为 production
- [ ] 所有敏感信息使用环境变量

### 安全配置
- [ ] HTTPS 已配置
- [ ] CORS 限制已设置
- [ ] Firestore 安全规则已配置
- [ ] API Key 使用限制已设置

### 功能测试
- [ ] 网站首页可访问
- [ ] 文章列表正常显示
- [ ] 文章详情正常显示
- [ ] 用户登录功能正常
- [ ] Firebase 数据读写正常

### N8N 配置（如果使用）
- [ ] Firebase REST API URL 正确
- [ ] API Key 正确
- [ ] 工作流测试通过

---

## 📝 快速修改命令

### 更新生产环境 BASE_URL

```bash
# 方法 1: 直接编辑
echo "BASE_URL=https://zodiac.laraks.com" >> .env.production

# 方法 2: 使用 sed 替换
sed -i '' 's|BASE_URL=http://localhost:8080|BASE_URL=https://zodiac.laraks.com|' .env.production

# 方法 3: 在服务器上设置环境变量
export BASE_URL=https://zodiac.laraks.com
```

---

## 🆘 常见问题

### Q: 部署后文章 URL 还是 localhost 怎么办？

**A:** 检查：
1. 环境变量是否正确加载
2. 服务器是否重启
3. 是否使用了正确的 .env 文件

### Q: Firebase REST API 在生产环境不工作？

**A:** 检查：
1. Firestore 安全规则
2. API Key 域名限制
3. 网络防火墙设置

### Q: CORS 错误？

**A:** 更新 server.js 中的 CORS 配置，添加生产域名。

---

## 🎉 总结

### 当前使用 Firebase REST API

**部署时需要修改：**
- ❌ 无（BASE_URL 不影响）

**建议修改：**
- ✅ 添加 CORS 限制
- ✅ 设置 NODE_ENV=production

### 将来如果使用 Webhook

**必须修改：**
- ✅ BASE_URL → `https://zodiac.laraks.com`
- ✅ N8N Webhook URL

**您的项目已经配置好了域名白名单，支持 `*.laraks.com`！** ✅
