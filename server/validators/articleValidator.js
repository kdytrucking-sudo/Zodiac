// Article data validation schema and validator

const VALID_CATEGORIES = ['fortune', 'culture', 'compatibility', 'lifestyle'];
const VALID_ZODIAC_SIGNS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

function validateArticleData(data) {
    const errors = {};

    // Validate title
    if (!data.title || typeof data.title !== 'string') {
        errors.title = 'Title is required and must be a string';
    } else if (data.title.length < 1 || data.title.length > 200) {
        errors.title = 'Title must be between 1 and 200 characters';
    }

    // Validate content
    if (!data.content || typeof data.content !== 'string') {
        errors.content = 'Content is required and must be a string';
    } else if (data.content.length < 100) {
        errors.content = 'Content must be at least 100 characters';
    }

    // Validate category
    if (!data.category) {
        errors.category = 'Category is required';
    } else if (!VALID_CATEGORIES.includes(data.category)) {
        errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }

    // Validate zodiacSign
    if (!data.zodiacSign) {
        errors.zodiacSign = 'Zodiac sign is required';
    } else if (!VALID_ZODIAC_SIGNS.includes(data.zodiacSign)) {
        errors.zodiacSign = `Zodiac sign must be one of: ${VALID_ZODIAC_SIGNS.join(', ')}`;
    }

    // Validate source
    if (!data.source || typeof data.source !== 'string') {
        errors.source = 'Source is required and must be a string';
    } else if (data.source.length < 1 || data.source.length > 100) {
        errors.source = 'Source must be between 1 and 100 characters';
    }

    // Validate keywords (optional)
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

module.exports = {
    validateArticleData,
    validateArticleMiddleware,
    VALID_CATEGORIES,
    VALID_ZODIAC_SIGNS
};
