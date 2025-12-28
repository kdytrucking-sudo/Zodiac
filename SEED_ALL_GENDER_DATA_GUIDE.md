# 全量性别特定数据 Seed 脚本使用指南

## 📋 概述

`seed-all-gender-data.mjs` 脚本会为数据库中的**所有 144 个生肖配对**生成完整的性别特定匹配数据。

### 数据规模

- **配对数量**: 78 个（12 个生肖的所有组合，包括同属相）
- **每个配对**: 6 种性别组合 × 2 种匹配类型 = 12 个数据条目
- **总数据条目**: 78 × 12 = **936 个数据条目**

## 🎯 生成的数据结构

每个配对会生成以下数据：

### 6 种性别组合

1. **male-male** (♂♂)
2. **male-female** (♂♀)
3. **male-others** (♂⚪)
4. **female-female** (♀♀)
5. **female-others** (♀⚪)
6. **others-others** (⚪⚪)

### 每种组合包含

- **Romance 数据**:
  - score (分数)
  - rating (评级)
  - summary (摘要)
  - detailedAnalysis (详细分析)
  - highlights (亮点列表)
  - challenges (挑战列表)
  - advice (建议)

- **Business 数据**:
  - 相同的字段结构

## 🚀 使用方法

### 方法 1: 直接运行（推荐）

```bash
node scripts/seed-all-gender-data.mjs
```

这将：
- ✅ 检查每个配对是否已存在性别特定数据
- ✅ 只为缺少数据的配对生成新数据
- ✅ 跳过已有数据的配对
- ✅ 显示详细的进度和统计信息

### 方法 2: 查看帮助

```bash
node scripts/seed-all-gender-data.mjs --help
```

### 方法 3: 强制重新生成（未实现）

如果需要强制重新生成所有数据，可以修改脚本中的检查逻辑。

## 📊 执行过程

### 1. 启动信息

```
🚀 Starting comprehensive gender-specific data seeding...

📊 Total pairings to process: 78
📊 Data entries per pairing: 6 gender combinations × 2 match types = 12
📊 Total data entries to generate: 936
```

### 2. 进度更新

每处理 10 个配对会显示进度：

```
📈 Progress: 10/78 pairings (5.2s elapsed)
   ✅ Success: 8 | ⏭️  Skipped: 2 | ❌ Errors: 0
```

### 3. 完成总结

```
============================================================
📊 SEEDING SUMMARY
============================================================
⏱️  Total time: 45.3 seconds
📦 Total pairings processed: 78
✅ Successfully seeded: 76 pairings (912 data entries)
⏭️  Skipped (already exists): 2 pairings
❌ Errors: 0 pairings
============================================================
```

## 🎨 内容生成逻辑

### 基础分数计算

脚本使用预定义的兼容性矩阵来确定基础分数：

```javascript
const compatibilityMatrix = {
  'Rat': { 
    'Rat': 72, 
    'Ox': 88, 
    'Dragon': 92,
    // ... 其他配对
  },
  // ... 其他生肖
};
```

### 性别调整

基于性别组合应用调整：

| 性别组合 | Romance 调整 | Business 调整 |
|---------|-------------|--------------|
| male-male | -2 | +5 |
| male-female | +3 | 0 |
| male-others | 0 | 0 |
| female-female | +5 | +2 |
| female-others | 0 | 0 |
| others-others | 0 | 0 |

### 内容生成

脚本会根据以下信息生成内容：

1. **生肖特征**: 每个生肖的正面和负面特质
2. **是否同属相**: 同属相配对有特殊的内容逻辑
3. **性别组合**: 不同性别组合有不同的描述
4. **分数等级**: 根据最终分数生成相应的评价

## 📝 生成内容示例

### Rat-Rat, Female-Female, Romance

```javascript
{
  score: 77,
  rating: "Good",
  summary: "In a romantic relationship between two females, this Rat-Rat pairing shows good compatibility. Both partners share the Rat's intelligent and adaptable nature, creating deep mutual understanding while potentially amplifying both strengths and challenges.",
  detailedAnalysis: "When two females come together in a Rat-Rat romantic pairing, they create a relationship with unique dynamics shaped by both their zodiac characteristics and gender combination. Sharing the same zodiac sign means they deeply understand each other's motivations, values, and behavioral patterns...",
  highlights: [
    "♀♀ Deep mutual understanding of Rat characteristics",
    "Shared values around intelligent and adaptable",
    "Strong emotional resonance and intuitive connection",
    "Gender-specific dynamics enhance relationship depth"
  ],
  challenges: [
    "Both may exhibit opportunistic tendencies simultaneously",
    "Shared anxious nature can amplify issues",
    "Navigating gender-specific expectations and dynamics"
  ],
  advice: "For two females in this Rat-Rat pairing, focus on open communication about both zodiac-based and gender-based relationship dynamics. Recognize when you're both exhibiting the same Rat tendencies and balance each other. Embrace the unique strengths this gender combination brings while being mindful of potential challenges."
}
```

## ⚠️ 注意事项

### 1. 数据质量

- ✅ 脚本生成的是**自动化内容**，质量中等
- ⚠️ 建议后续人工审核和优化重要配对
- 💡 可以先使用自动生成的数据，然后逐步替换为高质量人工内容

### 2. 执行时间

- 预计总执行时间：**30-60 秒**（取决于网络速度）
- 每个配对之间有 100ms 延迟，避免过载 Firestore

### 3. 数据覆盖

脚本会检查现有数据：
- 如果配对文档不存在 → 跳过
- 如果已有 `genderSpecificMatching` 数据 → 跳过
- 只为缺少数据的配对生成新内容

### 4. 成本考虑

- **Firestore 读取**: 78 次（检查现有数据）
- **Firestore 写入**: 最多 78 次（如果全部需要生成）
- 在免费额度内，但建议在非高峰时段运行

## 🔧 自定义和优化

### 调整兼容性分数

编辑 `compatibilityMatrix` 对象：

```javascript
const compatibilityMatrix = {
  'Rat': { 
    'Ox': 88,  // 修改这里的分数
    // ...
  }
};
```

### 调整性别调整值

编辑 `applyGenderAdjustment` 函数中的 `adjustments` 对象：

```javascript
const adjustments = {
  'male-male': {
    romance: -2,  // 修改这里
    business: 5
  },
  // ...
};
```

### 优化内容生成

修改 `generateRomanceContent` 和 `generateBusinessContent` 函数来改进内容质量。

## 📈 后续步骤

### 1. 运行脚本

```bash
node scripts/seed-all-gender-data.mjs
```

### 2. 验证数据

在 Firebase Console 中检查几个配对，确认数据已正确生成。

### 3. 测试前端

访问 `http://localhost:8080/matching.html` 测试不同的配对和性别组合。

### 4. 内容优化

识别重要的配对（如热门组合），手动优化其内容质量：

**优先优化列表**：
- Rat-Rat, Rat-Ox, Rat-Dragon (Rat 的重要配对)
- Dragon-Dragon, Dragon-Monkey, Dragon-Rooster (Dragon 的重要配对)
- Rabbit-Snake, Rabbit-Goat, Rabbit-Pig (Rabbit 的重要配对)
- 其他高分配对

### 5. 收集反馈

- 监控用户对不同配对内容的反馈
- 根据反馈优先优化被查询最多的配对

## 🎯 质量提升建议

### 短期（本周）

1. ✅ 运行脚本生成所有基础数据
2. ⬜ 手动优化 10-20 个热门配对
3. ⬜ 测试所有性别组合的显示效果

### 中期（下周）

4. ⬜ 基于用户反馈优化内容
5. ⬜ 添加更多个性化的细节
6. ⬜ 优化 50% 的配对内容

### 长期（持续）

7. ⬜ 所有配对达到高质量标准
8. ⬜ 定期更新和改进内容
9. ⬜ 添加更多维度的分析

## 🆘 故障排除

### 问题 1: Permission Denied

**错误**: `7 PERMISSION_DENIED: Permission denied on resource project`

**解决方案**: 
- 检查 Firebase 配置是否正确
- 确认 Firestore 安全规则允许写入
- 尝试在浏览器端运行（使用 `upload-gender-data.html`）

### 问题 2: 脚本运行缓慢

**原因**: 网络延迟或 Firestore 限流

**解决方案**:
- 增加延迟时间（修改 `setTimeout` 值）
- 分批运行（修改脚本只处理部分配对）

### 问题 3: 某些配对跳过

**原因**: 配对文档不存在

**解决方案**:
- 确认所有 78 个配对文档已在数据库中创建
- 检查文档 ID 格式是否正确（如 `Rat-Rat`, `Rabbit-Snake`）

## 📚 相关文档

- `GENDER_SPECIFIC_MATCHING_DESIGN.md` - 设计文档
- `DATABASE_ANALYSIS_GENDER_MATCHING.md` - 数据库分析
- `GENDER_SPECIFIC_IMPLEMENTATION_SUMMARY.md` - 实现总结
- `LOCAL_TESTING_GUIDE.md` - 本地测试指南

## 🎉 总结

这个 seed 脚本提供了一个快速的方式来为所有生肖配对生成基础的性别特定数据。虽然是自动生成的内容，但它提供了一个良好的起点，可以在此基础上逐步优化和改进。

**立即开始**：
```bash
node scripts/seed-all-gender-data.mjs
```

祝数据生成顺利！🚀
