// Article controller for webhook operations
const admin = require('firebase-admin');

// Generate unique article ID
function generateArticleId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `article_${timestamp}_${random}`;
}

// Create article in Firestore
async function createArticle(req, res) {
    try {
        const articleData = req.body;
        const articleId = generateArticleId();

        // Prepare article document
        const article = {
            title: articleData.title,
            content: articleData.content,
            category: articleData.category,
            zodiacSign: articleData.zodiacSign,
            source: articleData.source,
            keywords: articleData.keywords || [],

            // Initialize statistics
            viewCount: 0,
            favoriteCount: 0,
            commentCount: 0,

            // Metadata
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),

            // Optional metadata from request
            metadata: articleData.metadata || {
                createdBy: 'webhook',
                createdVia: 'api'
            }
        };

        // Save to Firestore
        const db = admin.firestore();
        await db.collection('articles').doc(articleId).set(article);

        console.log(`✅ Article created: ${articleId} - ${article.title}`);

        // Construct article URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
        const articleUrl = `${baseUrl}/article-detail.html?id=${articleId}`;

        // Return success response
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

// Placeholder for future update functionality
async function updateArticle(req, res) {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'Update functionality is not yet implemented'
    });
}

// Placeholder for future delete functionality
async function deleteArticle(req, res) {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'Delete functionality is not yet implemented'
    });
}

// Placeholder for future batch create functionality
async function batchCreateArticles(req, res) {
    res.status(501).json({
        success: false,
        error: 'Not implemented',
        message: 'Batch create functionality is not yet implemented'
    });
}

module.exports = {
    createArticle,
    updateArticle,
    deleteArticle,
    batchCreateArticles
};
