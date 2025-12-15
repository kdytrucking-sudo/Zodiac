// Webhook routes for article management
const express = require('express');
const router = express.Router();

const { verifyWebhookAuth } = require('../middleware/auth');
const { validateArticleMiddleware } = require('../validators/articleValidator');
const {
    createArticle,
    updateArticle,
    deleteArticle,
    batchCreateArticles
} = require('../controllers/articleController');

// Middleware applied to all webhook routes
router.use(verifyWebhookAuth);

// POST /api/webhook/articles/create
// Create a single article
router.post('/articles/create', validateArticleMiddleware, createArticle);

// Future endpoints (placeholders)
// PUT /api/webhook/articles/:id
router.put('/articles/:id', updateArticle);

// DELETE /api/webhook/articles/:id
router.delete('/articles/:id', deleteArticle);

// POST /api/webhook/articles/batch-create
router.post('/articles/batch-create', batchCreateArticles);

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
