# 文章功能增强实现计划

## 📋 需求概述

为文章板块添加以下功能：
1. 文章统计：查看次数、收藏次数、评论次数
2. 收藏功能：用户可以收藏文章
3. 评论功能：用户可以评论文章

## 🗄️ 数据库结构

### 1. articles 集合（需要添加字段）
```javascript
{
  // ... 现有字段
  viewCount: Number,      // 查看次数
  favoriteCount: Number,  // 收藏次数
  commentCount: Number    // 评论次数
}
```

### 2. favorites 集合（已存在，保持一致）
```javascript
{
  uid: String,           // 用户 ID
  articleId: String,     // 文章 ID
  articleTitle: String,  // 文章标题
  timestamp: String      // ISO 格式时间戳
}
```

### 3. article-comments 集合（新建）
```javascript
{
  articleId: String,     // 文章 ID
  content: String,       // 评论内容（最多 500 字符）
  authorId: String,      // 评论者 ID
  authorName: String,    // 评论者名称
  authorEmail: String,   // 评论者邮箱
  createdAt: Timestamp   // 创建时间
}
```

## 📝 实现步骤

### 步骤 1: 更新 article-detail.html
- [ ] 添加统计显示区域（查看、收藏、评论数）
- [ ] 添加收藏按钮
- [ ] 添加评论区域（评论列表 + 评论表单）

### 步骤 2: 更新 article-detail.js
- [ ] 添加查看次数追踪
- [ ] 实现收藏功能（添加/取消收藏）
- [ ] 实现评论加载
- [ ] 实现评论提交
- [ ] 更新统计数字

### 步骤 3: 更新 article.js（文章列表）
- [ ] 在文章卡片显示统计信息

### 步骤 4: 添加 CSS 样式
- [ ] 统计显示样式
- [ ] 收藏按钮样式
- [ ] 评论区域样式

### 步骤 5: 数据库索引
- [ ] 创建 article-comments 的复合索引（articleId + createdAt）

## 🎨 UI 设计

### 统计显示
```
👁️ 125 views  ⭐ 23 favorites  💬 8 comments
```

### 收藏按钮
```
[⭐ Favorite] (未收藏)
[★ Favorited] (已收藏)
```

### 评论区域
```
💬 Comments (8)

[评论输入框 - 登录用户可见]
[Reply 按钮]

评论列表：
┌─────────────────────────────────┐
│ 👤 John Doe    🕐 5 minutes ago │
│ Great article! Very helpful...  │
└─────────────────────────────────┘
```

## 🔄 功能流程

### 查看文章
1. 用户打开文章详情
2. 自动增加 viewCount
3. 显示统计信息

### 收藏文章
1. 检查用户登录状态
2. 检查是否已收藏
3. 点击按钮切换收藏状态
4. 更新 favorites 集合
5. 更新文章的 favoriteCount

### 评论文章
1. 检查用户登录状态
2. 用户输入评论（最多 500 字符）
3. 提交评论到 article-comments
4. 更新文章的 commentCount
5. 刷新评论列表

## ✅ 验收标准

- [ ] 文章详情页显示查看、收藏、评论数
- [ ] 查看次数自动追踪
- [ ] 收藏按钮正常工作（添加/取消）
- [ ] 收藏数据保存到 favorites 集合
- [ ] 评论列表正常显示
- [ ] 登录用户可以发表评论
- [ ] 未登录用户只能查看评论
- [ ] 评论按时间倒序排列（最新在前）
- [ ] 所有统计数字实时更新
