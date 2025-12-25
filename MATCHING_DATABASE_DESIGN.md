# 生肖匹配数据库设计文档

## 一、数据库表结构

### 1. Matching 集合 (Collection)

每个文档代表一个生肖与其他所有生肖（包括自己）的匹配关系。

#### 文档结构示例：

```javascript
{
  // 基本信息
  "zodiacSign": "鼠",           // 当前生肖（中文）
  "zodiacSignEn": "Rat",        // 当前生肖（英文）
  
  // 婚恋爱情匹配数据
  "romanceMatching": {
    "鼠": {
      "matchIndex": 75,                    // 匹配指数 (0-100)
      "briefDescription": "两只老鼠在一起...",  // 简要说明（免费）
      "detailedDescription": "详细的性格分析...", // 详细说明（收费）
      "genderSpecific": {                   // 性别特定说明
        "maleMale": "两位男性...",
        "maleFemale": "男鼠女鼠...",
        "femaleMale": "女鼠男鼠...",
        "femaleFemale": "两位女性..."
      }
    },
    "牛": {
      "matchIndex": 88,
      "briefDescription": "鼠与牛的组合非常和谐...",
      "detailedDescription": "鼠的机智与牛的稳重...",
      "genderSpecific": {
        "maleMale": "...",
        "maleFemale": "...",
        "femaleMale": "...",
        "femaleFemale": "..."
      }
    },
    // ... 其他10个生肖
  },
  
  // 生意合作匹配数据
  "businessMatching": {
    "鼠": {
      "matchIndex": 70,
      "briefDescription": "两只老鼠合作...",
      "detailedDescription": "在商业合作中...",
      "genderSpecific": {
        "maleMale": "...",
        "maleFemale": "...",
        "femaleMale": "...",
        "femaleFemale": "..."
      }
    },
    "牛": {
      "matchIndex": 92,
      "briefDescription": "鼠与牛的商业组合...",
      "detailedDescription": "鼠的敏锐商业嗅觉...",
      "genderSpecific": {
        "maleMale": "...",
        "maleFemale": "...",
        "femaleMale": "...",
        "femaleFemale": "..."
      }
    },
    // ... 其他10个生肖
  },
  
  // 婚恋爱情相克数据
  "romanceConflict": {
    "鼠": {
      "conflictIndex": 30,                 // 相克指数 (0-100，越高越相克)
      "briefDescription": "同属相可能产生的矛盾...",
      "detailedDescription": "详细的相克分析...",
      "resolutionAdvice": "化解建议..."      // 化解方法（收费）
    },
    "牛": {
      "conflictIndex": 15,
      "briefDescription": "鼠牛组合的潜在冲突...",
      "detailedDescription": "虽然整体和谐...",
      "resolutionAdvice": "建议双方..."
    },
    // ... 其他10个生肖
  },
  
  // 生意合作相克数据
  "businessConflict": {
    "鼠": {
      "conflictIndex": 35,
      "briefDescription": "商业合作中的摩擦点...",
      "detailedDescription": "两只老鼠在商业上...",
      "resolutionAdvice": "建议明确分工..."
    },
    "牛": {
      "conflictIndex": 20,
      "briefDescription": "鼠牛商业合作的挑战...",
      "detailedDescription": "节奏差异可能导致...",
      "resolutionAdvice": "互相尊重..."
    },
    // ... 其他10个生肖
  },
  
  // 元数据
  "createdAt": "2025-12-26T00:00:00Z",
  "updatedAt": "2025-12-26T00:00:00Z"
}
```

## 二、数据字段说明

### 2.1 基本字段
- **zodiacSign**: 生肖中文名称（鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪）
- **zodiacSignEn**: 生肖英文名称（Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig）

### 2.2 匹配数据字段（romanceMatching & businessMatching）
每个生肖对应的匹配数据包含：
- **matchIndex**: 匹配指数（0-100）
  - 0-30: Poor（差）
  - 31-50: Fair（一般）
  - 51-70: Good（良好）
  - 71-85: Very Good（很好）
  - 86-100: Excellent（极佳）

- **briefDescription**: 简要结果说明（免费内容，100-200字）
- **detailedDescription**: 详细说明（收费内容，500-1000字）
- **genderSpecific**: 性别特定说明（可选，收费内容）
  - maleMale: 两位男性的匹配说明
  - maleFemale: 男A女B的匹配说明
  - femaleMale: 女A男B的匹配说明
  - femaleFemale: 两位女性的匹配说明

### 2.3 相克数据字段（romanceConflict & businessConflict）
每个生肖对应的相克数据包含：
- **conflictIndex**: 相克指数（0-100，数值越高表示相克越严重）
  - 0-20: Low（低）
  - 21-40: Moderate（中等）
  - 41-60: High（高）
  - 61-80: Very High（很高）
  - 81-100: Extreme（极高）

- **briefDescription**: 相克简要说明（收费内容）
- **detailedDescription**: 相克详细说明（收费内容）
- **resolutionAdvice**: 化解建议（收费内容）

## 三、Firestore 集合结构

```
zodiac-matching/
├── 鼠/
│   └── (包含上述完整文档结构)
├── 牛/
│   └── (包含上述完整文档结构)
├── 虎/
│   └── (包含上述完整文档结构)
├── 兔/
│   └── (包含上述完整文档结构)
├── 龙/
│   └── (包含上述完整文档结构)
├── 蛇/
│   └── (包含上述完整文档结构)
├── 马/
│   └── (包含上述完整文档结构)
├── 羊/
│   └── (包含上述完整文档结构)
├── 猴/
│   └── (包含上述完整文档结构)
├── 鸡/
│   └── (包含上述完整文档结构)
├── 狗/
│   └── (包含上述完整文档结构)
└── 猪/
    └── (包含上述完整文档结构)
```

## 四、查询逻辑

### 4.1 查询匹配数据
当用户选择：
- Person A: 鼠（女）
- Person B: 兔（女）
- 匹配类型: 婚恋爱情

查询步骤：
1. 从 `zodiac-matching` 集合获取文档 ID 为 `鼠` 的文档
2. 读取 `romanceMatching.兔` 对象
3. 显示：
   - 免费内容：`matchIndex` 和 `briefDescription`
   - 收费内容：`detailedDescription` 和 `genderSpecific.femaleFemale`

### 4.2 查询相克数据
继续上面的例子，查询相克信息：
1. 从同一文档读取 `romanceConflict.兔` 对象
2. 显示：
   - `conflictIndex`（收费）
   - `briefDescription`（收费）
   - `detailedDescription`（收费）
   - `resolutionAdvice`（收费）

## 五、数据填充示例

### 5.1 创建种子数据脚本
创建 `seed_matching.js` 文件来填充初始数据：

```javascript
import { db } from './app.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const zodiacSigns = [
  { cn: '鼠', en: 'Rat' },
  { cn: '牛', en: 'Ox' },
  { cn: '虎', en: 'Tiger' },
  { cn: '兔', en: 'Rabbit' },
  { cn: '龙', en: 'Dragon' },
  { cn: '蛇', en: 'Snake' },
  { cn: '马', en: 'Horse' },
  { cn: '羊', en: 'Goat' },
  { cn: '猴', en: 'Monkey' },
  { cn: '鸡', en: 'Rooster' },
  { cn: '狗', en: 'Dog' },
  { cn: '猪', en: 'Pig' }
];

async function seedMatchingData() {
  for (const sign of zodiacSigns) {
    const matchingData = {
      zodiacSign: sign.cn,
      zodiacSignEn: sign.en,
      romanceMatching: {},
      businessMatching: {},
      romanceConflict: {},
      businessConflict: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 为每个生肖创建与其他生肖的匹配数据
    for (const targetSign of zodiacSigns) {
      // 婚恋匹配
      matchingData.romanceMatching[targetSign.cn] = {
        matchIndex: Math.floor(Math.random() * 40) + 60, // 示例：60-100
        briefDescription: `${sign.cn}与${targetSign.cn}的婚恋匹配简要说明...`,
        detailedDescription: `${sign.cn}与${targetSign.cn}的婚恋匹配详细分析...`,
        genderSpecific: {
          maleMale: `两位男性的特殊说明...`,
          maleFemale: `男${sign.cn}女${targetSign.cn}的说明...`,
          femaleMale: `女${sign.cn}男${targetSign.cn}的说明...`,
          femaleFemale: `两位女性的特殊说明...`
        }
      };
      
      // 生意匹配
      matchingData.businessMatching[targetSign.cn] = {
        matchIndex: Math.floor(Math.random() * 40) + 60,
        briefDescription: `${sign.cn}与${targetSign.cn}的商业合作简要说明...`,
        detailedDescription: `${sign.cn}与${targetSign.cn}的商业合作详细分析...`,
        genderSpecific: {
          maleMale: `两位男性的商业合作...`,
          maleFemale: `男${sign.cn}女${targetSign.cn}的商业合作...`,
          femaleMale: `女${sign.cn}男${targetSign.cn}的商业合作...`,
          femaleFemale: `两位女性的商业合作...`
        }
      };
      
      // 婚恋相克
      matchingData.romanceConflict[targetSign.cn] = {
        conflictIndex: Math.floor(Math.random() * 30) + 10, // 示例：10-40
        briefDescription: `${sign.cn}与${targetSign.cn}的婚恋相克简要说明...`,
        detailedDescription: `${sign.cn}与${targetSign.cn}的婚恋相克详细分析...`,
        resolutionAdvice: `化解${sign.cn}与${targetSign.cn}相克的建议...`
      };
      
      // 生意相克
      matchingData.businessConflict[targetSign.cn] = {
        conflictIndex: Math.floor(Math.random() * 30) + 10,
        briefDescription: `${sign.cn}与${targetSign.cn}的商业相克简要说明...`,
        detailedDescription: `${sign.cn}与${targetSign.cn}的商业相克详细分析...`,
        resolutionAdvice: `化解${sign.cn}与${targetSign.cn}商业相克的建议...`
      };
    }
    
    // 保存到 Firestore
    await setDoc(doc(db, 'zodiac-matching', sign.cn), matchingData);
    console.log(`已创建 ${sign.cn} 的匹配数据`);
  }
  
  console.log('所有匹配数据创建完成！');
}

// 执行种子数据填充
seedMatchingData();
```

## 六、前端查询示例

```javascript
import { db } from './app.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

async function getMatchingData(zodiacA, zodiacB, matchType, genderA, genderB) {
  try {
    // 获取 zodiacA 的文档
    const docRef = doc(db, 'zodiac-matching', zodiacA);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('数据不存在');
    }
    
    const data = docSnap.data();
    
    // 根据匹配类型选择数据
    const matchingKey = matchType === 'romance' ? 'romanceMatching' : 'businessMatching';
    const conflictKey = matchType === 'romance' ? 'romanceConflict' : 'businessConflict';
    
    // 获取匹配数据
    const matchingData = data[matchingKey][zodiacB];
    const conflictData = data[conflictKey][zodiacB];
    
    // 确定性别组合
    const genderKey = `${genderA}${genderB.charAt(0).toUpperCase() + genderB.slice(1)}`;
    
    return {
      matching: {
        index: matchingData.matchIndex,
        brief: matchingData.briefDescription,
        detailed: matchingData.detailedDescription,
        genderSpecific: matchingData.genderSpecific[genderKey]
      },
      conflict: {
        index: conflictData.conflictIndex,
        brief: conflictData.briefDescription,
        detailed: conflictData.detailedDescription,
        resolution: conflictData.resolutionAdvice
      }
    };
  } catch (error) {
    console.error('获取匹配数据失败:', error);
    throw error;
  }
}
```

## 七、权限控制

### 7.1 免费内容
- `romanceMatching.*.matchIndex`
- `romanceMatching.*.briefDescription`
- `businessMatching.*.matchIndex`
- `businessMatching.*.briefDescription`

### 7.2 收费内容
- `romanceMatching.*.detailedDescription`
- `romanceMatching.*.genderSpecific`
- `businessMatching.*.detailedDescription`
- `businessMatching.*.genderSpecific`
- 所有 `romanceConflict` 数据
- 所有 `businessConflict` 数据

## 八、索引建议

在 Firestore 中，由于我们使用文档 ID 进行查询，不需要额外的索引。

## 九、数据维护

### 9.1 更新数据
使用 Admin 页面或专门的管理界面来更新匹配数据。

### 9.2 数据验证
确保：
- 所有 matchIndex 在 0-100 范围内
- 所有 conflictIndex 在 0-100 范围内
- 所有文本字段都有内容
- 每个生肖都有完整的 12 个匹配对象

## 十、未来扩展

### 10.1 可能的扩展字段
- `compatibility`: 综合兼容性评分
- `strengths`: 组合优势列表
- `challenges`: 组合挑战列表
- `famousCouples`: 著名的该组合案例
- `luckyElements`: 幸运元素（颜色、数字、方位等）

### 10.2 多语言支持
可以添加 `locale` 字段来支持多语言：
```javascript
{
  "briefDescription": {
    "zh": "中文说明",
    "en": "English description"
  }
}
```
