import { db } from "./app.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Get article ID from URL
function getArticleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Get zodiac emoji
function getZodiacEmoji(zodiac) {
    const emojiMap = {
        'rat': '🐀',
        'ox': '🐂',
        'tiger': '🐅',
        'rabbit': '🐇',
        'dragon': '🐉',
        'snake': '🐍',
        'horse': '🐴',
        'goat': '🐐',
        'monkey': '🐒',
        'rooster': '🐓',
        'dog': '🐕',
        'pig': '🐖'
    };
    return emojiMap[zodiac] || '🔮';
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load article from Firestore
async function loadArticle() {
    const articleId = getArticleId();

    if (!articleId) {
        showError();
        return;
    }

    try {
        const docRef = doc(db, "articles", articleId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const article = docSnap.data();
            displayArticle(article);
        } else {
            showError();
        }
    } catch (error) {
        console.error("Error loading article:", error);
        showError();
    }
}

// Display article content
function displayArticle(article) {
    // Hide loading, show content
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('article-content').style.display = 'block';

    // Update page title
    document.title = `${article.title} - Larak's Zodiac`;

    // Breadcrumb
    document.getElementById('breadcrumb-title').textContent = article.title.substring(0, 50) + '...';

    // Header
    document.getElementById('article-category').textContent = article.category;
    document.getElementById('article-zodiac').innerHTML = `${getZodiacEmoji(article.zodiacSign)} ${capitalizeFirst(article.zodiacSign)}`;
    document.getElementById('article-title').textContent = article.title;

    // Meta information
    const date = new Date(article.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('article-date').textContent = formattedDate;
    document.getElementById('article-source').textContent = article.source;

    // Keywords
    if (article.keywords && article.keywords.length > 0) {
        document.getElementById('article-keywords').textContent = article.keywords.join(', ');
    }

    // Article body - convert \n to <br> for line breaks
    const formattedContent = article.content.replace(/\n/g, '<br><br>');
    document.getElementById('article-text').innerHTML = formattedContent;

    // Related zodiac info
    const zodiacName = capitalizeFirst(article.zodiacSign);
    document.getElementById('zodiac-icon').textContent = getZodiacEmoji(article.zodiacSign);
    document.getElementById('zodiac-name').textContent = `The ${zodiacName}`;
    document.getElementById('zodiac-description').textContent = `Discover more about the ${zodiacName} zodiac sign, including personality traits, fortune predictions, and compatibility insights.`;
    document.getElementById('zodiac-detail-link').href = `detail.html?sign=${article.zodiacSign}`;
}

// Show error message
function showError() {
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('error-message').style.display = 'flex';
}

// Share functions
window.shareOnFacebook = function () {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareOnTwitter = function () {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('article-title').textContent);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
};

window.copyLink = function () {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = event.target.closest('.share-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy link. Please copy manually: ' + window.location.href);
    });
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
});
