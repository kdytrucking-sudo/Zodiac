// Webhook routes - 使用 Firebase Web SDK (简单版本)
import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const router = express.Router();

// Firebase 配置（和网页相同）
const firebaseConfig = {
    apiKey: "AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU",
    authDomain: "studio-4395392521-1abeb.firebaseapp.com",
    projectId: "studio-4395392521-1abeb",
    storageBucket: "studio-4395392521-1abeb.firebasestorage.app",
    messagingSenderId: "413532569115",
    appId: "1:413532569115:web:afa287880769758b5382be"
};

// 初始化 Firebase（就像网页一样）
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// 认证中间件（简单的 Token 验证）
// ============================================
function verifyWebhookAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    const WEBHOOK_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN || 'wh_3ec5ecbb-199e-436f-ab02-aad323e822f6';

    if (!token || token !== WEBHOOK_SECRET_TOKEN) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or missing authorization token'
        });
    }

    console.log('✅ Webhook request authenticated');
    next();
}

// ============================================
// 数据验证
// ============================================
const VALID_CATEGORIES = ['fortune', 'culture', 'compatibility', 'lifestyle'];
const VALID_ZODIAC_SIGNS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

function validateArticleData(data) {
    const errors = {};

    if (!data.title || typeof data.title !== 'string') {
        errors.title = 'Title is required and must be a string';
    } else if (data.title.length < 1 || data.title.length > 200) {
        errors.title = 'Title must be between 1 and 200 characters';
    }

    if (!data.content || typeof data.content !== 'string') {
        errors.content = 'Content is required and must be a string';
    } else if (data.content.length < 100) {
        errors.content = 'Content must be at least 100 characters';
    }

    if (!data.category) {
        errors.category = 'Category is required';
    } else if (!VALID_CATEGORIES.includes(data.category)) {
        errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }

    if (!data.zodiacSign) {
        errors.zodiacSign = 'Zodiac sign is required';
    } else if (!VALID_ZODIAC_SIGNS.includes(data.zodiacSign)) {
        errors.zodiacSign = `Zodiac sign must be one of: ${VALID_ZODIAC_SIGNS.join(', ')}`;
    }

    if (!data.source || typeof data.source !== 'string') {
        errors.source = 'Source is required and must be a string';
    } else if (data.source.length < 1 || data.source.length > 100) {
        errors.source = 'Source must be between 1 and 100 characters';
    }

    if (data.keywords) {
        if (!Array.isArray(data.keywords)) {
            errors.keywords = 'Keywords must be an array';
        } else if (data.keywords.length > 10) {
            errors.keywords = 'Maximum 10 keywords allowed';
        } else if (!data.keywords.every(k => typeof k === 'string')) {
            errors.keywords = 'All keywords must be strings';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateArticleMiddleware(req, res, next) {
    const validation = validateArticleData(req.body);

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: validation.errors
        });
    }

    next();
}

// ============================================
// 创建文章（就像网页发帖一样）
// ============================================
function generateArticleId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `article_${timestamp}_${random}`;
}

async function createArticle(req, res) {
    try {
        const articleData = req.body;
        const articleId = generateArticleId();

        const article = {
            title: articleData.title,
            content: articleData.content,
            category: articleData.category,
            zodiacSign: articleData.zodiacSign,
            source: articleData.source,
            keywords: articleData.keywords || [],

            viewCount: 0,
            favoriteCount: 0,
            commentCount: 0,

            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            metadata: articleData.metadata || {
                createdBy: 'webhook',
                createdVia: 'api'
            }
        };

        // 写入 Firestore（就像网页一样）
        const articlesRef = collection(db, 'articles');
        const articleDoc = doc(articlesRef, articleId);
        await setDoc(articleDoc, article);

        console.log(`✅ Article created: ${articleId} - ${article.title}`);

        const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
        const articleUrl = `${baseUrl}/article-detail.html?id=${articleId}`;

        res.status(200).json({
            success: true,
            message: 'Article created successfully',
            data: {
                articleId: articleId,
                title: article.title,
                category: article.category,
                zodiacSign: article.zodiacSign,
                createdAt: article.created_at,
                url: articleUrl
            }
        });

    } catch (error) {
        console.error('❌ Error creating article:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message || 'Failed to create article. Please try again later.'
        });
    }
}

// ============================================
// 路由
// ============================================

// 健康检查（不需要认证）
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook API is running',
        timestamp: new Date().toISOString()
    });
});

// 创建文章（需要认证）
router.post('/articles/create', verifyWebhookAuth, validateArticleMiddleware, createArticle);

export default router;
