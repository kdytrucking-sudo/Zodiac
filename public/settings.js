import { auth, db } from "./app.js";
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const profileForm = document.getElementById('profile-form');
const profileMessage = document.getElementById('profile-message');

// Form Fields
const displayNameInput = document.getElementById('display-name');
const birthdateInput = document.getElementById('birthdate');
const birthtimeInput = document.getElementById('birthtime');
const locationInput = document.getElementById('location');

// Navigation
const navBtns = document.querySelectorAll('.settings-nav-btn');
const sections = document.querySelectorAll('.settings-section');

// Tab Switching Logic
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        navBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show target section
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await loadUserData(user.uid);
    } else {
        window.location.href = 'login.html';
    }
});

async function loadUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Populate Form
            displayNameInput.value = data.name || currentUser.displayName || '';
            birthdateInput.value = data.birthdate || '';
            birthtimeInput.value = data.birthtime || '';
            locationInput.value = data.location || '';
        }
    } catch (error) {
        console.error("Error loading user data:", error);
        showMessage('Failed to load profile data.', 'error');
    }
}

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) return;

    const submitBtn = profileForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    profileMessage.style.display = 'none';

    try {
        const newName = displayNameInput.value.trim();

        // Update Firestore Data
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
            name: newName,
            birthdate: birthdateInput.value,
            birthtime: birthtimeInput.value,
            location: locationInput.value.trim(),
            updatedAt: new Date().toISOString()
        });

        // Update Auth Profile if name changed
        if (newName !== currentUser.displayName) {
            await updateProfile(currentUser, {
                displayName: newName
            });
        }

        showMessage('Profile updated successfully!', 'success');

    } catch (error) {
        console.error("Error updating profile:", error);
        showMessage('Failed to update profile. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
});

function showMessage(msg, type) {
    profileMessage.textContent = msg;
    profileMessage.className = `status-message ${type}`;
    profileMessage.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            profileMessage.style.display = 'none';
        }, 3000);
    }
}
