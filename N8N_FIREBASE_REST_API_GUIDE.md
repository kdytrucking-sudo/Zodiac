# N8N + Firebase REST API 集成指南

## 🎯 方案概述

使用 Firebase Firestore REST API 直接从 N8N 创建文章，无需 Webhook 服务器。

## 📋 准备工作

### 1. 获取 Firebase 配置信息

从您的项目中获取：
- **Project ID**: `studio-4395392521-1abeb`
- **Database ID**: `zodia1`
- **API Key**: `AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU`

### 2. Firestore REST API 端点

```
https://firestore.googleapis.com/v1/projects/{projectId}/databases/{databaseId}/documents/{collectionPath}
```

实际 URL：
```
https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles
```

## 🔧 N8N 工作流配置

### 完整工作流示例

```
1. Schedule Trigger (定时触发)
   ↓
2. ChatGPT/AI Node (生成文章内容)
   ↓
3. Function Node (格式化数据)
   ↓
4. HTTP Request Node (调用 Firebase API)
   ↓
5. IF Node (检查结果)
   ↓
6. Success/Error 处理
```

---

## 📝 详细配置

### Node 1: Schedule Trigger

**配置：**
- Trigger: Schedule
- Mode: Every Day
- Hour: 9
- Minute: 0

---

### Node 2: ChatGPT Node (或其他 AI)

**Prompt 示例：**
```
请写一篇关于龙年运势的文章，要求：
1. 标题吸引人
2. 内容至少150字
3. 包含事业、财运、感情三个方面
4. 语言通俗易懂
```

**输出格式：**
```json
{
  "title": "生成的标题",
  "content": "生成的内容"
}
```

---

### Node 3: Function Node (格式化数据)

**代码：**
```javascript
// 生成唯一的文章 ID
const timestamp = Date.now();
const random = Math.random().toString(36).substring(2, 8);
const articleId = `article_${timestamp}_${random}`;

// 从 AI 输出获取数据
const aiOutput = $input.item.json;

// 格式化为 Firestore 文档格式
const article = {
  fields: {
    title: { stringValue: aiOutput.title || "默认标题" },
    content: { stringValue: aiOutput.content || "默认内容" },
    category: { stringValue: "fortune" },
    zodiacSign: { stringValue: "dragon" },
    source: { stringValue: "AI Generator" },
    keywords: { 
      arrayValue: { 
        values: [
          { stringValue: "运势" },
          { stringValue: "龙年" },
          { stringValue: "2025" }
        ]
      }
    },
    viewCount: { integerValue: "0" },
    favoriteCount: { integerValue: "0" },
    commentCount: { integerValue: "0" },
    created_at: { stringValue: new Date().toISOString() },
    updated_at: { stringValue: new Date().toISOString() },
    metadata: {
      mapValue: {
        fields: {
          createdBy: { stringValue: "n8n" },
          createdVia: { stringValue: "api" },
          workflowId: { stringValue: $workflow.id }
        }
      }
    }
  }
};

return {
  json: {
    articleId: articleId,
    document: article
  }
};
```

---

### Node 4: HTTP Request Node (调用 Firebase API)

**配置：**

**Method:** `POST`

**URL:**
```
https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId={{ $json.articleId }}&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{{ $json.document }}
```

**Body Content Type:** JSON

---

### Node 5: IF Node (检查结果)

**条件：**
```
{{ $json.name }} is not empty
```

如果成功，`$json.name` 会包含创建的文档路径。

---

### Node 6a: Success Node (成功处理)

**可选操作：**
- 发送成功通知
- 记录到日志
- 发送邮件

**示例 - Set Node:**
```json
{
  "status": "success",
  "message": "Article created successfully",
  "articleId": "{{ $('Function').item.json.articleId }}",
  "title": "{{ $('ChatGPT').item.json.title }}"
}
```

---

### Node 6b: Error Node (错误处理)

**可选操作：**
- 发送错误通知
- 记录错误日志
- 重试逻辑

---

## 📋 简化版配置（快速开始）

如果您想快速测试，可以使用这个简化版本：

### HTTP Request Node (直接配置)

**Method:** POST

**URL:**
```
https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId=article_test_001&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU
```

**Body:**
```json
{
  "fields": {
    "title": {
      "stringValue": "测试文章标题"
    },
    "content": {
      "stringValue": "这是一篇测试文章的内容。这是一篇测试文章的内容。这是一篇测试文章的内容。这是一篇测试文章的内容。这是一篇测试文章的内容。这是一篇测试文章的内容。"
    },
    "category": {
      "stringValue": "fortune"
    },
    "zodiacSign": {
      "stringValue": "dragon"
    },
    "source": {
      "stringValue": "N8N Test"
    },
    "keywords": {
      "arrayValue": {
        "values": [
          { "stringValue": "测试" },
          { "stringValue": "文章" }
        ]
      }
    },
    "viewCount": {
      "integerValue": "0"
    },
    "favoriteCount": {
      "integerValue": "0"
    },
    "commentCount": {
      "integerValue": "0"
    },
    "created_at": {
      "stringValue": "2024-01-15T10:30:00.000Z"
    },
    "updated_at": {
      "stringValue": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## 🧪 使用 curl 测试

在配置 N8N 之前，您可以先用 curl 测试：

```bash
curl -X POST \
  "https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId=article_test_$(date +%s)&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "title": {
        "stringValue": "curl 测试文章"
      },
      "content": {
        "stringValue": "这是通过 curl 和 Firebase REST API 创建的测试文章。这是通过 curl 和 Firebase REST API 创建的测试文章。这是通过 curl 和 Firebase REST API 创建的测试文章。"
      },
      "category": {
        "stringValue": "fortune"
      },
      "zodiacSign": {
        "stringValue": "dragon"
      },
      "source": {
        "stringValue": "curl Test"
      },
      "keywords": {
        "arrayValue": {
          "values": [
            { "stringValue": "测试" }
          ]
        }
      },
      "viewCount": { "integerValue": "0" },
      "favoriteCount": { "integerValue": "0" },
      "commentCount": { "integerValue": "0" },
      "created_at": { "stringValue": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'" },
      "updated_at": { "stringValue": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'" }
    }
  }'
```

---

## 📊 Firestore 数据类型映射

| JavaScript 类型 | Firestore REST API 格式 |
|----------------|------------------------|
| String | `{ "stringValue": "text" }` |
| Number (整数) | `{ "integerValue": "123" }` |
| Number (浮点) | `{ "doubleValue": 123.45 }` |
| Boolean | `{ "booleanValue": true }` |
| Array | `{ "arrayValue": { "values": [...] } }` |
| Object | `{ "mapValue": { "fields": {...} } }` |
| Timestamp | `{ "timestampValue": "2024-01-15T10:30:00Z" }` |

---

## 🔐 安全注意事项

### 1. API Key 保护

**不要：**
- ❌ 将 API Key 硬编码在公开的地方
- ❌ 提交到 Git

**应该：**
- ✅ 使用 N8N 的 Credentials 功能
- ✅ 使用环境变量

### 2. Firestore 安全规则

确保您的 Firestore 规则允许写入：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      // 允许所有人读取
      allow read: if true;
      
      // 只允许认证用户写入
      allow write: if request.auth != null;
    }
  }
}
```

**注意：** 使用 REST API 时，如果没有用户认证，需要调整规则或使用服务账号。

---

## ✅ 验证文章创建成功

### 方法 1: Firebase Console
1. 访问 Firebase Console
2. Firestore Database → Data
3. 查看 `articles` 集合

### 方法 2: 网站前端
1. 访问文章列表页面
2. 应该看到新创建的文章

### 方法 3: REST API 查询
```bash
curl "https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU"
```

---

## 🎯 完整的 N8N 工作流 JSON

您可以导入这个 JSON 到 N8N：

```json
{
  "name": "Create Article via Firebase API",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 24
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId=article_{{ $now.toUnixInteger() }}&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU",
        "options": {},
        "bodyParametersJson": "={\n  \"fields\": {\n    \"title\": { \"stringValue\": \"自动生成的文章\" },\n    \"content\": { \"stringValue\": \"这是通过 N8N 自动创建的文章内容。\" },\n    \"category\": { \"stringValue\": \"fortune\" },\n    \"zodiacSign\": { \"stringValue\": \"dragon\" },\n    \"source\": { \"stringValue\": \"N8N Automation\" },\n    \"viewCount\": { \"integerValue\": \"0\" },\n    \"favoriteCount\": { \"integerValue\": \"0\" },\n    \"commentCount\": { \"integerValue\": \"0\" },\n    \"created_at\": { \"stringValue\": \"{{ $now.toISO() }}\" },\n    \"updated_at\": { \"stringValue\": \"{{ $now.toISO() }}\" }\n  }\n}"
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [[{ "node": "HTTP Request", "type": "main", "index": 0 }]]
    }
  }
}
```

---

## 📚 相关资源

- [Firestore REST API 文档](https://firebase.google.com/docs/firestore/use-rest-api)
- [N8N HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Firebase Console](https://console.firebase.google.com/)

---

## 🎉 总结

使用 Firebase REST API 的优势：
- ✅ 无需配置服务器端 SDK
- ✅ 直接从 N8N 调用
- ✅ 简单易用
- ✅ 立即可用

**下一步：**
1. 在 N8N 中创建工作流
2. 配置 HTTP Request Node
3. 测试创建文章
4. 集成 AI 生成内容

**祝您使用愉快！** 🚀
