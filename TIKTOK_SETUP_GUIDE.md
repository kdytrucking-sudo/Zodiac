# TikTok 开发者配置指南

本指南将帮助您配置 TikTok API，实现从 Larak's Zodiac 网站直接分享视频到 TikTok 的功能。

## 📋 目录
1. [注册 TikTok 开发者账号](#1-注册-tiktok-开发者账号)
2. [创建应用](#2-创建应用)
3. [获取 API 凭证](#3-获取-api-凭证)
4. [配置 OAuth 回调](#4-配置-oauth-回调)
5. [配置环境变量](#5-配置环境变量)
6. [实现后端 API](#6-实现后端-api)
7. [测试集成](#7-测试集成)

---

## 1. 注册 TikTok 开发者账号

### 步骤：
1. 访问 **TikTok 开发者平台**：https://developers.tiktok.com/
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. 使用您的 TikTok 账号登录（如果没有，需要先注册）
4. 完成开发者认证：
   - 填写个人/公司信息
   - 提供联系方式
   - 同意开发者协议

### 注意事项：
- 开发者账号审核可能需要 1-3 个工作日
- 确保提供真实有效的信息

---

## 2. 创建应用

### 步骤：
1. 登录开发者控制台后，点击 **"My Apps"**
2. 点击 **"Create an App"** 或 **"Connect an App"**
3. 填写应用信息：

```
应用名称 (App Name): Larak's Zodiac
应用类型 (App Type): Web App
分类 (Category): Entertainment 或 Lifestyle
描述 (Description): Share personalized zodiac sign videos on TikTok
```

4. 上传应用图标（建议尺寸：512x512px）
5. 提供必需的 URL：
   - **Privacy Policy URL**: https://zodiac.laraks.com/privacy
   - **Terms of Service URL**: https://zodiac.laraks.com/terms

### 注意事项：
- 应用名称应与您的网站品牌一致
- 隐私政策和服务条款页面必须真实存在

---

## 3. 获取 API 凭证

### 步骤：
1. 创建应用后，进入应用详情页
2. 在 **"App Info"** 或 **"Credentials"** 部分找到：
   - **Client Key** (也称为 App ID)
   - **Client Secret**

### 示例：
```
Client Key: aw1234567890abcdef
Client Secret: 1234567890abcdef1234567890abcdef
```

### ⚠️ 安全提醒：
- **Client Secret 必须保密**，不要分享给任何人
- 不要将 Client Secret 提交到 Git 仓库
- 定期更换 Client Secret 以提高安全性

---

## 4. 配置 OAuth 回调

### 步骤：
1. 在应用设置中找到 **"Login Kit"** 或 **"OAuth"** 部分
2. 添加 **Redirect URI**（回调 URL）：

```
开发环境: http://localhost:8080/api/tiktok/callback
生产环境: https://zodiac.laraks.com/api/tiktok/callback
```

3. 选择所需的 **权限范围 (Scopes)**：
   - ✅ `user.info.basic` - 获取用户基本信息
   - ✅ `video.upload` - 上传视频
   - ✅ `video.publish` - 发布视频到 TikTok

### 注意事项：
- 回调 URL 必须与代码中配置的完全一致
- 生产环境必须使用 HTTPS
- 某些权限可能需要额外审核

---

## 5. 配置环境变量

### 步骤：
1. 打开项目根目录的 `.env` 文件
2. 找到 TikTok 配置部分
3. 替换占位符为您的真实凭证：

```bash
# TikTok API Configuration
TIKTOK_CLIENT_KEY=aw1234567890abcdef  # 替换为您的 Client Key
TIKTOK_CLIENT_SECRET=1234567890abcdef1234567890abcdef  # 替换为您的 Client Secret
TIKTOK_REDIRECT_URI=https://zodiac.laraks.com/api/tiktok/callback
```

### 本地开发配置：
如果在本地测试，可以创建 `.env.local` 文件：

```bash
TIKTOK_CLIENT_KEY=aw1234567890abcdef
TIKTOK_CLIENT_SECRET=1234567890abcdef1234567890abcdef
TIKTOK_REDIRECT_URI=http://localhost:8080/api/tiktok/callback
```

### 注意事项：
- `.env` 文件已在 `.gitignore` 中，不会被提交到 Git
- 生产环境需要在 Firebase App Hosting 中配置环境变量

---

## 6. 实现后端 API

### 需要创建的 API 端点：

#### 6.1 OAuth 授权端点
```javascript
// functions/api/tiktok/auth.js
export async function onRequest(context) {
  const clientKey = context.env.TIKTOK_CLIENT_KEY;
  const redirectUri = context.env.TIKTOK_REDIRECT_URI;
  const state = generateRandomState(); // 生成随机 state 用于安全验证
  
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.upload,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  
  return Response.redirect(authUrl);
}
```

#### 6.2 OAuth 回调端点
```javascript
// functions/api/tiktok/callback.js
export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  // 验证 state 参数
  // 使用 code 换取 access_token
  const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: context.env.TIKTOK_CLIENT_KEY,
      client_secret: context.env.TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: context.env.TIKTOK_REDIRECT_URI
    })
  });
  
  const tokenData = await tokenResponse.json();
  // 保存 access_token 到用户会话
  // 重定向回应用
}
```

#### 6.3 视频上传端点
```javascript
// functions/api/tiktok/upload.js
export async function onRequest(context) {
  const { videoPath, accessToken } = await context.request.json();
  
  // 1. 初始化上传
  const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post_info: {
        title: 'My Zodiac Sign Video',
        privacy_level: 'SELF_ONLY', // 或 'PUBLIC_TO_EVERYONE'
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSize,
        chunk_size: chunkSize,
        total_chunk_count: totalChunks
      }
    })
  });
  
  // 2. 上传视频文件
  // 3. 发布视频
}
```

---

## 7. 测试集成

### 测试步骤：

1. **启动本地开发服务器**
   ```bash
   npm start
   ```

2. **测试 OAuth 流程**
   - 访问：http://localhost:8080/archive.html?sign=rat
   - 点击 TikTok 分享按钮
   - 点击 "Share to My TikTok"
   - 应该跳转到 TikTok 授权页面

3. **授权后测试**
   - 授权成功后应该返回您的网站
   - 检查控制台是否有错误
   - 验证 access_token 是否正确获取

4. **测试视频上传**
   - 选择一个生肖视频
   - 点击分享到 TikTok
   - 检查上传进度
   - 在 TikTok 应用中验证视频是否成功发布

### 调试技巧：

1. **查看浏览器控制台**
   ```javascript
   // 在 archive.js 中添加调试日志
   console.log('TikTok auth URL:', authUrl);
   console.log('Access token:', accessToken);
   ```

2. **检查网络请求**
   - 打开浏览器开发者工具 -> Network 标签
   - 查看 TikTok API 请求和响应
   - 检查是否有 4xx 或 5xx 错误

3. **常见错误及解决方案**

| 错误代码 | 错误信息 | 解决方案 |
|---------|---------|---------|
| 10002 | Invalid client_key | 检查 Client Key 是否正确 |
| 10003 | Invalid redirect_uri | 确保回调 URL 在开发者平台中已配置 |
| 10004 | Invalid scope | 检查请求的权限是否已在应用中启用 |
| 10006 | Invalid access_token | Access token 已过期，需要重新授权 |

---

## 📚 参考资源

- **TikTok 开发者文档**: https://developers.tiktok.com/doc/
- **Login Kit 文档**: https://developers.tiktok.com/doc/login-kit-web/
- **Content Posting API**: https://developers.tiktok.com/doc/content-posting-api-get-started/
- **API 参考**: https://developers.tiktok.com/doc/content-posting-api-reference/

---

## ⚠️ 重要提醒

1. **隐私和合规**
   - 确保您的应用符合 TikTok 的使用条款
   - 正确处理用户数据和隐私
   - 在上传视频前获得用户明确同意

2. **速率限制**
   - TikTok API 有速率限制
   - 建议实现请求队列和重试机制
   - 监控 API 使用量

3. **生产环境部署**
   - 在 Firebase App Hosting 中配置环境变量
   - 确保使用 HTTPS
   - 定期更新 Client Secret

4. **用户体验**
   - 提供清晰的授权说明
   - 显示上传进度
   - 处理错误并给出友好提示

---

## 🎯 下一步

完成配置后，您可以：
1. 实现完整的 OAuth 授权流程
2. 添加视频上传功能
3. 优化用户体验
4. 添加错误处理和重试机制
5. 部署到生产环境

如有问题，请参考 TikTok 开发者文档或联系技术支持。
