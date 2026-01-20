import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * GET /api/instagram/auth
 * Redirect to Facebook (Meta) Login for Instagram permissions
 */
router.get('/auth', (req, res) => {
    // TEMPORARY: Hardcoded credentials for testing (User needs to provide real ones)
    const appId = 'YOUR_INSTAGRAM_APP_ID';
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
        const appId = 'YOUR_INSTAGRAM_APP_ID';
        const appSecret = 'YOUR_INSTAGRAM_APP_SECRET';
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

        // 2. Get the Instagram Business Account ID associated with the user
        // Note: For simplicity in testing, we assume the user has a linked IG account
        const accountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`);
        const accountsData = await accountsResponse.json();

        // This is a complex flow for IG (Page ID -> IG User ID)
        // For development, we return success and explain the next steps
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #121212; color: white; min-height: 100vh;">
                <h1 style="color: #E1306C;">Instagram Authorized!</h1>
                <p>We received your access token. The next step is publishing the video.</p>
                <div style="margin: 30px 0; padding: 20px; border: 1px dashed #E1306C; border-radius: 10px; display: inline-block;">
                    <p>Instagram sharing is complex and requires a linked Facebook Page.</p>
                    <p style="color: #888;">Token obtained: ${userAccessToken.substring(0, 10)}...</p>
                </div>
                <br>
                <a href="/" style="color: #fdd56a; text-decoration: none; border: 1px solid #fdd56a; padding: 10px 20px; border-radius: 20px;">Back to Home</a>
            </div>
        `);

    } catch (error) {
        console.error('❌ Instagram integration error:', error);
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

export default router;
