import express from 'express';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const router = express.Router();

// Initialize Genkit for video generation
const rawKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = genkit({
    plugins: [googleAI({ apiKey: rawKey })],
    model: 'googleai/gemini-2.0-flash-exp',
});

/**
 * POST /api/generate-tiktok-video
 * Generate a TikTok video using Gemini AI
 * 
 * Request body:
 * {
 *   zodiacSign: string,
 *   zodiacName: string,
 *   prompt: string,
 *   zodiacData: object
 * }
 */
router.post('/generate-tiktok-video', async (req, res) => {
    try {
        const { zodiacSign, zodiacName, prompt, zodiacData } = req.body;

        if (!zodiacSign || !zodiacName || !prompt) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: zodiacSign, zodiacName, or prompt'
            });
        }

        console.log(`🎬 Generating TikTok video for ${zodiacName} (${zodiacSign})`);

        // Call Gemini API to generate video
        // Note: As of now, Gemini doesn't directly support video generation
        // This is a placeholder for when the feature becomes available
        // For now, we'll simulate the response

        // TODO: Replace with actual Gemini video generation API when available
        // const { video } = await ai.generate({
        //   prompt: prompt,
        //   config: {
        //     outputFormat: 'video',
        //     aspectRatio: '9:16',
        //     duration: 15,
        //     resolution: '1080x1920'
        //   }
        // });

        // Simulated response for development
        // In production, you would:
        // 1. Generate the video using Gemini or another AI service
        // 2. Upload it to cloud storage (Firebase Storage, S3, etc.)
        // 3. Return the public URL

        // For now, use a valid test video URL for preview testing
        // Using a very small sample video (1.5MB) for instant loading
        // This is a short vertical video perfect for testing
        const mockVideoUrl = `https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4`;

        console.log(`✅ Video generated successfully (MOCK): ${mockVideoUrl}`);

        res.json({
            success: true,
            videoUrl: mockVideoUrl,
            zodiacSign,
            zodiacName,
            message: 'Video generation feature is in development. This is a mock response.'
        });

    } catch (error) {
        console.error('❌ Error generating TikTok video:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate video'
        });
    }
});

/**
 * GET /api/tiktok/auth
 * Redirect to TikTok OAuth page
 */
router.all('/auth', (req, res) => {
    console.log(`🔍 Received request for TikTok auth: sign=${req.query.sign}, video=${req.query.video}`);

    // TEMPORARY: Hardcoded credentials for testing
    const clientKey = 'sbaw1imsw3k4var7mm';
    const redirectUri = 'https://zodiac.laraks.com/api/tiktok/callback';

    const state = JSON.stringify({
        zodiacSign: req.query.sign || 'unknown',
        videoUrl: req.query.video || ''
    });

    // New version of TikTok authorization URL (v2)
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
        `?client_key=${clientKey}` +
        `&scope=user.info.basic,video.upload,video.publish` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${encodeURIComponent(state)}`;

    console.log(`🔗 Redirecting to TikTok auth: ${authUrl}`);
    res.redirect(authUrl);
});

/**
 * GET /api/tiktok/callback
 * Handle TikTok OAuth callback (TikTok redirects here with 'code' and 'state')
 */
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send('<h1>Error</h1><p>Missing authorization code from TikTok.</p>');
    }

    try {
        console.log(`🎟️ Exchanging TikTok code for access token...`);

        // TEMPORARY: Hardcoded credentials for testing
        const clientKey = 'sbaw1imsw3k4var7mm';
        const clientSecret = 'sSrlcKFYuMvHMEWhnLE94n1UeMdv9Wtz';
        const redirectUri = 'https://zodiac.laraks.com/api/tiktok/callback';

        // Change code for access token
        const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            body: new URLSearchParams({
                client_key: clientKey,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('❌ TikTok token exchange error:', data);
            return res.status(500).send(`<h1>TikTok Error</h1><p>${data.error_description || 'Failed to exchange token'}</p>`);
        }

        const accessToken = data.access_token;
        const openId = data.open_id;

        console.log(`✅ Success! Got TikTok Access Token for user: ${openId}`);

        // Parse state to get video info
        let zodiacSign = 'unknown';
        try {
            const stateData = JSON.parse(decodeURIComponent(state));
            zodiacSign = stateData.zodiacSign;
        } catch (e) { }

        // In a real app, you would now trigger the video upload using the accessToken
        // For now, we'll return a success page to the user
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #121212; color: white; min-height: 100vh;">
                <h1 style="color: #00f2ea;">Successfully Authorized!</h1>
                <p>TikTok has authorized Larak's Zodiac to share your <strong>${zodiacSign}</strong> video.</p>
                <div style="margin: 30px 0; padding: 20px; border: 1px dashed #ff0050; border-radius: 10px; display: inline-block;">
                    <p style="font-size: 1.2rem;">Next Step: Video Uploading...</p>
                    <p style="color: #888;">(This feature is currently in automated testing mode)</p>
                </div>
                <br>
                <a href="/" style="color: #fdd56a; text-decoration: none; border: 1px solid #fdd56a; padding: 10px 20px; border-radius: 20px;">Back to Home</a>
            </div>
        `);

    } catch (error) {
        console.error('❌ TikTok integration error:', error);
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

export default router;
