/**
 * Seed script to generate gender-specific matching data for ALL zodiac pairings
 * This creates 6 gender combinations × 2 match types × 144 pairings = 1,728 data entries
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

// All zodiac signs
const zodiacSigns = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

// 6 gender combinations
const genderCombinations = [
    { key: 'male-male', label: 'two males', icon: '♂♂', personas: ['male', 'male'] },
    { key: 'male-female', label: 'a male and female', icon: '♂♀', personas: ['male', 'female'] },
    { key: 'male-others', label: 'a male and non-binary individual', icon: '♂⚪', personas: ['male', 'others'] },
    { key: 'female-female', label: 'two females', icon: '♀♀', personas: ['female', 'female'] },
    { key: 'female-others', label: 'a female and non-binary individual', icon: '♀⚪', personas: ['female', 'others'] },
    { key: 'others-others', label: 'two non-binary individuals', icon: '⚪⚪', personas: ['others', 'others'] }
];

// Zodiac characteristics for content generation
const zodiacTraits = {
    'Rat': {
        positive: ['intelligent', 'adaptable', 'quick-witted', 'charming', 'resourceful'],
        negative: ['opportunistic', 'anxious', 'manipulative', 'restless'],
        element: 'Water',
        nature: 'Yang'
    },
    'Ox': {
        positive: ['reliable', 'patient', 'methodical', 'strong', 'determined'],
        negative: ['stubborn', 'conservative', 'slow to change', 'rigid'],
        element: 'Earth',
        nature: 'Yin'
    },
    'Tiger': {
        positive: ['brave', 'confident', 'competitive', 'charismatic', 'passionate'],
        negative: ['impulsive', 'reckless', 'short-tempered', 'rebellious'],
        element: 'Wood',
        nature: 'Yang'
    },
    'Rabbit': {
        positive: ['gentle', 'compassionate', 'artistic', 'diplomatic', 'elegant'],
        negative: ['indecisive', 'overly cautious', 'superficial', 'escapist'],
        element: 'Wood',
        nature: 'Yin'
    },
    'Dragon': {
        positive: ['powerful', 'charismatic', 'ambitious', 'energetic', 'visionary'],
        negative: ['arrogant', 'demanding', 'impatient', 'inflexible'],
        element: 'Earth',
        nature: 'Yang'
    },
    'Snake': {
        positive: ['wise', 'intuitive', 'sophisticated', 'graceful', 'strategic'],
        negative: ['secretive', 'suspicious', 'possessive', 'calculating'],
        element: 'Fire',
        nature: 'Yin'
    },
    'Horse': {
        positive: ['energetic', 'independent', 'enthusiastic', 'warm-hearted', 'adventurous'],
        negative: ['impatient', 'impulsive', 'self-centered', 'commitment-phobic'],
        element: 'Fire',
        nature: 'Yang'
    },
    'Goat': {
        positive: ['creative', 'gentle', 'compassionate', 'artistic', 'peaceful'],
        negative: ['pessimistic', 'indecisive', 'overly dependent', 'anxious'],
        element: 'Earth',
        nature: 'Yin'
    },
    'Monkey': {
        positive: ['clever', 'curious', 'innovative', 'sociable', 'versatile'],
        negative: ['mischievous', 'unreliable', 'manipulative', 'restless'],
        element: 'Metal',
        nature: 'Yang'
    },
    'Rooster': {
        positive: ['observant', 'hardworking', 'courageous', 'confident', 'honest'],
        negative: ['critical', 'perfectionist', 'boastful', 'inflexible'],
        element: 'Metal',
        nature: 'Yin'
    },
    'Dog': {
        positive: ['loyal', 'honest', 'responsible', 'protective', 'just'],
        negative: ['anxious', 'pessimistic', 'stubborn', 'judgmental'],
        element: 'Earth',
        nature: 'Yang'
    },
    'Pig': {
        positive: ['generous', 'compassionate', 'diligent', 'optimistic', 'honest'],
        negative: ['naive', 'materialistic', 'indulgent', 'gullible'],
        element: 'Water',
        nature: 'Yin'
    }
};

// Compatibility base scores (simplified - you can refine these)
const compatibilityMatrix = {
    'Rat': { 'Rat': 72, 'Ox': 88, 'Tiger': 55, 'Rabbit': 65, 'Dragon': 92, 'Snake': 70, 'Horse': 45, 'Goat': 60, 'Monkey': 90, 'Rooster': 58, 'Dog': 62, 'Pig': 75 },
    'Ox': { 'Ox': 70, 'Tiger': 50, 'Rabbit': 75, 'Dragon': 68, 'Snake': 95, 'Horse': 48, 'Goat': 55, 'Monkey': 62, 'Rooster': 90, 'Dog': 72, 'Pig': 78 },
    'Tiger': { 'Tiger': 65, 'Rabbit': 72, 'Dragon': 58, 'Snake': 52, 'Horse': 92, 'Goat': 68, 'Monkey': 55, 'Rooster': 60, 'Dog': 88, 'Pig': 85 },
    'Rabbit': { 'Rabbit': 68, 'Dragon': 62, 'Snake': 88, 'Horse': 65, 'Goat': 90, 'Monkey': 70, 'Rooster': 58, 'Dog': 82, 'Pig': 95 },
    'Dragon': { 'Dragon': 75, 'Snake': 78, 'Horse': 70, 'Goat': 65, 'Monkey': 92, 'Rooster': 88, 'Dog': 45, 'Pig': 72 },
    'Snake': { 'Snake': 70, 'Horse': 62, 'Goat': 75, 'Monkey': 85, 'Rooster': 90, 'Dog': 68, 'Pig': 65 },
    'Horse': { 'Horse': 68, 'Goat': 88, 'Monkey': 72, 'Rooster': 65, 'Dog': 90, 'Pig': 75 },
    'Goat': { 'Goat': 72, 'Monkey': 68, 'Rooster': 60, 'Dog': 65, 'Pig': 92 },
    'Monkey': { 'Monkey': 70, 'Rooster': 75, 'Dog': 68, 'Pig': 78 },
    'Rooster': { 'Rooster': 65, 'Dog': 62, 'Pig': 72 },
    'Dog': { 'Dog': 70, 'Pig': 85 },
    'Pig': { 'Pig': 75 }
};

/**
 * Get base compatibility score between two zodiac signs
 */
function getBaseScore(zodiac1, zodiac2) {
    // Try direct lookup
    if (compatibilityMatrix[zodiac1] && compatibilityMatrix[zodiac1][zodiac2] !== undefined) {
        return compatibilityMatrix[zodiac1][zodiac2];
    }
    // Try reverse lookup
    if (compatibilityMatrix[zodiac2] && compatibilityMatrix[zodiac2][zodiac1] !== undefined) {
        return compatibilityMatrix[zodiac2][zodiac1];
    }
    // Default score
    return 70;
}

/**
 * Apply gender-specific adjustments to base score
 */
function applyGenderAdjustment(baseScore, genderKey, matchType) {
    const adjustments = {
        'male-male': {
            romance: -2,  // Slightly lower due to potential competition
            business: 5   // Higher due to traditional business dynamics
        },
        'male-female': {
            romance: 3,   // Traditional complementary dynamic
            business: 0   // Neutral
        },
        'male-others': {
            romance: 0,   // Neutral
            business: 0   // Neutral
        },
        'female-female': {
            romance: 5,   // Enhanced emotional connection
            business: 2   // Good collaboration
        },
        'female-others': {
            romance: 0,   // Neutral
            business: 0   // Neutral
        },
        'others-others': {
            romance: 0,   // Neutral
            business: 0   // Neutral
        }
    };

    const adjustment = adjustments[genderKey]?.[matchType] || 0;
    return Math.max(0, Math.min(100, baseScore + adjustment));
}

/**
 * Get rating from score
 */
function getRating(score) {
    if (score >= 90) return 'Perfect';
    if (score >= 75) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
}

/**
 * Generate romance content for a gender-specific pairing
 */
function generateRomanceContent(zodiac1, zodiac2, genderCombo, baseScore) {
    const score = applyGenderAdjustment(baseScore, genderCombo.key, 'romance');
    const rating = getRating(score);
    const traits1 = zodiacTraits[zodiac1];
    const traits2 = zodiacTraits[zodiac2];
    const isSameSign = zodiac1 === zodiac2;

    // Generate summary
    let summary = `In a romantic relationship between ${genderCombo.label}`;
    if (isSameSign) {
        summary += `, this ${zodiac1}-${zodiac2} pairing shows ${rating.toLowerCase()} compatibility. `;
        summary += `Both partners share the ${zodiac1}'s ${traits1.positive[0]} and ${traits1.positive[1]} nature, `;
        summary += `creating deep mutual understanding while potentially amplifying both strengths and challenges.`;
    } else {
        summary += `, the ${zodiac1}-${zodiac2} pairing demonstrates ${rating.toLowerCase()} compatibility. `;
        summary += `The ${zodiac1}'s ${traits1.positive[0]} nature complements the ${zodiac2}'s ${traits2.positive[0]} approach, `;
        summary += `creating a ${rating === 'Perfect' || rating === 'Excellent' ? 'harmonious' : 'balanced'} dynamic.`;
    }

    // Generate detailed analysis
    let detailedAnalysis = `When ${genderCombo.label} come together in a ${zodiac1}-${zodiac2} romantic pairing, `;
    detailedAnalysis += `they create a relationship with unique dynamics shaped by both their zodiac characteristics and gender combination. `;

    if (isSameSign) {
        detailedAnalysis += `Sharing the same zodiac sign means they deeply understand each other's motivations, values, and behavioral patterns. `;
        detailedAnalysis += `The ${zodiac1}'s ${traits1.positive[0]} and ${traits1.positive[1]} traits are doubled, `;
        detailedAnalysis += `which can create powerful synergy or potential conflicts if not managed well. `;
    } else {
        detailedAnalysis += `The ${zodiac1} brings ${traits1.positive[0]}, ${traits1.positive[1]}, and ${traits1.positive[2]} qualities, `;
        detailedAnalysis += `while the ${zodiac2} contributes ${traits2.positive[0]}, ${traits2.positive[1]}, and ${traits2.positive[2]} strengths. `;
        detailedAnalysis += `This combination creates ${rating === 'Perfect' || rating === 'Excellent' ? 'exceptional' : 'interesting'} relationship dynamics. `;
    }

    detailedAnalysis += `The ${genderCombo.icon} gender combination adds another layer of complexity and richness to the relationship. `;
    detailedAnalysis += `Both partners should embrace their unique perspectives while building on their zodiac compatibility.`;

    // Generate highlights
    const highlights = [];
    if (isSameSign) {
        highlights.push(`${genderCombo.icon} Deep mutual understanding of ${zodiac1} characteristics`);
        highlights.push(`Shared values around ${traits1.positive[0]} and ${traits1.positive[1]}`);
        highlights.push(`Strong emotional resonance and intuitive connection`);
    } else {
        highlights.push(`${genderCombo.icon} ${zodiac1}'s ${traits1.positive[0]} complements ${zodiac2}'s ${traits2.positive[0]}`);
        highlights.push(`Balanced approach combining ${traits1.positive[1]} and ${traits2.positive[1]}`);
        highlights.push(`Mutual growth through different perspectives`);
    }
    highlights.push(`Gender-specific dynamics enhance relationship depth`);

    // Generate challenges
    const challenges = [];
    if (isSameSign) {
        challenges.push(`Both may exhibit ${traits1.negative[0]} tendencies simultaneously`);
        challenges.push(`Shared ${traits1.negative[1]} nature can amplify issues`);
    } else {
        challenges.push(`${zodiac1}'s ${traits1.negative[0]} may clash with ${zodiac2}'s ${traits2.negative[0]}`);
        challenges.push(`Different approaches to ${traits1.positive[2]} vs ${traits2.positive[2]}`);
    }
    challenges.push(`Navigating gender-specific expectations and dynamics`);

    // Generate advice
    let advice = `For ${genderCombo.label} in this ${zodiac1}-${zodiac2} pairing, `;
    advice += `focus on open communication about both zodiac-based and gender-based relationship dynamics. `;
    if (isSameSign) {
        advice += `Recognize when you're both exhibiting the same ${zodiac1} tendencies and balance each other. `;
    } else {
        advice += `Appreciate how your different zodiac characteristics create a richer relationship. `;
    }
    advice += `Embrace the unique strengths this gender combination brings while being mindful of potential challenges.`;

    return {
        score,
        rating,
        summary,
        detailedAnalysis,
        highlights,
        challenges,
        advice
    };
}

/**
 * Generate business content for a gender-specific pairing
 */
function generateBusinessContent(zodiac1, zodiac2, genderCombo, baseScore) {
    const score = applyGenderAdjustment(baseScore, genderCombo.key, 'business');
    const rating = getRating(score);
    const traits1 = zodiacTraits[zodiac1];
    const traits2 = zodiacTraits[zodiac2];
    const isSameSign = zodiac1 === zodiac2;

    // Generate summary
    let summary = `In a business partnership between ${genderCombo.label}`;
    if (isSameSign) {
        summary += `, this ${zodiac1}-${zodiac2} pairing demonstrates ${rating.toLowerCase()} professional compatibility. `;
        summary += `Both partners bring the ${zodiac1}'s ${traits1.positive[0]} and ${traits1.positive[1]} approach to business, `;
        summary += `creating ${rating === 'Excellent' || rating === 'Perfect' ? 'powerful synergy' : 'solid collaboration'}.`;
    } else {
        summary += `, the ${zodiac1}-${zodiac2} pairing shows ${rating.toLowerCase()} professional compatibility. `;
        summary += `The ${zodiac1}'s ${traits1.positive[0]} business style complements the ${zodiac2}'s ${traits2.positive[0]} approach, `;
        summary += `creating effective teamwork.`;
    }

    // Generate detailed analysis
    let detailedAnalysis = `In professional settings, ${genderCombo.label} in a ${zodiac1}-${zodiac2} partnership `;
    detailedAnalysis += `bring distinct advantages shaped by their zodiac characteristics and gender dynamics. `;

    if (isSameSign) {
        detailedAnalysis += `As both are ${zodiac1}s, they share similar work ethics, decision-making styles, and business values. `;
        detailedAnalysis += `This creates efficient communication and aligned goals, though they must establish clear roles to avoid overlap. `;
    } else {
        detailedAnalysis += `The ${zodiac1} excels in ${traits1.positive[0]} and ${traits1.positive[1]} aspects of business, `;
        detailedAnalysis += `while the ${zodiac2} brings strength in ${traits2.positive[0]} and ${traits2.positive[1]} areas. `;
        detailedAnalysis += `This complementary skill set creates a well-rounded business partnership. `;
    }

    detailedAnalysis += `The ${genderCombo.icon} gender combination influences leadership dynamics, communication styles, and decision-making processes. `;
    detailedAnalysis += `Understanding and leveraging these dynamics can significantly enhance business success.`;

    // Generate highlights
    const highlights = [];
    if (isSameSign) {
        highlights.push(`${genderCombo.icon} Aligned business vision and ${zodiac1} work ethic`);
        highlights.push(`Shared understanding of ${traits1.positive[0]} approach`);
        highlights.push(`Efficient communication through similar thinking patterns`);
    } else {
        highlights.push(`${genderCombo.icon} ${zodiac1}'s ${traits1.positive[0]} complements ${zodiac2}'s ${traits2.positive[0]}`);
        highlights.push(`Diverse skill sets create comprehensive capabilities`);
        highlights.push(`Balanced decision-making from different perspectives`);
    }
    highlights.push(`Gender-aware professional dynamics enhance collaboration`);

    // Generate challenges
    const challenges = [];
    if (isSameSign) {
        challenges.push(`Both may exhibit ${traits1.negative[0]} in business decisions`);
        challenges.push(`Need clear role definition to avoid conflicts`);
    } else {
        challenges.push(`Different paces: ${zodiac1}'s ${traits1.positive[2]} vs ${zodiac2}'s ${traits2.positive[2]}`);
        challenges.push(`Balancing ${traits1.negative[0]} and ${traits2.negative[0]} tendencies`);
    }
    challenges.push(`Navigating gender dynamics in professional settings`);

    // Generate advice
    let advice = `In business, ${genderCombo.label} should leverage their ${zodiac1}-${zodiac2} complementarity `;
    advice += `while maintaining professional boundaries and clear communication. `;
    if (isSameSign) {
        advice += `Divide responsibilities based on individual strengths rather than assuming identical capabilities. `;
    } else {
        advice += `Appreciate how different zodiac approaches create a more robust business strategy. `;
    }
    advice += `Focus on results and mutual respect to maximize the partnership's potential.`;

    return {
        score,
        rating,
        summary,
        detailedAnalysis,
        highlights,
        challenges,
        advice
    };
}

/**
 * Generate complete gender-specific matching data for a pairing
 */
function generateGenderSpecificData(zodiac1, zodiac2) {
    const baseScore = getBaseScore(zodiac1, zodiac2);
    const genderSpecificMatching = {};

    for (const genderCombo of genderCombinations) {
        genderSpecificMatching[genderCombo.key] = {
            romance: generateRomanceContent(zodiac1, zodiac2, genderCombo, baseScore),
            business: generateBusinessContent(zodiac1, zodiac2, genderCombo, baseScore)
        };
    }

    return genderSpecificMatching;
}

/**
 * Generate pair ID
 */
function generatePairId(zodiac1, zodiac2) {
    const sorted = [zodiac1, zodiac2].sort();
    return `${sorted[0]}-${sorted[1]}`;
}

/**
 * Seed gender-specific data for a single pairing
 */
async function seedPairing(zodiac1, zodiac2) {
    const pairId = generatePairId(zodiac1, zodiac2);

    try {
        const docRef = doc(db, 'zodiac-compatibility', pairId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`⚠️  Document ${pairId} does not exist, skipping...`);
            return { success: false, reason: 'not-found' };
        }

        const existingData = docSnap.data();

        // Check if already has gender-specific data
        if (existingData.genderSpecificMatching && existingData.metadata?.hasGenderSpecificData) {
            console.log(`ℹ️  ${pairId} already has gender-specific data, skipping...`);
            return { success: false, reason: 'already-exists' };
        }

        // Generate gender-specific data
        const genderSpecificMatching = generateGenderSpecificData(zodiac1, zodiac2);

        // Update document
        await setDoc(docRef, {
            ...existingData,
            genderSpecificMatching,
            metadata: {
                ...existingData.metadata,
                updatedAt: new Date().toISOString(),
                version: 2.0,
                hasGenderSpecificData: true,
                dataQuality: 'auto-generated'
            }
        });

        console.log(`✅ ${pairId} - Generated 6 gender combinations × 2 types = 12 entries`);
        return { success: true };

    } catch (error) {
        console.error(`❌ Error processing ${pairId}:`, error.message);
        return { success: false, reason: 'error', error: error.message };
    }
}

/**
 * Seed all pairings
 */
async function seedAllPairings() {
    console.log('🚀 Starting comprehensive gender-specific data seeding...\n');
    console.log(`📊 Total pairings to process: ${zodiacSigns.length * (zodiacSigns.length + 1) / 2}`);
    console.log(`📊 Data entries per pairing: 6 gender combinations × 2 match types = 12`);
    console.log(`📊 Total data entries to generate: ${zodiacSigns.length * (zodiacSigns.length + 1) / 2 * 12}\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let totalPairings = 0;

    const startTime = Date.now();

    // Process all pairings
    for (let i = 0; i < zodiacSigns.length; i++) {
        for (let j = i; j < zodiacSigns.length; j++) {
            const zodiac1 = zodiacSigns[i];
            const zodiac2 = zodiacSigns[j];
            totalPairings++;

            const result = await seedPairing(zodiac1, zodiac2);

            if (result.success) {
                successCount++;
            } else if (result.reason === 'already-exists') {
                skipCount++;
            } else {
                errorCount++;
            }

            // Progress indicator every 10 pairings
            if (totalPairings % 10 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`\n📈 Progress: ${totalPairings}/78 pairings (${elapsed}s elapsed)`);
                console.log(`   ✅ Success: ${successCount} | ⏭️  Skipped: ${skipCount} | ❌ Errors: ${errorCount}\n`);
            }

            // Small delay to avoid overwhelming Firestore
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`📦 Total pairings processed: ${totalPairings}`);
    console.log(`✅ Successfully seeded: ${successCount} pairings (${successCount * 12} data entries)`);
    console.log(`⏭️  Skipped (already exists): ${skipCount} pairings`);
    console.log(`❌ Errors: ${errorCount} pairings`);
    console.log('='.repeat(60));

    if (successCount > 0) {
        console.log('\n🎉 Gender-specific data has been generated for all pairings!');
        console.log('📝 Note: This is auto-generated content. You may want to review and enhance it for better quality.');
    }
}

/**
 * Main execution
 */
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  node scripts/seed-all-gender-data.mjs              # Seed all pairings');
    console.log('  node scripts/seed-all-gender-data.mjs --force      # Force re-seed even if data exists');
    console.log('  node scripts/seed-all-gender-data.mjs --help       # Show this help');
    process.exit(0);
}

seedAllPairings().then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
}).catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
