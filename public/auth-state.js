import { auth } from "./app.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

export function initAuth() {
    const headerAuth = document.querySelector('.header-auth');

    if (!headerAuth) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            const displayName = user.displayName || user.email.split('@')[0];

            headerAuth.innerHTML = `
                <div class="user-menu-container">
                    <button class="user-menu-btn">
                        <i class="fas fa-user-circle"></i>
                        <span>${displayName}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown">
                        <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;

            // Add event listeners for the new elements
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await signOut(auth);
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                });
            }

            // Toggle dropdown on click
            const userMenuBtn = document.querySelector('.user-menu-btn');
            const userDropdown = document.querySelector('.user-dropdown');

            if (userMenuBtn && userDropdown) {
                userMenuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userDropdown.classList.toggle('show');
                    userMenuBtn.querySelector('.fa-chevron-down').style.transform =
                        userDropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    userDropdown.classList.remove('show');
                    userMenuBtn.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
                });
            }

        } else {
            // User is signed out - restore original buttons
            headerAuth.innerHTML = `
                <button class="btn-login" onclick="location.href='login.html'">Login</button>
                <button class="btn-register" onclick="location.href='register.html'">Register</button>
            `;
        }
    });
}

