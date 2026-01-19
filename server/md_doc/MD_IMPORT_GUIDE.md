# MD Import Tool - User Guide

## 概述
这是一个用于批量导入 Matching 数据的管理工具。通过上传 4 个 MD 文件(对应不同的性别组合),系统会自动合并、解析并转换为 JSON 格式,最后更新到 Firestore 数据库。

## 使用步骤

### Step 1: 上传 MD 文件

1. 准备 4 个 MD 文件,分别对应:
   - **Male vs Male** (male-male)
   - **Male vs Female** (male-female)  
   - **Female vs Male** (female-male)
   - **Female vs Female** (female-female)

2. 点击对应的上传框,选择相应的 MD 文件
   - 文件必须是 `.md` 格式
   - 文件名建议使用格式: `Zodiac1_Zodiac2_gender-combo.md`
   - 例如: `Pig_Rabbit_male-male.md`

3. 上传成功后,上传框会变成绿色边框,显示文件名和大小

4. 至少上传 1 个文件后,"Merge Files" 按钮会激活

### Step 2: 合并文件预览

1. 点击 **"Merge Files"** 按钮
2. 系统会自动读取所有上传的文件内容
3. 合并后的内容会显示在 Textarea 中
4. 每个性别组合的内容会用分隔线标识

**合并格式:**
```markdown
# ========== MALE-MALE ==========
[male-male 文件内容]

# ========== MALE-FEMALE ==========
[male-female 文件内容]

# ========== FEMALE-MALE ==========
[female-male 文件内容]

# ========== FEMALE-FEMALE ==========
[female-female 文件内容]
```

5. 你可以在 Textarea 中手动编辑内容
6. 合并成功后,"Convert to JSON" 按钮会激活

### Step 3: 转换为 JSON

1. 点击 **"Convert to JSON"** 按钮
2. 系统会根据 `MAPPING_GUIDE.md` 的规则解析 MD 内容
3. 解析完成后会显示:
   - **统计卡片**: 显示生肖配对、性别组合数量、浪漫分数、商业分数
   - **JSON 预览**: 显示完整的 JSON 数据结构

4. 检查 JSON 数据是否正确
5. 转换成功后,"Update to Database" 按钮会激活

### Step 4: 更新到数据库

1. 点击 **"Update to Database"** 按钮
2. 系统会:
   - 根据生肖名称生成文档 ID (按字母顺序排序)
   - 检查文档是否已存在
   - 如果存在,合并更新数据
   - 如果不存在,创建新文档

3. 更新成功后会显示成功消息
4. 系统会询问是否重置表单以进行新的导入

## MD 文件格式要求

### 文件结构
每个 MD 文件必须包含以下部分:

1. **Pairing Information** (配对信息)
```markdown
## Pairing Information
**Zodiac 1:** Pig (Primary)
**Zodiac 2:** Rabbit (Secondary)
**Gender Combination:** male-male
```

2. **Romance Compatibility Analysis** (浪漫兼容性分析)
   - Overall Romantic Assessment (Free Content)
   - Detailed Romantic Analysis (Premium Content)
   - Potential Challenges & Solutions (Premium Content)

3. **Business Compatibility Analysis** (商业兼容性分析)
   - Overall Business Assessment (Free Content)
   - Detailed Business Analysis (Premium Content)
   - Business Challenges & Solutions (Premium Content)

### 详细格式说明
请参考 `server/md_doc/MAPPING_GUIDE.md` 文件,其中包含:
- 完整的字段映射关系
- 数据库结构示例
- 字段要求检查清单
- 解析策略说明

## 数据库结构

### Document ID 生成规则
- 格式: `Zodiac1-Zodiac2`
- 按字母顺序排序
- 例如: `Pig-Rabbit` (不是 `Rabbit-Pig`)

### 数据结构
```javascript
{
  zodiacPair: {
    zodiac1: "Pig",
    zodiac2: "Rabbit",
    pairName: "Pig & Rabbit"
  },
  romance: {
    'male-male': { free: {...}, premium: {...} },
    'male-female': { free: {...}, premium: {...} },
    'female-male': { free: {...}, premium: {...} },
    'female-female': { free: {...}, premium: {...} }
  },
  business: {
    'male-male': { free: {...}, premium: {...} },
    'male-female': { free: {...}, premium: {...} },
    'female-male': { free: {...}, premium: {...} },
    'female-female': { free: {...}, premium: {...} }
  },
  metadata: {
    createdAt: "2026-01-19T...",
    updatedAt: "2026-01-19T...",
    version: 2,
    dataQuality: "complete",
    structure: "gender-specific"
  }
}
```

## 注意事项

### 必填字段
- ✅ 每个 Romance/Business 部分必须有 Free Content
- ✅ Free Content 必须包含: matchingScore, rating, quickOverview, compatibilityTags (3个)
- ✅ Premium Content 必须包含 3 个主要部分 + 2 个 Others 部分
- ✅ Conflicts/Challenges 必须有 5 个条目

### 评分范围
- Matching Score: 0-100
- Section Score: 0-100
- Severity: 0-100 (数值越高越严重)

### 状态值
- Rating: `Poor`, `Fair`, `Good`, `Very Good`, `Excellent`
- Tag Status: `positive`, `neutral`, `negative`

### 生肖名称
使用标准英文名称(首字母大写):
- Rat, Ox, Tiger, Rabbit, Dragon, Snake
- Horse, Goat, Monkey, Rooster, Dog, Pig

## 常见问题

### Q: 如果只有部分性别组合的数据怎么办?
A: 可以只上传有数据的文件,系统会自动处理。更新时会与现有数据合并。

### Q: 如何修改已上传的数据?
A: 重新上传相同生肖配对的 MD 文件,系统会自动合并更新。

### Q: 解析失败怎么办?
A: 检查 MD 文件格式是否符合 `MAPPING_GUIDE.md` 的要求,特别注意:
- 标题层级是否正确 (##, ###, ####, #####)
- 必填字段是否完整
- 数值是否在有效范围内

### Q: 如何查看已导入的数据?
A: 点击页面右上角的 "Edit Mode" 按钮,进入编辑模式查看和修改数据。

## 示例文件

参考文件位置: `server/md_doc/`
- `Pig_Rabbit_male-male.md`
- `Pig_Rabbit_male-female.md`
- `Pig_Rabbit_female-male.md`
- `Pig_Rabbit_female-female.md`
- `EXAMPLE_Rabbit_Snake_Female_Female.md`

## 技术支持

如有问题,请检查:
1. 浏览器控制台 (F12) 查看错误信息
2. MD 文件格式是否正确
3. 网络连接是否正常
4. Firebase 配置是否正确
