# N8N Webhook 接口设计方案

## 📋 需求分析

### 目标
创建一个 Webhook 接口，让 n8n 工作流可以：
1. 接收文章数据
2. 验证数据格式
3. 保存到 Firestore
4. 返回创建结果

### 使用场景
- n8n 工作流使用 AI（如 ChatGPT）生成文章内容
- 自动发布到网站
- 批量创建文章
- 定时发布文章

---

## 🏗️ 架构设计

### 方案选择

#### 方案 1: Firebase Cloud Functions (推荐)
**优点：**
- ✅ 与现有 Firebase 项目完美集成
- ✅ 自动扩展
- ✅ 内置身份验证
- ✅ 无需额外服务器
- ✅ HTTPS 自动配置

**缺点：**
- ⚠️ 需要 Firebase Blaze 计划（按使用付费）
- ⚠️ 冷启动可能稍慢

#### 方案 2: Express.js API (当前项目扩展)
**优点：**
- ✅ 与现有 Express 服务器集成
- ✅ 本地开发简单
- ✅ 完全控制

**缺点：**
- ⚠️ 需要部署到服务器
- ⚠️ 需要配置 HTTPS
- ⚠️ 需要手动扩展

**我推荐方案 2**，因为您已经有 Express 服务器在运行。

---

## 🔧 接口设计

### 1. 端点 (Endpoint)

```
POST /api/articles/create
```

### 2. 请求格式

#### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SECRET_TOKEN"
}
```

#### Body
```json
{
  "title": "文章标题",
  "content": "文章内容（支持换行符 \\n）",
  "category": "fortune|culture|compatibility|lifestyle",
  "zodiacSign": "rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig",
  "source": "来源名称",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "metadata": {
    "author": "AI Generator",
    "generatedBy": "n8n",
    "workflowId": "可选的工作流ID"
  }
}
```

### 3. 响应格式

#### 成功 (200 OK)
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "articleId": "article_123456",
    "title": "文章标题",
    "createdAt": "2024-01-15T10:30:00Z",
    "url": "https://yoursite.com/article-detail.html?id=article_123456"
  }
}
```

#### 失败 (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "title": "Title is required",
    "category": "Invalid category value"
  }
}
```

#### 未授权 (401 Unauthorized)
```json
{
  "success": false,
  "error": "Invalid or missing authorization token"
}
```

---

## 🔐 安全设计

### 1. API Token 认证

**生成方式：**
```javascript
// 使用环境变量存储
const API_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;

// 或使用 UUID
const token = "wh_" + crypto.randomUUID();
```

**验证方式：**
```javascript
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (token !== API_SECRET_TOKEN) {
        return res.status(401).json({
            success: false,
            error: "Invalid or missing authorization token"
        });
    }
    
    next();
}
```

### 2. 请求验证

**必填字段：**
- title (1-200 字符)
- content (最少 100 字符)
- category (枚举值)
- zodiacSign (枚举值)
- source (1-100 字符)

**可选字段：**
- keywords (数组，最多 10 个)
- metadata (对象)

### 3. 速率限制

```javascript
// 使用 express-rate-limit
const rateLimit = require('express-rate-limit');

const createArticleLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 10, // 最多 10 个请求
    message: "Too many requests, please try again later"
});
```

---

## 📝 实现步骤

### 步骤 1: 创建 API 路由
```
server/routes/webhook.js
```

### 步骤 2: 添加验证中间件
```javascript
- Token 验证
- 数据格式验证
- 速率限制
```

### 步骤 3: 实现文章创建逻辑
```javascript
- 验证数据
- 生成文章 ID
- 初始化统计字段
- 保存到 Firestore
- 返回结果
```

### 步骤 4: 添加日志记录
```javascript
- 记录所有请求
- 记录创建的文章
- 记录错误
```

### 步骤 5: 配置环境变量
```
.env 文件：
WEBHOOK_SECRET_TOKEN=your_secret_token_here
```

---

## 🔄 N8N 工作流示例

### 工作流步骤

```
1. Trigger (定时或手动)
   ↓
2. ChatGPT Node (生成文章)
   ↓
3. Function Node (格式化数据)
   ↓
4. HTTP Request Node (调用 Webhook)
   ↓
5. 成功/失败处理
```

### HTTP Request 配置

```json
{
  "method": "POST",
  "url": "http://localhost:8080/api/articles/create",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SECRET_TOKEN"
  },
  "body": {
    "title": "{{ $json.title }}",
    "content": "{{ $json.content }}",
    "category": "{{ $json.category }}",
    "zodiacSign": "{{ $json.zodiacSign }}",
    "source": "AI Generator",
    "keywords": "{{ $json.keywords }}",
    "metadata": {
      "generatedBy": "n8n",
      "workflowId": "{{ $workflow.id }}"
    }
  }
}
```

---

## 📊 数据流程图

```
N8N Workflow
    ↓
[生成文章内容]
    ↓
[格式化为 JSON]
    ↓
[POST /api/articles/create]
    ↓
Express Server
    ↓
[验证 Token] → 失败 → 401 Unauthorized
    ↓
[验证数据] → 失败 → 400 Bad Request
    ↓
[创建文章 ID]
    ↓
[保存到 Firestore]
    ↓
[返回成功响应]
    ↓
N8N 接收结果
    ↓
[可选：发送通知]
```

---

## 🎯 扩展功能建议

### 1. 批量创建
```
POST /api/articles/batch-create
Body: { articles: [...] }
```

### 2. 更新文章
```
PUT /api/articles/:id
```

### 3. 删除文章
```
DELETE /api/articles/:id
```

### 4. 查询文章状态
```
GET /api/articles/:id/status
```

### 5. Webhook 日志查询
```
GET /api/webhook/logs
```

---

## 🧪 测试方案

### 1. 使用 Postman 测试

**请求示例：**
```bash
curl -X POST http://localhost:8080/api/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "测试文章",
    "content": "这是一篇测试文章的内容...",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试", "文章"]
  }'
```

### 2. 单元测试

```javascript
describe('POST /api/articles/create', () => {
    it('should create article with valid data', async () => {
        // 测试代码
    });
    
    it('should reject invalid token', async () => {
        // 测试代码
    });
    
    it('should validate required fields', async () => {
        // 测试代码
    });
});
```

---

## 📁 文件结构

```
server/
├── routes/
│   └── webhook.js          # Webhook 路由
├── middleware/
│   ├── auth.js            # Token 验证
│   ├── validate.js        # 数据验证
│   └── rateLimit.js       # 速率限制
├── controllers/
│   └── articleController.js  # 文章创建逻辑
├── utils/
│   ├── logger.js          # 日志工具
│   └── idGenerator.js     # ID 生成器
└── validators/
    └── articleSchema.js   # 数据验证规则
```

---

## 🔒 环境变量配置

```env
# .env 文件
WEBHOOK_SECRET_TOKEN=wh_your_secret_token_here_12345
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
LOG_LEVEL=info
```

---

## 📈 监控和日志

### 日志内容
```javascript
{
  timestamp: "2024-01-15T10:30:00Z",
  method: "POST",
  endpoint: "/api/articles/create",
  ip: "192.168.1.1",
  userAgent: "n8n/1.0",
  requestBody: {...},
  responseStatus: 200,
  responseTime: "150ms",
  articleId: "article_123456"
}
```

### 监控指标
- 请求总数
- 成功率
- 平均响应时间
- 错误类型分布

---

## ✅ 总结

### 推荐方案
**使用 Express.js 扩展当前服务器**

### 核心特性
1. ✅ RESTful API 设计
2. ✅ Token 认证
3. ✅ 数据验证
4. ✅ 速率限制
5. ✅ 错误处理
6. ✅ 日志记录

### 优势
- 简单易实现
- 与现有项目集成
- 安全可靠
- 易于测试
- 易于扩展

---

**这个设计方案如何？您有什么想法或需要调整的地方吗？** 🤔
