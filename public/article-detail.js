import { db, auth } from "./app.js";
import { doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, Timestamp, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let currentUser = null;
let currentArticleId = null;
let currentArticle = null;
let allComments = [];
let showingAllComments = false;

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
    // Store current article
    currentArticle = article;

    // Hide loading, show content
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('article-content').style.display = 'block';

    // Update page title
    document.title = `${article.title} - Larak's Zodiac`;

    // Breadcrumb
    document.getElementById('breadcrumb-title').textContent = article.title.substring(0, 50) + '...';

    // Article Title
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

    // Keywords - display as tags
    const keywordsSection = document.getElementById('keywords-section');
    const keywordsContainer = document.getElementById('article-keywords');
    if (article.keywords && article.keywords.length > 0) {
        keywordsContainer.innerHTML = article.keywords.map(keyword =>
            `<span class="keyword-tag">${keyword}</span>`
        ).join('');
        keywordsSection.style.display = 'block';
    } else {
        keywordsSection.style.display = 'none';
    }

    // Article body - convert \n to <br> for line breaks
    const formattedContent = article.content.replace(/\n/g, '<br><br>');
    document.getElementById('article-text').innerHTML = formattedContent;

    // Display statistics
    document.getElementById('article-views').textContent = article.viewCount || 0;
    document.getElementById('article-favorites').textContent = article.favoriteCount || 0;
    document.getElementById('comments-count').textContent = article.commentCount || 0;

    // Related zodiac info
    const zodiacName = capitalizeFirst(article.zodiacSign);
    document.getElementById('zodiac-icon').textContent = getZodiacEmoji(article.zodiacSign);
    document.getElementById('zodiac-name').textContent = `The ${zodiacName}`;
    document.getElementById('zodiac-description').textContent = `Discover more about the ${zodiacName} zodiac sign, including personality traits, fortune predictions, and compatibility insights.`;
    document.getElementById('zodiac-detail-link').href = `detail.html?sign=${article.zodiacSign}`;

    // Setup favorite button
    setupFavoriteButton();

    // Setup comment form and load comments
    setupCommentForm();
    loadComments(currentArticleId);

    // Load trending articles
    loadTrendingArticles(article.zodiacSign);

    // Increment view count
    incrementViewCount(currentArticleId);
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

window.copyLink = function (event) {
    const url = window.location.href;

    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess(event);
        }).catch(err => {
            console.error('Clipboard API failed:', err);
            fallbackCopyLink(url, event);
        });
    } else {
        // Fallback for older browsers or insecure contexts
        fallbackCopyLink(url, event);
    }
};

// Show copy success feedback
function showCopySuccess(event) {
    const btn = event ? event.target.closest('.action-icon-btn') : null;

    if (btn) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'rgba(16, 185, 129, 0.2)';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    }

    // Also show a toast message
    showSuccessMessage('Link copied to clipboard!');
}

// Fallback copy method for older browsers
function fallbackCopyLink(url, event) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(event);
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        // Show manual copy prompt
        prompt('Copy this link:', url);
    } finally {
        document.body.removeChild(textArea);
    }
}


// Initialize authentication
function initAuth() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        console.log('Auth state changed:', user ? user.email : 'Not logged in');
    });
}

// Increment view count
async function incrementViewCount(articleId) {
    try {
        const articleRef = doc(db, 'articles', articleId);
        await updateDoc(articleRef, {
            viewCount: increment(1)
        });
        console.log('View count incremented for article:', articleId);
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    currentArticleId = getArticleId();
    loadArticle();
});

// Check if article is favorited by current user
async function checkIfFavorited(articleId) {
    if (!currentUser) return false;

    try {
        const favoritesRef = collection(db, 'favorites');
        const q = query(
            favoritesRef,
            where('uid', '==', currentUser.uid),
            where('articleId', '==', articleId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
}

// Handle favorite button click
async function handleFavorite() {
    if (!currentUser) {
        alert('Please login to favorite this article');
        return;
    }

    const favoriteBtn = document.getElementById('favorite-btn');
    const isFavorited = favoriteBtn.classList.contains('favorited');

    try {
        favoriteBtn.disabled = true;

        if (isFavorited) {
            // Remove from favorites
            await removeFavorite(currentArticleId);
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.querySelector('i').className = 'far fa-star';

            // Update count
            currentArticle.favoriteCount = Math.max(0, (currentArticle.favoriteCount || 0) - 1);
            document.getElementById('article-favorites').textContent = currentArticle.favoriteCount;
        } else {
            // Add to favorites
            await addFavorite(currentArticleId, currentArticle.title);
            favoriteBtn.classList.add('favorited');
            favoriteBtn.querySelector('i').className = 'fas fa-star';

            // Update local data
            currentArticle.favoriteCount = (currentArticle.favoriteCount || 0) + 1;
            document.getElementById('article-favorites').textContent = currentArticle.favoriteCount;
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorite. Please try again.');
    } finally {
        favoriteBtn.disabled = false;
    }
}

// Add article to favorites
async function addFavorite(articleId, articleTitle) {
    const favoritesRef = collection(db, 'favorites');
    await addDoc(favoritesRef, {
        uid: currentUser.uid,
        articleId: articleId,
        articleTitle: articleTitle,
        timestamp: new Date().toISOString()
    });

    // Increment favorite count in article
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
        favoriteCount: increment(1)
    });

    console.log('Article added to favorites');
}

// Remove article from favorites
async function removeFavorite(articleId) {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
        favoritesRef,
        where('uid', '==', currentUser.uid),
        where('articleId', '==', articleId)
    );
    const querySnapshot = await getDocs(q);

    // Delete all matching documents (should be only one)
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);

    // Decrement favorite count in article
    const articleRef = doc(db, 'articles', articleId);
    await updateDoc(articleRef, {
        favoriteCount: increment(-1)
    });

    console.log('Article removed from favorites');
}

// Setup favorite button
async function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favorite-btn');

    if (currentUser) {
        favoriteBtn.style.display = 'flex';

        // Check if already favorited
        const isFavorited = await checkIfFavorited(currentArticleId);
        if (isFavorited) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.querySelector('i').className = 'fas fa-star';
        }

        // Add click handler
        favoriteBtn.onclick = handleFavorite;
    } else {
        favoriteBtn.style.display = 'flex';
        favoriteBtn.onclick = () => {
            alert('Please login to favorite this article');
        };
    }
}

// Load comments for the article (show only 3 initially)
async function loadComments(articleId) {
    const commentsList = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    const commentsCount = document.getElementById('comments-count');
    const loadMoreBtn = document.getElementById('load-more-comments');

    try {
        const commentsRef = collection(db, 'article-comments');
        let querySnapshot;

        try {
            // Try with orderBy first
            const q = query(
                commentsRef,
                where('articleId', '==', articleId),
                orderBy('createdAt', 'desc')
            );
            querySnapshot = await getDocs(q);
        } catch (indexError) {
            console.warn('Index not available, querying without orderBy:', indexError);
            // Fallback: query without orderBy
            const q = query(
                commentsRef,
                where('articleId', '==', articleId)
            );
            querySnapshot = await getDocs(q);
        }

        commentsList.innerHTML = '';

        if (querySnapshot.empty) {
            commentsList.style.display = 'none';
            noComments.style.display = 'block';
            commentsCount.textContent = '0';
            loadMoreBtn.style.display = 'none';
            return;
        }

        noComments.style.display = 'none';
        commentsList.style.display = 'block';
        commentsCount.textContent = querySnapshot.size;

        // Convert to array and sort manually if needed
        allComments = [];
        querySnapshot.forEach((doc) => {
            allComments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in descending order (newest first)
        allComments.sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return bTime - aTime;
        });

        // Display only first 3 comments
        const commentsToShow = showingAllComments ? allComments : allComments.slice(0, 3);
        commentsToShow.forEach((comment) => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });

        // Show/hide load more button
        if (allComments.length > 3 && !showingAllComments) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.style.display = 'none';
        noComments.style.display = 'block';
        noComments.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error loading comments. Please try again.</p>
        `;
    }
}

// Create comment element
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';

    const date = comment.createdAt?.toDate ? comment.createdAt.toDate() : new Date();
    const formattedDate = formatCommentDate(date);

    commentDiv.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">
                <i class="fas fa-user"></i> ${escapeHtml(comment.authorName || 'Anonymous')}
            </span>
            <span class="comment-date">
                <i class="fas fa-clock"></i> ${formattedDate}
            </span>
        </div>
        <div class="comment-content">
            ${escapeHtml(comment.content)}
        </div>
    `;

    return commentDiv;
}

// Format comment date
function formatCommentDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle comment submission
async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('Please login to comment');
        return;
    }

    const content = document.getElementById('comment-content').value.trim();

    if (!content) {
        alert('Please enter your comment');
        return;
    }

    try {
        const submitBtn = e.target.querySelector('.btn-comment');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

        const commentsRef = collection(db, 'article-comments');
        const newComment = {
            articleId: currentArticleId,
            content: content,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || currentUser.email || 'Anonymous',
            authorEmail: currentUser.email,
            createdAt: Timestamp.now()
        };

        await addDoc(commentsRef, newComment);

        // Update comment count in article
        const articleRef = doc(db, 'articles', currentArticleId);
        const now = Timestamp.now();
        await updateDoc(articleRef, {
            commentCount: increment(1)
        });

        // Update local data
        currentArticle.commentCount = (currentArticle.commentCount || 0) + 1;
        document.getElementById('comments-count').textContent = currentArticle.commentCount;

        // Reset form
        document.getElementById('comment-content').value = '';
        document.getElementById('comment-count').textContent = '0';

        // Reload comments
        await loadComments(currentArticleId);

        // Show success message
        showSuccessMessage('Comment posted successfully!');
    } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('.btn-comment');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Comment';
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Setup comment form
function setupCommentForm() {
    const commentForm = document.getElementById('comment-form');
    const commentLoginHint = document.getElementById('comment-login-hint');
    const commentTextarea = document.getElementById('comment-content');

    if (currentUser) {
        commentForm.style.display = 'block';
        commentLoginHint.style.display = 'none';

        // Add submit handler
        commentForm.onsubmit = handleCommentSubmit;

        // Add character counter
        commentTextarea.addEventListener('input', () => {
            const count = commentTextarea.value.length;
            document.getElementById('comment-count').textContent = count;
        });
    } else {
        commentForm.style.display = 'none';
        commentLoginHint.style.display = 'block';
    }
}

// Load trending articles (same zodiac sign)
async function loadTrendingArticles(zodiacSign) {
    const trendingContainer = document.getElementById('trending-articles');

    try {
        const articlesRef = collection(db, 'articles');
        let querySnapshot;

        try {
            // Try with orderBy first
            const q = query(
                articlesRef,
                where('zodiacSign', '==', zodiacSign),
                orderBy('created_at', 'desc'),
                limit(6)
            );
            querySnapshot = await getDocs(q);
        } catch (indexError) {
            console.warn('Index not available for trending, querying without orderBy:', indexError);
            // Fallback: query without orderBy
            const q = query(
                articlesRef,
                where('zodiacSign', '==', zodiacSign),
                limit(6)
            );
            querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty) {
            trendingContainer.innerHTML = '<p class="no-trending">No related articles found.</p>';
            return;
        }

        trendingContainer.innerHTML = '';

        let count = 0;
        querySnapshot.forEach((doc) => {
            const article = doc.data();
            // Skip current article
            if (doc.id === currentArticleId) return;

            // Limit to 5 articles
            if (count >= 5) return;
            count++;

            // Format date
            const date = new Date(article.created_at);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const trendingItem = document.createElement('a');
            trendingItem.href = `article-detail.html?id=${doc.id}`;
            trendingItem.className = 'trending-item';
            trendingItem.innerHTML = `
                <div class="trending-content">
                    <h4 class="trending-title">${article.title}</h4>
                    <div class="trending-date">${formattedDate}</div>
                    <div class="trending-meta">
                        <span><i class="fas fa-eye"></i> ${article.viewCount || 0}</span>
                        <span><i class="fas fa-star"></i> ${article.favoriteCount || 0}</span>
                        <span class="trending-source"><i class="fas fa-book"></i> ${article.source || 'Unknown'}</span>
                    </div>
                </div>
            `;
            trendingContainer.appendChild(trendingItem);
        });

        // If no articles were added (all were current article)
        if (count === 0) {
            trendingContainer.innerHTML = '<p class="no-trending">No other related articles found.</p>';
        }
    } catch (error) {
        console.error('Error loading trending articles:', error);
        trendingContainer.innerHTML = '<p class="no-trending">Failed to load trending articles.</p>';
    }
}

// Load all comments
window.loadAllComments = function () {
    showingAllComments = true;
    loadComments(currentArticleId);
};
