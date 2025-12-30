// Authentication middleware for webhook
// Validates both Bearer token and origin domain

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

    // 2. Verify Origin Domain
    const origin = req.headers.origin || req.headers.referer || '';
    const allowedDomains = [
        'laraks.com',
        'www.laraks.com',
        // Add subdomains
        /.*\.laraks\.com$/
    ];

    // Extract domain from origin/referer
    let requestDomain = '';
    try {
        if (origin) {
            const url = new URL(origin);
            requestDomain = url.hostname;
        }
    } catch (e) {
        // If no valid origin, check if it's localhost (for development)
        const host = req.headers.host || '';
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            // Allow localhost in development
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

module.exports = { verifyWebhookAuth };
