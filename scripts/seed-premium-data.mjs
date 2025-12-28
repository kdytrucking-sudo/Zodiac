/**
 * Enhanced Seed Script - Generate Gender-Specific Data with Full Premium Details
 * Includes: 5 Compatibility Sections + 5 Conflicts for each gender combination
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
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

// Zodiac characteristics
const zodiacTraits = {
    'Rat': {
        positive: ['intelligent', 'adaptable', 'quick-witted', 'charming', 'resourceful'],
        negative: ['opportunistic', 'anxious', 'manipulative', 'restless'],
        element: 'Water'
    },
    'Ox': {
        positive: ['reliable', 'patient', 'methodical', 'strong', 'determined'],
        negative: ['stubborn', 'conservative', 'slow to change', 'rigid'],
        element: 'Earth'
    },
    'Tiger': {
        positive: ['brave', 'confident', 'competitive', 'charismatic', 'passionate'],
        negative: ['impulsive', 'reckless', 'short-tempered', 'rebellious'],
        element: 'Wood'
    },
    'Rabbit': {
        positive: ['gentle', 'compassionate', 'artistic', 'diplomatic', 'elegant'],
        negative: ['indecisive', 'overly cautious', 'superficial', 'escapist'],
        element: 'Wood'
    },
    'Dragon': {
        positive: ['powerful', 'charismatic', 'ambitious', 'energetic', 'visionary'],
        negative: ['arrogant', 'demanding', 'impatient', 'inflexible'],
        element: 'Earth'
    },
    'Snake': {
        positive: ['wise', 'intuitive', 'sophisticated', 'graceful', 'strategic'],
        negative: ['secretive', 'suspicious', 'possessive', 'calculating'],
        element: 'Fire'
    },
    'Horse': {
        positive: ['energetic', 'independent', 'enthusiastic', 'warm-hearted', 'adventurous'],
        negative: ['impatient', 'impulsive', 'self-centered', 'commitment-phobic'],
        element: 'Fire'
    },
    'Goat': {
        positive: ['creative', 'gentle', 'compassionate', 'artistic', 'peaceful'],
        negative: ['pessimistic', 'indecisive', 'overly dependent', 'anxious'],
        element: 'Earth'
    },
    'Monkey': {
        positive: ['clever', 'curious', 'innovative', 'sociable', 'versatile'],
        negative: ['mischievous', 'unreliable', 'manipulative', 'restless'],
        element: 'Metal'
    },
    'Rooster': {
        positive: ['observant', 'hardworking', 'courageous', 'confident', 'honest'],
        negative: ['critical', 'perfectionist', 'boastful', 'inflexible'],
        element: 'Metal'
    },
    'Dog': {
        positive: ['loyal', 'honest', 'responsible', 'protective', 'just'],
        negative: ['anxious', 'pessimistic', 'stubborn', 'judgmental'],
        element: 'Earth'
    },
    'Pig': {
        positive: ['generous', 'compassionate', 'diligent', 'optimistic', 'honest'],
        negative: ['naive', 'materialistic', 'indulgent', 'gullible'],
        element: 'Water'
    }
};

// Compatibility base scores
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
 * Get base compatibility score
 */
function getBaseScore(zodiac1, zodiac2) {
    if (compatibilityMatrix[zodiac1]?.[zodiac2] !== undefined) {
        return compatibilityMatrix[zodiac1][zodiac2];
    }
    if (compatibilityMatrix[zodiac2]?.[zodiac1] !== undefined) {
        return compatibilityMatrix[zodiac2][zodiac1];
    }
    return 70;
}

/**
 * Apply gender-specific adjustments
 */
function applyGenderAdjustment(baseScore, genderKey, matchType) {
    const adjustments = {
        'male-male': { romance: -2, business: 5 },
        'male-female': { romance: 3, business: 0 },
        'male-others': { romance: 0, business: 0 },
        'female-female': { romance: 5, business: 2 },
        'female-others': { romance: 0, business: 0 },
        'others-others': { romance: 0, business: 0 }
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
 * Generate Romance Premium Compatibility Sections
 */
function generateRomancePremiumSections(zodiac1, zodiac2, genderCombo, score) {
    const traits1 = zodiacTraits[zodiac1];
    const traits2 = zodiacTraits[zodiac2];
    const isSameSign = zodiac1 === zodiac2;

    return {
        emotionalCompatibility: {
            title: `${genderCombo.icon} Emotional Resonance`,
            content: isSameSign
                ? `Both ${zodiac1}s share deep emotional wavelengths, creating intuitive understanding. Their ${traits1.positive[0]} nature allows them to connect on profound levels, though they must be mindful of amplifying each other's ${traits1.negative[0]} tendencies.`
                : `The ${zodiac1}'s ${traits1.positive[0]} emotional style complements the ${zodiac2}'s ${traits2.positive[0]} approach. This creates a rich emotional landscape where both partners can grow and support each other's emotional needs.`,
            score: Math.min(100, score + Math.floor(Math.random() * 10) - 2),
            highlights: [
                `Deep ${genderCombo.label} emotional connection`,
                isSameSign ? `Shared ${zodiac1} emotional patterns` : `Complementary emotional styles`,
                `Strong empathy and mutual understanding`
            ]
        },
        intellectualAlignment: {
            title: `${genderCombo.icon} Mental Connection`,
            content: isSameSign
                ? `Sharing the ${zodiac1}'s ${traits1.positive[1]} mindset creates seamless intellectual rapport. They finish each other's thoughts and share similar interests, making conversations effortless and engaging.`
                : `The ${zodiac1}'s ${traits1.positive[1]} thinking pairs well with the ${zodiac2}'s ${traits2.positive[1]} perspective. This diversity enriches their intellectual exchanges and broadens both partners' horizons.`,
            score: Math.min(100, score + Math.floor(Math.random() * 8) - 3),
            highlights: [
                `Stimulating intellectual conversations`,
                `Shared or complementary interests`,
                `Mutual respect for each other's ideas`
            ]
        },
        longTermPotential: {
            title: `${genderCombo.icon} Future Together`,
            content: isSameSign
                ? `Both ${zodiac1}s envision similar futures, making long-term planning natural. Their shared ${traits1.element} element energy creates stability, though they should ensure they're not too set in their ways.`
                : `The ${zodiac1} and ${zodiac2} can build a lasting future by combining their strengths. The ${zodiac1}'s ${traits1.positive[2]} nature balances the ${zodiac2}'s ${traits2.positive[2]} approach, creating a well-rounded partnership.`,
            score: Math.min(100, score + Math.floor(Math.random() * 12) - 4),
            highlights: [
                `Strong foundation for long-term commitment`,
                `Aligned life goals and values`,
                `Growing together over time`
            ]
        },
        others1: {
            title: `${genderCombo.icon} Intimacy & Trust`,
            content: `In this ${genderCombo.label} relationship, intimacy develops through ${isSameSign ? 'shared understanding' : 'complementary energies'}. Trust builds as both partners demonstrate ${traits1.positive[3]} and ${traits2.positive[3]} qualities in their daily interactions.`,
            score: Math.min(100, score + Math.floor(Math.random() * 6) - 1),
            highlights: [
                `Growing trust through consistency`,
                `Deepening intimacy over time`,
                `Safe space for vulnerability`
            ]
        },
        others2: {
            title: `${genderCombo.icon} Shared Life Vision`,
            content: `This pairing creates opportunities for ${genderCombo.label} to build a shared vision that honors both partners' dreams. Their combined ${isSameSign ? zodiac1 : `${zodiac1} and ${zodiac2}`} energy manifests in creating a meaningful life together.`,
            score: Math.min(100, score + Math.floor(Math.random() * 7) - 2),
            highlights: [
                `Collaborative life planning`,
                `Supporting each other's dreams`,
                `Creating shared memories and traditions`
            ]
        }
    };
}

/**
 * Generate Business Premium Compatibility Sections
 */
function generateBusinessPremiumSections(zodiac1, zodiac2, genderCombo, score) {
    const traits1 = zodiacTraits[zodiac1];
    const traits2 = zodiacTraits[zodiac2];
    const isSameSign = zodiac1 === zodiac2;

    return {
        workStyleCompatibility: {
            title: `${genderCombo.icon} Work Synergy`,
            content: isSameSign
                ? `Both ${zodiac1}s share similar work ethics and approaches, making collaboration smooth. Their ${traits1.positive[0]} work style creates efficiency, though they should establish distinct roles to avoid overlap.`
                : `The ${zodiac1}'s ${traits1.positive[0]} work approach complements the ${zodiac2}'s ${traits2.positive[0]} style. This creates a balanced team where different strengths contribute to overall success.`,
            score: Math.min(100, score + Math.floor(Math.random() * 10) - 1),
            highlights: [
                `Efficient collaboration and teamwork`,
                `Complementary work styles`,
                `Productive professional dynamic`
            ]
        },
        leadershipDynamics: {
            title: `${genderCombo.icon} Leadership Balance`,
            content: isSameSign
                ? `With both being ${zodiac1}s, leadership roles need clear definition. Their shared ${traits1.positive[1]} approach to leadership can create powerful synergy when properly channeled.`
                : `The ${zodiac1} leads with ${traits1.positive[1]} energy while the ${zodiac2} brings ${traits2.positive[1]} leadership. This diversity creates well-rounded decision-making and balanced authority.`,
            score: Math.min(100, score + Math.floor(Math.random() * 8) - 2),
            highlights: [
                `Clear leadership structure`,
                `Mutual respect for authority`,
                `Balanced decision-making process`
            ]
        },
        financialAlignment: {
            title: `${genderCombo.icon} Financial Strategy`,
            content: isSameSign
                ? `Both ${zodiac1}s approach finances with similar ${traits1.positive[2]} mindsets. This alignment simplifies financial planning, though they should seek diverse perspectives for major decisions.`
                : `The ${zodiac1}'s ${traits1.positive[2]} financial approach balances the ${zodiac2}'s ${traits2.positive[2]} perspective. This creates comprehensive financial strategy and risk management.`,
            score: Math.min(100, score + Math.floor(Math.random() * 9) - 3),
            highlights: [
                `Aligned financial goals`,
                `Balanced risk management`,
                `Effective resource allocation`
            ]
        },
        others1: {
            title: `${genderCombo.icon} Communication Flow`,
            content: `Professional communication between ${genderCombo.label} in this pairing flows ${isSameSign ? 'naturally through shared understanding' : 'effectively through complementary styles'}. Clear, respectful dialogue enhances business outcomes.`,
            score: Math.min(100, score + Math.floor(Math.random() * 7) - 1),
            highlights: [
                `Clear professional communication`,
                `Effective conflict resolution`,
                `Transparent information sharing`
            ]
        },
        others2: {
            title: `${genderCombo.icon} Growth Potential`,
            content: `This ${genderCombo.label} business partnership has strong growth potential. Their combined ${isSameSign ? zodiac1 : `${zodiac1} and ${zodiac2}`} strengths create opportunities for expansion and innovation.`,
            score: Math.min(100, score + Math.floor(Math.random() * 8) - 2),
            highlights: [
                `Scalable business model`,
                `Innovation and adaptation`,
                `Long-term sustainability`
            ]
        }
    };
}

/**
 * Generate 5 Conflicts
 */
function generateConflicts(zodiac1, zodiac2, genderCombo, matchType) {
    const traits1 = zodiacTraits[zodiac1];
    const traits2 = zodiacTraits[zodiac2];
    const isSameSign = zodiac1 === zodiac2;

    const conflictTemplates = matchType === 'romance' ? [
        {
            type: 'Communication Styles',
            severity: Math.floor(Math.random() * 30) + 10,
            description: isSameSign
                ? `Both ${zodiac1}s may communicate in similar ways, potentially creating echo chambers. Their shared ${traits1.negative[0]} tendency can amplify misunderstandings.`
                : `The ${zodiac1}'s direct communication may clash with the ${zodiac2}'s ${traits2.positive[0]} approach. Finding common ground requires patience and active listening.`,
            resolution: `Establish regular check-ins where both partners practice active listening. Use "I feel" statements and validate each other's perspectives before responding.`
        },
        {
            type: 'Emotional Expression',
            severity: Math.floor(Math.random() * 25) + 15,
            description: isSameSign
                ? `Sharing the ${zodiac1}'s emotional patterns means both may struggle with the same ${traits1.negative[1]} tendencies simultaneously.`
                : `Different emotional rhythms between ${zodiac1} and ${zodiac2} can create friction. One may need more ${traits1.positive[1]} while the other prefers ${traits2.positive[1]}.`,
            resolution: `Create a safe space for emotional expression. Respect each other's emotional timing and needs, and find compromise in how feelings are shared.`
        },
        {
            type: 'Life Pace & Priorities',
            severity: Math.floor(Math.random() * 35) + 5,
            description: isSameSign
                ? `Both ${zodiac1}s moving at the same pace can be harmonious or create stagnation. Their shared ${traits1.element} element may resist necessary changes.`
                : `The ${zodiac1}'s ${traits1.positive[2]} pace differs from the ${zodiac2}'s ${traits2.positive[2]} rhythm. Balancing these speeds requires conscious effort.`,
            resolution: `Discuss and align on major life decisions. Create a shared calendar for goals and milestones, allowing flexibility for individual pacing.`
        },
        {
            type: 'Personal Space Needs',
            severity: Math.floor(Math.random() * 20) + 10,
            description: `In ${genderCombo.label} relationships, personal space needs vary. The ${isSameSign ? zodiac1 : `${zodiac1} and ${zodiac2}`} dynamic requires balancing togetherness with independence.`,
            resolution: `Respect each other's need for alone time. Establish boundaries around personal space while maintaining connection through quality time together.`
        },
        {
            type: 'Future Planning',
            severity: Math.floor(Math.random() * 30) + 8,
            description: isSameSign
                ? `Two ${zodiac1}s may have similar visions but struggle with execution due to shared ${traits1.negative[2]} patterns.`
                : `Different approaches to planning between ${zodiac1} and ${zodiac2} can cause tension. One may be more ${traits1.positive[3]} while the other is ${traits2.positive[3]}.`,
            resolution: `Create a joint vision board and break down goals into manageable steps. Regular planning sessions help align expectations and timelines.`
        }
    ] : [
        {
            type: 'Decision-Making Process',
            severity: Math.floor(Math.random() * 30) + 15,
            description: isSameSign
                ? `Both ${zodiac1}s may approach decisions similarly, potentially missing alternative perspectives. Their ${traits1.negative[0]} tendency can create blind spots.`
                : `The ${zodiac1}'s ${traits1.positive[0]} decision style differs from the ${zodiac2}'s ${traits2.positive[0]} approach. This can cause delays or conflicts.`,
            resolution: `Establish a clear decision-making framework. Assign roles based on expertise and use structured processes for major business decisions.`
        },
        {
            type: 'Work-Life Balance',
            severity: Math.floor(Math.random() * 25) + 10,
            description: `Maintaining professional boundaries in ${genderCombo.label} partnerships requires conscious effort. The ${isSameSign ? zodiac1 : `${zodiac1}-${zodiac2}`} dynamic can blur lines.`,
            resolution: `Set clear working hours and boundaries. Separate business discussions from personal time, and respect each other's off-hours.`
        },
        {
            type: 'Risk Tolerance',
            severity: Math.floor(Math.random() * 35) + 12,
            description: isSameSign
                ? `Both ${zodiac1}s share similar risk profiles, which can lead to either excessive caution or recklessness based on their ${traits1.negative[1]} nature.`
                : `The ${zodiac1}'s risk appetite differs from the ${zodiac2}'s approach. Finding balance between ${traits1.positive[2]} and ${traits2.positive[2]} is crucial.`,
            resolution: `Develop a risk assessment framework. Discuss major decisions thoroughly and consider seeking external advice for balanced perspectives.`
        },
        {
            type: 'Resource Allocation',
            severity: Math.floor(Math.random() * 28) + 8,
            description: `Managing resources between ${genderCombo.label} requires transparency. Different priorities around ${isSameSign ? 'shared' : 'complementary'} ${traits1.positive[3]} values can cause friction.`,
            resolution: `Create a clear budget and resource allocation plan. Regular financial reviews ensure both partners are aligned on spending priorities.`
        },
        {
            type: 'Growth Direction',
            severity: Math.floor(Math.random() * 30) + 10,
            description: isSameSign
                ? `Two ${zodiac1}s may have similar growth visions but struggle with ${traits1.negative[2]} patterns that hinder progress.`
                : `The ${zodiac1} envisions growth through ${traits1.positive[4]} while the ${zodiac2} prefers ${traits2.positive[4]}. Aligning these visions is essential.`,
            resolution: `Conduct quarterly strategy sessions to align on growth objectives. Create a shared roadmap that incorporates both partners' visions.`
        }
    ];

    return conflictTemplates;
}

/**
 * Generate complete gender-specific data with premium sections
 */
function generateGenderSpecificData(zodiac1, zodiac2) {
    const baseScore = getBaseScore(zodiac1, zodiac2);
    const genderSpecificMatching = {};

    for (const genderCombo of genderCombinations) {
        const romanceScore = applyGenderAdjustment(baseScore, genderCombo.key, 'romance');
        const businessScore = applyGenderAdjustment(baseScore, genderCombo.key, 'business');

        genderSpecificMatching[genderCombo.key] = {
            romance: {
                score: romanceScore,
                rating: getRating(romanceScore),
                summary: `In a romantic relationship between ${genderCombo.label}, this ${zodiac1}-${zodiac2} pairing shows ${getRating(romanceScore).toLowerCase()} compatibility with a score of ${romanceScore}%.`,
                premium: {
                    ...generateRomancePremiumSections(zodiac1, zodiac2, genderCombo, romanceScore),
                    conflicts: generateConflicts(zodiac1, zodiac2, genderCombo, 'romance')
                }
            },
            business: {
                score: businessScore,
                rating: getRating(businessScore),
                summary: `In a business partnership between ${genderCombo.label}, this ${zodiac1}-${zodiac2} pairing demonstrates ${getRating(businessScore).toLowerCase()} professional compatibility with a score of ${businessScore}%.`,
                premium: {
                    ...generateBusinessPremiumSections(zodiac1, zodiac2, genderCombo, businessScore),
                    conflicts: generateConflicts(zodiac1, zodiac2, genderCombo, 'business')
                }
            }
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
 * Seed a single pairing
 */
async function seedPairing(zodiac1, zodiac2, force = false) {
    const pairId = generatePairId(zodiac1, zodiac2);

    try {
        const docRef = doc(db, 'zodiac-compatibility', pairId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`⚠️  ${pairId} does not exist, skipping...`);
            return { success: false, reason: 'not-found' };
        }

        const existingData = docSnap.data();

        // Check if already has complete premium data
        if (!force && existingData.genderSpecificMatching?.['male-male']?.romance?.premium) {
            console.log(`ℹ️  ${pairId} already has premium data, skipping...`);
            return { success: false, reason: 'already-exists' };
        }

        // Generate complete gender-specific data with premium sections
        const genderSpecificMatching = generateGenderSpecificData(zodiac1, zodiac2);

        // Update document
        await setDoc(docRef, {
            ...existingData,
            genderSpecificMatching,
            metadata: {
                ...existingData.metadata,
                updatedAt: new Date().toISOString(),
                version: 3.0,
                hasGenderSpecificData: true,
                hasPremiumData: true,
                dataQuality: 'auto-generated-premium'
            }
        });

        console.log(`✅ ${pairId} - Generated 6 gender combos × 2 types × (5 sections + 5 conflicts)`);
        return { success: true };

    } catch (error) {
        console.error(`❌ Error processing ${pairId}:`, error.message);
        return { success: false, reason: 'error', error: error.message };
    }
}

/**
 * Seed all pairings
 */
async function seedAllPairings(force = false) {
    console.log('🚀 Starting PREMIUM gender-specific data seeding...\n');
    console.log(`📊 Total pairings: ${zodiacSigns.length * (zodiacSigns.length + 1) / 2}`);
    console.log(`📊 Per pairing: 6 genders × 2 types × (5 sections + 5 conflicts)`);
    console.log(`📊 Total data entries: ${zodiacSigns.length * (zodiacSigns.length + 1) / 2 * 6 * 2 * 10}\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let totalPairings = 0;

    const startTime = Date.now();

    for (let i = 0; i < zodiacSigns.length; i++) {
        for (let j = i; j < zodiacSigns.length; j++) {
            const zodiac1 = zodiacSigns[i];
            const zodiac2 = zodiacSigns[j];
            totalPairings++;

            const result = await seedPairing(zodiac1, zodiac2, force);

            if (result.success) {
                successCount++;
            } else if (result.reason === 'already-exists') {
                skipCount++;
            } else {
                errorCount++;
            }

            // Progress every 10 pairings
            if (totalPairings % 10 === 0) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`\n📈 Progress: ${totalPairings}/78 (${elapsed}s)`);
                console.log(`   ✅ Success: ${successCount} | ⏭️  Skipped: ${skipCount} | ❌ Errors: ${errorCount}\n`);
            }

            // Small delay
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(70));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(70));
    console.log(`⏱️  Total time: ${totalTime} seconds`);
    console.log(`📦 Pairings processed: ${totalPairings}`);
    console.log(`✅ Successfully seeded: ${successCount} pairings`);
    console.log(`⏭️  Skipped: ${skipCount} pairings`);
    console.log(`❌ Errors: ${errorCount} pairings`);
    console.log('='.repeat(70));

    if (successCount > 0) {
        console.log('\n🎉 Premium gender-specific data generated!');
        console.log('📝 Note: Auto-generated content - review and enhance for quality.');
    }
}

/**
 * Main execution
 */
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  node scripts/seed-premium-data.mjs              # Seed all pairings');
    console.log('  node scripts/seed-premium-data.mjs --force      # Force re-seed');
    console.log('  node scripts/seed-premium-data.mjs --help       # Show help');
    process.exit(0);
}

seedAllPairings(force).then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
}).catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
