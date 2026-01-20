# TikTok 配置快速开始 🚀

## 第一步：注册开发者账号（5分钟）

1. 访问：https://developers.tiktok.com/
2. 点击 "Sign Up" 用 TikTok 账号登录
3. 填写开发者信息并提交审核

## 第二步：创建应用（3分钟）

1. 登录后点击 "My Apps" → "Create an App"
2. 填写信息：
   ```
   名称: Larak's Zodiac
   类型: Web App
   分类: Entertainment
   ```
3. 上传图标（512x512px）
4. 提供隐私政策和服务条款 URL

## 第三步：获取凭证（1分钟）

创建应用后，复制以下信息：
- **Client Key**: `aw1234567890abcdef`
- **Client Secret**: `1234567890abcdef1234567890abcdef`

## 第四步：配置回调 URL（2分钟）

在应用设置中添加：
```
开发: http://localhost:8080/api/tiktok/callback
生产: https://zodiac.laraks.com/api/tiktok/callback
```

选择权限：
- ✅ user.info.basic
- ✅ video.upload
- ✅ video.publish

## 第五步：配置环境变量（1分钟）

编辑 `.env` 文件：
```bash
TIKTOK_CLIENT_KEY=你的Client_Key
TIKTOK_CLIENT_SECRET=你的Client_Secret
TIKTOK_REDIRECT_URI=https://zodiac.laraks.com/api/tiktok/callback
```

## 完成！🎉

现在您可以：
1. 重启开发服务器：`npm start`
2. 访问：http://localhost:8080/archive.html?sign=rat
3. 点击 TikTok 分享按钮测试

---

## 需要帮助？

- 📖 详细指南：查看 `TIKTOK_SETUP_GUIDE.md`
- 🌐 官方文档：https://developers.tiktok.com/doc/
- ❓ 常见问题：见详细指南第7章
