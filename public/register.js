import { auth, db } from "./app.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Toggle optional information section
const optionalToggle = document.getElementById('optional-toggle');
const optionalContent = document.getElementById('optional-content');

optionalToggle.addEventListener('click', () => {
    const isHidden = optionalContent.style.display === 'none';
    optionalContent.style.display = isHidden ? 'block' : 'none';

    // Rotate the chevron icon
    const icon = optionalToggle.querySelector('i');
    icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const location = document.getElementById('location').value.trim();

    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        errorMessage.style.display = 'block';
        return;
    }

    // Validate password length
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long.';
        errorMessage.style.display = 'block';
        return;
    }

    // Disable submit button
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    try {
        // Create user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
            displayName: name
        });

        // Prepare user data for Firestore
        // Prepare user data for Firestore
        const userData = {
            uid: user.uid,
            name: name,
            email: email,
            birthdate: birthdate || "",
            birthtime: birthtime || "",
            location: location || "",
            level: 0, // 0: Free, 1: Premium
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save user data to Firestore 'users' collection
        await setDoc(doc(db, "users", user.uid), userData);

        // Show success message
        successMessage.textContent = 'Account created successfully! Redirecting to login...';
        successMessage.style.display = 'block';

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';

        // Show error message
        let errorMsg = 'An error occurred. Please try again.';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'This email is already registered. Redirecting to login...';
                errorMessage.textContent = errorMsg;
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return; // Stop further execution
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMsg = 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                errorMsg = 'Password is too weak. Please use a stronger password.';
                break;
            default:
                errorMsg = error.message;
        }

        errorMessage.textContent = errorMsg;
        errorMessage.style.display = 'block';
        console.error('Registration error:', error);
    }
});

// Google Sign-In
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
                    level: 0, // 0: Free, 1: Premium
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await setDoc(userDocRef, userData);
            }

            // Show success message
            successMessage.textContent = 'Google sign-in successful! Redirecting...';
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

// Facebook Sign-In
import { FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const facebookBtn = document.querySelector('.facebook-btn');
if (facebookBtn) {
    facebookBtn.addEventListener('click', async () => {
        const provider = new FacebookAuthProvider();

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
                    email: user.email || '',
                    birthdate: "",
                    birthtime: "",
                    location: "",
                    level: 0, // 0: Free, 1: Premium
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                await setDoc(userDocRef, userData);
            }

            // Show success message
            successMessage.textContent = 'Facebook sign-in successful! Redirecting...';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Facebook Sign-In Error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        }
    });
}
