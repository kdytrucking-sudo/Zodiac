# Fortune Webhook 快速开始指南

## 🚀 快速开始（3步）

### 1️⃣ 配置环境变量
在 `.env` 文件中添加：
```bash
WEBHOOK_SECRET_TOKEN=your_very_secure_random_token_here
```

💡 **生成安全 Token**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2️⃣ 启动服务器
```bash
npm start
```

### 3️⃣ 测试 API
```bash
./test-fortune-webhook.sh
```

---

## 📚 文档索引

### 🎯 我想...

#### 快速了解所有字段
👉 查看 **[FORTUNE_FIELDS_CHECKLIST.md](./FORTUNE_FIELDS_CHECKLIST.md)**
- 所有44个字段的快速参考
- 字段清单（确保不遗漏）
- 常用值参考

#### 了解完整的 API 规范
👉 查看 **[FORTUNE_WEBHOOK_API_DOCS.md](./FORTUNE_WEBHOOK_API_DOCS.md)**
- 详细的认证说明
- 所有字段的中文解释
- 完整的请求/响应示例
- 错误处理
- curl 测试命令

#### 了解实施细节和架构
👉 查看 **[FORTUNE_WEBHOOK_SUMMARY.md](./FORTUNE_WEBHOOK_SUMMARY.md)**
- 已完成的工作总览
- 数据库结构
- 安全注意事项
- 与 Article Webhook 的对比

#### 查看示例数据
👉 查看 **[fortune-example.json](./fortune-example.json)**
- 完整的 JSON 示例
- 包含所有必填字段
- 可直接用于测试

---

## 🔌 API 端点

### 健康检查（无需认证）
```bash
GET http://localhost:8080/api/webhook/fortune/health
```

### 更新运势（需要认证）
```bash
POST http://localhost:8080/api/webhook/fortune/update
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_SECRET_TOKEN
Body: 见 fortune-example.json
```

---

## 🧪 测试方法

### 方法1：自动化测试脚本（推荐）
```bash
./test-fortune-webhook.sh
```

包含4个测试：
- ✅ 健康检查
- ✅ 正常更新
- ❌ 认证失败
- ❌ 验证失败

### 方法2：手动 curl 测试
```bash
# 健康检查
curl http://localhost:8080/api/webhook/fortune/health

# 更新运势
curl -X POST http://localhost:8080/api/webhook/fortune/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_secret_token_change_this" \
  -d @fortune-example.json
```

### 方法3：使用 N8N
1. 创建 HTTP Request 节点
2. URL: `https://your-domain.com/api/webhook/fortune/update`
3. Method: POST
4. Headers:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_SECRET_TOKEN`
5. Body: 使用 `fortune-example.json` 的内容

---

## 📊 数据结构概览

```
POST /api/webhook/fortune/update
{
  "zodiacSign": "tiger",           // 12生肖之一
  "period": "week",                // today/week/month/year
  "free": {                        // 18个字段
    // 文本字段 (12个)
    "overview": "...",
    "career": "...",
    "love": "...",
    "health": "...",
    "wealth": "...",
    "luckyColor": "Azure",
    "luckyNumber": "7",
    "luckyDirection": "North",
    "luckyTime": "9:00 AM - 11:00 AM",
    "benefactor": "dragon",
    "do": "...",
    "dont": "...",
    
    // 评分字段 (5个)
    "ratingCareer": 4,             // 1-5
    "ratingHealth": 3,             // 1-5
    "ratingLove": 5,               // 1-5
    "ratingWealth": 3,             // 1-5
    "overallScore": 75,            // 0-100
    
    // 可选方位 (3个)
    "loveDirection": "East",
    "joyDirection": "Southeast",
    "wealthDirection": "West"
  },
  "paid": {                        // 22个字段
    // 详细分析 (4个)
    "careerDetailed": "...",
    "loveDetailed": "...",
    "healthDetailed": "...",
    "wealthDetailed": "...",
    
    // 个性化建议 (4个)
    "careerAdvice": "...",
    "loveAdvice": "...",
    "healthAdvice": "...",
    "wealthAdvice": "...",
    
    // 评分 (4个)
    "ratingCareer": 4,
    "ratingHealth": 3,
    "ratingLove": 5,
    "ratingWealth": 3,
    
    // 幸运元素 (7个)
    "luckyColors": "Azure, Silver",
    "luckyNumbers": "3, 7, 18",
    "luckyDirections": "East, Southeast",
    "luckyFlower": "Yellow Lily",
    "luckyMineral": "Sapphire",
    "luckyTime": "9:00 AM - 11:00 AM",
    "benefactor": "dragon",
    
    // 可选方位 (3个)
    "loveDirection": "East",
    "joyDirection": "Southeast",
    "wealthDirection": "West",
    
    // 建议列表 (2个数组)
    "dos": ["...", "...", "..."],
    "donts": ["...", "...", "..."]
  }
}
```

---

## ✅ 字段统计

| 部分 | 字段数 | 必填 | 可选 |
|------|--------|------|------|
| 顶层 | 4 | 4 | 0 |
| Free | 18 | 15 | 3 |
| Paid | 22 | 19 | 3 |
| **总计** | **44** | **38** | **6** |

---

## 🔒 认证机制（与 Article Webhook 相同）

### 1. Bearer Token 验证
```
Authorization: Bearer YOUR_SECRET_TOKEN
```

### 2. 域名验证（可选）
允许的域名：
- `laraks.com`
- `www.laraks.com`
- `*.laraks.com`

**注意**：
- localhost 自动允许（开发模式）
- 无 Origin 头的请求只验证 Token（适用于 curl、N8N）

---

## 📁 相关文件

| 文件 | 说明 |
|------|------|
| `server/routes/webhook-fortune.mjs` | Fortune Webhook 路由实现 |
| `FORTUNE_WEBHOOK_API_DOCS.md` | 完整 API 文档（推荐阅读） |
| `FORTUNE_FIELDS_CHECKLIST.md` | 字段快速参考（推荐阅读） |
| `FORTUNE_WEBHOOK_SUMMARY.md` | 实施总结 |
| `fortune-example.json` | 完整示例数据 |
| `test-fortune-webhook.sh` | 自动化测试脚本 |

---

## 🎯 常见问题

### Q1: 如何生成安全的 Token？
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Q2: 如何验证数据已成功写入？
1. 查看服务器日志：`✅ Fortune updated: tiger - week`
2. 在 Firebase Console 检查 `fortune` collection
3. 在网站前端查看运势页面

### Q3: 评分字段的范围是什么？
- `ratingCareer`, `ratingHealth`, `ratingLove`, `ratingWealth`: 1-5
- `overallScore`: 0-100

### Q4: dos 和 donts 数组需要多少项？
- 至少1项
- 建议3-5项

### Q5: 如何更新多个生肖？
每个生肖需要单独调用一次 API。可以使用循环或批处理脚本。

### Q6: 如何更新多个时间周期？
每个周期需要单独调用一次 API。例如：
- 调用1：`{"zodiacSign": "tiger", "period": "today", ...}`
- 调用2：`{"zodiacSign": "tiger", "period": "week", ...}`

---

## 🚨 故障排除

### 401 Unauthorized
- 检查 Token 是否正确
- 确认 `.env` 文件中的 `WEBHOOK_SECRET_TOKEN` 已设置

### 400 Validation Error
- 检查所有必填字段是否存在
- 使用 `FORTUNE_FIELDS_CHECKLIST.md` 中的清单
- 参考 `fortune-example.json` 的格式

### 500 Internal Server Error
- 检查服务器日志
- 确认 Firebase 配置正确
- 验证数据格式是否正确

---

## 📞 支持

如有问题，请查看：
1. **[FORTUNE_WEBHOOK_API_DOCS.md](./FORTUNE_WEBHOOK_API_DOCS.md)** - 完整 API 文档
2. **[FORTUNE_FIELDS_CHECKLIST.md](./FORTUNE_FIELDS_CHECKLIST.md)** - 字段参考
3. 服务器日志输出

---

## 🎉 开始使用

1. ✅ 配置 `.env` 文件
2. ✅ 启动服务器：`npm start`
3. ✅ 运行测试：`./test-fortune-webhook.sh`
4. ✅ 查看结果

祝你使用愉快！🚀
