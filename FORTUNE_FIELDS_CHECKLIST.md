# Fortune Webhook 字段清单（快速参考）

## 📋 顶层必填字段

| 字段 | 类型 | 可选值 | 说明 |
|------|------|--------|------|
| `zodiacSign` | string | rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig | 生肖 |
| `period` | string | today, week, month, year | 时间周期 |
| `free` | object | - | 免费用户内容 |
| `paid` | object | - | 付费用户内容 |

---

## 🆓 Free 对象（18个字段）

### 文本字段（12个）
| 字段 | 说明 | 示例 |
|------|------|------|
| `overview` | 运势总览 | "本周运势平稳，事业上有新机会..." |
| `career` | 事业运势 | "工作中会有新项目需要你全力投入" |
| `love` | 爱情运势 | "与伴侣的沟通将会改善" |
| `health` | 健康运势 | "注意保持均衡饮食" |
| `wealth` | 财运 | "避免本周冲动消费" |
| `luckyColor` | 幸运颜色 | "Azure" |
| `luckyNumber` | 幸运数字 | "7" |
| `luckyDirection` | 幸运方位 | "North" |
| `luckyTime` | 幸运时间 | "9:00 AM - 11:00 AM" |
| `benefactor` | 贵人生肖 | "dragon" |
| `do` | 建议做 | "主动承担新项目" |
| `dont` | 建议避免 | "参与不必要的争论" |

### 评分字段（5个，数字类型）
| 字段 | 范围 | 说明 |
|------|------|------|
| `ratingCareer` | 1-5 | 事业运评分 |
| `ratingHealth` | 1-5 | 健康运评分 |
| `ratingLove` | 1-5 | 爱情运评分 |
| `ratingWealth` | 1-5 | 财运评分 |
| `overallScore` | 0-100 | 综合运势评分 |

### 可选方位字段（3个）
| 字段 | 说明 |
|------|------|
| `loveDirection` | 爱情方位 |
| `joyDirection` | 喜庆方位 |
| `wealthDirection` | 财运方位 |

---

## 💎 Paid 对象（22个字段）

### 详细分析（4个长文本）
| 字段 | 说明 |
|------|------|
| `careerDetailed` | 事业运势详细分析 |
| `loveDetailed` | 爱情运势详细分析 |
| `healthDetailed` | 健康运势详细分析 |
| `wealthDetailed` | 财运详细分析 |

### 个性化建议（4个文本）
| 字段 | 说明 |
|------|------|
| `careerAdvice` | 事业建议 |
| `loveAdvice` | 爱情建议 |
| `healthAdvice` | 健康建议 |
| `wealthAdvice` | 财运建议 |

### 评分（4个数字，1-5）
| 字段 | 说明 |
|------|------|
| `ratingCareer` | 事业运评分 |
| `ratingHealth` | 健康运评分 |
| `ratingLove` | 爱情运评分 |
| `ratingWealth` | 财运评分 |

### 幸运元素（7个文本）
| 字段 | 说明 | 示例 |
|------|------|------|
| `luckyColors` | 幸运颜色（多个） | "Azure, Silver" |
| `luckyNumbers` | 幸运数字（多个） | "3, 7, 18" |
| `luckyDirections` | 幸运方位（多个） | "East, Southeast" |
| `luckyFlower` | 幸运花卉 | "Yellow Lily" |
| `luckyMineral` | 幸运矿石 | "Sapphire" |
| `luckyTime` | 幸运时间 | "9:00 AM - 11:00 AM" |
| `benefactor` | 贵人生肖 | "dragon" |

### 可选方位（3个）
| 字段 | 说明 |
|------|------|
| `loveDirection` | 爱情方位（可选） |
| `joyDirection` | 喜庆方位（可选） |
| `wealthDirection` | 财运方位（可选） |

### 建议列表（2个数组）
| 字段 | 类型 | 说明 |
|------|------|------|
| `dos` | array[string] | 建议做的事情列表（至少1项） |
| `donts` | array[string] | 建议避免的事情列表（至少1项） |

---

## 🎨 常用值参考

### 生肖（zodiacSign）
```
rat(鼠), ox(牛), tiger(虎), rabbit(兔), dragon(龙), snake(蛇),
horse(马), goat(羊), monkey(猴), rooster(鸡), dog(狗), pig(猪)
```

### 时间周期（period）
```
today(今日), week(本周), month(本月), year(本年)
```

### 方位（Direction）
```
North(北), South(南), East(东), West(西),
Northeast(东北), Northwest(西北), Southeast(东南), Southwest(西南)
```

### 颜色（Color）
```
Red, Blue, Green, Gold, Silver, Purple, Orange, 
White, Black, Yellow, Azure, Crimson, Teal
```

### 花卉（Flower）
```
Rose(玫瑰), Lily(百合), Lotus(莲花), Orchid(兰花),
Peony(牡丹), Sunflower(向日葵), Tulip(郁金香), Daisy(雏菊)
```

### 矿石（Mineral）
```
Gold(黄金), Silver(白银), Jade(玉), Ruby(红宝石),
Sapphire(蓝宝石), Emerald(祖母绿), Amethyst(紫水晶), Diamond(钻石)
```

---

## 📊 字段总数统计

| 部分 | 字段数 | 必填 | 可选 |
|------|--------|------|------|
| 顶层 | 4 | 4 | 0 |
| Free | 18 | 15 | 3 |
| Paid | 22 | 19 | 3 |
| **总计** | **44** | **38** | **6** |

---

## ✅ 快速检查清单

使用此清单确保你的 JSON 包含所有必填字段：

### 顶层
- [ ] zodiacSign
- [ ] period
- [ ] free (对象)
- [ ] paid (对象)

### Free 部分（15个必填）
- [ ] overview
- [ ] career
- [ ] love
- [ ] health
- [ ] wealth
- [ ] luckyColor
- [ ] luckyNumber
- [ ] luckyDirection
- [ ] luckyTime
- [ ] benefactor
- [ ] do
- [ ] dont
- [ ] ratingCareer (1-5)
- [ ] ratingHealth (1-5)
- [ ] ratingLove (1-5)
- [ ] ratingWealth (1-5)
- [ ] overallScore (0-100)

### Paid 部分（19个必填）
- [ ] careerDetailed
- [ ] loveDetailed
- [ ] healthDetailed
- [ ] wealthDetailed
- [ ] careerAdvice
- [ ] loveAdvice
- [ ] healthAdvice
- [ ] wealthAdvice
- [ ] ratingCareer (1-5)
- [ ] ratingHealth (1-5)
- [ ] ratingLove (1-5)
- [ ] ratingWealth (1-5)
- [ ] luckyColors
- [ ] luckyNumbers
- [ ] luckyDirections
- [ ] luckyFlower
- [ ] luckyMineral
- [ ] luckyTime
- [ ] benefactor
- [ ] dos (数组，至少1项)
- [ ] donts (数组，至少1项)

---

## 💡 提示

1. **评分一致性**：建议 free 和 paid 的评分字段保持相同值
2. **文本长度**：
   - 简短文本（career, love等）：20-100字
   - 详细文本（careerDetailed等）：100-500字
   - 建议文本（careerAdvice等）：50-200字
3. **数组长度**：dos 和 donts 建议各包含 3-5 项
4. **多值字段**：luckyColors, luckyNumbers, luckyDirections 用逗号和空格分隔，如 "Azure, Silver"
