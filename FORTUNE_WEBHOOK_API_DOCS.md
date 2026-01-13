# Fortune Webhook API 文档

## 概述

Fortune Webhook API 允许外部系统通过 HTTP POST 请求更新生肖运势数据。

## 认证方式

与 Article Webhook API 相同的认证机制：

### 1. Bearer Token 认证
在请求头中包含 Authorization token：

```
Authorization: Bearer YOUR_SECRET_TOKEN
```

Token 需要与服务器环境变量 `WEBHOOK_SECRET_TOKEN` 匹配。

### 2. 域名验证（可选）
如果请求包含 Origin 或 Referer 头，系统会验证域名是否为：
- `laraks.com`
- `www.laraks.com`
- `*.laraks.com` (任何子域名)

**注意**：对于 curl、N8N 等 API 客户端，如果没有 Origin 头，只需 Token 验证即可。

## API 端点

### 更新运势数据

**端点**: `POST /api/webhook/fortune/update`

**请求头**:
```
Content-Type: application/json
Authorization: Bearer YOUR_SECRET_TOKEN
```

## 完整的 JSON 字段说明

### 顶层字段

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `zodiacSign` | string | 是 | 生肖标识，必须是以下之一：`rat`(鼠), `ox`(牛), `tiger`(虎), `rabbit`(兔), `dragon`(龙), `snake`(蛇), `horse`(马), `goat`(羊), `monkey`(猴), `rooster`(鸡), `dog`(狗), `pig`(猪) |
| `period` | string | 是 | 时间周期，必须是以下之一：`today`(今日), `week`(本周), `month`(本月), `year`(本年) |
| `free` | object | 是 | 免费用户可见的运势内容 |
| `paid` | object | 是 | 付费用户可见的详细运势内容 |

---

### `free` 对象字段（免费用户内容）

#### 基础运势文本

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `overview` | string | 是 | 运势总览，简要概括本周期的整体运势 | "本周运势平稳，事业上有新机会出现，财运方面需谨慎..." |
| `career` | string | 是 | 事业运势简述 | "工作中会有新项目需要你全力投入" |
| `love` | string | 是 | 爱情运势简述 | "与伴侣的沟通将会改善" |
| `health` | string | 是 | 健康运势简述 | "注意保持均衡饮食" |
| `wealth` | string | 是 | 财运简述 | "避免本周冲动消费" |

#### 幸运元素

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `luckyColor` | string | 是 | 幸运颜色（单个） | "Azure"（天蓝色） |
| `luckyNumber` | string | 是 | 幸运数字（单个） | "7" |
| `luckyDirection` | string | 是 | 幸运方位（通用） | "North"（北方） |
| `luckyTime` | string | 是 | 幸运时间段 | "9:00 AM - 11:00 AM" |
| `benefactor` | string | 是 | 贵人生肖 | "dragon"（龙） |

#### 特定方位（可选，用于仪表板显示）

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `loveDirection` | string | 否 | 爱情方位 | "East"（东方） |
| `joyDirection` | string | 否 | 喜庆方位 | "Southeast"（东南） |
| `wealthDirection` | string | 否 | 财运方位 | "West"（西方） |

#### 评分（1-5分制）

| 字段名 | 类型 | 必填 | 说明 | 取值范围 |
|--------|------|------|------|----------|
| `ratingCareer` | number | 是 | 事业运评分 | 1-5 |
| `ratingHealth` | number | 是 | 健康运评分 | 1-5 |
| `ratingLove` | number | 是 | 爱情运评分 | 1-5 |
| `ratingWealth` | number | 是 | 财运评分 | 1-5 |
| `overallScore` | number | 是 | 综合运势评分 | 0-100 |

#### 行动建议

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `do` | string | 是 | 建议做的事情 | "主动承担新项目" |
| `dont` | string | 是 | 建议避免的事情 | "避免不必要的争论" |

---

### `paid` 对象字段（付费用户内容）

#### 详细运势分析

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `careerDetailed` | string | 是 | 事业运势详细分析（长文本） | "本周是你职业生涯的重要转折点。星象显示有利于大胆行动和领导力的发挥..." |
| `loveDetailed` | string | 是 | 爱情运势详细分析（长文本） | "沟通是本周感情关系的基石。对于有伴侣的人来说..." |
| `healthDetailed` | string | 是 | 健康运势详细分析（长文本） | "你的能量水平可能会波动，因此优先考虑休息和营养至关重要..." |
| `wealthDetailed` | string | 是 | 财运详细分析（长文本） | "本周财务谨慎至关重要。虽然收入来源保持稳定..." |

#### 个性化建议

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `careerAdvice` | string | 是 | 事业方面的个性化建议 | "专注于一次完成一项任务以避免不堪重负。安排会议展示你的创新想法..." |
| `loveAdvice` | string | 是 | 爱情方面的个性化建议 | "与伴侣安排高质量的相处时间，不要分心。单身者要接受感兴趣的社交邀请..." |
| `healthAdvice` | string | 是 | 健康方面的个性化建议 | "每晚保证7-8小时睡眠。提前准备健康餐食以避免不健康的零食..." |
| `wealthAdvice` | string | 是 | 财运方面的个性化建议 | "审查你的月度预算并坚持执行。推迟几周内的非必要大额购买..." |

#### 评分（与免费版相同）

| 字段名 | 类型 | 必填 | 说明 | 取值范围 |
|--------|------|------|------|----------|
| `ratingCareer` | number | 是 | 事业运评分 | 1-5 |
| `ratingHealth` | number | 是 | 健康运评分 | 1-5 |
| `ratingLove` | number | 是 | 爱情运评分 | 1-5 |
| `ratingWealth` | number | 是 | 财运评分 | 1-5 |

#### 幸运元素（更丰富）

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `luckyColors` | string | 是 | 幸运颜色（多个，逗号分隔） | "Azure, Silver" |
| `luckyNumbers` | string | 是 | 幸运数字（多个，逗号分隔） | "3, 7, 18" |
| `luckyDirections` | string | 是 | 幸运方位（多个，逗号分隔） | "East, Southeast" |
| `luckyFlower` | string | 是 | 幸运花卉 | "Yellow Lily"（黄百合） |
| `luckyMineral` | string | 是 | 幸运矿石/宝石 | "Sapphire"（蓝宝石） |
| `luckyTime` | string | 是 | 幸运时间段 | "9:00 AM - 11:00 AM" |
| `benefactor` | string | 是 | 贵人生肖 | "dragon" |

#### 特定方位（可选）

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `loveDirection` | string | 否 | 爱情方位 | "East" |
| `joyDirection` | string | 否 | 喜庆方位 | "Southeast" |
| `wealthDirection` | string | 否 | 财运方位 | "West" |

#### 详细建议列表

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `dos` | array[string] | 是 | 建议做的事情列表（至少1项） | `["主动承担新项目展示领导力", "与所爱的人进行开放诚实的沟通", "优先自我照顾，倾听身体需要休息的信号", "审查财务并制定本周可靠预算"]` |
| `donts` | array[string] | 是 | 建议避免的事情列表（至少1项） | `["参与不必要的争论或职场八卦", "做出冲动购买或高风险财务决策", "忽视压力或疲劳感；避免过度劳累", "在个人关系中犹豫表达真实感受"]` |

---

## 完整请求示例

```json
{
  "zodiacSign": "tiger",
  "period": "week",
  "free": {
    "overview": "本周运势平稳，事业上有新机会出现，但财务方面需要谨慎。整体来说是积极向上的一周。",
    "career": "一个项目将需要你全力以赴的关注",
    "love": "与伴侣的沟通是关键",
    "health": "注意保持均衡饮食",
    "wealth": "本周避免冲动消费",
    "luckyColor": "Azure",
    "luckyNumber": "7",
    "luckyDirection": "North",
    "luckyTime": "9:00 AM - 11:00 AM",
    "benefactor": "dragon",
    "loveDirection": "East",
    "joyDirection": "Southeast",
    "wealthDirection": "West",
    "ratingCareer": 4,
    "ratingHealth": 3,
    "ratingLove": 5,
    "ratingWealth": 3,
    "overallScore": 75,
    "do": "主动承担新项目",
    "dont": "参与不必要的争论"
  },
  "paid": {
    "careerDetailed": "本周是你职业生涯的关键时刻。一个重大项目将需要你全力以赴，你的领导能力将受到考验。与同事的合作将富有成效，但要注意在表达自己想法时不要掩盖他人的贡献。周末可能会出现意想不到的晋升机会。做好准备，迅速果断地行动，因为犹豫可能意味着错过重要的职业提升机会。",
    "loveDetailed": "沟通是本周感情关系的基石。对于有伴侣的人来说，开放和诚实的对话将加强你们的联系。不要回避讨论更深层的情感或未来计划。单身者可能会通过社交或职业聚会遇到有趣的人，所以要对新的联系保持开放态度。然而，避免让表面魅力超过真实的情感表达。这是建立信任和理解的时刻。",
    "healthDetailed": "你的能量水平可能会波动，因此优先考虑休息和营养至关重要。注重保持均衡饮食，多摄入绿色蔬菜和瘦肉蛋白。工作压力可能会对你的身体产生影响，因此强烈建议采用放松技巧，如冥想或在大自然中轻松散步。注意身体发出的信号，避免将自己推向极限。",
    "wealthDetailed": "本周财务谨慎至关重要。虽然你的收入来源保持稳定，但会有冲动购买或投资的诱惑。在承诺之前要谨慎行事并彻底审查任何财务机会。坚持你的预算和长期财务目标。避免高风险投资，如果你正在考虑任何重大财务决策，请寻求专业建议。可能会出现意外支出，因此拥有应急基金将是有益的。",
    "careerAdvice": "专注于一次完成一项任务以避免不堪重负。安排会议展示你的创新想法。在评估新机会时相信你的直觉，但不要忽视尽职调查。与资深同事建立联系可能会打开大门。",
    "loveAdvice": "与伴侣安排高质量的相处时间，不要分心。单身者要接受通常感兴趣的社交邀请。诚实但友善地表达你的感受。积极倾听他人所说的话，包括言语和非言语。",
    "healthAdvice": "每晚保证7-8小时睡眠。提前准备健康餐食以避免不健康的零食。每天至少花15分钟进行正念或深呼吸练习。睡前听舒缓音乐以改善睡眠质量。",
    "wealthAdvice": "审查你的月度预算并坚持执行。推迟几周内的非必要大额购买。在进行任何投资之前进行彻底研究。将少量资金存入储蓄账户。",
    "ratingCareer": 4,
    "ratingHealth": 3,
    "ratingLove": 5,
    "ratingWealth": 3,
    "luckyColors": "Azure, Silver",
    "luckyNumbers": "3, 7, 18",
    "luckyDirections": "East, Southeast",
    "luckyFlower": "Yellow Lily",
    "luckyMineral": "Sapphire",
    "luckyTime": "9:00 AM - 11:00 AM",
    "benefactor": "dragon",
    "loveDirection": "East",
    "joyDirection": "Southeast",
    "wealthDirection": "West",
    "dos": [
      "主动承担新项目并展示你的领导技能",
      "与所爱的人进行开放诚实的沟通",
      "优先自我照顾，倾听身体需要休息的信号",
      "审查财务并制定本周可靠预算"
    ],
    "donts": [
      "参与不必要的争论或职场八卦",
      "做出冲动购买或高风险财务决策",
      "忽视压力或疲劳感；避免过度劳累",
      "在个人关系中犹豫表达真实感受"
    ]
  }
}
```

## 成功响应示例

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

## 错误响应示例

### 认证失败 (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authorization token"
}
```

### 验证失败 (400)
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "zodiacSign": "Zodiac sign must be one of: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig",
    "free.ratingCareer": "ratingCareer must be a number between 1 and 5"
  }
}
```

### 服务器错误 (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to update fortune. Please try again later."
}
```

## 使用 curl 测试

```bash
curl -X POST https://your-domain.com/api/webhook/fortune/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \
  -d @fortune-data.json
```

## 字段值建议

### 生肖对照表
- `rat` - 鼠
- `ox` - 牛
- `tiger` - 虎
- `rabbit` - 兔
- `dragon` - 龙
- `snake` - 蛇
- `horse` - 马
- `goat` - 羊
- `monkey` - 猴
- `rooster` - 鸡
- `dog` - 狗
- `pig` - 猪

### 方位选项
- `North` - 北
- `South` - 南
- `East` - 东
- `West` - 西
- `Northeast` - 东北
- `Northwest` - 西北
- `Southeast` - 东南
- `Southwest` - 西南

### 颜色示例
- `Red` - 红色
- `Blue` - 蓝色
- `Green` - 绿色
- `Gold` - 金色
- `Silver` - 银色
- `Purple` - 紫色
- `Orange` - 橙色
- `White` - 白色
- `Black` - 黑色
- `Yellow` - 黄色
- `Azure` - 天蓝色
- `Crimson` - 深红色
- `Teal` - 青色

### 花卉示例
- `Rose` - 玫瑰
- `Lily` - 百合
- `Lotus` - 莲花
- `Orchid` - 兰花
- `Peony` - 牡丹
- `Sunflower` - 向日葵
- `Tulip` - 郁金香
- `Daisy` - 雏菊

### 矿石/宝石示例
- `Gold` - 黄金
- `Silver` - 白银
- `Jade` - 玉
- `Ruby` - 红宝石
- `Sapphire` - 蓝宝石
- `Emerald` - 祖母绿
- `Amethyst` - 紫水晶
- `Diamond` - 钻石

## 注意事项

1. **数据完整性**：每次更新会覆盖指定生肖和周期的数据，请确保提供完整的 `free` 和 `paid` 对象
2. **评分一致性**：建议 `free` 和 `paid` 部分的评分保持一致
3. **文本长度**：详细分析文本（`*Detailed` 字段）建议在 100-500 字之间
4. **数组长度**：`dos` 和 `donts` 数组建议包含 3-5 项
5. **时间格式**：时间段建议使用 "HH:MM AM/PM - HH:MM AM/PM" 格式或 "All Day"
6. **数字格式**：`luckyNumbers` 可以是单个数字或多个数字的组合，用逗号分隔

## 健康检查

**端点**: `GET /api/webhook/fortune/health`

**响应**:
```json
{
  "success": true,
  "message": "Fortune Webhook API is running",
  "timestamp": "2026-01-12T06:13:27.000Z"
}
```

此端点不需要认证，可用于检查 API 是否正常运行。
