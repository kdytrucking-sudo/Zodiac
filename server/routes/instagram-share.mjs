import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * GET /api/instagram/auth
 * Redirect to Facebook (Meta) Login for Instagram permissions
 */
router.get('/auth', (req, res) => {
    // TEMPORARY: Hardcoded credentials for testing
    const appId = '727675370331926';
    const redirectUri = 'https://zodiac.laraks.com/api/instagram/callback';

    const state = JSON.stringify({
        zodiacSign: req.query.sign || 'unknown',
        videoUrl: req.query.video || ''
    });

    // We need instagram_basic and instagram_content_publish scopes
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth` +
        `?client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${encodeURIComponent(state)}` +
        `&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;

    console.log(`🔗 Redirecting to Instagram (Meta) auth: ${authUrl}`);
    res.redirect(authUrl);
});

/**
 * GET /api/instagram/callback
 * Handle Meta OAuth callback
 */
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('<h1>Error</h1><p>Missing authorization code from Meta.</p>');
    }

    try {
        console.log(`🎟️ Exchanging Meta code for access token...`);

        // TEMPORARY: Hardcoded credentials
        const appId = '727675370331926';
        const appSecret = '94c1854a593959b5a1161fcaa1c94a4c';
        const redirectUri = 'https://zodiac.laraks.com/api/instagram/callback';

        // 1. Exchange code for User Access Token
        const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token` +
            `?client_id=${appId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&client_secret=${appSecret}` +
            `&code=${code}`);

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('❌ Meta Token Error:', tokenData.error);
            return res.status(500).send(`<h1>Meta Error</h1><p>${tokenData.error.message}</p>`);
        }

        const userAccessToken = tokenData.access_token;

        // 2. Parse state for video info
        let zodiacSign = 'unknown';
        let videoPath = '';
        try {
            const stateData = JSON.parse(decodeURIComponent(state));
            zodiacSign = stateData.zodiacSign;
            videoPath = stateData.videoUrl;
        } catch (e) { }

        const videoUrl = `https://zodiac.laraks.com${videoPath}`;
        console.log(`📸 Searching for Instagram Business Account to publish: ${videoUrl}`);

        // 3. Get the Instagram Business Account ID
        // First get Facebook Pages
        const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`);
        const pagesData = await pagesResponse.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            return res.status(400).send('<h1>No Pages Found</h1><p>Your Facebook account must have at least one Page linked to an Instagram Business/Creator account.</p>');
        }

        let igAccountId = null;
        for (const page of pagesData.data) {
            const igResponse = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${userAccessToken}`);
            const igData = await igResponse.json();
            if (igData.instagram_business_account) {
                igAccountId = igData.instagram_business_account.id;
                break;
            }
        }

        if (!igAccountId) {
            return res.status(400).send('<h1>No Instagram Account linked</h1><p>None of your Facebook Pages are linked to an Instagram Business/Creator account.</p>');
        }

        console.log(`✅ Found Instagram Account: ${igAccountId}. Initializing upload...`);

        // 4. Create Media Container (Reels)
        const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                media_type: 'REELS',
                video_url: videoUrl,
                caption: `Discover your ${zodiacSign} Zodiac wisdom! 🐉✨ #zodiac #astrology #larakszodiac`,
                access_token: userAccessToken
            })
        });

        const mediaData = await mediaResponse.json();
        if (mediaData.error) {
            console.error('❌ IG Media Container Error:', mediaData.error);
            return res.status(500).send(`<h1>Instagram Error</h1><p>${mediaData.error.message}</p>`);
        }

        const creationId = mediaData.id;
        console.log(`📦 Media container created: ${creationId}. Waiting for processing...`);

        // 5. Success response to user while processing happens
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #121212; color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 30px rgba(220, 39, 67, 0.5);">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Instagram Upload Started!</h1>
                <p style="font-size: 1.2rem; color: #d1d1d6; max-width: 600px;">
                    Your <strong>${zodiacSign.toUpperCase()}</strong> zodiac video is being processed by Instagram.
                    It will appear on your profile as a Reel shortly.
                </p>

                <div style="margin: 40px 0; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 400px;">
                    <h3 style="color: #fdd56a; margin-top: 0;">What's happening?</h3>
                    <ul style="text-align: left; color: #aaa; line-height: 1.6;">
                        <li>We've successfully verified your identity.</li>
                        <li>The video has been sent to Instagram.</li>
                        <li>The server is finalizing the post in the background.</li>
                    </ul>
                </div>

                <a href="/" style="background: white; color: black; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; transition: transform 0.2s;">
                    Back to Larak's Zodiac
                </a>
            </div>
        `);

        // 6. Background Polling and Publishing (Fire and forget on the server)
        (async () => {
            try {
                let status = 'IN_PROGRESS';
                let attempts = 0;
                while (status !== 'FINISHED' && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                    const statusCheck = await fetch(`https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${userAccessToken}`);
                    const statusData = await statusCheck.json();
                    status = statusData.status_code;
                    console.log(`🔄 IG processing status for ${creationId}: ${status}`);
                    if (status === 'ERROR') {
                        console.error('❌ IG Video Processing Error:', statusData);
                        return;
                    }
                    attempts++;
                }

                if (status === 'FINISHED') {
                    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            creation_id: creationId,
                            access_token: userAccessToken
                        })
                    });
                    const publishData = await publishResponse.json();
                    console.log(`🎉 Instagram Reel published! ID: ${publishData.id}`);
                } else {
                    console.error('⏳ Instagram processing timed out.');
                }
            } catch (bgError) {
                console.error('❌ Error in background Instagram publishing:', bgError);
            }
        })();

    } catch (error) {
        console.error('❌ Instagram integration error:', error);
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

export default router;
