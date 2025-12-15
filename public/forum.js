import { auth, db } from './app.js';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, increment, Timestamp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

let currentUser = null;
let currentSection = 'customer-service';
let allPosts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initEventListeners();
    loadPosts();
});

// Initialize authentication state
function initAuth() {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateUIForAuth();
    });
}

// Update UI based on authentication state
function updateUIForAuth() {
    const newPostBtn = document.getElementById('new-post-btn');
    const loginHint = document.getElementById('login-hint');

    if (currentUser) {
        newPostBtn.style.display = 'flex';
        loginHint.style.display = 'none';
    } else {
        newPostBtn.style.display = 'none';
        loginHint.style.display = 'block';
    }
}

// Initialize event listeners
function initEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.forum-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSection = tab.dataset.section;
            displayPosts();
        });
    });

    // New post button
    document.getElementById('new-post-btn').addEventListener('click', openNewPostModal);

    // Modal close buttons
    document.getElementById('modal-close').addEventListener('click', closeNewPostModal);
    document.getElementById('cancel-btn').addEventListener('click', closeNewPostModal);
    document.getElementById('detail-modal-close').addEventListener('click', closeDetailModal);

    // Click outside modal to close
    document.getElementById('new-post-modal').addEventListener('click', (e) => {
        if (e.target.id === 'new-post-modal') {
            closeNewPostModal();
        }
    });

    document.getElementById('post-detail-modal').addEventListener('click', (e) => {
        if (e.target.id === 'post-detail-modal') {
            closeDetailModal();
        }
    });

    // New post form
    document.getElementById('new-post-form').addEventListener('submit', handleNewPost);

    // Character counter
    const contentTextarea = document.getElementById('post-content');
    contentTextarea.addEventListener('input', () => {
        const count = contentTextarea.value.length;
        document.getElementById('content-count').textContent = count;
    });
}

// Load posts from Firestore
async function loadPosts() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const postsGrid = document.getElementById('posts-grid');

    try {
        loadingIndicator.style.display = 'block';
        postsGrid.style.display = 'none';

        const postsRef = collection(db, 'forum-posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        allPosts = [];
        querySnapshot.forEach((doc) => {
            allPosts.push({
                id: doc.id,
                ...doc.data()
            });
        });

        updatePostCounts();
        displayPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load posts. Please try again later.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Update post counts in tabs
function updatePostCounts() {
    const csCount = allPosts.filter(p => p.section === 'customer-service').length;
    const gdCount = allPosts.filter(p => p.section === 'general-discussion').length;

    document.getElementById('cs-count').textContent = csCount;
    document.getElementById('gd-count').textContent = gdCount;
}

// Display posts for current section
function displayPosts() {
    const postsGrid = document.getElementById('posts-grid');
    const noPosts = document.getElementById('no-posts');

    const sectionPosts = allPosts.filter(p => p.section === currentSection);

    if (sectionPosts.length === 0) {
        postsGrid.style.display = 'none';
        noPosts.style.display = 'block';
        return;
    }

    noPosts.style.display = 'none';
    postsGrid.style.display = 'grid';
    postsGrid.innerHTML = '';

    sectionPosts.forEach(post => {
        const postCard = createPostCard(post);
        postsGrid.appendChild(postCard);
    });
}

// Create post card element
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.onclick = () => openPostDetail(post);

    const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
    const formattedDate = formatDate(date);

    const sectionName = post.section === 'customer-service' ? 'Customer Service' : 'General Discussion';
    const sectionClass = post.section === 'customer-service' ? 'section-cs' : 'section-gd';

    // Get zodiac info if available
    const zodiacInfo = post.zodiacSign ? getZodiacInfo(post.zodiacSign) : null;

    card.innerHTML = `
        <div class="post-card-header">
            <div class="post-badges">
                <span class="post-section ${sectionClass}">${sectionName}</span>
                ${zodiacInfo ? `<span class="post-zodiac-tag">${zodiacInfo.emoji} ${zodiacInfo.name}</span>` : ''}
            </div>
            <span class="post-likes">
                <i class="far fa-heart"></i> ${post.likes || 0}
            </span>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <p class="post-preview">${escapeHtml(truncateText(post.content, 150))}</p>
        <div class="post-meta">
            <span class="post-author">
                <i class="fas fa-user"></i> ${escapeHtml(post.authorName || 'Anonymous')}
            </span>
            <span class="post-date">
                <i class="fas fa-clock"></i> ${formattedDate}
            </span>
        </div>
    `;

    return card;
}

// Get zodiac sign information
function getZodiacInfo(zodiacSign) {
    const zodiacMap = {
        'rat': { name: 'Rat', emoji: '🐀', chinese: '鼠' },
        'ox': { name: 'Ox', emoji: '🐂', chinese: '牛' },
        'tiger': { name: 'Tiger', emoji: '🐅', chinese: '虎' },
        'rabbit': { name: 'Rabbit', emoji: '🐇', chinese: '兔' },
        'dragon': { name: 'Dragon', emoji: '🐉', chinese: '龙' },
        'snake': { name: 'Snake', emoji: '🐍', chinese: '蛇' },
        'horse': { name: 'Horse', emoji: '🐴', chinese: '马' },
        'goat': { name: 'Goat', emoji: '🐐', chinese: '羊' },
        'monkey': { name: 'Monkey', emoji: '🐵', chinese: '猴' },
        'rooster': { name: 'Rooster', emoji: '🐓', chinese: '鸡' },
        'dog': { name: 'Dog', emoji: '🐕', chinese: '狗' },
        'pig': { name: 'Pig', emoji: '🐖', chinese: '猪' }
    };
    return zodiacMap[zodiacSign] || null;
}

// Open new post modal
function openNewPostModal() {
    if (!currentUser) {
        alert('Please login to create a post');
        window.location.href = 'login.html';
        return;
    }

    const modal = document.getElementById('new-post-modal');
    const sectionSelect = document.getElementById('post-section');

    // Set default section to current tab
    sectionSelect.value = currentSection;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close new post modal
function closeNewPostModal() {
    const modal = document.getElementById('new-post-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('new-post-form').reset();
    document.getElementById('content-count').textContent = '0';
}

// Handle new post submission
async function handleNewPost(e) {
    e.preventDefault();

    if (!currentUser) {
        alert('Please login to create a post');
        return;
    }

    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const section = document.getElementById('post-section').value;
    const zodiacSign = document.getElementById('post-zodiac').value;

    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const submitBtn = e.target.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

        const postsRef = collection(db, 'forum-posts');
        const newPost = {
            title,
            content,
            section,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || currentUser.email || 'Anonymous',
            authorEmail: currentUser.email,
            likes: 0,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        // Add zodiac sign if selected
        if (zodiacSign) {
            newPost.zodiacSign = zodiacSign;
        }

        const docRef = await addDoc(postsRef, newPost);

        // Add to local posts array
        allPosts.unshift({
            id: docRef.id,
            ...newPost
        });

        updatePostCounts();
        displayPosts();
        closeNewPostModal();

        // Show success message
        showSuccess('Post created successfully!');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    } finally {
        const submitBtn = e.target.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post';
    }
}

// Open post detail modal
function openPostDetail(post) {
    const modal = document.getElementById('post-detail-modal');

    document.getElementById('detail-title').textContent = post.title;
    document.getElementById('detail-author').textContent = post.authorName || 'Anonymous';

    const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date();
    document.getElementById('detail-date').textContent = formatDate(date);

    const sectionName = post.section === 'customer-service' ? 'Customer Service' : 'General Discussion';
    const sectionClass = post.section === 'customer-service' ? 'section-cs' : 'section-gd';
    const sectionBadge = document.getElementById('detail-section-badge');
    sectionBadge.textContent = sectionName;
    sectionBadge.className = `post-section ${sectionClass}`;

    // Show zodiac badge if available
    const zodiacBadge = document.getElementById('detail-zodiac-badge');
    const zodiacName = document.getElementById('detail-zodiac-name');
    if (post.zodiacSign) {
        const zodiacInfo = getZodiacInfo(post.zodiacSign);
        if (zodiacInfo) {
            zodiacName.textContent = `${zodiacInfo.emoji} ${zodiacInfo.name}`;
            zodiacBadge.style.display = 'flex';
        } else {
            zodiacBadge.style.display = 'none';
        }
    } else {
        zodiacBadge.style.display = 'none';
    }

    document.getElementById('detail-content').textContent = post.content;
    document.getElementById('detail-likes').textContent = post.likes || 0;

    // Setup like button
    const likeBtn = document.getElementById('detail-like-btn');
    likeBtn.onclick = () => handleLike(post.id);

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close post detail modal
function closeDetailModal() {
    const modal = document.getElementById('post-detail-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle like button
async function handleLike(postId) {
    if (!currentUser) {
        alert('Please login to like posts');
        return;
    }

    try {
        const postRef = doc(db, 'forum-posts', postId);
        await updateDoc(postRef, {
            likes: increment(1)
        });

        // Update local data
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            post.likes = (post.likes || 0) + 1;
            document.getElementById('detail-likes').textContent = post.likes;
            displayPosts();
        }

        showSuccess('Thanks for your like!');
    } catch (error) {
        console.error('Error liking post:', error);
        alert('Failed to like post. Please try again.');
    }
}

// Utility functions
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Simple success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    // Simple error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
