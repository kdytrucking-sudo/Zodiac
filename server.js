import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Genkit imports
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';


console.log('KEY CHECK (runtime):', !!process.env.GOOGLE_GENAI_API_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cloud Run / App Hosting 指定的端口（一定要用这个）
const PORT = process.env.PORT || 8080;

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});

// Define a simple flow
const zodiacFlow = ai.defineFlow('zodiacFlow', async (input) => {
  const { text } = await ai.generate(`Tell me a fun fact about the ${input} zodiac sign.`);
  return text;
});

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

// Genkit API endpoint
app.post('/api/genkit/zodiac', async (req, res) => {
  const { sign } = req.body;
  try {
    const result = await zodiacFlow(sign);
    res.json({ result });
  } catch (error) {
    console.error('Genkit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Genkit AI 测试端点 - 支持自定义参数
app.post('/api/genkit/generate', async (req, res) => {
  const { prompt, temperature, topK, topP, maxTokens } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const config = {};
    if (temperature !== undefined) config.temperature = parseFloat(temperature);
    if (topK !== undefined) config.topK = parseInt(topK);
    if (topP !== undefined) config.topP = parseFloat(topP);
    if (maxTokens !== undefined) config.maxOutputTokens = parseInt(maxTokens);

    const { text } = await ai.generate({
      prompt,
      config
    });

    res.json({
      result: text,
      config: config
    });
  } catch (error) {
    console.error('Genkit generation error:', error);
    res.status(500).json({ error: error.message });
  }
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
