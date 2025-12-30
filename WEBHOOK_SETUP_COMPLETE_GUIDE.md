# 🔧 Webhook 配置完整指南

## 📋 配置 Firebase Admin SDK

### 步骤 1: 下载服务账号密钥

1. **访问 Firebase Console**
   ```
   https://console.firebase.google.com/
   ```

2. **选择项目**
   - Project: `studio-4395392521-1abeb`

3. **进入 Project Settings**
   - 点击左侧齿轮图标 ⚙️
   - 选择 "Project Settings"

4. **切换到 Service Accounts**
   - 点击 "Service Accounts" 标签

5. **生成新密钥**
   - 点击 "Generate New Private Key" 按钮
   - 确认下载
   - 保存 JSON 文件

### 步骤 2: 放置密钥文件

```bash
# 在项目根目录创建 config 文件夹
mkdir -p config

# 将下载的文件重命名并移动
# 假设下载的文件在 Downloads 文件夹
mv ~/Downloads/studio-4395392521-1abeb-*.json config/serviceAccountKey.json

# 确认文件存在
ls -la config/serviceAccountKey.json
```

### 步骤 3: 添加到 .gitignore

```bash
# 确保密钥文件不会被提交到 Git
echo "config/serviceAccountKey.json" >> .gitignore
```

### 步骤 4: 重启服务器

```bash
# 停止当前服务器
lsof -ti:8080 | xargs kill -9

# 重新启动
npm start
```

**应该看到：**
```
✅ Firebase Admin initialized with service account
✅ Webhook routes loaded
Zodiac backend listening on port 8080
```

---

## 🧪 测试 Webhook

### 使用 curl 测试

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "Webhook 测试文章",
    "content": "这是通过 Webhook API 创建的测试文章。这是通过 Webhook API 创建的测试文章。这是通过 Webhook API 创建的测试文章。这是通过 Webhook API 创建的测试文章。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Webhook Test",
    "keywords": ["测试", "webhook"]
  }'
```

**成功响应：**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "articleId": "article_...",
    "title": "Webhook 测试文章",
    "category": "fortune",
    "zodiacSign": "dragon",
    "createdAt": "2024-01-15T...",
    "url": "http://localhost:8080/article-detail.html?id=article_..."
  }
}
```

---

## 🌐 N8N 配置

### HTTP Request Node 设置

**Method:** `POST`

**URL:**
```
https://zodiac.laraks.com/api/webhook/articles/create
```

**Authentication:** `Header Auth`

**Header Name:** `Authorization`

**Header Value:** `Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`

**或者手动添加 Header：**

**Send Headers:** `ON`

**Header Parameters:**
- Name: `Authorization`
- Value: `Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`

**Send Body:** `ON`

**Body Content Type:** `JSON`

**Body:**
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "category": "fortune",
  "zodiacSign": "dragon",
  "source": "N8N AI Generator",
  "keywords": ["测试", "webhook"]
}
```

---

## 🔐 安全配置

### 1. 保护服务账号密钥

**不要：**
- ❌ 提交到 Git
- ❌ 分享给他人
- ❌ 放在公开的地方

**应该：**
- ✅ 添加到 `.gitignore`
- ✅ 设置文件权限：`chmod 600 config/serviceAccountKey.json`
- ✅ 定期轮换密钥

### 2. 环境变量（可选）

如果不想使用文件，可以使用环境变量：

```bash
# 将 JSON 内容转为单行
export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
```

然后在 server.js 中：
```javascript
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
```

---

## 📁 文件结构

```
Zodiac/
├── config/
│   └── serviceAccountKey.json  # Firebase 服务账号密钥（不提交到 Git）
├── server/
│   └── routes/
│       └── webhook.mjs
├── .env
├── .gitignore                  # 包含 config/serviceAccountKey.json
└── server.js
```

---

## ⚠️ 故障排除

### 问题 1: "Service account key not found"

**解决：**
```bash
# 检查文件是否存在
ls -la config/serviceAccountKey.json

# 检查文件内容
head config/serviceAccountKey.json
```

### 问题 2: "Permission denied"

**解决：**
```bash
# 设置正确的权限
chmod 600 config/serviceAccountKey.json
```

### 问题 3: "Invalid service account"

**解决：**
1. 重新下载服务账号密钥
2. 确认 JSON 格式正确
3. 确认项目 ID 匹配

### 问题 4: N8N 仍然 401 错误

**检查：**
1. Authorization header 格式：`Bearer TOKEN`（注意空格）
2. Token 值正确：`wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`
3. URL 正确：`https://zodiac.laraks.com/api/webhook/articles/create`
4. 服务器已重启

---

## 🎯 完整的 N8N 配置示例

### Node 1: Manual Trigger
- Type: Manual Trigger

### Node 2: Function (格式化数据)
```javascript
return {
  json: {
    title: "2025年龙年运势完整解析",
    content: "龙年是一个充满机遇和挑战的年份...",
    category: "fortune",
    zodiacSign: "dragon",
    source: "N8N AI Generator",
    keywords: ["龙年", "运势", "2025"]
  }
};
```

### Node 3: HTTP Request (创建文章)
- **Method:** POST
- **URL:** `https://zodiac.laraks.com/api/webhook/articles/create`
- **Authentication:** Header Auth
  - Header Name: `Authorization`
  - Header Value: `Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body:** `{{ JSON.stringify($json) }}`

---

## ✅ 验证清单

配置完成后，检查：

- [ ] 服务账号密钥已下载
- [ ] 密钥文件在 `config/serviceAccountKey.json`
- [ ] 密钥文件已添加到 `.gitignore`
- [ ] 服务器已重启
- [ ] 看到 "Firebase Admin initialized with service account"
- [ ] curl 测试成功
- [ ] N8N Authorization header 已配置
- [ ] N8N 测试成功

---

## 🚀 快速命令

```bash
# 1. 创建 config 目录
mkdir -p config

# 2. 移动密钥文件（修改路径）
mv ~/Downloads/studio-*.json config/serviceAccountKey.json

# 3. 添加到 gitignore
echo "config/serviceAccountKey.json" >> .gitignore

# 4. 重启服务器
lsof -ti:8080 | xargs kill -9 && npm start

# 5. 测试 Webhook
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{"title":"测试","content":"测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容","category":"fortune","zodiacSign":"dragon","source":"Test","keywords":["测试"]}'
```

---

**配置完成后，Webhook API 就可以正常工作了！** 🎉
