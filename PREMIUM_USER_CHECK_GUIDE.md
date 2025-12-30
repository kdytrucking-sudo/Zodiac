# Premium User Check Implementation Guide

## 📋 Overview

The matching page now includes Premium user detection and content gating. This document explains how the system works and how to configure it.

## 🔐 How Premium Check Works

### Current Implementation

The system checks premium status in `matching.js`:

```javascript
async function checkPremiumStatus(userId) {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Check multiple possible field names
            state.isPremium = userData.isPremium === true || 
                             userData.membershipLevel === 'premium' ||
                             userData.subscription === 'active';
        } else {
            state.isPremium = false;
        }
    } catch (error) {
        console.error('Error checking premium status:', error);
        state.isPremium = false;
    }
}
```

## 📊 User Collection Structure

### Required Firestore Collection: `users`

Each user document should have:

```javascript
{
  userId: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  
  // Premium status (use ONE of these fields)
  isPremium: true,              // Option 1: Simple boolean
  // OR
  membershipLevel: "premium",   // Option 2: String ("free", "premium", "vip")
  // OR
  subscription: "active",       // Option 3: Subscription status
  
  // Optional: Subscription details
  subscriptionExpiry: "2025-12-31T23:59:59Z",
  subscriptionPlan: "monthly",
  
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-12-26T00:00:00Z"
}
```

## 🎯 Content Gating Logic

### Free Users See:
- ✅ Matching score and rating
- ✅ Quick overview
- ✅ Compatibility tags
- ❌ Detailed analysis (locked with preview)
- ❌ Conflict details (locked with preview)

### Premium Users See:
- ✅ Everything free users see
- ✅ Full detailed analysis (5 sections)
- ✅ Complete conflict analysis (5 items)
- ✅ All resolution strategies
- ✅ No lock icons or "unlock" buttons

## 🔄 User Flow

### For Non-Premium Users:

1. **View Free Content**
   - See basic compatibility score
   - Read quick overview
   - View compatibility tags

2. **See Premium Preview**
   - Premium sections show with lock icons
   - Preview text visible
   - "Unlock" buttons displayed

3. **Click Unlock Button**
   - If not logged in → Redirect to login
   - If logged in but not premium → Show upgrade message

### For Premium Users:

1. **Automatic Detection**
   - System checks premium status on page load
   - Premium status stored in state

2. **Full Access**
   - All content unlocked automatically
   - No lock icons shown
   - No unlock buttons displayed

## 🛠️ Configuration Options

### Option 1: Use Existing User Field

If you already have a user collection with premium info:

```javascript
// In matching.js, line ~55
state.isPremium = userData.isPremium === true;
```

### Option 2: Check Subscription Expiry

```javascript
state.isPremium = userData.subscription === 'active' && 
                  new Date(userData.subscriptionExpiry) > new Date();
```

### Option 3: Multiple Membership Levels

```javascript
const premiumLevels = ['premium', 'vip', 'lifetime'];
state.isPremium = premiumLevels.includes(userData.membershipLevel);
```

### Option 4: Custom Logic

```javascript
state.isPremium = checkCustomPremiumLogic(userData);

function checkCustomPremiumLogic(userData) {
    // Your custom logic here
    return userData.hasActiveSubscription && 
           userData.paymentStatus === 'paid';
}
```

## 📝 Testing

### Test as Free User

1. Logout or use incognito mode
2. Visit matching page
3. Verify:
   - ✅ Free content visible
   - ✅ Premium sections locked
   - ✅ Lock icons showing
   - ✅ Unlock buttons visible

### Test as Premium User

1. Login with premium account
2. Set `isPremium: true` in user document
3. Visit matching page
4. Verify:
   - ✅ All content visible
   - ✅ No lock icons
   - ✅ No unlock buttons
   - ✅ Full analysis displayed

### Manual Testing in Console

```javascript
// Check current state
console.log(window.matchingState);

// Manually set premium status (for testing)
window.matchingState.isPremium = true;
window.analyzeCompatibility();

// Reset to non-premium
window.matchingState.isPremium = false;
window.analyzeCompatibility();
```

## 🎨 UI States

### Premium Locked State

```css
.premium-locked {
    position: relative;
    opacity: 0.7;
}

.premium-locked::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
    pointer-events: none;
}
```

### Premium Unlocked State

```css
.detailed-analysis-card:not(.premium-locked),
.conflict-analysis-card:not(.premium-locked) {
    opacity: 1;
    /* Full access styling */
}
```

## 🚀 Upgrade Flow (TODO)

When non-premium user clicks unlock:

```javascript
function handleUnlock() {
    if (!state.user) {
        // Not logged in
        window.location.href = 'login.html?redirect=matching.html';
        return;
    }
    
    if (!state.isPremium) {
        // Logged in but not premium
        window.location.href = 'upgrade.html?source=matching';
        return;
    }
}
```

## 📊 Analytics Tracking (Optional)

Track premium conversion:

```javascript
// When user clicks unlock
analytics.logEvent('premium_unlock_attempt', {
    page: 'matching',
    user_id: state.user?.uid,
    is_logged_in: !!state.user,
    match_type: state.matchType,
    zodiac_pair: `${state.personA.zodiac}-${state.personB.zodiac}`
});
```

## 🔒 Security Notes

1. **Frontend Check Only**
   - Current implementation is frontend-only
   - Premium content is still in the database
   - For true security, implement backend checks

2. **Backend Validation (Recommended)**
   - Add Firestore Security Rules
   - Validate premium status server-side
   - Restrict premium field access

### Firestore Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /zodiac-compatibility/{pairId} {
      // Everyone can read free content
      allow read: if true;
      
      // Only admins can write
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users cannot modify their own premium status
      allow update: if request.auth != null && 
                       request.auth.uid == userId &&
                       !request.resource.data.diff(resource.data).affectedKeys()
                         .hasAny(['isPremium', 'membershipLevel', 'subscription']);
    }
  }
}
```

## 📝 Next Steps

1. ✅ Create `users` collection in Firestore
2. ✅ Add premium status field to user documents
3. ⏳ Test with premium and non-premium accounts
4. ⏳ Create upgrade/payment page
5. ⏳ Implement backend premium validation
6. ⏳ Add analytics tracking

## 🐛 Troubleshooting

### Premium status not detected

1. Check user document exists in Firestore
2. Verify field name matches code
3. Check console for errors
4. Verify user is logged in

### Content still locked for premium users

1. Check `state.isPremium` in console
2. Verify `checkPremiumStatus` is called
3. Check for JavaScript errors
4. Clear cache and reload

### All content unlocked for free users

1. Check if `isPremium` is accidentally set to true
2. Verify premium check logic
3. Check for CSS issues with `.premium-locked` class

---

**Status**: ✅ Premium check implemented
**Security Level**: Frontend only (upgrade to backend recommended)
**Ready for**: Testing and integration
