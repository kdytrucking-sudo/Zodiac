import { initAuth } from "./auth-state.js";

const navbarHTML = `
<nav class="navbar">
    <div class="logo">
        <div class="logo-icon"></div>
        <span>Larak's Zodiac</span>
    </div>
    <ul class="nav-links">
        <li><a href="index.html" data-page="index.html">Home</a></li>
        <li><a href="archive.html" data-page="archive.html">Archive</a></li>
        <li><a href="query.html" data-page="query.html">Query</a></li>
        <li><a href="fortune.html" data-page="fortune.html">Fortune</a></li>
        <li><a href="matching.html" data-page="matching">Matching</a></li>
        <li><a href="dashboard.html" data-page="dashboard.html">Member Center</a></li>
        <li><a href="community.html" data-page="community">Community (Blog)</a></li>
    </ul>
    <div class="header-search">
        <i class="fas fa-search search-icon"></i>
        <input type="text" placeholder="Quick Zodiac Lookup (e.g., Dragon, 1988)">
    </div>
    <div class="header-auth">
        <!-- Auth buttons injected by auth-state.js -->
    </div>
</nav>
`;

export function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = navbarHTML;

    // Set active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        // Remove active class
        link.classList.remove('active');

        // Add active class if matches
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }

        // Special case for root path
        if (currentPage === '' && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        }
    });

    // Initialize Auth State logic now that the DOM exists
    initAuth();
}

// Auto-load if not imported as a module that calls it manually
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
