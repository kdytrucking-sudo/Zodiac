# 🚀 N8N 工作流快速开始指南

## 📝 方法 1: 使用测试脚本（最简单）

### 运行测试脚本

```bash
./test-firebase-api.sh
```

这会创建一篇测试文章，您可以立即在网站上看到。

---

## 📋 方法 2: 导入 N8N 工作流

### 步骤 1: 复制工作流 JSON

文件位置：`n8n-workflow-create-article.json`

### 步骤 2: 在 N8N 中导入

1. 打开 N8N
2. 点击右上角的 "+" 创建新工作流
3. 点击右上角的 "..." 菜单
4. 选择 "Import from File" 或 "Import from URL"
5. 选择 `n8n-workflow-create-article.json` 文件
6. 点击 "Import"

### 步骤 3: 测试工作流

1. 点击 "Execute Workflow" 按钮
2. 查看执行结果
3. 访问 http://localhost:8080/article.html 查看新文章

---

## 🔧 方法 3: 手动配置 N8N（详细步骤）

### Node 1: Manual Trigger
- 类型：Manual Trigger
- 无需配置

### Node 2: Function (格式化数据)
- 类型：Function
- 代码：见下方

```javascript
// 生成唯一的文章 ID
const timestamp = Date.now();
const random = Math.random().toString(36).substring(2, 8);
const articleId = `article_${timestamp}_${random}`;

// 获取当前时间
const currentTime = new Date().toISOString();

// 文章数据
const title = "2025年龙年运势完整解析";
const content = "龙年是一个充满机遇和挑战的年份。在2025年，属龙的人将迎来事业上的重大突破。财运方面表现稳健，但需要注意理财规划。感情方面，单身者有望遇到心仪对象，已婚者需要多花时间陪伴家人。健康方面整体良好，但要注意劳逸结合。本年度的幸运色是金色和红色，幸运数字是3和8。";

// 格式化为 Firestore 文档格式
const firestoreDocument = {
  fields: {
    title: { stringValue: title },
    content: { stringValue: content },
    category: { stringValue: "fortune" },
    zodiacSign: { stringValue: "dragon" },
    source: { stringValue: "N8N AI Generator" },
    keywords: {
      arrayValue: {
        values: [
          { stringValue: "龙年" },
          { stringValue: "运势" },
          { stringValue: "2025" },
          { stringValue: "生肖" }
        ]
      }
    },
    viewCount: { integerValue: "0" },
    favoriteCount: { integerValue: "0" },
    commentCount: { integerValue: "0" },
    created_at: { stringValue: currentTime },
    updated_at: { stringValue: currentTime },
    metadata: {
      mapValue: {
        fields: {
          createdBy: { stringValue: "n8n" },
          createdVia: { stringValue: "workflow" }
        }
      }
    }
  }
};

return {
  json: {
    articleId: articleId,
    document: firestoreDocument,
    title: title
  }
};
```

### Node 3: HTTP Request (创建文章)
- 类型：HTTP Request
- Method: `POST`
- URL: 
```
https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId={{ $json.articleId }}&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU
```
- Headers:
  - `Content-Type`: `application/json`
- Body:
  - Type: `JSON`
  - Content: `{{ JSON.stringify($json.document) }}`

### Node 4: IF (检查结果)
- 类型: IF
- 条件: `{{ $json.name }}` is not empty

### Node 5: Set (成功)
- 类型: Set
- 设置值:
  - `status`: `success`
  - `message`: `文章创建成功`
  - `articleId`: `{{ $('格式化数据').item.json.articleId }}`
  - `title`: `{{ $('格式化数据').item.json.title }}`

### Node 6: Set (失败)
- 类型: Set
- 设置值:
  - `status`: `error`
  - `message`: `文章创建失败`

---

## 📱 方法 4: 直接使用 curl（最快）

### 单行命令（复制即用）

```bash
curl -X POST \
  "https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId=article_$(date +%s)&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "title": {"stringValue": "测试文章标题"},
      "content": {"stringValue": "这是测试文章的内容。这是测试文章的内容。这是测试文章的内容。这是测试文章的内容。这是测试文章的内容。这是测试文章的内容。这是测试文章的内容。"},
      "category": {"stringValue": "fortune"},
      "zodiacSign": {"stringValue": "dragon"},
      "source": {"stringValue": "curl Test"},
      "keywords": {"arrayValue": {"values": [{"stringValue": "测试"}]}},
      "viewCount": {"integerValue": "0"},
      "favoriteCount": {"integerValue": "0"},
      "commentCount": {"integerValue": "0"},
      "created_at": {"stringValue": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"},
      "updated_at": {"stringValue": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"}
    }
  }'
```

---

## ✅ 验证文章创建成功

### 1. 查看返回结果

成功的响应应该包含：
```json
{
  "name": "projects/.../documents/articles/article_...",
  "fields": {...},
  "createTime": "2024-01-15T...",
  "updateTime": "2024-01-15T..."
}
```

### 2. 访问网站

打开浏览器访问：
```
http://localhost:8080/article.html
```

应该看到新创建的文章。

### 3. 查看 Firebase Console

1. 访问 https://console.firebase.google.com/
2. 选择项目
3. Firestore Database → Data
4. 查看 `articles` 集合

---

## 🎯 下一步：集成 AI 生成内容

### 添加 ChatGPT Node

在 "手动触发" 和 "格式化数据" 之间添加：

**ChatGPT Node 配置：**
- Prompt: 
```
请写一篇关于龙年运势的文章，要求：
1. 标题吸引人
2. 内容至少150字
3. 包含事业、财运、感情三个方面
4. 语言通俗易懂

请以 JSON 格式返回：
{
  "title": "文章标题",
  "content": "文章内容"
}
```

然后在 Function Node 中使用：
```javascript
const aiOutput = $input.item.json;
const title = aiOutput.title;
const content = aiOutput.content;
```

---

## 📊 工作流对比

| 方法 | 难度 | 速度 | 灵活性 | 推荐度 |
|------|------|------|--------|--------|
| 测试脚本 | ⭐ | ⭐⭐⭐ | ⭐ | 快速测试 |
| 导入工作流 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ✅ 推荐 |
| 手动配置 | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ | 学习用 |
| 直接 curl | ⭐ | ⭐⭐⭐ | ⭐ | 快速测试 |

---

## 🆘 常见问题

### Q: 文章创建失败？
**A:** 检查：
1. API Key 是否正确
2. Project ID 是否正确
3. Database ID 是否正确（zodia1）
4. 网络连接是否正常

### Q: 文章创建成功但网站看不到？
**A:** 检查：
1. 刷新页面（Ctrl+F5）
2. 检查 Firebase Console 中的数据
3. 检查文章的 category 和 zodiacSign 字段

### Q: 如何修改文章内容？
**A:** 修改 Function Node 中的 `title` 和 `content` 变量。

---

## 🎉 开始使用

**最简单的方式：**
```bash
# 1. 运行测试脚本
./test-firebase-api.sh

# 2. 访问网站查看
open http://localhost:8080/article.html
```

**或者导入 N8N 工作流：**
1. 打开 N8N
2. 导入 `n8n-workflow-create-article.json`
3. 点击 "Execute Workflow"
4. 完成！

**祝您使用愉快！** 🚀
