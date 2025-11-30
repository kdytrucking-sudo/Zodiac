const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Cloud Run / App Hosting 指定的端口（一定要用这个）
const PORT = process.env.PORT || 8080;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件：托管 public 目录里的前端
app.use(express.static(path.join(__dirname, 'public')));

// 根路径：返回首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 示例后端 API：以后你可以在这里接 Firestore / AI
app.get('/api/zodiac/today', async (req, res) => {
  // 这里先返回一个假数据，将来你可以接数据库 / AI
  // 比如根据用户 id / 时区 / 生肖生成
  res.json({
    sign: 'dragon',
    date: new Date().toISOString().slice(0, 10),
    luck: 'high',
    message: 'Today is a good day to build your Zodiac AI backend 🐉'
  });
});

// 全局错误兜底（以后加复杂逻辑时有用）
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Zodiac backend listening on port ${PORT}`);
});
