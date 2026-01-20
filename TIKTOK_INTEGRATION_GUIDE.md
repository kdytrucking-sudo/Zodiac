# TikTok Video Generation & Sharing Integration Guide

## 📋 Overview

This feature allows users to generate personalized zodiac sign videos using AI and share them directly to TikTok.

## 🎯 Features Implemented

### 1. **Modal Dialog** ✅
- Beautiful floating modal with TikTok branding
- Dynamic title based on selected zodiac sign
- Video description preview
- Hidden AI prompt (visible on hover)
- Status indicators for generation progress

### 2. **AI-Powered Content Generation** ✅
- Automatic video description generation
- Detailed AI prompt for video creation
- Personalized content based on zodiac data

### 3. **Backend API** ✅
- `/api/generate-tiktok-video` endpoint
- Gemini AI integration ready
- Error handling and logging

### 4. **TikTok OAuth Integration** 🔄 (Needs Configuration)
- OAuth flow implementation
- Video upload preparation
- Callback handling

## 🔧 Required TikTok Developer Configuration

### Step 1: Get TikTok Developer Credentials

1. **Go to TikTok for Developers**
   - Visit: https://developers.tiktok.com/
   - Sign in with your TikTok account

2. **Create an App**
   - Click "Manage Apps" → "Create App"
   - Fill in app details:
     - App Name: "Larak's Zodiac"
     - Category: "Entertainment"
     - Description: "Personalized Chinese Zodiac videos"

3. **Get Your Credentials**
   After creating the app, you'll receive:
   - **Client Key** (App ID)
   - **Client Secret**

4. **Configure Redirect URI**
   - Add your redirect URI:
     - Development: `http://localhost:8080/tiktok-callback`
     - Production: `https://zodiac.laraks.com/tiktok-callback`

5. **Request Permissions (Scopes)**
   - `user.info.basic` - Get user profile info
   - `video.upload` - Upload videos to TikTok
   - `video.publish` - Publish videos

### Step 2: Update Environment Variables

Add to your `.env` file:

```env
# TikTok Developer Credentials
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=http://localhost:8080/tiktok-callback
```

### Step 3: Update Frontend Code

In `public/archive.js`, replace the placeholder:

```javascript
// Find this line (around line 424):
const tiktokClientKey = 'YOUR_TIKTOK_CLIENT_KEY';

// Replace with:
const tiktokClientKey = '{{YOUR_ACTUAL_CLIENT_KEY}}';
```

Or better yet, fetch it from your backend:

```javascript
// Fetch TikTok config from backend
const response = await fetch('/api/tiktok/config');
const { clientKey } = await response.json();
```

## 🎬 Gemini Video Generation API

### Current Status
- **Gemini 2.0** supports video generation but the API is still in preview
- The current implementation returns a mock response
- When Gemini video API becomes generally available, update the code

### When Gemini Video API is Available

Update `server/routes/tiktok-video.mjs`:

```javascript
// Replace the mock response with actual Gemini call:
const { video } = await ai.generate({
  prompt: prompt,
  config: {
    outputFormat: 'video',
    aspectRatio: '9:16',
    duration: 15,
    resolution: '1080x1920',
    model: 'gemini-2.0-flash-exp'
  }
});

// Upload video to Firebase Storage or Cloud Storage
const videoUrl = await uploadVideoToStorage(video);

res.json({
  success: true,
  videoUrl: videoUrl,
  zodiacSign,
  zodiacName
});
```

## 📝 Implementation Checklist

- [x] Create modal UI
- [x] Add CSS styling
- [x] Implement frontend logic
- [x] Create backend API route
- [x] Integrate Gemini AI (placeholder)
- [ ] Get TikTok Developer credentials
- [ ] Configure TikTok OAuth
- [ ] Implement video upload to TikTok
- [ ] Test end-to-end flow
- [ ] Deploy to production

## 🔐 Security Notes

1. **Never expose Client Secret in frontend code**
   - Always keep it in backend environment variables
   - Use backend proxy for TikTok API calls

2. **Validate all user inputs**
   - Sanitize zodiac data before sending to AI
   - Validate video URLs before uploading

3. **Rate Limiting**
   - Implement rate limiting on video generation endpoint
   - Prevent abuse of AI API

## 📚 API Documentation

### POST /api/generate-tiktok-video

**Request:**
```json
{
  "zodiacSign": "rat",
  "zodiacName": "Rat",
  "prompt": "Create a captivating 9:16 vertical video...",
  "zodiacData": {
    "name": "Rat",
    "personality": ["clever", "quick-witted"],
    "strengths": ["intelligent", "adaptable"],
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://storage.googleapis.com/zodiac-videos/rat-1234567890.mp4",
  "zodiacSign": "rat",
  "zodiacName": "Rat",
  "message": "Video generated successfully"
}
```

### POST /api/tiktok-callback

**Request:**
```json
{
  "code": "authorization_code_from_tiktok",
  "state": "{\"videoUrl\":\"...\",\"zodiacSign\":\"rat\"}"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video uploaded to TikTok successfully"
}
```

## 🎨 UI/UX Features

1. **Modal Animations**
   - Smooth fade-in and slide-up animations
   - Hover effects on tooltips
   - Loading spinners during generation

2. **Status Indicators**
   - Info: Ready to generate
   - Loading: Generating video
   - Success: Video ready
   - Error: Generation failed

3. **Responsive Design**
   - Mobile-friendly modal
   - Adaptive button sizes
   - Touch-optimized interactions

## 🐛 Troubleshooting

### Video Generation Fails
- Check Gemini API key in `.env`
- Verify API quota limits
- Check server logs for errors

### TikTok OAuth Fails
- Verify Client Key and Secret
- Check redirect URI matches exactly
- Ensure scopes are approved

### Modal Doesn't Open
- Check if zodiac sign is selected
- Verify JavaScript console for errors
- Ensure all CSS is loaded

## 📞 Support

For issues or questions:
- Check server logs: `npm start`
- Review browser console
- Verify environment variables
- Test API endpoints individually

## 🚀 Next Steps

1. **Get TikTok credentials** from https://developers.tiktok.com/
2. **Update environment variables** with your credentials
3. **Test the modal** by selecting a zodiac sign
4. **Monitor Gemini API** for video generation availability
5. **Deploy to production** when ready

---

**Note:** This feature is currently in development. The video generation returns a mock response until Gemini's video API becomes generally available.
