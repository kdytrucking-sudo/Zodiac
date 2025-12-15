# Webhook API 使用文档

## 🚀 快速开始

### 1. 配置环境变量

复制 `.env.webhook.example` 到 `.env` 并配置：

```bash
WEBHOOK_SECRET_TOKEN=your_secret_token_here
BASE_URL=http://localhost:8080
```

### 2. 生成安全Token

```bash
# 使用 Node.js 生成随机 token
node -e "console.log('wh_' + require('crypto').randomUUID())"
```

### 3. 启动服务器

```bash
npm start
```

服务器会在 `http://localhost:8080` 启动，Webhook API 在 `/api/webhook`

---

## 📡 API 端点

### 创建文章

**端点：** `POST /api/webhook/articles/create`

**认证：**
- Bearer Token (必需)
- Origin 必须是 `*.laraks.com` 域名

**Headers：**
```http
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_TOKEN
```

**请求Body：**
```json
{
  "title": "2025年龙年运势详解",
  "content": "龙年是一个充满机遇的年份...\n\n（支持换行符）",
  "category": "fortune",
  "zodiacSign": "dragon",
  "source": "AI Generator",
  "keywords": ["龙年", "运势", "2025"],
  "metadata": {
    "author": "N8N Workflow",
    "workflowId": "workflow_123"
  }
}
```

**字段说明：**

| 字段 | 类型 | 必需 | 说明 | 限制 |
|------|------|------|------|------|
| title | string | ✅ | 文章标题 | 1-200 字符 |
| content | string | ✅ | 文章内容 | 最少 100 字符 |
| category | string | ✅ | 分类 | fortune/culture/compatibility/lifestyle |
| zodiacSign | string | ✅ | 生肖 | rat/ox/tiger/rabbit/dragon/snake/horse/goat/monkey/rooster/dog/pig |
| source | string | ✅ | 来源 | 1-100 字符 |
| keywords | array | ❌ | 关键词 | 最多 10 个 |
| metadata | object | ❌ | 元数据 | 任意键值对 |

**成功响应 (200)：**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "articleId": "article_1705123456789_abc123",
    "title": "2025年龙年运势详解",
    "category": "fortune",
    "zodiacSign": "dragon",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "url": "http://localhost:8080/article-detail.html?id=article_1705123456789_abc123"
  }
}
```

**错误响应：**

**401 Unauthorized - Token 无效**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authorization token"
}
```

**403 Forbidden - 域名不允许**
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Origin domain not allowed. Only *.laraks.com domains are permitted."
}
```

**400 Bad Request - 数据验证失败**
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "title": "Title must be between 1 and 200 characters",
    "content": "Content must be at least 100 characters"
  }
}
```

---

## 🧪 测试方法

### 使用 curl

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \
  -d '{
    "title": "测试文章标题",
    "content": "这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试", "文章"]
  }'
```

### 使用 Postman

1. **Method**: POST
2. **URL**: `http://localhost:8080/api/webhook/articles/create`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_SECRET_TOKEN`
4. **Body** (raw JSON):
   ```json
   {
     "title": "测试文章",
     "content": "文章内容...",
     "category": "fortune",
     "zodiacSign": "dragon",
     "source": "Postman Test",
     "keywords": ["测试"]
   }
   ```

### 健康检查

```bash
curl http://localhost:8080/api/webhook/health
```

响应：
```json
{
  "success": true,
  "message": "Webhook API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 安全特性

### 1. Bearer Token 认证
- 所有请求必须包含有效的 Bearer Token
- Token 存储在环境变量中
- 建议使用长随机字符串

### 2. 域名白名单
- 只允许来自 `*.laraks.com` 的请求
- 包括：
  - `laraks.com`
  - `www.laraks.com`
  - `subdomain.laraks.com`
- 本地开发时允许 `localhost`

### 3. 数据验证
- 所有字段都经过严格验证
- 防止 SQL 注入和 XSS 攻击
- 字段长度限制

---

## 🔄 N8N 工作流配置

### HTTP Request Node 配置

**Method**: POST

**URL**: `http://localhost:8080/api/webhook/articles/create`

**Authentication**: None (使用 Headers)

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SECRET_TOKEN"
}
```

**Body**:
```json
{
  "title": "{{ $json.title }}",
  "content": "{{ $json.content }}",
  "category": "{{ $json.category }}",
  "zodiacSign": "{{ $json.zodiacSign }}",
  "source": "N8N AI Generator",
  "keywords": {{ $json.keywords }},
  "metadata": {
    "generatedBy": "n8n",
    "workflowId": "{{ $workflow.id }}",
    "executionId": "{{ $execution.id }}"
  }
}
```

### 工作流示例

```
1. Schedule Trigger (每天 9:00)
   ↓
2. ChatGPT Node
   Prompt: "写一篇关于{{ zodiacSign }}的运势文章"
   ↓
3. Function Node
   格式化输出为 JSON
   ↓
4. HTTP Request Node
   调用 Webhook API
   ↓
5. IF Node
   检查是否成功
   ↓
6a. 成功 → 发送通知
6b. 失败 → 记录错误
```

---

## 📊 未来功能（已预留）

### 更新文章
```
PUT /api/webhook/articles/:id
```

### 删除文章
```
DELETE /api/webhook/articles/:id
```

### 批量创建
```
POST /api/webhook/articles/batch-create
```

---

## 🐛 故障排除

### 问题 1: 401 Unauthorized

**原因**: Token 无效或缺失

**解决**:
- 检查 `.env` 文件中的 `WEBHOOK_SECRET_TOKEN`
- 确保 Header 格式正确: `Authorization: Bearer TOKEN`

### 问题 2: 403 Forbidden

**原因**: 域名不在白名单中

**解决**:
- 确保请求来自 `*.laraks.com` 域名
- 本地测试时确保使用 `localhost`
- 检查 `Origin` 或 `Referer` header

### 问题 3: 400 Validation Error

**原因**: 数据格式不正确

**解决**:
- 检查所有必填字段
- 确保字段类型正确
- 查看错误详情中的具体问题

### 问题 4: 500 Internal Server Error

**原因**: 服务器错误

**解决**:
- 检查服务器日志
- 确保 Firebase Admin SDK 已正确配置
- 检查 Firestore 连接

---

## 📝 日志

服务器会记录以下信息：

```
✅ Webhook request authenticated from: subdomain.laraks.com
✅ Article created: article_123 - 文章标题
❌ Webhook request rejected from: unauthorized-domain.com
```

---

## 🔗 相关文档

- [N8N Documentation](https://docs.n8n.io/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Webhook API 已就绪！** 🎉
