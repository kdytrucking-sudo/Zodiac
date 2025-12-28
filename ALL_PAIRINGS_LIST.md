# 生肖配对完整列表

## 📊 总览

- **总配对数**: 78 个
- **性别组合**: 6 种
- **匹配类型**: 2 种 (Romance + Business)
- **总数据条目**: 78 × 6 × 2 = **936 个**

## 🔢 所有 78 个配对

### Rat 的配对 (12 个)
1. Rat-Rat
2. Rat-Ox
3. Rat-Tiger
4. Rat-Rabbit
5. Rat-Dragon
6. Rat-Snake
7. Rat-Horse
8. Rat-Goat
9. Rat-Monkey
10. Rat-Rooster
11. Rat-Dog
12. Rat-Pig

### Ox 的配对 (11 个)
13. Ox-Ox
14. Ox-Tiger
15. Ox-Rabbit
16. Ox-Dragon
17. Ox-Snake
18. Ox-Horse
19. Ox-Goat
20. Ox-Monkey
21. Ox-Rooster
22. Ox-Dog
23. Ox-Pig

### Tiger 的配对 (10 个)
24. Tiger-Tiger
25. Tiger-Rabbit
26. Tiger-Dragon
27. Tiger-Snake
28. Tiger-Horse
29. Tiger-Goat
30. Tiger-Monkey
31. Tiger-Rooster
32. Tiger-Dog
33. Tiger-Pig

### Rabbit 的配对 (9 个)
34. Rabbit-Rabbit
35. Rabbit-Dragon
36. Rabbit-Snake
37. Rabbit-Horse
38. Rabbit-Goat
39. Rabbit-Monkey
40. Rabbit-Rooster
41. Rabbit-Dog
42. Rabbit-Pig

### Dragon 的配对 (8 个)
43. Dragon-Dragon
44. Dragon-Snake
45. Dragon-Horse
46. Dragon-Goat
47. Dragon-Monkey
48. Dragon-Rooster
49. Dragon-Dog
50. Dragon-Pig

### Snake 的配对 (7 个)
51. Snake-Snake
52. Snake-Horse
53. Snake-Goat
54. Snake-Monkey
55. Snake-Rooster
56. Snake-Dog
57. Snake-Pig

### Horse 的配对 (6 个)
58. Horse-Horse
59. Horse-Goat
60. Horse-Monkey
61. Horse-Rooster
62. Horse-Dog
63. Horse-Pig

### Goat 的配对 (5 个)
64. Goat-Goat
65. Goat-Monkey
66. Goat-Rooster
67. Goat-Dog
68. Goat-Pig

### Monkey 的配对 (4 个)
69. Monkey-Monkey
70. Monkey-Rooster
71. Monkey-Dog
72. Monkey-Pig

### Rooster 的配对 (3 个)
73. Rooster-Rooster
74. Rooster-Dog
75. Rooster-Pig

### Dog 的配对 (2 个)
76. Dog-Dog
77. Dog-Pig

### Pig 的配对 (1 个)
78. Pig-Pig

## 🎯 每个配对的数据结构

每个配对包含：

```
配对 (例如: Rat-Rat)
├── genderSpecificMatching
│   ├── male-male
│   │   ├── romance { score, rating, summary, detailedAnalysis, highlights, challenges, advice }
│   │   └── business { score, rating, summary, detailedAnalysis, highlights, challenges, advice }
│   ├── male-female
│   │   ├── romance { ... }
│   │   └── business { ... }
│   ├── male-others
│   │   ├── romance { ... }
│   │   └── business { ... }
│   ├── female-female
│   │   ├── romance { ... }
│   │   └── business { ... }
│   ├── female-others
│   │   ├── romance { ... }
│   │   └── business { ... }
│   └── others-others
│       ├── romance { ... }
│       └── business { ... }
```

## 📈 数据量统计

| 类别 | 数量 |
|------|------|
| 总配对数 | 78 |
| 性别组合/配对 | 6 |
| 匹配类型/性别组合 | 2 |
| 数据条目/配对 | 12 |
| **总数据条目** | **936** |

## 🎨 按生肖分类统计

| 生肖 | 配对数 | 数据条目数 |
|------|--------|-----------|
| Rat | 12 | 144 |
| Ox | 11 | 132 |
| Tiger | 10 | 120 |
| Rabbit | 9 | 108 |
| Dragon | 8 | 96 |
| Snake | 7 | 84 |
| Horse | 6 | 72 |
| Goat | 5 | 60 |
| Monkey | 4 | 48 |
| Rooster | 3 | 36 |
| Dog | 2 | 24 |
| Pig | 1 | 12 |
| **总计** | **78** | **936** |

## 🔍 验证公式

配对总数 = n × (n + 1) / 2
其中 n = 12 (生肖数量)

12 × 13 / 2 = 78 ✅

数据条目总数 = 配对数 × 性别组合 × 匹配类型
78 × 6 × 2 = 936 ✅

## 🚀 快速开始

生成所有数据：
```bash
node scripts/seed-all-gender-data.mjs
```

预计时间：30-60 秒
预计生成：936 个数据条目

## 📝 注意事项

1. **同属相配对** (12 个): Rat-Rat, Ox-Ox, Tiger-Tiger, 等
   - 这些配对有特殊的内容逻辑
   - 强调共同特质和潜在的竞争

2. **跨属相配对** (66 个): Rat-Ox, Rabbit-Snake, 等
   - 强调互补性和平衡
   - 突出不同特质的协同作用

3. **数据质量**:
   - 自动生成的内容质量中等
   - 建议优先优化热门配对
   - 可以逐步替换为高质量人工内容
