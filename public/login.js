import { auth } from "./app.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Disable submit button
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    try {
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Show success message
        successMessage.textContent = 'Login successful! Redirecting...';
        successMessage.style.display = 'block';

        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';

        // Show error message
        let errorMsg = 'An error occurred. Please try again.';

        switch (error.code) {
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMsg = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMsg = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password.';
                break;
            case 'auth/invalid-credential':
                errorMsg = 'Invalid email or password.';
                break;
            default:
                errorMsg = error.message;
        }

        errorMessage.textContent = errorMsg;
        errorMessage.style.display = 'block';
        console.error('Login error:', error);
    }
});

// Google Sign-In
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./app.js";

const googleBtn = document.querySelector('.google-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // Create new user document
                const userData = {
                    uid: user.uid,
                    name: user.displayName || 'User',
                    email: user.email,
                    birthdate: "",
                    birthtime: "",
                    location: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await setDoc(userDocRef, userData);
            }

            // Show success message
            successMessage.textContent = 'Google login successful! Redirecting...';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Google Sign-In Error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
}
