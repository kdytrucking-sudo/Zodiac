# 用户需求理解

## 用户的设计要求

### 选择器部分：
```
[Zodiac 1: Rabbit ▼] [Zodiac 2: Snake ▼] [Gender: Male-Female ▼]
[Load Data]
```

### 数据结构（每个性别组合）：
```
Rabbit-Snake (Male-Female)
├── Romance
│   ├── Basic Info (免费)
│   │   ├── Score
│   │   ├── Rating
│   │   └── Summary
│   └── Premium Details (收费)
│       ├── Emotional Compatibility (title, content, score, highlights)
│       ├── Intellectual Alignment
│       ├── Long-term Potential
│       ├── Others 1
│       ├── Others 2
│       └── Conflicts (3个)
│
└── Business
    ├── Basic Info (免费)
    │   ├── Score
    │   ├── Rating
    │   └── Summary
    └── Premium Details (收费)
        ├── Work Style Compatibility (title, content, score, highlights)
        ├── Leadership Dynamics
        ├── Financial Alignment
        ├── Others 1
        ├── Others 2
        └── Conflicts (3个)
```

## 问题

当前数据库结构中，Premium Details（Emotional Compatibility等）存储在：
```javascript
currentData.romance.premium.emotionalCompatibility
```

但用户希望这些也是性别特定的，应该存储在：
```javascript
currentData.genderSpecificMatching['male-female'].romance.premium.emotionalCompatibility
```

## 需要确认

1. Premium Details 是否也应该是性别特定的？
2. 还是只有 Basic Info (score, rating, summary) 是性别特定的？
3. 如果 Premium Details 也是性别特定的，需要更新数据库结构

## 当前实现的问题

我现在的实现只在性别特定数据中存储了 score, rating, summary，
但没有存储 Premium Details（Emotional Compatibility等10个详细条目）。

需要用户确认是否需要将这10个详细条目也做成性别特定的。
