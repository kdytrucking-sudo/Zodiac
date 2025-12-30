#!/bin/bash

# ========================================
# Firebase REST API 创建文章 - 测试脚本
# ========================================

# 生成唯一的文章 ID
ARTICLE_ID="article_$(date +%s)_$(openssl rand -hex 3)"

# 当前时间（ISO 8601 格式）
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

echo "📝 创建文章..."
echo "文章 ID: $ARTICLE_ID"
echo "时间: $CURRENT_TIME"
echo ""

# 执行 curl 请求
curl -X POST \
  "https://firestore.googleapis.com/v1/projects/studio-4395392521-1abeb/databases/zodia1/documents/articles?documentId=${ARTICLE_ID}&key=AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "title": {
        "stringValue": "2025年龙年运势完整解析"
      },
      "content": {
        "stringValue": "龙年是一个充满机遇和挑战的年份。在2025年，属龙的人将迎来事业上的重大突破。财运方面表现稳健，但需要注意理财规划。感情方面，单身者有望遇到心仪对象，已婚者需要多花时间陪伴家人。健康方面整体良好，但要注意劳逸结合。本年度的幸运色是金色和红色，幸运数字是3和8。"
      },
      "category": {
        "stringValue": "fortune"
      },
      "zodiacSign": {
        "stringValue": "dragon"
      },
      "source": {
        "stringValue": "AI Generator"
      },
      "keywords": {
        "arrayValue": {
          "values": [
            { "stringValue": "龙年" },
            { "stringValue": "运势" },
            { "stringValue": "2025" },
            { "stringValue": "生肖" }
          ]
        }
      },
      "viewCount": {
        "integerValue": "0"
      },
      "favoriteCount": {
        "integerValue": "0"
      },
      "commentCount": {
        "integerValue": "0"
      },
      "created_at": {
        "stringValue": "'"$CURRENT_TIME"'"
      },
      "updated_at": {
        "stringValue": "'"$CURRENT_TIME"'"
      },
      "metadata": {
        "mapValue": {
          "fields": {
            "createdBy": {
              "stringValue": "test-script"
            },
            "createdVia": {
              "stringValue": "curl"
            }
          }
        }
      }
    }
  }'

echo ""
echo ""
echo "✅ 请求已发送！"
echo "📱 请访问文章列表页面查看新文章"
echo "🔗 http://localhost:8080/article.html"
