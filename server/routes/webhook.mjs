// Webhook routes for article management (ES Module version)
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();

// ============================================
// Authentication Middleware
// ============================================
function verifyWebhookAuth(req, res, next) {
    // 1. Verify Bearer Token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    const WEBHOOK_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN || 'your_secret_token_change_this';

    if (!token || token !== WEBHOOK_SECRET_TOKEN) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or missing authorization token'
        });
    }

    // 2. Verify Origin Domain (optional - only if Origin header is present)
    const origin = req.headers.origin || req.headers.referer || '';

    // If no origin/referer, allow the request (for curl, N8N, etc.)
    // Token validation is sufficient for these cases
    if (!origin) {
        console.log('⚠️  Webhook request without Origin header (curl/N8N/API client)');
        return next();
    }

    const allowedDomains = [
        'laraks.com',
        'www.laraks.com',
        /.*\.laraks\.com$/
    ];

    // Extract domain from origin/referer
    let requestDomain = '';
    try {
        const url = new URL(origin);
        requestDomain = url.hostname;
    } catch (e) {
        // If origin is present but invalid, check if it's localhost
        const host = req.headers.host || '';
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            console.log('⚠️  Webhook request from localhost (development mode)');
            return next();
        }

        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'Invalid origin'
        });
    }

    // Check if domain is allowed
    const isAllowed = allowedDomains.some(allowed => {
        if (typeof allowed === 'string') {
            return requestDomain === allowed;
        } else if (allowed instanceof RegExp) {
            return allowed.test(requestDomain);
        }
        return false;
    });

    if (!isAllowed) {
        console.log(`❌ Webhook request rejected from: ${requestDomain}`);
        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'Origin domain not allowed. Only *.laraks.com domains are permitted.'
        });
    }

    console.log(`✅ Webhook request authenticated from: ${requestDomain}`);
    next();
}

// ============================================
// Validation
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
// Controllers
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

        const db = admin.firestore();
        // Use the correct database name
        const articlesRef = db.collection('articles');
        await articlesRef.doc(articleId).set(article);

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
            message: 'Failed to create article. Please try again later.'
        });
    }
}

// ============================================
// Routes
// ============================================

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook API is running',
        timestamp: new Date().toISOString()
    });
});

// Middleware applied to all other webhook routes
router.use(verifyWebhookAuth);

// POST /api/webhook/articles/create
router.post('/articles/create', validateArticleMiddleware, createArticle);

export default router;
