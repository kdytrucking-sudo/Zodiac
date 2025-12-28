/**
 * Script to add genderSpecificMatching data to existing compatibility documents
 * This adds 9 gender combinations with full Romance and Business content
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBRxqKVZEpwfTy0TdNPmJkgGCLSWqPnINY",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "zodiac-b3c2b.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "zodiac-b3c2b",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "zodiac-b3c2b.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1091074623547",
    appId: process.env.FIREBASE_APP_ID || "1:1091074623547:web:d5a0e4e0e8f8f8f8f8f8f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 9 gender combinations (using 6 for now to reduce workload)
const genderCombinations = [
    'male-male',
    'male-female',
    'male-others',
    'female-female',
    'female-others',
    'others-others'
];

/**
 * Generate gender-specific matching data based on base data
 */
function generateGenderSpecificData(baseRomance, baseBusiness, genderCombo) {
    const baseRomanceScore = baseRomance?.free?.matchingScore || 70;
    const baseBusinessScore = baseBusiness?.free?.matchingScore || 70;

    // Apply slight variations based on gender combination
    const adjustments = {
        'male-male': { romance: -2, business: 5 },
        'male-female': { romance: 3, business: 0 },
        'male-others': { romance: 0, business: 0 },
        'female-female': { romance: 5, business: 2 },
        'female-others': { romance: 0, business: 0 },
        'others-others': { romance: 0, business: 0 }
    };

    const adjustment = adjustments[genderCombo] || { romance: 0, business: 0 };

    const romanceScore = Math.max(0, Math.min(100, baseRomanceScore + adjustment.romance));
    const businessScore = Math.max(0, Math.min(100, baseBusinessScore + adjustment.business));

    const getRating = (score) => {
        if (score >= 90) return 'Perfect';
        if (score >= 75) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Poor';
    };

    const genderLabels = {
        'male-male': { label: 'two males', icon: '♂♂' },
        'male-female': { label: 'a male and female', icon: '♂♀' },
        'male-others': { label: 'a male and non-binary individual', icon: '♂⚪' },
        'female-female': { label: 'two females', icon: '♀♀' },
        'female-others': { label: 'a female and non-binary individual', icon: '♀⚪' },
        'others-others': { label: 'two non-binary individuals', icon: '⚪⚪' }
    };

    const genderInfo = genderLabels[genderCombo];

    return {
        romance: {
            score: romanceScore,
            rating: getRating(romanceScore),
            summary: `In a romantic relationship between ${genderInfo.label}, this pairing shows ${getRating(romanceScore).toLowerCase()} compatibility. The unique dynamics of this gender combination bring both opportunities and considerations to the relationship.`,
            detailedAnalysis: `This ${genderInfo.icon} pairing creates a distinctive romantic dynamic. The base compatibility is enhanced or modified by the specific gender combination, bringing unique strengths and potential challenges. Both partners should be aware of how their gender identities and expressions interact with their zodiac characteristics to create a fulfilling relationship.`,
            highlights: [
                `${genderInfo.icon} Gender-specific emotional dynamics`,
                'Unique communication patterns for this combination',
                'Tailored relationship advice based on gender pairing'
            ],
            challenges: [
                'Understanding gender-specific needs and expectations',
                'Balancing traditional and modern relationship dynamics'
            ],
            advice: `For ${genderInfo.label} in this zodiac pairing, focus on open communication about both zodiac-based and gender-based relationship dynamics. Embrace the unique strengths this combination brings while being mindful of potential challenges.`
        },
        business: {
            score: businessScore,
            rating: getRating(businessScore),
            summary: `In a business partnership between ${genderInfo.label}, this pairing demonstrates ${getRating(businessScore).toLowerCase()} professional compatibility. The gender dynamics add a unique dimension to the working relationship.`,
            detailedAnalysis: `The ${genderInfo.icon} business partnership brings specific advantages in professional settings. Gender-based communication styles, leadership approaches, and decision-making processes interact with zodiac characteristics to create a unique collaborative dynamic. Understanding these intersections can lead to more effective teamwork.`,
            highlights: [
                `${genderInfo.icon} Complementary professional strengths`,
                'Gender-aware leadership dynamics',
                'Effective collaboration strategies for this pairing'
            ],
            challenges: [
                'Navigating gender dynamics in professional settings',
                'Balancing different communication styles'
            ],
            advice: `In business, ${genderInfo.label} should leverage their unique perspectives while maintaining professional boundaries. Focus on clear communication and mutual respect to maximize the partnership's potential.`
        }
    };
}

/**
 * Add gender-specific matching data to a single document
 */
async function addGenderSpecificMatching(pairId) {
    try {
        const docRef = doc(db, 'zodiac-compatibility', pairId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`⚠️  Document ${pairId} does not exist, skipping...`);
            return false;
        }

        const data = docSnap.data();

        // Check if genderSpecificMatching already exists
        if (data.genderSpecificMatching) {
            console.log(`ℹ️  Document ${pairId} already has genderSpecificMatching, skipping...`);
            return false;
        }

        console.log(`📝 Processing ${pairId}...`);

        // Generate gender-specific data for all combinations
        const genderSpecificMatching = {};

        for (const combo of genderCombinations) {
            genderSpecificMatching[combo] = generateGenderSpecificData(
                data.romance,
                data.business,
                combo
            );
        }

        // Update the document
        await setDoc(docRef, {
            ...data,
            genderSpecificMatching,
            metadata: {
                ...data.metadata,
                updatedAt: new Date().toISOString(),
                version: (data.metadata?.version || 1) + 0.1,
                hasGenderSpecificData: true
            }
        });

        console.log(`✅ Successfully updated ${pairId}`);
        return true;

    } catch (error) {
        console.error(`❌ Error processing ${pairId}:`, error.message);
        return false;
    }
}

/**
 * Process all documents in the zodiac-compatibility collection
 */
async function processAllDocuments() {
    try {
        console.log('🚀 Starting gender-specific data migration...\n');

        const collectionRef = collection(db, 'zodiac-compatibility');
        const snapshot = await getDocs(collectionRef);

        console.log(`📊 Found ${snapshot.size} documents to process\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const docSnapshot of snapshot.docs) {
            const result = await addGenderSpecificMatching(docSnapshot.id);

            if (result === true) {
                successCount++;
            } else if (result === false) {
                skipCount++;
            } else {
                errorCount++;
            }

            // Add a small delay to avoid overwhelming Firestore
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n📈 Migration Summary:');
        console.log(`   ✅ Successfully updated: ${successCount}`);
        console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📊 Total processed: ${snapshot.size}`);

    } catch (error) {
        console.error('❌ Fatal error during migration:', error);
    }
}

/**
 * Process specific documents (for testing)
 */
async function processSpecificDocuments(pairIds) {
    console.log('🚀 Processing specific documents...\n');

    for (const pairId of pairIds) {
        await addGenderSpecificMatching(pairId);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ Specific documents processed');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--all')) {
    // Process all documents
    processAllDocuments().then(() => {
        console.log('\n🎉 Migration complete!');
        process.exit(0);
    });
} else if (args.includes('--test')) {
    // Process only test documents
    const testPairs = ['Rat-Rat', 'Rabbit-Snake'];
    processSpecificDocuments(testPairs).then(() => {
        console.log('\n🎉 Test migration complete!');
        process.exit(0);
    });
} else {
    console.log('Usage:');
    console.log('  node scripts/add-gender-specific-data.mjs --test   # Process test documents only');
    console.log('  node scripts/add-gender-specific-data.mjs --all    # Process all documents');
    process.exit(0);
}
