import { db } from "./app.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let allArticles = [];
let currentCategory = 'all';
let currentZodiac = 'all';

// Load articles from Firestore
async function loadArticles() {
    try {
        const articlesRef = collection(db, "articles");
        const q = query(articlesRef, orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);

        allArticles = [];
        querySnapshot.forEach((doc) => {
            allArticles.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Loaded ${allArticles.length} articles`);
        displayArticles();
    } catch (error) {
        console.error("Error loading articles:", error);
        showError("Failed to load articles. Please try again later.");
    }
}

// Display articles based on current filters
function displayArticles() {
    const grid = document.getElementById('articles-grid');
    const noResults = document.getElementById('no-results');

    // Filter articles
    let filteredArticles = allArticles.filter(article => {
        const categoryMatch = currentCategory === 'all' || article.category === currentCategory;
        const zodiacMatch = currentZodiac === 'all' || article.zodiacSign === currentZodiac;
        return categoryMatch && zodiacMatch;
    });

    // Clear grid
    grid.innerHTML = '';

    // Show/hide no results message
    if (filteredArticles.length === 0) {
        noResults.style.display = 'block';
        return;
    } else {
        noResults.style.display = 'none';
    }

    // Create article cards
    filteredArticles.forEach(article => {
        const card = createArticleCard(article);
        grid.appendChild(card);
    });
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
            currentCategory = btn.dataset.category;
            displayArticles();
        });
    });

    // Zodiac filter
    const zodiacButtons = document.querySelectorAll('#zodiac-filter .filter-btn');
    zodiacButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            zodiacButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentZodiac = btn.dataset.zodiac;
            displayArticles();
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    loadArticles();
});
