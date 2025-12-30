# Webhook API 实现完成

## ✅ 已完成的功能

### 1. 核心功能
- ✅ POST /api/webhook/articles/create - 创建文章
- ✅ GET /api/webhook/health - 健康检查

### 2. 安全认证（双重验证）
- ✅ **Bearer Token 认证** - 防止未授权访问
- ✅ **域名白名单** - 只允许 `*.laraks.com` 域名
  - `laraks.com`
  - `www.laraks.com`
  - `subdomain.laraks.com`
  - 本地开发允许 `localhost`

### 3. 数据验证
- ✅ 必填字段验证
- ✅ 字段类型验证
- ✅ 字段长度限制
- ✅ 枚举值验证（category, zodiacSign）

### 4. 错误处理
- ✅ 401 Unauthorized - Token 无效
- ✅ 403 Forbidden - 域名不允许
- ✅ 400 Bad Request - 数据验证失败
- ✅ 500 Internal Server Error - 服务器错误

## 📁 文件结构

```
server/
├── middleware/
│   └── auth.js                    # Token + 域名验证
├── validators/
│   └── articleValidator.js        # 数据验证
├── controllers/
│   └── articleController.js       # 文章创建逻辑
└── routes/
    └── webhook.js                 # Webhook 路由

根目录/
├── .env.webhook.example           # 环境变量示例
├── WEBHOOK_API_DOCS.md            # API 文档
├── test-webhook.sh                # 测试脚本
└── server.js                      # 已集成 webhook 路由
```

## 🔧 配置步骤

### 1. 设置环境变量

在 `.env` 文件中添加：

```env
WEBHOOK_SECRET_TOKEN=wh_your_secret_token_here
BASE_URL=http://localhost:8080
```

### 2. 生成安全Token

```bash
node -e "console.log('wh_' + require('crypto').randomUUID())"
```

### 3. 启动服务器

```bash
npm start
```

## 🧪 测试

### 方法 1: 使用测试脚本

```bash
# 1. 编辑 test-webhook.sh，设置正确的 TOKEN
# 2. 运行测试
./test-webhook.sh
```

### 方法 2: 使用 curl

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "测试文章",
    "content": "这是测试内容，需要至少100个字符。这是测试内容，需要至少100个字符。这是测试内容，需要至少100个字符。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试"]
  }'
```

## 📊 API 端点

### POST /api/webhook/articles/create

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_TOKEN
```

**Body:**
```json
{
  "title": "文章标题",
  "content": "文章内容（最少100字符）",
  "category": "fortune|culture|compatibility|lifestyle",
  "zodiacSign": "rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig",
  "source": "来源",
  "keywords": ["关键词1", "关键词2"],
  "metadata": {
    "author": "作者",
    "workflowId": "工作流ID"
  }
}
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "articleId": "article_1705123456789_abc123",
    "title": "文章标题",
    "category": "fortune",
    "zodiacSign": "dragon",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "url": "http://localhost:8080/article-detail.html?id=article_1705123456789_abc123"
  }
}
```

## 🔐 安全特性

### 1. Bearer Token 认证
```javascript
// 验证 Authorization header
Authorization: Bearer YOUR_SECRET_TOKEN
```

### 2. 域名白名单
```javascript
// 允许的域名
- laraks.com
- www.laraks.com
- *.laraks.com (所有子域名)
- localhost (开发环境)
```

### 3. 请求验证流程
```
请求 → Token验证 → 域名验证 → 数据验证 → 创建文章 → 返回结果
```

## 🔄 N8N 集成

### HTTP Request Node 配置

**Method:** POST

**URL:** `http://localhost:8080/api/webhook/articles/create`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SECRET_TOKEN"
}
```

**Body:**
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
    "workflowId": "{{ $workflow.id }}"
  }
}
```

## 🚀 未来功能（已预留）

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

## 📝 使用示例

### 示例 1: 创建运势文章

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "2025年龙年运势详解",
    "content": "龙年是一个充满机遇的年份...",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "AI Generator",
    "keywords": ["龙年", "运势", "2025"]
  }'
```

### 示例 2: 创建文化文章

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "十二生肖的起源与传说",
    "content": "十二生肖是中国传统文化的重要组成部分...",
    "category": "culture",
    "zodiacSign": "rat",
    "source": "Cultural Research",
    "keywords": ["生肖", "文化", "传说"]
  }'
```

## 🐛 故障排除

### 问题 1: Webhook routes failed to load

**原因:** CommonJS 和 ES Module 兼容性问题

**解决:** 
- 检查 server.js 中的动态导入
- 确保所有 webhook 模块使用 CommonJS (module.exports)

### 问题 2: 403 Forbidden from localhost

**原因:** 域名验证逻辑问题

**解决:**
- 检查 auth.js 中的 localhost 判断
- 确保 req.headers.host 包含 localhost

### 问题 3: Firebase Admin not initialized

**原因:** Firebase Admin SDK 未配置

**解决:**
- 确保 Firebase Admin SDK 已在 server.js 中初始化
- 检查 GOOGLE_APPLICATION_CREDENTIALS 环境变量

## ✅ 验收清单

- [ ] 服务器启动成功
- [ ] Webhook routes 加载成功
- [ ] 健康检查端点正常
- [ ] Token 认证工作正常
- [ ] 域名验证工作正常
- [ ] 数据验证工作正常
- [ ] 文章创建成功
- [ ] 错误处理正确
- [ ] 测试脚本运行成功

## 📚 相关文档

- [WEBHOOK_API_DOCS.md](./WEBHOOK_API_DOCS.md) - 完整 API 文档
- [.env.webhook.example](./.env.webhook.example) - 环境变量示例
- [test-webhook.sh](./test-webhook.sh) - 测试脚本

---

**Webhook API 已完成并可以使用！** 🎉

**下一步:**
1. 配置环境变量
2. 生成安全Token
3. 运行测试
4. 集成到 N8N 工作流
