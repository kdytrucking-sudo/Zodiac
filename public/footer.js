const footerHTML = `
<footer class="footer">
    <div class="footer-links">
        <a href="about.html">About Us</a>
        <a href="contact.html">Contact</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Service</a>
    </div>
    <div class="social-icons">
        <a href="https://www.threads.net/@laraksoracle" target="_blank"><i class="fa-brands fa-threads"></i></a>
        <a href="https://www.tiktok.com/@laraksoracle" target="_blank"><i class="fa-brands fa-tiktok"></i></a>
        <a href="https://www.instagram.com/laraksoracle/" target="_blank"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.facebook.com/laraksoracleta" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="https://www.youtube.com/@LaraKsOracle" target="_blank"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://x.com/laraks_oracle" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
    </div>
    <p class="copyright">© 2024 Larak's Zodiac. All Rights Reserved.</p>
</footer>
`;

export function loadFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = footerHTML;
}

// Auto-load if not imported as a module that calls it manually
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
