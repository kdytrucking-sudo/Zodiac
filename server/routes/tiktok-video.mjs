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
    const clientKey = 'WOEgKAqpJZZGaS4bmyoWq7I1uGXkI5E2';
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
        const clientKey = 'WOEgKAqpJZZGaS4bmyoWq7I1uGXkI5E2';
        const clientSecret = 'aww6zbavqvwdcffv';
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
        let videoPath = '';
        try {
            const stateData = JSON.parse(decodeURIComponent(state));
            zodiacSign = stateData.zodiacSign;
            videoPath = stateData.videoUrl;
        } catch (e) { }

        // Construct absolute video URL
        // TikTok needs a public URL to pull the video from, or we need to stream the file.
        // Since our videos are in /public/video, they are publicly accessible.
        const origin = 'https://zodiac.laraks.com';
        const absoluteVideoUrl = `${origin}${videoPath}`;

        console.log(`🚀 Attempting to publish video to TikTok: ${absoluteVideoUrl}`);

        // 1. Initialize Video Publication
        const publishInitUrl = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
        const publishResponse = await fetch(publishInitUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_info: {
                    title: `Check out my ${zodiacSign} Zodiac video! #zodiac #lara-k`,
                    privacy_level: 'SELF_ONLY', // Changed from PUBLIC_TO_EVERYONE to bypass unaudited client restriction
                    disable_duet: false,
                    disable_comment: false,
                    disable_stitch: false,
                    video_cover_timestamp_ms: 1000
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url: absoluteVideoUrl
                }
            })
        });

        const publishData = await publishResponse.json();

        if (publishData.error && publishData.error.code !== 'ok') {
            console.error('❌ TikTok Publishing Error:', publishData);
            return res.status(500).send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #121212; color: white; min-height: 100vh;">
                    <h1 style="color: #ff0050;">Publishing Failed</h1>
                    <p>${publishData.error.message || 'TikTok rejected the video upload request.'}</p>
                    <p style="color: #888;">Error Code: ${publishData.error.code}</p>
                    <br>
                    <a href="/" style="color: #fdd56a; text-decoration: none; border: 1px solid #fdd56a; padding: 10px 20px; border-radius: 20px;">Return to Site</a>
                </div>
            `);
        }

        const publishId = publishData.data?.publish_id;
        console.log(`🎉 Video submission successful! Publish ID: ${publishId}`);

        // Return a BEAUTIFUL success page to the user
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #121212; color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="background: linear-gradient(135deg, #ff0050 0%, #00f2ea 100%); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 30px rgba(255, 0, 80, 0.5);">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Video Shared Successfully!</h1>
                <p style="font-size: 1.2rem; color: #d1d1d6; max-width: 600px;">
                    Your <strong>${zodiacSign.toUpperCase()}</strong> zodiac video has been sent to TikTok. 
                    It will appear on your profile shortly once TikTok finishes processing it.
                </p>
                
                <div style="margin: 40px 0; background: rgba(255,255,255,0.05); padding: 25px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 400px;">
                    <h3 style="color: #fdd56a; margin-top: 0;">What happens next?</h3>
                    <ul style="text-align: left; color: #aaa; line-height: 1.6;">
                        <li>TikTok is now processing your video.</li>
                        <li>Check your TikTok app "Inbox" or "Profile".</li>
                        <li>You can edit the caption and hashtags there.</li>
                    </ul>
                </div>

                <a href="/" style="background: white; color: black; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; transition: transform 0.2s;">
                    Back to Larak's Zodiac
                </a>
                
                <p style="margin-top: 30px; font-size: 0.8rem; color: #555;">Publish ID: ${publishId}</p>
            </div>
        `);

    } catch (error) {
        console.error('❌ TikTok integration error:', error);
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

export default router;
