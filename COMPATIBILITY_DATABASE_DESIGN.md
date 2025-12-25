# Zodiac Compatibility Database Design

## Overview
This document describes the database structure for the Zodiac Compatibility Matching feature.

## Collection: `zodiac-compatibility`

### Total Documents: 144
- 12 zodiac signs × 12 possible pairings (including same-sign pairings)
- Document ID format: `{Zodiac1}-{Zodiac2}` (alphabetically sorted, e.g., "Dragon-Rabbit", "Rat-Rat")

### Document Structure

```javascript
{
  // Document ID: "Rabbit-Snake"
  
  // Basic Information
  "zodiacPair": {
    "zodiac1": "Rabbit",
    "zodiac2": "Snake",
    "pairName": "Rabbit & Snake"
  },
  
  // Romance Compatibility
  "romance": {
    // Free Content (visible to all users)
    "free": {
      "matchingScore": 88,              // 0-100
      "rating": "Excellent",             // Poor/Fair/Good/Excellent/Perfect
      "quickOverview": "These two signs share a deep intellectual bond. While the Rabbit seeks harmony, the Snake provides wisdom, creating a stable and enriching partnership.",
      "compatibilityTags": [
        {
          "tag": "Emotional Balance",
          "status": "positive"           // positive/neutral/negative
        },
        {
          "tag": "Intellectual Match",
          "status": "positive"
        },
        {
          "tag": "Communication Style",
          "status": "neutral"
        }
      ]
    },
    
    // Premium Content (requires membership)
    "premium": {
      "emotionalCompatibility": {
        "title": "Emotional Compatibility",
        "content": "Deep dive into emotional connection patterns and relationship dynamics. The Rabbit's gentle nature complements the Snake's depth, creating a balanced emotional ecosystem.",
        "score": 85,
        "highlights": [
          "Strong emotional understanding",
          "Complementary emotional needs",
          "Mutual respect and trust"
        ]
      },
      "intellectualAlignment": {
        "title": "Intellectual Alignment",
        "content": "Analysis of communication styles and shared values. Both signs are thoughtful and prefer to analyze situations before acting.",
        "score": 92,
        "highlights": [
          "Deep conversations",
          "Shared analytical approach",
          "Mutual intellectual respect"
        ]
      },
      "longTermPotential": {
        "title": "Long-term Potential",
        "content": "Future outlook and relationship growth assessment. This pairing has strong foundations for lasting commitment.",
        "score": 88,
        "highlights": [
          "Stable foundation",
          "Growth-oriented mindset",
          "Shared life goals"
        ]
      },
      "others1": {
        "title": "Others1",
        "content": "On Construction",
        "score": 0,
        "highlights": [
          "Under development",
          "Coming soon",
          "Stay tuned"
        ]
      },
      "others2": {
        "title": "Others2",
        "content": "On Construction",
        "score": 0,
        "highlights": [
          "Under development",
          "Coming soon",
          "Stay tuned"
        ]
      },
      "conflicts": [
        {
          "type": "Communication Differences",
          "severity": 35,                // 0-100 (higher = more severe)
          "description": "The Rabbit prefers direct communication while the Snake tends to be more subtle and indirect.",
          "resolution": "Establish clear communication guidelines. The Rabbit should be patient with the Snake's indirect style, while the Snake should make an effort to be more straightforward when discussing important matters."
        },
        {
          "type": "Decision-Making Speed",
          "severity": 55,
          "description": "The Rabbit makes quick decisions based on intuition, while the Snake prefers careful deliberation.",
          "resolution": "Create a decision-making framework that allows for both quick responses and thoughtful analysis. Set time limits for decisions to prevent analysis paralysis."
        },
        {
          "type": "Emotional Expression",
          "severity": 25,
          "description": "Different comfort levels with expressing emotions openly.",
          "resolution": "Create safe spaces for emotional expression. The Rabbit can help the Snake open up, while the Snake can teach the Rabbit the value of emotional depth."
        },
        {
          "type": "Others1",
          "severity": 0,
          "description": "On Construction",
          "resolution": "On Construction"
        },
        {
          "type": "Others2",
          "severity": 0,
          "description": "On Construction",
          "resolution": "On Construction"
        }
      ]
    }
  },
  
  // Business Partnership
  "business": {
    // Free Content
    "free": {
      "matchingScore": 75,
      "rating": "Good",
      "quickOverview": "Strong complementary skills in business. The Rabbit's networking abilities combined with the Snake's strategic thinking create a powerful partnership.",
      "compatibilityTags": [
        {
          "tag": "Work Ethic",
          "status": "positive"
        },
        {
          "tag": "Decision Making",
          "status": "neutral"
        },
        {
          "tag": "Risk Tolerance",
          "status": "negative"
        }
      ]
    },
    
    // Premium Content
    "premium": {
      "workStyleCompatibility": {
        "title": "Work Style Compatibility",
        "content": "The Rabbit brings creativity and people skills, while the Snake contributes analytical thinking and strategic planning.",
        "score": 78,
        "highlights": [
          "Complementary skill sets",
          "Balanced approach to challenges",
          "Mutual professional respect"
        ]
      },
      "leadershipDynamics": {
        "title": "Leadership Dynamics",
        "content": "Natural division of leadership roles. The Rabbit excels in client-facing situations, while the Snake handles strategic planning.",
        "score": 72,
        "highlights": [
          "Clear role definition",
          "Minimal power struggles",
          "Effective delegation"
        ]
      },
      "financialAlignment": {
        "title": "Financial Alignment",
        "content": "Both signs are financially cautious, though the Snake is more conservative. This can lead to stable but slow growth.",
        "score": 70,
        "highlights": [
          "Conservative approach",
          "Risk-averse decisions",
          "Long-term stability focus"
        ]
      },
      "others1": {
        "title": "Others1",
        "content": "On Construction",
        "score": 0,
        "highlights": [
          "Under development",
          "Coming soon",
          "Stay tuned"
        ]
      },
      "others2": {
        "title": "Others2",
        "content": "On Construction",
        "score": 0,
        "highlights": [
          "Under development",
          "Coming soon",
          "Stay tuned"
        ]
      },
      "conflicts": [
        {
          "type": "Risk Tolerance",
          "severity": 60,
          "description": "The Rabbit is more willing to take calculated risks, while the Snake prefers extreme caution.",
          "resolution": "Establish clear risk assessment criteria. Create a balanced approach where both perspectives are valued in decision-making."
        },
        {
          "type": "Pace of Growth",
          "severity": 45,
          "description": "Different expectations for business expansion speed.",
          "resolution": "Set realistic growth milestones that satisfy both partners. Create quarterly reviews to adjust pace as needed."
        },
        {
          "type": "Client Relations",
          "severity": 30,
          "description": "Different approaches to client management and relationship building.",
          "resolution": "Leverage each other's strengths. Let the Rabbit handle initial client contact while the Snake manages long-term strategy."
        },
        {
          "type": "Others1",
          "severity": 0,
          "description": "On Construction",
          "resolution": "On Construction"
        },
        {
          "type": "Others2",
          "severity": 0,
          "description": "On Construction",
          "resolution": "On Construction"
        }
      ]
    }
  },
  
  // Gender-based Score Modifiers (optional adjustments)
  "genderModifiers": {
    "male-male": {
      "romanceScoreAdjustment": 0,
      "businessScoreAdjustment": 5,
      "notes": "Strong professional synergy"
    },
    "female-female": {
      "romanceScoreAdjustment": 3,
      "businessScoreAdjustment": 0,
      "notes": "Enhanced emotional connection"
    },
    "male-female": {
      "romanceScoreAdjustment": 2,
      "businessScoreAdjustment": 0,
      "notes": "Traditional complementary dynamic"
    },
    "others": {
      "romanceScoreAdjustment": 0,
      "businessScoreAdjustment": 0,
      "notes": "Base compatibility applies"
    }
  },
  
  // Metadata
  "metadata": {
    "createdAt": "2025-12-26T00:00:00Z",
    "updatedAt": "2025-12-26T00:00:00Z",
    "version": 1,
    "dataQuality": "complete"  // draft/partial/complete
  }
}
```

## Rating Scale

### Matching Score (0-100)
- **90-100**: Perfect - Exceptional compatibility
- **75-89**: Excellent - Very strong match
- **60-74**: Good - Solid compatibility
- **40-59**: Fair - Moderate compatibility with effort
- **0-39**: Poor - Challenging match requiring significant work

### Conflict Severity (0-100)
- **0-25**: Minor - Easy to manage
- **26-50**: Moderate - Requires attention
- **51-75**: Significant - Needs active management
- **76-100**: Major - Requires professional guidance

## Zodiac Signs List
1. Rat
2. Ox
3. Tiger
4. Rabbit
5. Dragon
6. Snake
7. Horse
8. Goat
9. Monkey
10. Rooster
11. Dog
12. Pig

## Document ID Generation Logic

```javascript
function generatePairId(zodiac1, zodiac2) {
  // Sort alphabetically to ensure consistency
  const sorted = [zodiac1, zodiac2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

// Examples:
// generatePairId("Snake", "Rabbit") => "Rabbit-Snake"
// generatePairId("Rat", "Rat") => "Rat-Rat"
// generatePairId("Dragon", "Dog") => "Dog-Dragon"
```

## Query Examples

### Get compatibility data for a specific pair
```javascript
const pairId = generatePairId("Rabbit", "Snake");
const doc = await db.collection('zodiac-compatibility').doc(pairId).get();
const data = doc.data();

// Access free romance data
const romanceFree = data.romance.free;

// Access premium romance data (check user membership first)
if (user.isPremium) {
  const romancePremium = data.romance.premium;
}
```

### Get all pairings for a specific zodiac
```javascript
const zodiac = "Rabbit";
const query = db.collection('zodiac-compatibility')
  .where('zodiacPair.zodiac1', '==', zodiac)
  .or('zodiacPair.zodiac2', '==', zodiac);
  
const snapshot = await query.get();
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /zodiac-compatibility/{pairId} {
      // Everyone can read the document
      allow read: if true;
      
      // Only admins can write
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
  }
}
```

## Data Population Strategy

1. **Phase 1**: Create all 144 document structures with basic free content
2. **Phase 2**: Populate premium romance content
3. **Phase 3**: Populate premium business content
4. **Phase 4**: Add gender modifiers and refinements
5. **Phase 5**: Quality review and adjustments

## Notes

- Premium content visibility is controlled on the frontend based on user membership status
- Gender modifiers are optional and can be applied dynamically in the frontend
- All text content should be in English only
- Scores should be realistic and based on traditional zodiac compatibility principles
- Each pairing should have unique, meaningful content (no generic templates)
