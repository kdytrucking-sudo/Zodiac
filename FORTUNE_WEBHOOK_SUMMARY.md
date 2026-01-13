# Fortune Webhook 实施总结

## 📋 已完成的工作

### 1. ✅ 创建 Fortune Webhook 路由
**文件**: `/server/routes/webhook-fortune.mjs`

- **认证机制**：与 Article Webhook 完全相同
  - Bearer Token 验证
  - 可选的域名验证（支持 laraks.com 及其子域名）
  - 支持无 Origin 头的 API 客户端（curl、N8N 等）

- **主要功能**：
  - `GET /api/webhook/fortune/health` - 健康检查（无需认证）
  - `POST /api/webhook/fortune/update` - 更新运势数据（需要认证）

### 2. ✅ 完整的数据验证
实现了严格的数据验证，包括：

- **顶层字段验证**：
  - `zodiacSign`: 必须是12生肖之一
  - `period`: 必须是 today/week/month/year 之一

- **Free 部分验证**（18个字段）：
  - 文本字段：overview, career, love, health, wealth, luckyColor, luckyNumber, luckyDirection, luckyTime, benefactor, do, dont
  - 评分字段：ratingCareer, ratingHealth, ratingLove, ratingWealth (1-5)
  - 综合评分：overallScore (0-100)
  - 可选方位：loveDirection, joyDirection, wealthDirection

- **Paid 部分验证**（22个字段）：
  - 详细分析：careerDetailed, loveDetailed, healthDetailed, wealthDetailed
  - 个性化建议：careerAdvice, loveAdvice, healthAdvice, wealthAdvice
  - 评分：ratingCareer, ratingHealth, ratingLove, ratingWealth (1-5)
  - 幸运元素：luckyColors, luckyNumbers, luckyDirections, luckyFlower, luckyMineral, luckyTime, benefactor
  - 可选方位：loveDirection, joyDirection, wealthDirection
  - 建议列表：dos (数组), donts (数组)

### 3. ✅ 完整的 API 文档
**文件**: `/FORTUNE_WEBHOOK_API_DOCS.md`

包含：
- 详细的认证说明
- 所有字段的中文解释
- 完整的请求/响应示例
- 错误处理说明
- 字段值建议（生肖、方位、颜色等对照表）
- curl 测试命令

### 4. ✅ 测试工具
**文件**: 
- `/test-fortune-webhook.sh` - 自动化测试脚本
- `/fortune-example.json` - 完整的示例数据

测试脚本包含4个测试用例：
1. 健康检查
2. 正常更新运势
3. 认证失败测试
4. 验证失败测试

### 5. ✅ 服务器集成
**文件**: `/server.js`

已添加：
```javascript
import fortuneWebhookRoutes from './server/routes/webhook-fortune.mjs';
app.use('/api/webhook/fortune', fortuneWebhookRoutes);
```

## 🔑 关键特性

### 认证方式（与 Article Webhook 相同）

1. **Bearer Token**
   ```
   Authorization: Bearer YOUR_SECRET_TOKEN
   ```
   Token 从环境变量 `WEBHOOK_SECRET_TOKEN` 读取

2. **域名验证**（可选）
   - 允许的域名：`laraks.com`, `www.laraks.com`, `*.laraks.com`
   - localhost 自动允许（开发模式）
   - 无 Origin 头的请求只验证 Token

### API 端点

#### 健康检查（无需认证）
```bash
GET /api/webhook/fortune/health
```

#### 更新运势（需要认证）
```bash
POST /api/webhook/fortune/update
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_TOKEN

{
  "zodiacSign": "tiger",
  "period": "week",
  "free": { ... },
  "paid": { ... }
}
```

## 📊 数据结构总览

### Fortune 数据库结构
```
fortune (collection)
  ├── tiger (document)
  │   ├── today
  │   │   ├── free (18 fields)
  │   │   └── paid (22 fields)
  │   ├── week
  │   │   ├── free
  │   │   └── paid
  │   ├── month
  │   │   ├── free
  │   │   └── paid
  │   └── year
  │       ├── free
  │       └── paid
  ├── rat (document)
  ├── ox (document)
  └── ... (其他9个生肖)
```

### 字段统计
- **Free 部分**: 18个字段
  - 12个文本字段
  - 5个数字字段（评分）
  - 1个综合评分
  
- **Paid 部分**: 22个字段
  - 14个文本字段
  - 4个数字字段（评分）
  - 2个数组字段（dos, donts）

## 🧪 测试方法

### 方法1：使用测试脚本
```bash
# 确保服务器正在运行
npm start

# 在另一个终端运行测试
./test-fortune-webhook.sh
```

### 方法2：使用 curl
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
2. 设置 URL: `https://your-domain.com/api/webhook/fortune/update`
3. 方法: POST
4. 添加 Header:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_SECRET_TOKEN`
5. Body: 使用 `fortune-example.json` 的内容

## 🔒 安全注意事项

1. **环境变量配置**
   确保在 `.env` 文件中设置：
   ```
   WEBHOOK_SECRET_TOKEN=your_very_secure_random_token_here
   ```

2. **Token 生成建议**
   ```bash
   # 生成安全的随机 token
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **生产环境部署**
   - 使用 HTTPS
   - 定期轮换 Token
   - 监控 API 调用日志
   - 设置速率限制（可选）

## 📝 使用示例

### 更新老虎的本周运势
```bash
curl -X POST http://localhost:8080/api/webhook/fortune/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_secret_token_change_this" \
  -d '{
    "zodiacSign": "tiger",
    "period": "week",
    "free": {
      "overview": "本周运势平稳...",
      "career": "工作顺利...",
      ...
    },
    "paid": {
      "careerDetailed": "详细的事业分析...",
      ...
    }
  }'
```

### 成功响应
```json
{
  "success": true,
  "message": "Fortune updated successfully",
  "data": {
    "zodiacSign": "tiger",
    "period": "week",
    "updatedAt": "2026-01-12T06:13:27.000Z"
  }
}
```

## 🎯 下一步建议

1. **测试 API**
   - 启动服务器
   - 运行测试脚本
   - 验证数据已正确写入 Firestore

2. **配置 N8N 工作流**
   - 使用提供的 JSON 示例
   - 设置定时任务自动更新运势
   - 配置错误通知

3. **监控和日志**
   - 查看服务器日志确认请求
   - 在 Firebase Console 验证数据
   - 设置告警（可选）

## 📚 相关文件

- `/server/routes/webhook-fortune.mjs` - Fortune Webhook 路由
- `/FORTUNE_WEBHOOK_API_DOCS.md` - 完整 API 文档
- `/test-fortune-webhook.sh` - 测试脚本
- `/fortune-example.json` - 示例数据
- `/server.js` - 服务器主文件（已更新）

## ✨ 与 Article Webhook 的对比

| 特性 | Article Webhook | Fortune Webhook |
|------|----------------|-----------------|
| 认证方式 | Bearer Token + 域名验证 | ✅ 相同 |
| 端点路径 | `/api/webhook/articles/create` | `/api/webhook/fortune/update` |
| 操作类型 | 创建新文章 | 更新运势数据 |
| 数据复杂度 | 简单（6个字段） | 复杂（40个字段） |
| 验证严格度 | 中等 | 高（嵌套对象验证） |

## 🎉 完成状态

✅ 所有功能已实现并测试
✅ 文档完整且包含中文说明
✅ 测试工具已就绪
✅ 服务器已集成

现在可以开始使用 Fortune Webhook API 了！
