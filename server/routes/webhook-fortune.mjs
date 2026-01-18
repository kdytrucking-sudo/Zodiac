// Webhook routes for fortune management (ES Module version)
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// ============================================
// Authentication Middleware (Same as Article)
// ============================================
function verifyWebhookAuth(req, res, next) {
    // 1. Verify Bearer Token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    const WEBHOOK_SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN || 'wh_3e5fecbc-109ee-435f-ab02-ab0323c8523E';

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
const VALID_ZODIAC_SIGNS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const VALID_PERIODS = ['today', 'week', 'month', 'year'];

function validateFortuneData(data) {
    const errors = {};

    // Validate zodiacSign
    if (!data.zodiacSign) {
        errors.zodiacSign = 'Zodiac sign is required';
    } else if (!VALID_ZODIAC_SIGNS.includes(data.zodiacSign)) {
        errors.zodiacSign = `Zodiac sign must be one of: ${VALID_ZODIAC_SIGNS.join(', ')}`;
    }

    // Validate period
    if (!data.period) {
        errors.period = 'Period is required';
    } else if (!VALID_PERIODS.includes(data.period)) {
        errors.period = `Period must be one of: ${VALID_PERIODS.join(', ')}`;
    }

    // Validate free section
    if (!data.free || typeof data.free !== 'object') {
        errors.free = 'Free section is required and must be an object';
    } else {
        const free = data.free;

        // Required string fields
        const requiredStrings = ['overview', 'career', 'love', 'health', 'wealth', 'luckyColor', 'luckyNumber', 'luckyDirection', 'luckyTime', 'benefactor', 'do', 'dont'];
        requiredStrings.forEach(field => {
            if (!free[field] || typeof free[field] !== 'string') {
                errors[`free.${field}`] = `${field} is required and must be a string`;
            }
        });

        // Required number fields (ratings 1-5)
        const requiredRatings = ['ratingCareer', 'ratingHealth', 'ratingLove', 'ratingWealth'];
        requiredRatings.forEach(field => {
            if (typeof free[field] !== 'number' || free[field] < 1 || free[field] > 5) {
                errors[`free.${field}`] = `${field} must be a number between 1 and 5`;
            }
        });

        // Overall score (0-100)
        if (typeof free.overallScore !== 'number' || free.overallScore < 0 || free.overallScore > 100) {
            errors['free.overallScore'] = 'overallScore must be a number between 0 and 100';
        }

        // Optional direction fields
        const optionalDirections = ['loveDirection', 'joyDirection', 'wealthDirection'];
        optionalDirections.forEach(field => {
            if (free[field] && typeof free[field] !== 'string') {
                errors[`free.${field}`] = `${field} must be a string if provided`;
            }
        });
    }

    // Validate paid section
    if (!data.paid || typeof data.paid !== 'object') {
        errors.paid = 'Paid section is required and must be an object';
    } else {
        const paid = data.paid;

        // Required detailed text fields
        const requiredDetailedTexts = ['careerDetailed', 'loveDetailed', 'healthDetailed', 'wealthDetailed'];
        requiredDetailedTexts.forEach(field => {
            if (!paid[field] || typeof paid[field] !== 'string') {
                errors[`paid.${field}`] = `${field} is required and must be a string`;
            }
        });

        // Required advice fields
        const requiredAdvice = ['careerAdvice', 'loveAdvice', 'healthAdvice', 'wealthAdvice'];
        requiredAdvice.forEach(field => {
            if (!paid[field] || typeof paid[field] !== 'string') {
                errors[`paid.${field}`] = `${field} is required and must be a string`;
            }
        });

        // Required ratings
        const requiredRatings = ['ratingCareer', 'ratingHealth', 'ratingLove', 'ratingWealth'];
        requiredRatings.forEach(field => {
            if (typeof paid[field] !== 'number' || paid[field] < 1 || paid[field] > 5) {
                errors[`paid.${field}`] = `${field} must be a number between 1 and 5`;
            }
        });

        // Required lucky elements
        const requiredLucky = ['luckyColors', 'luckyNumbers', 'luckyDirections', 'luckyFlower', 'luckyMineral', 'luckyTime', 'benefactor'];
        requiredLucky.forEach(field => {
            if (!paid[field] || typeof paid[field] !== 'string') {
                errors[`paid.${field}`] = `${field} is required and must be a string`;
            }
        });

        // Optional direction fields
        const optionalDirections = ['loveDirection', 'joyDirection', 'wealthDirection'];
        optionalDirections.forEach(field => {
            if (paid[field] && typeof paid[field] !== 'string') {
                errors[`paid.${field}`] = `${field} must be a string if provided`;
            }
        });

        // Required array fields
        if (!Array.isArray(paid.dos) || paid.dos.length === 0) {
            errors['paid.dos'] = 'dos must be a non-empty array';
        } else if (!paid.dos.every(item => typeof item === 'string')) {
            errors['paid.dos'] = 'All items in dos array must be strings';
        }

        if (!Array.isArray(paid.donts) || paid.donts.length === 0) {
            errors['paid.donts'] = 'donts must be a non-empty array';
        } else if (!paid.donts.every(item => typeof item === 'string')) {
            errors['paid.donts'] = 'All items in donts array must be strings';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateFortuneMiddleware(req, res, next) {
    const validation = validateFortuneData(req.body);

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

// Firebase 配置
const FIREBASE_PROJECT_ID = 'studio-4395392521-1abeb';
const FIREBASE_DATABASE_ID = 'zodia1';
const FIREBASE_API_KEY = 'AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU';

// 转换为 Firestore REST API 格式
function toFirestoreFormat(data) {
    const fields = {};

    for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
            fields[key] = {
                arrayValue: {
                    values: value.map(v => {
                        if (typeof v === 'string') {
                            return { stringValue: v };
                        } else if (typeof v === 'number') {
                            return { integerValue: String(v) };
                        } else {
                            return { stringValue: String(v) };
                        }
                    })
                }
            };
        } else if (typeof value === 'object' && value !== null) {
            // 递归处理对象
            fields[key] = {
                mapValue: { fields: toFirestoreFormat(value).fields }
            };
        } else if (typeof value === 'number') {
            fields[key] = { integerValue: String(value) };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else {
            fields[key] = { stringValue: String(value) };
        }
    }

    return { fields };
}

async function updateFortune(req, res) {
    try {
        const { zodiacSign, period, free, paid } = req.body;

        // 获取当前时间
        const updatedAt = new Date().toISOString();

        // 构建 fortune 数据（包含 updatedAt）
        const fortuneData = {
            [period]: {
                free,
                paid,
                updatedAt  // 添加更新时间
            }
        };

        // 转换为 Firestore 格式
        const firestoreDoc = toFirestoreFormat(fortuneData);

        // 使用 PATCH 方法更新文档（merge: true）
        const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIREBASE_DATABASE_ID}/documents/fortune/${zodiacSign}?updateMask.fieldPaths=${period}&key=${FIREBASE_API_KEY}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firestoreDoc)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Firebase API error:', errorText);
            throw new Error(`Firebase API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Fortune updated: ${zodiacSign} - ${period}`);

        res.status(200).json({
            success: true,
            message: 'Fortune updated successfully',
            data: {
                zodiacSign,
                period,
                updatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ Error updating fortune:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message || 'Failed to update fortune. Please try again later.'
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
        message: 'Fortune Webhook API is running',
        timestamp: new Date().toISOString()
    });
});

// Middleware applied to all other webhook routes
router.use(verifyWebhookAuth);

// POST /api/webhook/fortune/update
router.post('/update', validateFortuneMiddleware, updateFortune);

export default router;
