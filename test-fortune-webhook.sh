#!/bin/bash

# Fortune Webhook 测试脚本
# 使用方法: ./test-fortune-webhook.sh

# 配置
BASE_URL="http://localhost:8080"
# 如果部署到生产环境，请修改为实际域名
# BASE_URL="https://your-domain.com"

# 从环境变量获取 token，或使用默认值
WEBHOOK_TOKEN="${WEBHOOK_SECRET_TOKEN:-your_secret_token_change_this}"

echo "🧪 Testing Fortune Webhook API"
echo "================================"
echo "Base URL: $BASE_URL"
echo "Token: ${WEBHOOK_TOKEN:0:10}..."
echo ""

# 1. 健康检查
echo "1️⃣ Testing health check endpoint..."
curl -s -X GET "$BASE_URL/api/webhook/fortune/health" | jq '.'
echo ""
echo ""

# 2. 测试更新运势（使用示例数据）
echo "2️⃣ Testing fortune update endpoint..."
curl -s -X POST "$BASE_URL/api/webhook/fortune/update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBHOOK_TOKEN" \
  -d @fortune-example.json | jq '.'
echo ""
echo ""

# 3. 测试认证失败
echo "3️⃣ Testing authentication failure (wrong token)..."
curl -s -X POST "$BASE_URL/api/webhook/fortune/update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong_token" \
  -d @fortune-example.json | jq '.'
echo ""
echo ""

# 4. 测试验证失败（缺少必填字段）
echo "4️⃣ Testing validation failure (missing required fields)..."
curl -s -X POST "$BASE_URL/api/webhook/fortune/update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WEBHOOK_TOKEN" \
  -d '{
    "zodiacSign": "tiger",
    "period": "week"
  }' | jq '.'
echo ""
echo ""

echo "✅ Tests completed!"
