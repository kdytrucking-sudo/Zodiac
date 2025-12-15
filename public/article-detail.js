import { db, auth } from "./app.js";
import { doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let currentUser = null;
let currentArticleId = null;
let currentArticle = null;

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

    // Display statistics
    document.getElementById('article-views').textContent = article.viewCount || 0;
    document.getElementById('article-favorites').textContent = article.favoriteCount || 0;
    document.getElementById('article-comments-count').textContent = article.commentCount || 0;
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
            favoriteBtn.innerHTML = '<i class="far fa-star"></i> Favorite';

            // Update count
            currentArticle.favoriteCount = Math.max(0, (currentArticle.favoriteCount || 0) - 1);
            document.getElementById('article-favorites').textContent = currentArticle.favoriteCount;
        } else {
            // Add to favorites
            await addFavorite(currentArticleId, currentArticle.title);
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i> Favorited';

            // Update count
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
    const favoriteLoginHint = document.getElementById('favorite-login-hint');

    if (currentUser) {
        favoriteBtn.style.display = 'inline-flex';
        favoriteLoginHint.style.display = 'none';

        // Check if already favorited
        const isFavorited = await checkIfFavorited(currentArticleId);
        if (isFavorited) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-star"></i> Favorited';
        }

        // Add click handler
        favoriteBtn.onclick = handleFavorite;
    } else {
        favoriteBtn.style.display = 'none';
        favoriteLoginHint.style.display = 'block';
    }
}

// Load comments for the article
async function loadComments(articleId) {
    const commentsList = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    const commentsCount = document.getElementById('comments-count');

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
            return;
        }

        noComments.style.display = 'none';
        commentsList.style.display = 'block';
        commentsCount.textContent = querySnapshot.size;

        // Convert to array and sort manually if needed
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in descending order (newest first)
        comments.sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return bTime - aTime;
        });

        // Display sorted comments
        comments.forEach((comment) => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
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
        document.getElementById('article-comments-count').textContent = currentArticle.commentCount;

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
