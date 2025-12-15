# 🔧 Webhook 故障排除指南

## 问题：Cannot POST /api/webhook/articles/create

### 原因
路由没有正确加载到 Express 服务器。

### 解决方案

#### 1. 重启服务器（必须！）

```bash
# 在运行 npm start 的终端
# 按 Ctrl+C 停止服务器

# 然后重新启动
npm start
```

#### 2. 检查服务器启动日志

启动后应该看到：
```
✅ Webhook routes loaded
Zodiac backend listening on port 8080
```

如果没有看到 "✅ Webhook routes loaded"，说明路由加载失败。

#### 3. 测试健康检查端点

```bash
curl http://localhost:8080/api/webhook/health
```

应该返回：
```json
{
  "success": true,
  "message": "Webhook API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 4. 测试创建文章

```bash
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "测试文章",
    "content": "这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容这是测试内容",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test",
    "keywords": ["测试"]
  }'
```

---

## 常见错误及解决方法

### 错误 1: Cannot POST /api/webhook/articles/create

**原因：** 路由未加载

**解决：**
1. 确保重启了服务器
2. 检查 `server/routes/webhook.mjs` 文件存在
3. 查看服务器启动日志

### 错误 2: 401 Unauthorized

**原因：** Token 无效或缺失

**解决：**
1. 检查 Header: `Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6`
2. 确保 `.env` 文件中有 `WEBHOOK_SECRET_TOKEN`
3. Token 前面有 "Bearer " 且有空格

### 错误 3: 403 Forbidden

**原因：** 域名验证失败

**解决：**
1. 本地测试时确保使用 `localhost`
2. 检查请求的 `Host` header
3. 生产环境确保来自 `*.laraks.com`

### 错误 4: 400 Validation Error

**原因：** 数据格式不正确

**解决：**
1. 检查所有必填字段
2. 确保 content 至少 100 字符
3. 确保 category 和 zodiacSign 是有效值

### 错误 5: 500 Internal Server Error

**原因：** 服务器内部错误

**解决：**
1. 查看服务器日志
2. 确保 Firebase Admin SDK 已初始化
3. 检查 Firestore 连接

---

## 调试步骤

### 1. 检查服务器是否运行

```bash
curl http://localhost:8080/
```

应该返回首页 HTML。

### 2. 检查 Webhook 健康状态

```bash
curl http://localhost:8080/api/webhook/health
```

### 3. 查看服务器日志

在运行 `npm start` 的终端查看输出。

### 4. 测试不同的端点

```bash
# 测试根路径
curl http://localhost:8080/

# 测试 API
curl http://localhost:8080/api/zodiac/today

# 测试 Webhook 健康检查
curl http://localhost:8080/api/webhook/health

# 测试 Webhook 创建（需要 Token）
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -H "Content-Type: application/json" \
  -d '{"title":"test",...}'
```

---

## 验证清单

- [ ] 服务器已重启
- [ ] 看到 "✅ Webhook routes loaded" 消息
- [ ] `/api/webhook/health` 返回成功
- [ ] `.env` 文件包含 `WEBHOOK_SECRET_TOKEN`
- [ ] Token 格式正确（Bearer + 空格 + token）
- [ ] 请求 Body 是有效的 JSON
- [ ] 所有必填字段都存在

---

## 快速测试命令

### 完整的测试命令（复制即用）

```bash
# 1. 健康检查
echo "Testing health endpoint..."
curl http://localhost:8080/api/webhook/health
echo -e "\n"

# 2. 创建文章
echo "Testing create article..."
curl -X POST http://localhost:8080/api/webhook/articles/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wh_3ec5ecbb-199e-436f-ab02-aad323e822f6" \
  -d '{
    "title": "测试文章标题",
    "content": "这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。这是一篇测试文章的内容，需要至少100个字符。",
    "category": "fortune",
    "zodiacSign": "dragon",
    "source": "Test Script",
    "keywords": ["测试", "文章"]
  }'
echo -e "\n"
```

---

## 需要帮助？

如果问题仍然存在：

1. **查看服务器日志** - 在运行 `npm start` 的终端
2. **检查文件是否存在** - `ls -la server/routes/webhook.mjs`
3. **验证 .env 配置** - `cat .env | grep WEBHOOK`
4. **重新生成 Token** - `node -e "console.log('wh_' + require('crypto').randomUUID())"`

---

**记住：每次修改代码后都需要重启服务器！** 🔄
