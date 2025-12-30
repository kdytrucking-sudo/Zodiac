# 🔑 Webhook Token 配置指南

## 您的 Token 信息

### Token 值
```
wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
```

⚠️ **重要：请妥善保管此 Token，不要分享给他人！**

---

## 📍 Token 在哪里？

### 1. 服务器端（已配置）

Token 已保存在 `.env` 文件中：

```env
WEBHOOK_SECRET_TOKEN=wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
BASE_URL=http://localhost:8080
```

**位置：** `/Users/keyneszhang/Project/zodiac/Zodiac/.env`

### 2. 客户端使用（N8N 或其他工具）

在发送请求时，需要在 HTTP Header 中包含此 Token：

```http
Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
```

---

## 🔧 如何使用 Token

### 方法 1: 使用 curl

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "测试文章",
    "content": "这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试", "文章"]
  }'
```

### 方法 2: 使用 Postman

1. **打开 Postman**
2. **创建新请求**
   - Method: `POST`
   - URL: `http://localhost:8080/api/webhook/articles/create`

3. **设置 Headers**
   - 点击 "Headers" 标签
   - 添加两个 header：
     ```
     Key: Content-Type
     Value: application/json
     
     Key: Authorization
     Value: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
     ```

4. **设置 Body**
   - 点击 "Body" 标签
   - 选择 "raw"
   - 选择 "JSON"
   - 粘贴 JSON 数据

### 方法 3: 使用 N8N

在 N8N 的 HTTP Request Node 中：

**Headers 配置：**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6"
}
```

或者使用 N8N 的 Credentials 功能：
1. 创建新的 "Header Auth" credential
2. Name: `Webhook-Token`
3. Value: `Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`

---

## 🧪 测试 Token

### 快速测试

运行以下命令测试 Token 是否工作：

```bash
# 测试健康检查（不需要 Token）
curl http://localhost:8080/api/webhook/health

# 测试创建文章（需要 Token）
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "Token 测试文章",
    "content": "这是用来测试 Token 是否正常工作的文章。这是用来测试 Token 是否正常工作的文章。这是用来测试 Token 是否正常工作的文章。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Token Test",
    "keywords": ["测试"]
  }'
```

### 预期结果

**成功响应：**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "articleId": "article_...",
    "title": "Token 测试文章",
    ...
  }
}
```

**Token 错误响应：**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authorization token"
}
```

---

## 🔄 更换 Token

如果需要更换 Token（比如 Token 泄露了）：

### 1. 生成新 Token
```bash
node -e "console.log('wh_' + require('crypto').randomUUID())"
```

### 2. 更新 .env 文件
```bash
# 编辑 .env 文件
nano .env

# 或直接替换
sed -i '' 's/WEBHOOK_SECRET_TOKEN=.*/WEBHOOK_SECRET_TOKEN=新的token/' .env
```

### 3. 重启服务器
```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm start
```

### 4. 更新所有使用此 Token 的地方
- N8N 工作流
- Postman 集合
- 其他脚本

---

## 📝 Token 格式说明

### Token 结构
```
wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
│  │
│  └─ UUID (唯一标识符)
└─ 前缀 (表示这是 webhook token)
```

### 为什么使用这种格式？
- `wh_` 前缀：便于识别这是 webhook token
- UUID：保证唯一性和随机性
- 长度：36 个字符（不包括前缀），足够安全

---

## 🔐 安全最佳实践

### ✅ 应该做的
- ✅ 将 Token 保存在 `.env` 文件中
- ✅ 将 `.env` 添加到 `.gitignore`
- ✅ 定期更换 Token
- ✅ 只在 HTTPS 连接中使用（生产环境）

### ❌ 不应该做的
- ❌ 不要将 Token 硬编码在代码中
- ❌ 不要将 Token 提交到 Git
- ❌ 不要在公开的地方分享 Token
- ❌ 不要在 URL 参数中传递 Token

---

## 🆘 常见问题

### Q: Token 在哪里设置？
**A:** Token 已经设置在 `.env` 文件中，路径是：
```
/Users/keyneszhang/Project/zodiac/Zodiac/.env
```

### Q: 如何在请求中使用 Token？
**A:** 在 HTTP Header 中添加：
```
Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6
```

### Q: Token 错误怎么办？
**A:** 检查：
1. Token 是否正确复制（包括 `wh_` 前缀）
2. Header 格式是否正确（`Bearer ` 后面有空格）
3. 服务器是否已重启（读取新的 .env）

### Q: 忘记 Token 了怎么办？
**A:** 查看 `.env` 文件：
```bash
cat .env | grep WEBHOOK_SECRET_TOKEN
```

### Q: Token 可以分享给别人吗？
**A:** ❌ 不可以！Token 就像密码，只有授权的系统才能使用。

---

## 📋 快速参考

### 您的配置信息

| 项目 | 值 |
|------|-----|
| Token | `wh_3ec5ecbb-199e-436f-ab02-aad323e822f6` |
| API 端点 | `http://localhost:8080/api/webhook/articles/create` |
| Header 格式 | `Authorization: Bearer TOKEN` |
| .env 文件位置 | `/Users/keyneszhang/Project/zodiac/Zodiac/.env` |

### 测试命令（复制即用）

```bash
# 健康检查
curl http://localhost:8080/api/webhook/health

# 创建文章
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "测试文章",
    "content": "测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容测试内容",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试"]
  }'
```

---

**Token 已配置完成！您现在可以使用 Webhook API 了。** 🎉
