# 性别特定配对数据库设计方案

## 📋 需求说明

每个生肖配对（如 Rat-Rat）需要支持 **9种性别组合**，每种组合都有独立的 Romance 和 Business 配对内容。

### 9种性别组合

以 Rat-Rat 为例：

| # | Person A | Person B | 组合键 |
|---|----------|----------|--------|
| 1 | Male Rat | Male Rat | `male-male` |
| 2 | Male Rat | Female Rat | `male-female` |
| 3 | Male Rat | Others Rat | `male-others` |
| 4 | Female Rat | Male Rat | `female-male` |
| 5 | Female Rat | Female Rat | `female-female` |
| 6 | Female Rat | Others Rat | `female-others` |
| 7 | Others Rat | Male Rat | `others-male` |
| 8 | Others Rat | Female Rat | `others-female` |
| 9 | Others Rat | Others Rat | `others-others` |

## 🗄️ 数据库结构设计

### 方案 1: 嵌套在现有结构中（推荐）

```javascript
{
  "zodiacPair": {
    "zodiac1": "Rabbit",
    "zodiac2": "Snake"
  },
  
  // 基础配对数据（不考虑性别）
  "romance": {
    "free": {
      "score": 88,
      "rating": "Excellent",
      "summary": "Rabbit and Snake make a harmonious pair..."
    },
    "premium": {
      // ... 现有的 premium 内容
    }
  },
  
  "business": {
    "free": {
      "score": 75,
      "rating": "Good",
      "summary": "In business, Rabbit and Snake complement each other..."
    },
    "premium": {
      // ... 现有的 premium 内容
    }
  },
  
  // 性别特定配对数据（新增）
  "genderSpecificMatching": {
    "male-male": {
      "romance": {
        "score": 85,
        "rating": "Excellent",
        "summary": "Two male Rabbits and Snakes...",
        "detailedAnalysis": "In a romantic relationship between two males...",
        "highlights": [
          "Strong mutual understanding",
          "Shared values and goals"
        ]
      },
      "business": {
        "score": 78,
        "rating": "Good",
        "summary": "In business collaboration...",
        "detailedAnalysis": "Two males working together...",
        "highlights": [
          "Complementary skills",
          "Effective communication"
        ]
      }
    },
    
    "male-female": {
      "romance": {
        "score": 90,
        "rating": "Perfect",
        "summary": "Male Rabbit with Female Snake...",
        "detailedAnalysis": "This traditional pairing...",
        "highlights": [
          "Natural chemistry",
          "Balanced dynamics"
        ]
      },
      "business": {
        "score": 80,
        "rating": "Very Good",
        "summary": "In professional settings...",
        "detailedAnalysis": "The male Rabbit's approach...",
        "highlights": [
          "Diverse perspectives",
          "Strong collaboration"
        ]
      }
    },
    
    "male-others": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    },
    
    "female-male": {
      "romance": {
        "score": 88,
        "rating": "Excellent",
        "summary": "Female Rabbit with Male Snake...",
        "detailedAnalysis": "This pairing brings...",
        "highlights": [
          "Emotional depth",
          "Mutual respect"
        ]
      },
      "business": {
        "score": 82,
        "rating": "Very Good",
        "summary": "In business...",
        "detailedAnalysis": "The female Rabbit's intuition...",
        "highlights": [
          "Strategic thinking",
          "Balanced leadership"
        ]
      }
    },
    
    "female-female": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    },
    
    "female-others": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    },
    
    "others-male": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    },
    
    "others-female": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    },
    
    "others-others": {
      "romance": { /* ... */ },
      "business": { /* ... */ }
    }
  },
  
  "metadata": {
    "createdAt": "2025-12-28T00:00:00Z",
    "updatedAt": "2025-12-28T00:00:00Z",
    "version": "2.0"
  }
}
```

### 方案 2: 独立集合（备选）

如果数据量太大，可以将性别特定数据分离到独立集合：

```javascript
// Collection: zodiac-compatibility
{
  "zodiacPair": { "zodiac1": "Rabbit", "zodiac2": "Snake" },
  "romance": { /* 基础数据 */ },
  "business": { /* 基础数据 */ }
}

// Collection: zodiac-gender-matching
{
  "pairId": "Rabbit-Snake",
  "genderCombination": "male-female",
  "romance": { /* 性别特定数据 */ },
  "business": { /* 性别特定数据 */ }
}
```

## 📊 数据字段详细说明

### genderSpecificMatching 字段结构

每个性别组合包含：

```javascript
{
  "romance": {
    "score": 88,                    // 匹配分数 (0-100)
    "rating": "Excellent",          // 评级 (Perfect/Excellent/Good/Fair/Poor)
    "summary": "简短摘要...",        // 免费内容：100-200字
    "detailedAnalysis": "详细分析...", // 收费内容：500-1000字
    "highlights": [                 // 收费内容：关键亮点
      "亮点1",
      "亮点2",
      "亮点3"
    ],
    "challenges": [                 // 收费内容：潜在挑战（可选）
      "挑战1",
      "挑战2"
    ],
    "advice": "建议..."             // 收费内容：关系建议（可选）
  },
  "business": {
    "score": 75,
    "rating": "Good",
    "summary": "简短摘要...",
    "detailedAnalysis": "详细分析...",
    "highlights": [
      "亮点1",
      "亮点2"
    ],
    "challenges": [
      "挑战1"
    ],
    "advice": "建议..."
  }
}
```

## 🔄 查询逻辑

### 前端查询示例

```javascript
async function getGenderSpecificMatching(zodiac1, zodiac2, gender1, gender2, matchType) {
  // 1. 生成 pair ID
  const pairId = generatePairId(zodiac1, zodiac2);
  
  // 2. 生成性别组合键
  const genderKey = `${gender1}-${gender2}`;
  
  // 3. 获取文档
  const docRef = doc(db, 'zodiac-compatibility', pairId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('配对数据不存在');
  }
  
  const data = docSnap.data();
  
  // 4. 获取性别特定数据
  const genderSpecific = data.genderSpecificMatching?.[genderKey];
  
  if (!genderSpecific) {
    // 如果没有性别特定数据，回退到基础数据
    console.warn(`没有找到 ${genderKey} 的特定数据，使用基础数据`);
    return data[matchType];
  }
  
  // 5. 返回对应类型的数据
  return genderSpecific[matchType];
}

// 使用示例
const result = await getGenderSpecificMatching(
  'Rabbit',  // zodiac1
  'Snake',   // zodiac2
  'female',  // gender1
  'male',    // gender2
  'romance'  // matchType
);

console.log(result.score);           // 88
console.log(result.summary);         // 免费内容
console.log(result.detailedAnalysis); // 收费内容
```

## 🎨 管理后台设计

### UI 布局

```
┌─────────────────────────────────────────────────┐
│  Select Zodiac Pair                             │
│  Zodiac 1: [Rabbit ▼]  Zodiac 2: [Snake ▼]     │
│  [Load Data]                                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Select Gender Combination                      │
│  ┌──────────────────────────────────────────┐  │
│  │ [♂♂ Male-Male]  [♂♀ Male-Female]        │  │
│  │ [♂⚪ Male-Others] [♀♂ Female-Male]       │  │
│  │ [♀♀ Female-Female] [♀⚪ Female-Others]   │  │
│  │ [⚪♂ Others-Male] [⚪♀ Others-Female]     │  │
│  │ [⚪⚪ Others-Others]                       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Tabs: [Romance] [Business]                     │
│                                                 │
│  ┌─ Romance Content ─────────────────────────┐ │
│  │ Score: [88]                               │ │
│  │ Rating: [Excellent ▼]                     │ │
│  │ Summary: [文本框]                         │ │
│  │ Detailed Analysis: [大文本框]             │ │
│  │ Highlights:                               │ │
│  │   • [亮点1]                               │ │
│  │   • [亮点2]                               │ │
│  │   [+ Add Highlight]                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Save Changes]                                 │
└─────────────────────────────────────────────────┘
```

### 工作流程

1. **选择生肖配对**: Rabbit + Snake
2. **选择性别组合**: 从9个按钮中选择一个（如 Female-Male）
3. **切换标签**: Romance 或 Business
4. **编辑内容**: 修改分数、摘要、详细分析等
5. **保存**: 保存到 Firestore

## 🔧 实现步骤

### 步骤 1: 更新数据库结构

为所有现有的配对文档添加 `genderSpecificMatching` 字段：

```javascript
// 脚本: add-gender-specific-matching.js
const genderCombinations = [
  'male-male', 'male-female', 'male-others',
  'female-male', 'female-female', 'female-others',
  'others-male', 'others-female', 'others-others'
];

async function addGenderSpecificMatching(pairId) {
  const docRef = doc(db, 'zodiac-compatibility', pairId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return;
  
  const data = docSnap.data();
  const genderSpecificMatching = {};
  
  // 为每个性别组合创建默认数据
  genderCombinations.forEach(combo => {
    genderSpecificMatching[combo] = {
      romance: {
        score: data.romance.free.score, // 使用基础分数
        rating: data.romance.free.rating,
        summary: `${combo} specific romance summary...`,
        detailedAnalysis: '',
        highlights: []
      },
      business: {
        score: data.business.free.score,
        rating: data.business.free.rating,
        summary: `${combo} specific business summary...`,
        detailedAnalysis: '',
        highlights: []
      }
    };
  });
  
  // 更新文档
  await setDoc(docRef, {
    ...data,
    genderSpecificMatching
  });
}
```

### 步骤 2: 更新管理后台

修改 `admin-matching.html` 和 `admin-matching.js`：

1. 添加性别组合选择器（9个按钮）
2. 根据选择的性别组合加载对应数据
3. 提供编辑界面
4. 保存时更新对应的性别组合数据

### 步骤 3: 更新前端用户界面

修改 `matching.js`：

1. 根据用户选择的性别获取对应的性别特定数据
2. 显示性别特定的分数和内容
3. 如果没有性别特定数据，回退到基础数据

## 📈 数据量估算

- **12个生肖** × **12个生肖** = **144个配对**
- 每个配对有 **9种性别组合**
- 每种组合有 **2种类型**（Romance + Business）

**总计**: 144 × 9 × 2 = **2,592 个数据条目**

### Firestore 存储估算

每个性别特定条目约 1KB：
- 2,592 × 1KB = **2.5 MB**

完全在 Firestore 免费额度内（1GB 存储）。

## ⚠️ 注意事项

### 1. 向后兼容

确保现有的基础数据（`romance.free`, `business.free`）仍然存在，作为：
- 没有性别特定数据时的回退
- 不需要性别区分时的默认显示

### 2. 数据一致性

- 性别特定的分数应该与基础分数相近（±10分以内）
- 评级应该基于分数自动计算
- 所有9种组合都应该有完整数据

### 3. 性能优化

- 只加载当前需要的性别组合数据
- 使用缓存减少 Firestore 读取
- 考虑使用 Cloud Functions 预计算常见组合

## 🚀 迁移计划

### 阶段 1: 数据结构更新（1-2天）
- ✅ 设计新的数据结构
- ⬜ 编写迁移脚本
- ⬜ 测试迁移脚本
- ⬜ 执行迁移（添加默认数据）

### 阶段 2: 管理后台开发（2-3天）
- ⬜ 添加性别组合选择器
- ⬜ 实现数据加载逻辑
- ⬜ 实现编辑界面
- ⬜ 实现保存逻辑
- ⬜ 测试所有功能

### 阶段 3: 前端用户界面更新（1-2天）
- ⬜ 更新查询逻辑
- ⬜ 更新显示逻辑
- ⬜ 添加回退机制
- ⬜ 测试用户体验

### 阶段 4: 内容填充（持续）
- ⬜ 为每个性别组合编写专门内容
- ⬜ 审核和优化内容质量

## 📝 总结

这个设计方案：

✅ **完全支持** 9种性别组合  
✅ **独立内容** 每种组合都有专门的 Romance 和 Business 内容  
✅ **向后兼容** 保留现有基础数据作为回退  
✅ **可扩展** 未来可以轻松添加更多字段  
✅ **性能良好** 数据量在合理范围内  
✅ **易于管理** 管理后台界面清晰直观  

**建议采用方案 1（嵌套结构）**，因为它：
- 数据集中，易于管理
- 查询简单，只需一次读取
- 事务性更好，更新更可靠
