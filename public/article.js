import { db } from "./app.js";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const ARTICLES_PER_PAGE = 20;
let currentPage = 1;
let pageStartDocs = [null]; // Array to store start document for each page
let currentCategory = 'all';
let currentZodiac = 'all';
let isLoading = false;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setupFilters();

    // Initial load
    fetchArticles();

    // Pagination Listeners
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
});

// Load articles from Firestore with Pagination
async function fetchArticles() {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);

    try {
        const articlesRef = collection(db, "articles");

        // Base Query
        let qConstraints = [orderBy("created_at", "desc")];

        // Apply Filters
        if (currentCategory !== 'all') {
            qConstraints.push(where("category", "==", currentCategory));
        }
        if (currentZodiac !== 'all') {
            qConstraints.push(where("zodiacSign", "==", currentZodiac));
        }

        // Apply Pagination
        // For page 1, startAfter is not needed (or null)
        // For page N, startAfter(pageStartDocs[N-1])
        const startDoc = pageStartDocs[currentPage - 1];
        if (startDoc) {
            qConstraints.push(startAfter(startDoc));
        }

        qConstraints.push(limit(ARTICLES_PER_PAGE));

        const q = query(articlesRef, ...qConstraints);
        const querySnapshot = await getDocs(q);

        const articles = [];
        querySnapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
        });

        // Store the last document for the NEXT page
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        if (lastVisible) {
            pageStartDocs[currentPage] = lastVisible;
        } else {
            // No results or end of list
            // If we are on page > 1 and got no results, we should probably disable Next
        }

        console.log(`Loaded ${articles.length} articles for page ${currentPage}`);
        displayArticles(articles, querySnapshot.size < ARTICLES_PER_PAGE);
    } catch (error) {
        console.error("Error loading articles:", error);
        // Specialized error message for missing index
        if (error.message.includes('requires an index')) {
            console.warn("🔥 Missing Index! Open the link in the console error above to create it.");
        }
        showError("Failed to load articles. Please check console for details.");
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// Handle page changes
function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage < 1) return;

    // Don't go to next page if we don't have a start doc (unless it's page 1, which is impossible here if delta is 1)
    if (delta > 0 && !pageStartDocs[currentPage]) return;

    currentPage = newPage;
    fetchArticles();
    updatePaginationUI();
}

function updatePaginationUI() {
    document.getElementById('page-indicator').textContent = `Page ${currentPage}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    // Next button state is updated in displayArticles based on result count
}

// Display articles
function displayArticles(articles, isLastPage) {
    const grid = document.getElementById('articles-grid');
    const noResults = document.getElementById('no-results');
    const paginationControls = document.getElementById('pagination-controls');

    // Remove loading indicator but keep grid
    // Actually we want to clear previous articles
    grid.innerHTML = '';

    if (articles.length === 0) {
        if (currentPage === 1) {
            noResults.style.display = 'block';
            paginationControls.style.display = 'none';
        } else {
            // End of list reached on previous "Next" click maybe?
            // Should not happen if we disable Next correctly.
        }
    } else {
        noResults.style.display = 'none';
        paginationControls.style.display = 'block';

        articles.forEach(article => {
            const card = createArticleCard(article);
            grid.appendChild(card);
        });
    }

    // Update Next button state
    // If we fetched fewer items than requested, we are at the end
    document.getElementById('next-page').disabled = isLastPage || articles.length === 0;

    updatePaginationUI();
}

function showLoading(show) {
    const grid = document.getElementById('articles-grid');
    if (show) {
        grid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i><p>Loading...</p></div>';
    }
}


// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    // Format date
    const date = new Date(article.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Get zodiac emoji
    const zodiacEmoji = getZodiacEmoji(article.zodiacSign);

    // Truncate content for preview
    const preview = article.content.substring(0, 150) + '...';

    // Get statistics (default to 0 if not present)
    const viewCount = article.viewCount || 0;
    const favoriteCount = article.favoriteCount || 0;
    const commentCount = article.commentCount || 0;

    card.innerHTML = `
        <div class="article-card-header">
            <div class="article-category">${article.category}</div>
            <div class="article-zodiac" title="${capitalizeFirst(article.zodiacSign)}">
                ${zodiacEmoji} ${capitalizeFirst(article.zodiacSign)}
            </div>
        </div>
        <h3 class="article-title">${article.title}</h3>
        <p class="article-preview">${preview}</p>
        <div class="article-meta">
            <span class="article-date">
                <i class="far fa-calendar"></i> ${formattedDate}
            </span>
            <span class="article-source">
                <i class="fas fa-book"></i> ${article.source}
            </span>
        </div>
        <div class="article-stats-mini">
            <span class="stat-mini">
                <i class="fas fa-eye"></i> ${viewCount}
            </span>
            <span class="stat-mini">
                <i class="fas fa-star"></i> ${favoriteCount}
            </span>
            <span class="stat-mini">
                <i class="fas fa-comments"></i> ${commentCount}
            </span>
        </div>
        <a href="article-detail.html?id=${article.id}" class="article-read-more">
            Read More <i class="fas fa-arrow-right"></i>
        </a>
    `;

    return card;
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

// Show error message
function showError(message) {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Setup filter buttons
function setupFilters() {
    // Category filter
    const categoryButtons = document.querySelectorAll('#category-filter .filter-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Normalize category: the API expects lowercase for most things, but let's check values
            // The buttons have "Fortune", "Personality" etc.
            // The API/DB stores lowercase usually? Let's check existing data.
            // In article.js before it was just using the value.
            // Let's assume the button data-category attribute matches DB.
            currentCategory = btn.dataset.category;

            resetPagination();
            fetchArticles();
        });
    });

    // Zodiac filter
    const zodiacButtons = document.querySelectorAll('#zodiac-filter .filter-btn');
    zodiacButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            zodiacButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentZodiac = btn.dataset.zodiac;

            resetPagination();
            fetchArticles();
        });
    });
}

function resetPagination() {
    currentPage = 1;
    pageStartDocs = [null];
    updatePaginationUI();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    loadArticles();
});
