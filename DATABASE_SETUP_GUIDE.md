# Zodiac Compatibility Database Setup Guide

## 📋 Overview

This guide will help you set up the zodiac compatibility database for the matching feature.

## 📁 Files Created

1. **COMPATIBILITY_DATABASE_DESIGN.md** - Complete database schema and design documentation
2. **scripts/seed-compatibility.js** - Automated seeding script to populate all 144 documents
3. **SAMPLE_COMPATIBILITY_DATA.md** - High-quality example documents for reference

## 🚀 Quick Start

### Step 1: Update Firebase Configuration

Edit `scripts/seed-compatibility.js` and replace the placeholder Firebase config with your actual configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

You can find these values in your Firebase Console under Project Settings.

### Step 2: Install Dependencies (if needed)

The seeding script uses Firebase v9+ modular SDK. If you haven't already installed it:

```bash
npm install firebase
```

### Step 3: Run the Seeding Script

```bash
node scripts/seed-compatibility.js
```

This will create all 144 compatibility documents in your Firestore database under the `zodiac-compatibility` collection.

**Expected output:**
```
Starting database seeding...
Total documents to create: 144
Created: Dog-Dragon (1/144)
Created: Dog-Goat (2/144)
...
Created: Tiger-Tiger (144/144)
✅ Database seeding complete! Created 144 documents.
```

### Step 4: Verify in Firebase Console

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. You should see a new collection called `zodiac-compatibility`
4. It should contain 144 documents

## 📊 Database Structure

### Collection Name
`zodiac-compatibility`

### Total Documents
**144 documents** (12 zodiac signs × 12 pairings including same-sign matches)

### Document ID Format
Documents are named using alphabetically sorted zodiac pairs:
- `Dog-Dragon` (not `Dragon-Dog`)
- `Rabbit-Snake` (not `Snake-Rabbit`)
- `Rat-Rat` (same-sign pairing)

### Document Structure
Each document contains:
- **zodiacPair**: Basic pairing information
- **romance**: Romance compatibility data (free + premium)
- **business**: Business compatibility data (free + premium)
- **genderModifiers**: Optional score adjustments based on gender combinations
- **metadata**: Creation date, version, quality status

## 🎯 Data Quality Levels

The seed script generates data at different quality levels based on traditional zodiac compatibility:

- **Excellent (Score: 85-99)**: Highly compatible pairs
- **Good (Score: 65-79)**: Solid compatibility
- **Fair (Score: 45-59)**: Moderate compatibility
- **Poor (Score: 25-39)**: Challenging compatibility

## 🔐 Security Rules

Add these rules to your Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /zodiac-compatibility/{pairId} {
      // Everyone can read
      allow read: if true;
      
      // Only admins can write
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

## 📝 Customizing the Data

### Option 1: Edit the Seed Script

Before running the seed script, you can modify:

1. **Compatibility Matrix**: Edit the `compatibilityMatrix` object to change base compatibility levels
2. **Templates**: Modify `compatibilityTemplates` to change the default content
3. **Scores**: Adjust score ranges for each compatibility level

### Option 2: Manual Updates

After seeding, you can manually edit specific documents in the Firebase Console to add more detailed, personalized content. Use the examples in `SAMPLE_COMPATIBILITY_DATA.md` as a guide.

### Option 3: Batch Updates

Create a separate script to update specific fields across multiple documents:

```javascript
const batch = writeBatch(db);
const snapshot = await db.collection('zodiac-compatibility').get();

snapshot.forEach(doc => {
  batch.update(doc.ref, {
    'metadata.updatedAt': new Date().toISOString(),
    'metadata.version': 2
  });
});

await batch.commit();
```

## 🧪 Testing the Database

### Test Query 1: Get a specific pairing

```javascript
import { doc, getDoc } from 'firebase/firestore';

const pairId = 'Rabbit-Snake';
const docRef = doc(db, 'zodiac-compatibility', pairId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log('Data:', docSnap.data());
} else {
  console.log('No such document!');
}
```

### Test Query 2: Get all pairings for a zodiac

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';

const zodiac = 'Rabbit';
const q = query(
  collection(db, 'zodiac-compatibility'),
  where('zodiacPair.zodiac1', '==', zodiac)
);

const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data().romance.free.matchingScore);
});
```

## 📈 Next Steps

After setting up the database:

1. **Update matching.js** to fetch data from Firestore
2. **Implement premium content gating** based on user membership
3. **Add loading states** while fetching data
4. **Implement error handling** for failed queries
5. **Consider caching** frequently accessed pairings

## 🐛 Troubleshooting

### Error: "Firebase not initialized"
- Make sure you've updated the Firebase config in the seed script
- Verify your Firebase project is active

### Error: "Permission denied"
- Check your Firestore Security Rules
- Make sure you're authenticated if required

### Error: "Document already exists"
- The seed script will overwrite existing documents
- If you want to preserve existing data, modify the script to check before writing

### Incomplete data
- Check the console output for errors during seeding
- Verify all 144 documents were created
- Check individual documents in Firebase Console

## 💡 Tips

1. **Start with sample data**: Before running the full seed, test with just a few documents
2. **Backup first**: If you're re-seeding, export your existing data first
3. **Quality over quantity**: Consider manually enhancing high-traffic pairings (like Rabbit-Snake, Dragon-Dragon) with better content
4. **Monitor usage**: Track which pairings are queried most often and prioritize improving those

## 📞 Support

If you encounter issues:
1. Check the Firebase Console for error messages
2. Review the Firestore Security Rules
3. Verify your Firebase configuration
4. Check the browser console for client-side errors

---

**Ready to seed your database?** Run:
```bash
node scripts/seed-compatibility.js
```

Good luck! 🎉
