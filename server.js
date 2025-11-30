const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Cloud Run / App Hosting 要求：必须监听 process.env.PORT
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// -------- 静态页面（把 index.html 等一起服务出去） --------
app.use(express.static(path.join(__dirname, 'public')));

// 访问根路径时返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// -------- 示例 API：以后你可以在这里接 AI / 数据库 --------
app.get('/api/zodiac/today', (req, res) => {
  res.json({
    sign: 'dragon',
    message: 'Today is a good day to ship your Zodiac backend 🐉'
  });
});

app.listen(PORT, () => {
  console.log(`Zodiac backend listening on port ${PORT}`);
});
