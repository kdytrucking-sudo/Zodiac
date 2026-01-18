# MD Template to Database Mapping Guide

## Overview
This document explains how the MD template structure maps to the Firestore database structure.

---

## Document Identification

### MD Template
```markdown
## Pairing Information
**Zodiac 1:** Rabbit
**Zodiac 2:** Snake
**Gender Combination:** female-female
```

### Database Structure
```javascript
// Document ID: "Rabbit-Snake" (alphabetically sorted)
{
  zodiacPair: {
    zodiac1: "Rabbit",
    zodiac2: "Snake",
    pairName: "Rabbit & Snake"
  }
}
```

**Note:** The gender combination determines which nested object to update within `romance` and `business`.

---

## Romance Section Mapping

### Free Content

#### MD Template
```markdown
### Overall Romantic Assessment (Free Content)

#### Content
[Your content here]

#### Compatibility Analysis
##### Matching Score
88

##### Rating
Excellent

#### Compatibility Tags
##### Emotional Balance
**Status:** positive

##### Intellectual Match
**Status:** positive

##### Communication Style
**Status:** neutral
```

#### Database Path
```javascript
romance['female-female'].free = {
  matchingScore: 88,
  rating: "Excellent",
  quickOverview: "[Your content here]",
  compatibilityTags: [
    { tag: "Emotional Balance", status: "positive" },
    { tag: "Intellectual Match", status: "positive" },
    { tag: "Communication Style", status: "neutral" }
  ]
}
```

---

### Premium Content - Emotional Compatibility

#### MD Template
```markdown
#### Emotional Compatibility

##### Score
85

##### Highlights
- Strong emotional understanding
- Complementary emotional needs
- Mutual respect and trust

##### Content
[Your detailed analysis here]
```

#### Database Path
```javascript
romance['female-female'].premium.emotionalCompatibility = {
  title: "Emotional Compatibility",
  score: 85,
  highlights: [
    "Strong emotional understanding",
    "Complementary emotional needs",
    "Mutual respect and trust"
  ],
  content: "[Your detailed analysis here]"
}
```

---

### Premium Content - Intellectual Alignment

#### MD Template
```markdown
#### Intellectual Alignment

##### Score
92

##### Highlights
- Deep conversations
- Shared analytical approach
- Mutual intellectual respect

##### Content
[Your analysis here]
```

#### Database Path
```javascript
romance['female-female'].premium.intellectualAlignment = {
  title: "Intellectual Alignment",
  score: 92,
  highlights: [
    "Deep conversations",
    "Shared analytical approach",
    "Mutual intellectual respect"
  ],
  content: "[Your analysis here]"
}
```

---

### Premium Content - Long-term Potential

#### MD Template
```markdown
#### Long-term Potential

##### Score
88

##### Highlights
- Stable foundation
- Growth-oriented mindset
- Shared life goals

##### Content
[Your analysis here]
```

#### Database Path
```javascript
romance['female-female'].premium.longTermPotential = {
  title: "Long-term Potential",
  score: 88,
  highlights: [
    "Stable foundation",
    "Growth-oriented mindset",
    "Shared life goals"
  ],
  content: "[Your analysis here]"
}
```

---

### Premium Content - Others Sections

#### MD Template
```markdown
#### Others 1

##### Title
Custom Section Title

##### Score
75

##### Highlights
- Point 1
- Point 2
- Point 3

##### Content
[Your content]
```

#### Database Path
```javascript
romance['female-female'].premium.others1 = {
  title: "Custom Section Title",
  score: 75,
  highlights: ["Point 1", "Point 2", "Point 3"],
  content: "[Your content]"
}

// Same structure for others2
```

**Default for Under Construction:**
```javascript
{
  title: "Others1",
  score: 0,
  highlights: ["Under development", "Coming soon", "Stay tuned"],
  content: "On Construction"
}
```

---

### Premium Content - Conflicts

#### MD Template
```markdown
#### Conflict 1: Communication Differences

##### Severity
35

##### Description
The Rabbit prefers direct communication while the Snake tends to be more subtle...

##### Resolution
Establish clear communication guidelines...
```

#### Database Path
```javascript
romance['female-female'].premium.conflicts = [
  {
    type: "Communication Differences",
    severity: 35,
    description: "The Rabbit prefers direct communication while the Snake tends to be more subtle...",
    resolution: "Establish clear communication guidelines..."
  },
  // ... 4 more conflicts (total of 5)
]
```

**Important:** Always include exactly 5 conflicts. The last two can be placeholders:
```javascript
{
  type: "Others1",
  severity: 0,
  description: "On Construction",
  resolution: "On Construction"
}
```

---

## Business Section Mapping

### Free Content

#### MD Template
```markdown
### Overall Business Assessment (Free Content)

#### Content
[Your content here]

#### Business Compatibility Analysis
##### Matching Score
75

##### Rating
Good

#### Business Compatibility Tags
##### Work Ethic
**Status:** positive

##### Decision Making
**Status:** neutral

##### Risk Tolerance
**Status:** negative
```

#### Database Path
```javascript
business['female-female'].free = {
  matchingScore: 75,
  rating: "Good",
  quickOverview: "[Your content here]",
  compatibilityTags: [
    { tag: "Work Ethic", status: "positive" },
    { tag: "Decision Making", status: "neutral" },
    { tag: "Risk Tolerance", status: "negative" }
  ]
}
```

---

### Premium Content - Work Style Compatibility

#### MD Template
```markdown
#### Work Style Compatibility

##### Score
78

##### Highlights
- Complementary skill sets
- Balanced approach to challenges
- Mutual professional respect

##### Content
[Your analysis here]
```

#### Database Path
```javascript
business['female-female'].premium.workStyleCompatibility = {
  title: "Work Style Compatibility",
  score: 78,
  highlights: [
    "Complementary skill sets",
    "Balanced approach to challenges",
    "Mutual professional respect"
  ],
  content: "[Your analysis here]"
}
```

---

### Premium Content - Leadership Dynamics

#### MD Template
```markdown
#### Leadership Dynamics

##### Score
72

##### Highlights
- Clear role definition
- Minimal power struggles
- Effective delegation

##### Content
[Your analysis here]
```

#### Database Path
```javascript
business['female-female'].premium.leadershipDynamics = {
  title: "Leadership Dynamics",
  score: 72,
  highlights: [
    "Clear role definition",
    "Minimal power struggles",
    "Effective delegation"
  ],
  content: "[Your analysis here]"
}
```

---

### Premium Content - Financial Alignment

#### MD Template
```markdown
#### Financial Alignment

##### Score
70

##### Highlights
- Conservative approach
- Risk-averse decisions
- Long-term stability focus

##### Content
[Your analysis here]
```

#### Database Path
```javascript
business['female-female'].premium.financialAlignment = {
  title: "Financial Alignment",
  score: 70,
  highlights: [
    "Conservative approach",
    "Risk-averse decisions",
    "Long-term stability focus"
  ],
  content: "[Your analysis here]"
}
```

---

### Business Challenges

#### MD Template
```markdown
#### Challenge 1: Risk Tolerance

##### Severity
60

##### Description
Both partners are naturally risk-averse...

##### Resolution
Establish clear risk assessment criteria...
```

#### Database Path
```javascript
business['female-female'].premium.conflicts = [
  {
    type: "Risk Tolerance",
    severity: 60,
    description: "Both partners are naturally risk-averse...",
    resolution: "Establish clear risk assessment criteria..."
  },
  // ... 4 more challenges (total of 5)
]
```

---

## Complete Database Structure Example

```javascript
{
  // Document ID: "Rabbit-Snake"
  
  zodiacPair: {
    zodiac1: "Rabbit",
    zodiac2: "Snake",
    pairName: "Rabbit & Snake"
  },
  
  romance: {
    'male-male': { /* same structure */ },
    'female-female': {
      free: {
        matchingScore: 88,
        rating: "Excellent",
        quickOverview: "...",
        compatibilityTags: [
          { tag: "Emotional Balance", status: "positive" },
          { tag: "Intellectual Match", status: "positive" },
          { tag: "Communication Style", status: "neutral" }
        ]
      },
      premium: {
        emotionalCompatibility: {
          title: "Emotional Compatibility",
          score: 85,
          highlights: ["...", "...", "..."],
          content: "..."
        },
        intellectualAlignment: {
          title: "Intellectual Alignment",
          score: 92,
          highlights: ["...", "...", "..."],
          content: "..."
        },
        longTermPotential: {
          title: "Long-term Potential",
          score: 88,
          highlights: ["...", "...", "..."],
          content: "..."
        },
        others1: {
          title: "Others1",
          score: 0,
          highlights: ["Under development", "Coming soon", "Stay tuned"],
          content: "On Construction"
        },
        others2: {
          title: "Others2",
          score: 0,
          highlights: ["Under development", "Coming soon", "Stay tuned"],
          content: "On Construction"
        },
        conflicts: [
          {
            type: "Communication Differences",
            severity: 35,
            description: "...",
            resolution: "..."
          },
          {
            type: "Decision-Making Speed",
            severity: 55,
            description: "...",
            resolution: "..."
          },
          {
            type: "Emotional Expression",
            severity: 25,
            description: "...",
            resolution: "..."
          },
          {
            type: "Others1",
            severity: 0,
            description: "On Construction",
            resolution: "On Construction"
          },
          {
            type: "Others2",
            severity: 0,
            description: "On Construction",
            resolution: "On Construction"
          }
        ]
      }
    },
    'male-female': { /* same structure */ }
  },
  
  business: {
    'male-male': { /* same structure */ },
    'female-female': {
      free: {
        matchingScore: 75,
        rating: "Good",
        quickOverview: "...",
        compatibilityTags: [
          { tag: "Work Ethic", status: "positive" },
          { tag: "Decision Making", status: "neutral" },
          { tag: "Risk Tolerance", status: "negative" }
        ]
      },
      premium: {
        workStyleCompatibility: { /* ... */ },
        leadershipDynamics: { /* ... */ },
        financialAlignment: { /* ... */ },
        others1: { /* ... */ },
        others2: { /* ... */ },
        conflicts: [ /* 5 challenges */ ]
      }
    },
    'male-female': { /* same structure */ }
  },
  
  metadata: {
    createdAt: "2025-12-26T00:00:00Z",
    updatedAt: "2025-12-26T00:00:00Z",
    version: 2,
    dataQuality: "complete",
    structure: "gender-specific"
  }
}
```

---

## Field Requirements Checklist

### Romance Section
- [ ] Free Content
  - [ ] Matching Score (0-100)
  - [ ] Rating (Poor/Fair/Good/Very Good/Excellent)
  - [ ] Quick Overview (200-300 words)
  - [ ] 3 Compatibility Tags (each with status: positive/neutral/negative)
  
- [ ] Premium Content
  - [ ] Emotional Compatibility (score, 3 highlights, content)
  - [ ] Intellectual Alignment (score, 3 highlights, content)
  - [ ] Long-term Potential (score, 3 highlights, content)
  - [ ] Others 1 (title, score, 3 highlights, content)
  - [ ] Others 2 (title, score, 3 highlights, content)
  - [ ] 5 Conflicts (type, severity, description, resolution)

### Business Section
- [ ] Free Content
  - [ ] Matching Score (0-100)
  - [ ] Rating (Poor/Fair/Good/Very Good/Excellent)
  - [ ] Quick Overview (200-300 words)
  - [ ] 3 Compatibility Tags (each with status)
  
- [ ] Premium Content
  - [ ] Work Style Compatibility (score, 3 highlights, content)
  - [ ] Leadership Dynamics (score, 3 highlights, content)
  - [ ] Financial Alignment (score, 3 highlights, content)
  - [ ] Others 1 (title, score, 3 highlights, content)
  - [ ] Others 2 (title, score, 3 highlights, content)
  - [ ] 5 Challenges (type, severity, description, resolution)

---

## Important Notes

1. **Gender Combination Keys:**
   - Use exactly: `male-male`, `female-female`, or `male-female`
   - These are case-sensitive in the database

2. **Zodiac Sign Names:**
   - Use exact capitalization: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig

3. **Document ID Generation:**
   - Always alphabetically sorted: "Dog-Pig" not "Pig-Dog"
   - Use hyphen separator: "Rabbit-Snake"

4. **Required Arrays:**
   - Compatibility Tags: Exactly 3 items
   - Highlights: Exactly 3 items per section
   - Conflicts/Challenges: Exactly 5 items

5. **Status Values:**
   - Only use: `positive`, `neutral`, or `negative`
   - Case-sensitive

6. **Rating Values:**
   - Only use: `Poor`, `Fair`, `Good`, `Very Good`, or `Excellent`
   - Case-sensitive, use exact capitalization

7. **Score Ranges:**
   - All scores: 0-100
   - Severity: 0-100 (higher = more severe)

8. **Content Length Guidelines:**
   - Quick Overview: 200-300 words
   - Premium Content: 150-250 words per section
   - Conflict Description: 50-100 words
   - Resolution: 50-100 words

---

## Parsing Strategy

When creating an automated parser, follow this sequence:

1. **Extract Header Info:**
   - Parse zodiac signs from "Pairing Information"
   - Parse gender combination
   - Generate document ID (alphabetically sorted)

2. **Parse Romance Free Content:**
   - Extract content between "Overall Romantic Assessment" and "Detailed Romantic Analysis"
   - Parse score, rating, and tags

3. **Parse Romance Premium Content:**
   - Extract each subsection (Emotional Compatibility, etc.)
   - Parse score, highlights (as array), and content for each

4. **Parse Romance Conflicts:**
   - Extract all conflicts under "Potential Challenges & Solutions"
   - Parse type, severity, description, resolution for each

5. **Repeat for Business Section:**
   - Same structure as Romance but different field names

6. **Validate:**
   - Check all required fields are present
   - Verify scores are 0-100
   - Ensure arrays have correct number of items
   - Validate enum values (rating, status)

---

## File Naming Convention

Suggested format for MD files:
```
[Zodiac1]_[Zodiac2]_[GenderCombo].md
```

Examples:
- `Rabbit_Snake_female_female.md`
- `Dragon_Tiger_male_male.md`
- `Pig_Rat_male_female.md`

This makes it easy to identify which document each MD file represents.
