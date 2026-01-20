import { db } from "./app.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const COLLECTION_NAME = "zodiacs";

// Get the select element
const zodiacSelect = document.getElementById('zodiac-select');
const zodiacContent = document.getElementById('zodiac-content');
const emptyState = document.getElementById('empty-state');

// Listen for selection changes
zodiacSelect.addEventListener('change', async (e) => {
    const selectedSign = e.target.value;

    if (!selectedSign) {
        // Show empty state
        zodiacContent.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    // Hide empty state and show loading
    emptyState.style.display = 'none';
    zodiacContent.style.display = 'block';

    // Load the zodiac data
    await loadZodiacData(selectedSign);
});

async function loadZodiacData(signId) {
    try {
        const docRef = doc(db, COLLECTION_NAME, signId);

        // Timeout promise
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 5000)
        );

        const docSnap = await Promise.race([getDoc(docRef), timeout]);

        if (docSnap.exists()) {
            const data = docSnap.data();
            renderZodiac(data, signId);
        } else {
            showNoDataMessage(signId);
        }
    } catch (error) {
        console.error("Error loading document:", error);
        showErrorMessage(error.message);
    }
}

function renderZodiac(data, signId) {
    // Header image
    document.getElementById('header-img').src = `images/${signId}.png`;

    // Title section
    document.getElementById('chinese-char').textContent = data.chineseChar || '';
    document.getElementById('zodiac-name').textContent = data.name || 'Unknown';
    document.getElementById('earthly-branch').textContent = data.earthlyBranch || '';

    // Years
    if (data.years && data.years.length > 0) {
        document.getElementById('years').textContent = `Years: ${data.years.join(', ')}`;
    } else {
        document.getElementById('years').textContent = '';
    }

    // Content sections
    document.getElementById('introduction').textContent = data.introduction || 'No introduction available.';
    document.getElementById('lifetime-fortune').textContent = data.lifetimeFortune || 'No fortune information available.';
    document.getElementById('love-marriage').textContent = data.loveMarriage || 'No information available.';
    document.getElementById('wealth').textContent = data.wealth || 'No information available.';
    document.getElementById('health').textContent = data.health || 'No information available.';
    document.getElementById('origin').textContent = data.origin || 'No origin story available.';

    // Personality lists
    renderList('personality-list', data.personality);
    renderList('strengths-list', data.strengths);
    renderList('weaknesses-list', data.weaknesses);

    // Attributes
    if (data.attributes) {
        document.getElementById('attr-element').textContent = data.attributes.element || '-';
        document.getElementById('attr-yinyang').textContent = data.attributes.yinyang || '-';
        document.getElementById('attr-numbers').textContent =
            data.attributes.luckyNumbers ? data.attributes.luckyNumbers.join(', ') : '-';
        document.getElementById('attr-colors').textContent =
            data.attributes.luckyColors ? data.attributes.luckyColors.join(', ') : '-';
        document.getElementById('attr-directions').textContent =
            data.attributes.auspiciousDirections ? data.attributes.auspiciousDirections.join(', ') : '-';
        document.getElementById('attr-flowers').textContent =
            data.attributes.luckyFlowers ? data.attributes.luckyFlowers.join(', ') : '-';
    }

    // Update meta tags for social sharing
    updateMetaTags(data, signId);
}

// Update Open Graph and Twitter Card meta tags for social sharing
function updateMetaTags(data, signId) {
    const zodiacName = data.name || 'Unknown';
    const chineseName = data.chineseChar || '';
    const currentUrl = `${window.location.origin}${window.location.pathname}?sign=${signId}`;
    const imageUrl = `${window.location.origin}/images/${signId}.png`;

    // Create dynamic title and description
    const title = `${zodiacName} ${chineseName} - Larak's Zodiac`;
    const description = data.introduction
        ? data.introduction.substring(0, 150) + '...'
        : `Discover the wisdom and characteristics of the ${zodiacName} in Chinese Zodiac`;

    // Update page title
    document.title = title;

    // Update Open Graph tags
    updateMetaTag('og-url', currentUrl);
    updateMetaTag('og-title', title);
    updateMetaTag('og-description', description);
    updateMetaTag('og-image', imageUrl);

    // Update Twitter Card tags
    updateMetaTag('twitter-title', title);
    updateMetaTag('twitter-description', description);
    updateMetaTag('twitter-image', imageUrl);
}

// Helper function to update meta tag content
function updateMetaTag(id, content) {
    const metaTag = document.getElementById(id);
    if (metaTag) {
        metaTag.setAttribute('content', content);
    }
}

function renderList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '';

    if (items && items.length > 0) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No data available';
        li.style.opacity = '0.5';
        listElement.appendChild(li);
    }
}

function showNoDataMessage(signId) {
    document.getElementById('zodiac-name').textContent = `No Data for ${signId.charAt(0).toUpperCase() + signId.slice(1)}`;
    document.getElementById('introduction').innerHTML =
        `<em>Data for this zodiac sign is not yet available in the database. Please check back later or contact us to add this information.</em>`;

    // Clear other sections
    document.getElementById('chinese-char').textContent = '';
    document.getElementById('earthly-branch').textContent = '';
    document.getElementById('years').textContent = '';
    document.getElementById('lifetime-fortune').textContent = '';
    document.getElementById('love-marriage').textContent = '';
    document.getElementById('wealth').textContent = '';
    document.getElementById('health').textContent = '';
    document.getElementById('origin').textContent = '';

    ['personality-list', 'strengths-list', 'weaknesses-list'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });
}

function showErrorMessage(message) {
    document.getElementById('zodiac-name').textContent = 'Error Loading Data';
    document.getElementById('introduction').innerHTML =
        `<em style="color: #e54d42;">An error occurred: ${message}</em>`;
}

// Check if there's a sign parameter in URL
const urlParams = new URLSearchParams(window.location.search);
const signParam = urlParams.get('sign');
if (signParam) {
    zodiacSelect.value = signParam;
    zodiacSelect.dispatchEvent(new Event('change'));
}

// Social Media Sharing Functions
let currentZodiacName = '';
let currentZodiacSign = '';

// Update current zodiac info when data is loaded
function updateCurrentZodiac(name, sign) {
    currentZodiacName = name;
    currentZodiacSign = sign;
}

// Modify renderZodiac to track current zodiac
const originalRenderZodiac = renderZodiac;
renderZodiac = function (data, signId) {
    originalRenderZodiac(data, signId);
    updateCurrentZodiac(data.name || 'Unknown', signId);
};

// Facebook Share
document.getElementById('share-facebook')?.addEventListener('click', () => {
    const url = window.location.href;
    const title = `${currentZodiacName} - Chinese Zodiac`;
    const description = `Discover the wisdom of the ${currentZodiacName} in Chinese Zodiac! 🐉✨`;

    // Check if running on localhost
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
        // For localhost, show helpful message and copy URL
        const message = '📝 Facebook Sharing on Localhost\n\n' +
            'Facebook requires a public URL for sharing.\n\n' +
            'Your URL has been copied to clipboard!\n' +
            'You can paste it manually on Facebook.\n\n' +
            '💡 Tip: Use the X (Twitter) button for localhost testing,\n' +
            'or deploy to a public URL for full Facebook integration.';

        // Copy URL to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert(message);
        }).catch(err => {
            alert(message + '\n\n(Note: Clipboard copy failed, please copy manually)');
            console.error('Failed to copy URL:', err);
        });
    } else {
        // For production URLs, use Facebook Dialog API with App ID
        // This allows Facebook to fetch Open Graph meta tags from the page
        const facebookUrl = `https://www.facebook.com/dialog/share?` +
            `app_id=727675370331926&` +
            `display=popup&` +
            `href=${encodeURIComponent(url)}&` +
            `redirect_uri=${encodeURIComponent(url)}`;

        window.open(facebookUrl, 'facebook-share-dialog', 'width=626,height=436');
    }
});

// X (Twitter) Share
document.getElementById('share-twitter')?.addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Discover the wisdom of the ${currentZodiacName} in Chinese Zodiac! 🐉✨`);
    const hashtags = encodeURIComponent('ChineseZodiac,Astrology,Zodiac');
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
});

// TikTok Share - Open Modal and Load Local Video
document.getElementById('share-tiktok')?.addEventListener('click', () => {
    if (!currentZodiacName || !currentZodiacSign) {
        alert('Please select a zodiac sign first!');
        return;
    }
    openTikTokModal();
});

// Instagram Share (Placeholder - to be implemented)
document.getElementById('share-instagram')?.addEventListener('click', () => {
    alert('Instagram sharing feature coming soon! 📸');
    // TODO: Implement Instagram sharing functionality
    // Note: Instagram doesn't support direct web sharing
    // You may need to use their official API or create shareable content
});

// ===== TikTok Video Preview Modal =====
let currentZodiacData = null;

// Store zodiac data when loaded
const originalRenderZodiacFunc = renderZodiac;
renderZodiac = function (data, signId) {
    originalRenderZodiacFunc(data, signId);
    currentZodiacData = data;
};

function openTikTokModal() {
    const modal = document.getElementById('tiktok-modal');
    const modalTitle = document.getElementById('modal-title');
    const videoPreview = document.getElementById('video-preview');
    const videoSource = document.getElementById('video-source');
    const statusEl = document.getElementById('video-status');
    const previewContainer = document.getElementById('video-preview-container');

    // Set title
    modalTitle.textContent = 'Share Your Zodiac Video';

    // Load local video file based on zodiac sign
    const videoPath = `/video/${currentZodiacSign}.mp4`;

    // Show loading status
    statusEl.className = 'video-status loading';
    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading video...</span>';

    // Set video source
    videoSource.src = videoPath;
    videoPreview.load();

    // Store video URL for sharing
    window.currentVideoUrl = videoPath;

    // Show preview container
    previewContainer.style.display = 'flex';

    // Add video event listeners
    videoPreview.addEventListener('loadeddata', () => {
        console.log('✅ Video loaded successfully');
        statusEl.className = 'video-status';
        statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Video ready! Click play to preview.</span>';
    }, { once: true });

    videoPreview.addEventListener('error', (e) => {
        console.error('❌ Video loading error:', e);
        statusEl.className = 'video-status error';
        statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Video file not found. Please contact administrator.</span>';
    }, { once: true });

    // Auto-play preview (muted)
    setTimeout(async () => {
        try {
            videoPreview.muted = true;
            await videoPreview.play();
            statusEl.className = 'video-status';
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Preview playing. Unmute to hear audio.</span>';
            // Unmute after starting
            setTimeout(() => {
                videoPreview.muted = false;
            }, 500);
        } catch (playError) {
            console.log('Auto-play prevented:', playError);
            statusEl.className = 'video-status';
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Video ready! Click play to preview.</span>';
        }
    }, 100);

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTikTokModal() {
    const modal = document.getElementById('tiktok-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset video
    const videoPreview = document.getElementById('video-preview');
    const videoSource = document.getElementById('video-source');

    videoPreview.pause();
    videoSource.src = '';

    // Reset status
    const statusEl = document.getElementById('video-status');
    statusEl.className = 'video-status';
    statusEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Loading video...</span>';

    // Clear stored video URL
    window.currentVideoUrl = null;
}

// Close modal handlers
document.getElementById('close-tiktok-modal')?.addEventListener('click', closeTikTokModal);
document.querySelector('.tiktok-modal-overlay')?.addEventListener('click', closeTikTokModal);

// Share video to TikTok
document.getElementById('btn-share-tiktok')?.addEventListener('click', async () => {
    const shareBtnEl = document.getElementById('btn-share-tiktok');
    const statusEl = document.getElementById('video-status');

    if (!window.currentVideoUrl) {
        alert('No video available to share.');
        return;
    }

    // Redirect to backend auth endpoint
    // This will handle the TikTok OAuth redirect
    const sign = currentZodiacSign || 'rat';
    const video = window.currentVideoUrl;

    // Redirecting user to our server's TikTok auth initiation point
    const authInitiateUrl = `/api/tiktok/auth?sign=${sign}&video=${encodeURIComponent(video)}`;

    console.log(`🚀 Initiating TikTok Share via: ${authInitiateUrl}`);

    // Disable button to prevent double clicks during redirect
    shareBtnEl.disabled = true;
    shareBtnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Redirecting...</span>';

    // Navigate to auth
    window.location.href = authInitiateUrl;
});
