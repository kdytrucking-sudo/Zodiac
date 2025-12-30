#!/bin/bash

# Gender Modifiers Feature Test Script
# 此脚本帮助测试性别修饰符功能

echo "🧪 Gender Modifiers Feature Test"
echo "=================================="
echo ""

# 检查文件是否存在
echo "📁 Checking files..."
files=(
    "public/admin-matching.html"
    "public/admin-matching.js"
    "public/matching.html"
    "public/matching.js"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file NOT FOUND"
        all_exist=false
    fi
done

echo ""

if [ "$all_exist" = false ]; then
    echo "⚠️  Some files are missing. Please check your project structure."
    exit 1
fi

# 检查关键代码是否存在
echo "🔍 Checking for key code implementations..."

# 检查 admin-matching.html 中的 Gender Modifiers 标签
if grep -q "Gender Modifiers" "public/admin-matching.html"; then
    echo "✅ Gender Modifiers tab found in admin-matching.html"
else
    echo "❌ Gender Modifiers tab NOT found in admin-matching.html"
fi

# 检查 admin-matching.js 中的函数
if grep -q "renderGenderModifiersSection" "public/admin-matching.js"; then
    echo "✅ renderGenderModifiersSection() function found"
else
    echo "❌ renderGenderModifiersSection() function NOT found"
fi

if grep -q "collectGenderModifiers" "public/admin-matching.js"; then
    echo "✅ collectGenderModifiers() function found"
else
    echo "❌ collectGenderModifiers() function NOT found"
fi

# 检查 matching.js 中的函数
if grep -q "applyGenderModifier" "public/matching.js"; then
    echo "✅ applyGenderModifier() function found in matching.js"
else
    echo "❌ applyGenderModifier() function NOT found in matching.js"
fi

if grep -q "getRatingFromScore" "public/matching.js"; then
    echo "✅ getRatingFromScore() function found in matching.js"
else
    echo "❌ getRatingFromScore() function NOT found in matching.js"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo ""
echo "Files modified:"
echo "  • public/admin-matching.html - Added Gender Modifiers tab"
echo "  • public/admin-matching.js - Added render and save logic"
echo "  • public/matching.js - Added gender modifier application"
echo ""
echo "🎯 Next Steps:"
echo "1. Start your local server (if not already running)"
echo "2. Visit http://localhost:3000/admin-matching.html"
echo "3. Login with password: 1234"
echo "4. Click on 'Gender Modifiers' tab"
echo "5. Edit gender modifiers for a zodiac pair"
echo "6. Save changes"
echo "7. Visit http://localhost:3000/matching.html"
echo "8. Select zodiacs and genders to see adjusted scores"
echo ""
echo "✨ Feature implementation complete!"
