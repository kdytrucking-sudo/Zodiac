// Seed script for Zodiac Compatibility Database
// This script creates all 144 compatibility documents in Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBk4Qspp1eBT1rkUhmffWLf4a4kAF26gU",
    authDomain: "studio-4395392521-1abeb.firebaseapp.com",
    projectId: "studio-4395392521-1abeb",
    storageBucket: "studio-4395392521-1abeb.firebasestorage.app",
    messagingSenderId: "413532569115",
    appId: "1:413532569115:web:afa287880769758b5382be",
    measurementId: "G-BM8SRGB02P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "zodia1"); // Using the same database name as app.js

// All zodiac signs
const zodiacSigns = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

// Generate pair ID (alphabetically sorted)
function generatePairId(zodiac1, zodiac2) {
    const sorted = [zodiac1, zodiac2].sort();
    return `${sorted[0]}-${sorted[1]}`;
}

// Sample data templates for different compatibility levels
const compatibilityTemplates = {
    excellent: {
        romance: {
            score: 85 + Math.floor(Math.random() * 15), // 85-99
            rating: 'Excellent',
            overview: 'These signs share exceptional harmony and deep understanding.',
            tags: [
                { tag: 'Emotional Balance', status: 'positive' },
                { tag: 'Intellectual Match', status: 'positive' },
                { tag: 'Communication Style', status: 'positive' }
            ]
        },
        business: {
            score: 75 + Math.floor(Math.random() * 15), // 75-89
            rating: 'Good',
            overview: 'Strong complementary skills create effective partnerships.',
            tags: [
                { tag: 'Work Ethic', status: 'positive' },
                { tag: 'Decision Making', status: 'positive' },
                { tag: 'Risk Tolerance', status: 'neutral' }
            ]
        }
    },
    good: {
        romance: {
            score: 65 + Math.floor(Math.random() * 15), // 65-79
            rating: 'Good',
            overview: 'Solid compatibility with potential for growth.',
            tags: [
                { tag: 'Emotional Balance', status: 'positive' },
                { tag: 'Intellectual Match', status: 'neutral' },
                { tag: 'Communication Style', status: 'positive' }
            ]
        },
        business: {
            score: 60 + Math.floor(Math.random() * 15), // 60-74
            rating: 'Good',
            overview: 'Workable partnership with clear role definition.',
            tags: [
                { tag: 'Work Ethic', status: 'positive' },
                { tag: 'Decision Making', status: 'neutral' },
                { tag: 'Risk Tolerance', status: 'neutral' }
            ]
        }
    },
    fair: {
        romance: {
            score: 45 + Math.floor(Math.random() * 15), // 45-59
            rating: 'Fair',
            overview: 'Moderate compatibility requiring effort and understanding.',
            tags: [
                { tag: 'Emotional Balance', status: 'neutral' },
                { tag: 'Intellectual Match', status: 'neutral' },
                { tag: 'Communication Style', status: 'negative' }
            ]
        },
        business: {
            score: 40 + Math.floor(Math.random() * 15), // 40-54
            rating: 'Fair',
            overview: 'Challenging but manageable with clear boundaries.',
            tags: [
                { tag: 'Work Ethic', status: 'neutral' },
                { tag: 'Decision Making', status: 'negative' },
                { tag: 'Risk Tolerance', status: 'neutral' }
            ]
        }
    },
    poor: {
        romance: {
            score: 25 + Math.floor(Math.random() * 15), // 25-39
            rating: 'Poor',
            overview: 'Significant challenges requiring substantial work.',
            tags: [
                { tag: 'Emotional Balance', status: 'negative' },
                { tag: 'Intellectual Match', status: 'negative' },
                { tag: 'Communication Style', status: 'negative' }
            ]
        },
        business: {
            score: 30 + Math.floor(Math.random() * 15), // 30-44
            rating: 'Poor',
            overview: 'Difficult partnership with conflicting approaches.',
            tags: [
                { tag: 'Work Ethic', status: 'negative' },
                { tag: 'Decision Making', status: 'negative' },
                { tag: 'Risk Tolerance', status: 'negative' }
            ]
        }
    }
};

// Predefined compatibility matrix (based on traditional Chinese zodiac)
// excellent = 4, good = 3, fair = 2, poor = 1
const compatibilityMatrix = {
    'Rat': { 'Rat': 3, 'Ox': 4, 'Tiger': 2, 'Rabbit': 2, 'Dragon': 4, 'Snake': 3, 'Horse': 1, 'Goat': 2, 'Monkey': 4, 'Rooster': 2, 'Dog': 3, 'Pig': 3 },
    'Ox': { 'Ox': 3, 'Tiger': 2, 'Rabbit': 3, 'Dragon': 3, 'Snake': 4, 'Horse': 2, 'Goat': 1, 'Monkey': 2, 'Rooster': 4, 'Dog': 2, 'Pig': 3, 'Rat': 4 },
    'Tiger': { 'Tiger': 2, 'Rabbit': 3, 'Dragon': 3, 'Snake': 1, 'Horse': 4, 'Goat': 3, 'Monkey': 1, 'Rooster': 2, 'Dog': 4, 'Pig': 4, 'Rat': 2, 'Ox': 2 },
    'Rabbit': { 'Rabbit': 3, 'Dragon': 2, 'Snake': 4, 'Horse': 3, 'Goat': 4, 'Monkey': 2, 'Rooster': 1, 'Dog': 4, 'Pig': 4, 'Rat': 2, 'Ox': 3, 'Tiger': 3 },
    'Dragon': { 'Dragon': 2, 'Snake': 3, 'Horse': 3, 'Goat': 3, 'Monkey': 4, 'Rooster': 4, 'Dog': 1, 'Pig': 3, 'Rat': 4, 'Ox': 3, 'Tiger': 3, 'Rabbit': 2 },
    'Snake': { 'Snake': 3, 'Horse': 2, 'Goat': 3, 'Monkey': 4, 'Rooster': 4, 'Dog': 2, 'Pig': 1, 'Rat': 3, 'Ox': 4, 'Tiger': 1, 'Rabbit': 4, 'Dragon': 3 },
    'Horse': { 'Horse': 3, 'Goat': 4, 'Monkey': 3, 'Rooster': 2, 'Dog': 4, 'Pig': 3, 'Rat': 1, 'Ox': 2, 'Tiger': 4, 'Rabbit': 3, 'Dragon': 3, 'Snake': 2 },
    'Goat': { 'Goat': 3, 'Monkey': 3, 'Rooster': 2, 'Dog': 2, 'Pig': 4, 'Rat': 2, 'Ox': 1, 'Tiger': 3, 'Rabbit': 4, 'Dragon': 3, 'Snake': 3, 'Horse': 4 },
    'Monkey': { 'Monkey': 3, 'Rooster': 3, 'Dog': 3, 'Pig': 3, 'Rat': 4, 'Ox': 2, 'Tiger': 1, 'Rabbit': 2, 'Dragon': 4, 'Snake': 4, 'Horse': 3, 'Goat': 3 },
    'Rooster': { 'Rooster': 2, 'Dog': 1, 'Pig': 2, 'Rat': 2, 'Ox': 4, 'Tiger': 2, 'Rabbit': 1, 'Dragon': 4, 'Snake': 4, 'Horse': 2, 'Goat': 2, 'Monkey': 3 },
    'Dog': { 'Dog': 3, 'Pig': 4, 'Rat': 3, 'Ox': 2, 'Tiger': 4, 'Rabbit': 4, 'Dragon': 1, 'Snake': 2, 'Horse': 4, 'Goat': 2, 'Monkey': 3, 'Rooster': 1 },
    'Pig': { 'Pig': 3, 'Rat': 3, 'Ox': 3, 'Tiger': 4, 'Rabbit': 4, 'Dragon': 3, 'Snake': 1, 'Horse': 3, 'Goat': 4, 'Monkey': 3, 'Rooster': 2, 'Dog': 4 }
};

// Get compatibility level from matrix
function getCompatibilityLevel(zodiac1, zodiac2) {
    const level = compatibilityMatrix[zodiac1][zodiac2];
    switch (level) {
        case 4: return 'excellent';
        case 3: return 'good';
        case 2: return 'fair';
        case 1: return 'poor';
        default: return 'fair';
    }
}

// Create a compatibility document
function createCompatibilityDoc(zodiac1, zodiac2) {
    const pairId = generatePairId(zodiac1, zodiac2);
    const level = getCompatibilityLevel(zodiac1, zodiac2);
    const template = compatibilityTemplates[level];

    return {
        zodiacPair: {
            zodiac1: zodiac1,
            zodiac2: zodiac2,
            pairName: `${zodiac1} & ${zodiac2}`
        },

        romance: {
            free: {
                matchingScore: template.romance.score,
                rating: template.romance.rating,
                quickOverview: template.romance.overview,
                compatibilityTags: template.romance.tags
            },
            premium: {
                emotionalCompatibility: {
                    title: 'Emotional Compatibility',
                    content: `Deep analysis of emotional connection between ${zodiac1} and ${zodiac2}. This pairing shows ${level} emotional resonance.`,
                    score: template.romance.score - 5,
                    highlights: [
                        'Emotional understanding',
                        'Mutual support',
                        'Trust building'
                    ]
                },
                intellectualAlignment: {
                    title: 'Intellectual Alignment',
                    content: `Communication and intellectual compatibility analysis. ${zodiac1} and ${zodiac2} demonstrate ${level} mental connection.`,
                    score: template.romance.score + 3,
                    highlights: [
                        'Communication style',
                        'Shared interests',
                        'Mental stimulation'
                    ]
                },
                longTermPotential: {
                    title: 'Long-term Potential',
                    content: `Future outlook for ${zodiac1} and ${zodiac2} relationship. This pairing has ${level} long-term prospects.`,
                    score: template.romance.score,
                    highlights: [
                        'Relationship stability',
                        'Growth potential',
                        'Shared goals'
                    ]
                },
                others1: {
                    title: 'Others1',
                    content: 'On Construction',
                    score: 0,
                    highlights: [
                        'Under development',
                        'Coming soon',
                        'Stay tuned'
                    ]
                },
                others2: {
                    title: 'Others2',
                    content: 'On Construction',
                    score: 0,
                    highlights: [
                        'Under development',
                        'Coming soon',
                        'Stay tuned'
                    ]
                },
                conflicts: [
                    {
                        type: 'Communication Differences',
                        severity: level === 'excellent' ? 25 : level === 'good' ? 40 : level === 'fair' ? 60 : 75,
                        description: `Different communication styles between ${zodiac1} and ${zodiac2}.`,
                        resolution: 'Establish clear communication guidelines and practice active listening.'
                    },
                    {
                        type: 'Decision-Making Speed',
                        severity: level === 'excellent' ? 30 : level === 'good' ? 50 : level === 'fair' ? 65 : 80,
                        description: 'Different approaches to making decisions.',
                        resolution: 'Create a balanced decision-making framework that respects both styles.'
                    },
                    {
                        type: 'Emotional Expression',
                        severity: level === 'excellent' ? 20 : level === 'good' ? 35 : level === 'fair' ? 55 : 70,
                        description: 'Varying comfort levels with emotional expression.',
                        resolution: 'Build trust and create safe spaces for emotional sharing.'
                    },
                    {
                        type: 'Others1',
                        severity: 0,
                        description: 'On Construction',
                        resolution: 'On Construction'
                    },
                    {
                        type: 'Others2',
                        severity: 0,
                        description: 'On Construction',
                        resolution: 'On Construction'
                    }
                ]
            }
        },

        business: {
            free: {
                matchingScore: template.business.score,
                rating: template.business.rating,
                quickOverview: template.business.overview,
                compatibilityTags: template.business.tags
            },
            premium: {
                workStyleCompatibility: {
                    title: 'Work Style Compatibility',
                    content: `Analysis of work styles between ${zodiac1} and ${zodiac2}. This partnership shows ${level} professional synergy.`,
                    score: template.business.score,
                    highlights: [
                        'Complementary skills',
                        'Work approach',
                        'Professional respect'
                    ]
                },
                leadershipDynamics: {
                    title: 'Leadership Dynamics',
                    content: `Leadership and decision-making dynamics. ${zodiac1} and ${zodiac2} demonstrate ${level} leadership compatibility.`,
                    score: template.business.score - 5,
                    highlights: [
                        'Role clarity',
                        'Power balance',
                        'Delegation effectiveness'
                    ]
                },
                financialAlignment: {
                    title: 'Financial Alignment',
                    content: `Financial management and risk tolerance analysis. This pairing shows ${level} financial compatibility.`,
                    score: template.business.score + 2,
                    highlights: [
                        'Financial goals',
                        'Risk approach',
                        'Investment strategy'
                    ]
                },
                others1: {
                    title: 'Others1',
                    content: 'On Construction',
                    score: 0,
                    highlights: [
                        'Under development',
                        'Coming soon',
                        'Stay tuned'
                    ]
                },
                others2: {
                    title: 'Others2',
                    content: 'On Construction',
                    score: 0,
                    highlights: [
                        'Under development',
                        'Coming soon',
                        'Stay tuned'
                    ]
                },
                conflicts: [
                    {
                        type: 'Risk Tolerance',
                        severity: level === 'excellent' ? 30 : level === 'good' ? 50 : level === 'fair' ? 65 : 80,
                        description: 'Different comfort levels with business risks.',
                        resolution: 'Establish clear risk assessment criteria and decision thresholds.'
                    },
                    {
                        type: 'Pace of Growth',
                        severity: level === 'excellent' ? 25 : level === 'good' ? 45 : level === 'fair' ? 60 : 75,
                        description: 'Different expectations for business expansion.',
                        resolution: 'Set realistic milestones and review progress regularly.'
                    },
                    {
                        type: 'Client Relations',
                        severity: level === 'excellent' ? 20 : level === 'good' ? 40 : level === 'fair' ? 55 : 70,
                        description: 'Different approaches to client management.',
                        resolution: 'Leverage each partner\'s strengths in client interactions.'
                    },
                    {
                        type: 'Others1',
                        severity: 0,
                        description: 'On Construction',
                        resolution: 'On Construction'
                    },
                    {
                        type: 'Others2',
                        severity: 0,
                        description: 'On Construction',
                        resolution: 'On Construction'
                    }
                ]
            }
        },

        genderModifiers: {
            'male-male': {
                romanceScoreAdjustment: 0,
                businessScoreAdjustment: 5,
                notes: 'Strong professional synergy'
            },
            'female-female': {
                romanceScoreAdjustment: 3,
                businessScoreAdjustment: 0,
                notes: 'Enhanced emotional connection'
            },
            'male-female': {
                romanceScoreAdjustment: 2,
                businessScoreAdjustment: 0,
                notes: 'Traditional complementary dynamic'
            },
            'others': {
                romanceScoreAdjustment: 0,
                businessScoreAdjustment: 0,
                notes: 'Base compatibility applies'
            }
        },

        metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            dataQuality: 'complete'
        }
    };
}

// Main seeding function
async function seedDatabase() {
    console.log('Starting database seeding...');
    console.log(`Total documents to create: ${zodiacSigns.length * zodiacSigns.length}`);

    let count = 0;
    const batchSize = 500; // Firestore batch limit
    let batch = writeBatch(db);
    let batchCount = 0;

    for (const zodiac1 of zodiacSigns) {
        for (const zodiac2 of zodiacSigns) {
            const pairId = generatePairId(zodiac1, zodiac2);
            const docData = createCompatibilityDoc(zodiac1, zodiac2);

            const docRef = doc(db, 'zodiac-compatibility', pairId);
            batch.set(docRef, docData);

            batchCount++;
            count++;

            // Commit batch when it reaches the limit
            if (batchCount >= batchSize) {
                await batch.commit();
                console.log(`Committed batch of ${batchCount} documents. Total: ${count}`);
                batch = writeBatch(db);
                batchCount = 0;
            }

            console.log(`Created: ${pairId} (${count}/${zodiacSigns.length * zodiacSigns.length})`);
        }
    }

    // Commit remaining documents
    if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} documents.`);
    }

    console.log(`\n✅ Database seeding complete! Created ${count} documents.`);
}

// Run the seeding
seedDatabase()
    .then(() => {
        console.log('Seeding finished successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });
