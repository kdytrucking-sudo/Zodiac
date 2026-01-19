// MD Import Admin JavaScript
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js';

// Firebase configuration (correct credentials from app.js)
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
const db = getFirestore(app, "zodia1");  // Use the same database name as app.js


// Global state
const state = {
    files: {
        'male-male': null,
        'male-female': null,
        'female-male': null,
        'female-female': null
    },
    mergedContent: '',
    jsonData: null
};

// Handle file selection
window.handleFileSelect = function (input, genderCombo) {
    const file = input.files[0];
    if (file) {
        state.files[genderCombo] = file;

        // Update UI
        const uploadItem = input.closest('.upload-item');
        const infoElement = uploadItem.querySelector('.file-info');

        uploadItem.classList.add('has-file');
        infoElement.innerHTML = `<span class="file-name">${file.name}</span><br><small>${(file.size / 1024).toFixed(2)} KB</small>`;

        // Check if we can enable merge button
        checkMergeButton();
    }
};

// Check if at least one file is uploaded
function checkMergeButton() {
    const hasFiles = Object.values(state.files).some(file => file !== null);
    document.getElementById('mergeBtn').disabled = !hasFiles;
}

// Merge files
window.mergeFiles = async function () {
    showLoading(true);

    try {
        // Step 1: Check if at least one file is uploaded
        const uploadedFiles = Object.entries(state.files).filter(([_, file]) => file !== null);
        if (uploadedFiles.length === 0) {
            throw new Error('Please upload at least one MD file');
        }

        // Step 2: Read all file contents
        const fileContents = {};
        for (const [combo, file] of uploadedFiles) {
            fileContents[combo] = await readFileContent(file);
        }

        // Step 3: Validate zodiac pair consistency
        const zodiacPairs = [];
        for (const [combo, content] of Object.entries(fileContents)) {
            const zodiac1Match = content.match(/\*\*Zodiac 1:\*\* (.+?)(?:\(|$)/m);
            const zodiac2Match = content.match(/\*\*Zodiac 2:\*\* (.+?)(?:\(|$)/m);

            if (!zodiac1Match || !zodiac2Match) {
                throw new Error(`File ${combo}: Missing zodiac pairing information`);
            }

            const zodiac1 = zodiac1Match[1].trim();
            const zodiac2 = zodiac2Match[1].trim();
            zodiacPairs.push({ combo, zodiac1, zodiac2 });
        }

        // Check if all files have the same zodiac pair
        const firstPair = zodiacPairs[0];
        for (let i = 1; i < zodiacPairs.length; i++) {
            const currentPair = zodiacPairs[i];
            if (currentPair.zodiac1 !== firstPair.zodiac1 || currentPair.zodiac2 !== firstPair.zodiac2) {
                throw new Error(
                    `Zodiac pair mismatch!\n` +
                    `${firstPair.combo}: ${firstPair.zodiac1} & ${firstPair.zodiac2}\n` +
                    `${currentPair.combo}: ${currentPair.zodiac1} & ${currentPair.zodiac2}\n` +
                    `All files must have the same zodiac pairing.`
                );
            }
        }

        // Step 4: Validate gender combination coverage
        const requiredCombos = ['male-male', 'male-female', 'female-male', 'female-female'];
        const uploadedCombos = Object.keys(fileContents);
        const missingCombos = requiredCombos.filter(combo => !uploadedCombos.includes(combo));

        if (missingCombos.length > 0) {
            const warning = `Warning: Missing gender combinations: ${missingCombos.join(', ')}\n` +
                `You can continue, but the data will be incomplete.`;
            console.warn(warning);

            // Show warning but allow to continue
            if (!confirm(warning + '\n\nDo you want to continue?')) {
                throw new Error('Merge cancelled by user');
            }
        }

        // Step 5: Validate MD data structure for each file
        for (const [combo, content] of Object.entries(fileContents)) {
            const validation = validateMDStructure(content, combo);
            if (!validation.isValid) {
                throw new Error(
                    `File ${combo} has incomplete structure:\n` +
                    validation.errors.join('\n')
                );
            }
        }

        // Step 6: Merge all files
        let mergedContent = '';
        const genderCombos = ['male-male', 'male-female', 'female-male', 'female-female'];

        for (const combo of genderCombos) {
            if (fileContents[combo]) {
                mergedContent += `\n\n# ========== ${combo.toUpperCase()} ==========\n\n`;
                mergedContent += fileContents[combo];
            }
        }

        state.mergedContent = mergedContent.trim();
        document.getElementById('mergedContent').value = state.mergedContent;
        document.getElementById('convertBtn').disabled = false;

        showMessage(
            `Files merged successfully! ✅\n` +
            `Zodiac Pair: ${firstPair.zodiac1} & ${firstPair.zodiac2}\n` +
            `Gender Combinations: ${uploadedCombos.length}/4`,
            'success'
        );
    } catch (error) {
        showMessage('Error merging files: ' + error.message, 'error');
        console.error('Merge error:', error);
    } finally {
        showLoading(false);
    }
};

// Read file content
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Validate MD file structure
function validateMDStructure(content, combo) {
    const errors = [];

    // 1. Check Pairing Information
    if (!content.includes('## Pairing Information')) {
        errors.push('❌ Missing "Pairing Information" section');
    }
    if (!content.match(/\*\*Zodiac 1:\*\*/)) {
        errors.push('❌ Missing "Zodiac 1" field');
    }
    if (!content.match(/\*\*Zodiac 2:\*\*/)) {
        errors.push('❌ Missing "Zodiac 2" field');
    }
    if (!content.match(/\*\*Gender Combination:\*\*/)) {
        errors.push('❌ Missing "Gender Combination" field');
    }

    // 2. Check Romance Compatibility Analysis
    if (!content.includes('## Romance Compatibility Analysis')) {
        errors.push('❌ Missing "Romance Compatibility Analysis" section');
    } else {
        // Check Free Content
        if (!content.includes('### Overall Romantic Assessment (Free Content)')) {
            errors.push('❌ Missing "Overall Romantic Assessment (Free Content)"');
        }
        if (!content.match(/##### Matching Score\s+\d+/)) {
            errors.push('❌ Missing "Matching Score" in Romance Free Content');
        }
        if (!content.match(/##### Rating\s+\w+/)) {
            errors.push('❌ Missing "Rating" in Romance Free Content');
        }

        // Check Premium Content
        if (!content.includes('### Detailed Romantic Analysis (Premium Content)')) {
            errors.push('❌ Missing "Detailed Romantic Analysis (Premium Content)"');
        }
        if (!content.includes('#### Emotional Compatibility')) {
            errors.push('❌ Missing "Emotional Compatibility" section');
        }
        if (!content.includes('#### Intellectual Alignment')) {
            errors.push('❌ Missing "Intellectual Alignment" section');
        }
        if (!content.includes('#### Long-term Potential')) {
            errors.push('❌ Missing "Long-term Potential" section');
        }

        // Check Conflicts
        if (!content.includes('### Potential Challenges & Solutions (Premium Content)')) {
            errors.push('❌ Missing "Potential Challenges & Solutions" section');
        }
        const conflictMatches = content.match(/#### Conflict \d+:/g);
        if (!conflictMatches || conflictMatches.length < 3) {
            errors.push(`⚠️  Only found ${conflictMatches ? conflictMatches.length : 0} conflicts (recommended: at least 3)`);
        }
    }

    // 3. Check Business Compatibility Analysis
    if (!content.includes('## Business Compatibility Analysis')) {
        errors.push('❌ Missing "Business Compatibility Analysis" section');
    } else {
        // Check Free Content
        if (!content.includes('### Overall Business Assessment (Free Content)')) {
            errors.push('❌ Missing "Overall Business Assessment (Free Content)"');
        }
        if (!content.match(/##### Matching Score\s+\d+/g) || content.match(/##### Matching Score\s+\d+/g).length < 2) {
            errors.push('❌ Missing "Matching Score" in Business Free Content');
        }

        // Check Premium Content
        if (!content.includes('### Detailed Business Analysis (Premium Content)')) {
            errors.push('❌ Missing "Detailed Business Analysis (Premium Content)"');
        }
        if (!content.includes('#### Work Style Compatibility')) {
            errors.push('❌ Missing "Work Style Compatibility" section');
        }
        if (!content.includes('#### Leadership Dynamics')) {
            errors.push('❌ Missing "Leadership Dynamics" section');
        }
        if (!content.includes('#### Financial Alignment')) {
            errors.push('❌ Missing "Financial Alignment" section');
        }

        // Check Challenges
        if (!content.includes('### Business Challenges & Solutions (Premium Content)')) {
            errors.push('❌ Missing "Business Challenges & Solutions" section');
        }
        const challengeMatches = content.match(/#### Challenge \d+:/g);
        if (!challengeMatches || challengeMatches.length < 3) {
            errors.push(`⚠️  Only found ${challengeMatches ? challengeMatches.length : 0} challenges (recommended: at least 3)`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}


// Convert to JSON
window.convertToJson = async function () {
    showLoading(true);

    try {
        const content = document.getElementById('mergedContent').value;
        if (!content.trim()) {
            throw new Error('No content to convert');
        }

        // Parse the merged content
        const jsonData = parseMergedContent(content);
        state.jsonData = jsonData;

        // Display JSON preview
        document.getElementById('jsonPreview').textContent = JSON.stringify(jsonData, null, 2);
        document.getElementById('jsonSection').style.display = 'block';

        // Update stats
        updateStats(jsonData);

        // Enable update button
        document.getElementById('updateBtn').disabled = false;

        showMessage('Content converted to JSON successfully!', 'success');

        // Scroll to JSON section
        document.getElementById('jsonSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showMessage('Error converting to JSON: ' + error.message, 'error');
        console.error('Conversion error:', error);
    } finally {
        showLoading(false);
    }
};

// Parse merged content into JSON structure
function parseMergedContent(content) {
    const sections = content.split(/# ========== (.+?) ==========/).filter(s => s.trim());

    const result = {
        zodiacPair: {},
        romance: {},
        business: {},
        metadata: {
            updatedAt: new Date().toISOString(),
            version: 2,
            dataQuality: 'complete',
            structure: 'gender-specific'
        }
    };

    // Process each gender combination section
    for (let i = 0; i < sections.length; i += 2) {
        if (i + 1 >= sections.length) break;

        const genderCombo = sections[i].trim().toLowerCase();
        const sectionContent = sections[i + 1];

        // Parse pairing information (only once)
        if (!result.zodiacPair.zodiac1) {
            const pairingInfo = extractPairingInfo(sectionContent);
            result.zodiacPair = pairingInfo;
        }

        // Parse romance section
        result.romance[genderCombo] = parseRomanceSection(sectionContent);

        // Parse business section
        result.business[genderCombo] = parseBusinessSection(sectionContent);
    }

    return result;
}

// Extract pairing information
function extractPairingInfo(content) {
    const zodiac1Match = content.match(/\*\*Zodiac 1:\*\* (.+?)(?:\(|$)/m);
    const zodiac2Match = content.match(/\*\*Zodiac 2:\*\* (.+?)(?:\(|$)/m);

    const zodiac1 = zodiac1Match ? zodiac1Match[1].trim() : '';
    const zodiac2 = zodiac2Match ? zodiac2Match[1].trim() : '';

    return {
        zodiac1,
        zodiac2,
        pairName: `${zodiac1} & ${zodiac2}`
    };
}

// Parse romance section
function parseRomanceSection(content) {
    const romanceMatch = content.match(/## Romance Compatibility Analysis([\s\S]*?)(?=## Business Compatibility Analysis|$)/);
    if (!romanceMatch) return null;

    const romanceContent = romanceMatch[1];

    return {
        free: parseFreeContent(romanceContent, 'romance'),
        premium: parsePremiumContent(romanceContent, 'romance')
    };
}

// Parse business section
function parseBusinessSection(content) {
    const businessMatch = content.match(/## Business Compatibility Analysis([\s\S]*?)$/);
    if (!businessMatch) return null;

    const businessContent = businessMatch[1];

    return {
        free: parseFreeContent(businessContent, 'business'),
        premium: parsePremiumContent(businessContent, 'business')
    };
}

// Parse free content
function parseFreeContent(content, type) {
    const overviewMatch = content.match(/### Overall (?:Romantic|Business) Assessment[\s\S]*?#### Content\s+([\s\S]*?)(?=####|$)/);
    const scoreMatch = content.match(/##### Matching Score\s+(\d+)/);
    const ratingMatch = content.match(/##### Rating\s+(.+)/);

    const quickOverview = overviewMatch ? overviewMatch[1].trim() : '';
    const matchingScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
    const rating = ratingMatch ? ratingMatch[1].trim() : '';

    // Parse compatibility tags
    const compatibilityTags = [];
    const tagPattern = /##### (.+?)\s+\*\*Status:\*\* (.+)/g;
    let tagMatch;

    while ((tagMatch = tagPattern.exec(content)) !== null) {
        compatibilityTags.push({
            tag: tagMatch[1].trim(),
            status: tagMatch[2].trim()
        });
    }

    return {
        matchingScore,
        rating,
        quickOverview,
        compatibilityTags: compatibilityTags.slice(0, 3) // Only first 3
    };
}

// Parse premium content
function parsePremiumContent(content, type) {
    const premium = {};

    // Define section mappings
    const sections = type === 'romance' ? [
        { key: 'emotionalCompatibility', title: 'Emotional Compatibility' },
        { key: 'intellectualAlignment', title: 'Intellectual Alignment' },
        { key: 'longTermPotential', title: 'Long-term Potential' }
    ] : [
        { key: 'workStyleCompatibility', title: 'Work Style Compatibility' },
        { key: 'leadershipDynamics', title: 'Leadership Dynamics' },
        { key: 'financialAlignment', title: 'Financial Alignment' }
    ];

    // Parse main sections
    sections.forEach(({ key, title }) => {
        premium[key] = parsePremiumSection(content, title);
    });

    // Parse Others sections
    premium.others1 = parsePremiumSection(content, 'Others 1') || {
        title: 'Others1',
        score: 0,
        highlights: ['Under development', 'Coming soon', 'Stay tuned'],
        content: 'On Construction'
    };

    premium.others2 = parsePremiumSection(content, 'Others 2') || {
        title: 'Others2',
        score: 0,
        highlights: ['Under development', 'Coming soon', 'Stay tuned'],
        content: 'On Construction'
    };

    // Parse conflicts/challenges
    const conflictType = type === 'romance' ? 'Potential Challenges & Solutions' : 'Business Challenges & Solutions';
    premium.conflicts = parseConflicts(content, conflictType);

    return premium;
}

// Parse individual premium section
function parsePremiumSection(content, sectionTitle) {
    const pattern = new RegExp(`#### ${sectionTitle}[\\s\\S]*?##### Score\\s+(\\d+)[\\s\\S]*?##### Highlights\\s+([\\s\\S]*?)(?=##### Content)[\\s\\S]*?##### Content\\s+([\\s\\S]*?)(?=---|####|$)`, 'i');
    const match = content.match(pattern);

    if (!match) return null;

    const score = parseInt(match[1]);
    const highlightsText = match[2];
    const contentText = match[3].trim();

    // Parse highlights
    const highlights = highlightsText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3);

    return {
        title: sectionTitle,
        score,
        highlights,
        content: contentText
    };
}

// Parse conflicts/challenges
function parseConflicts(content, sectionType) {
    const conflicts = [];
    const conflictPattern = /#### (?:Conflict|Challenge) \d+: (.+?)\s+##### Severity\s+(\d+)\s+##### Description\s+([\s\S]*?)(?=##### Resolution)[\s\S]*?##### Resolution\s+([\s\S]*?)(?=---|####|$)/g;

    let match;
    while ((match = conflictPattern.exec(content)) !== null) {
        conflicts.push({
            type: match[1].trim(),
            severity: parseInt(match[2]),
            description: match[3].trim(),
            resolution: match[4].trim()
        });
    }

    // Ensure we have exactly 5 conflicts
    while (conflicts.length < 5) {
        conflicts.push({
            type: `Others${conflicts.length - 2}`,
            severity: 0,
            description: 'On Construction',
            resolution: 'On Construction'
        });
    }

    return conflicts.slice(0, 5);
}

// Update stats display
function updateStats(jsonData) {
    const zodiacPair = jsonData.zodiacPair;
    document.getElementById('statZodiacPair').textContent = zodiacPair.pairName || '-';

    const genderCombos = Object.keys(jsonData.romance).length;
    document.getElementById('statGenderCombos').textContent = genderCombos;

    // Get average romance score
    const romanceScores = Object.values(jsonData.romance)
        .filter(r => r && r.free)
        .map(r => r.free.matchingScore);
    const avgRomance = romanceScores.length > 0
        ? Math.round(romanceScores.reduce((a, b) => a + b, 0) / romanceScores.length)
        : 0;
    document.getElementById('statRomanceScore').textContent = avgRomance;

    // Get average business score
    const businessScores = Object.values(jsonData.business)
        .filter(b => b && b.free)
        .map(b => b.free.matchingScore);
    const avgBusiness = businessScores.length > 0
        ? Math.round(businessScores.reduce((a, b) => a + b, 0) / businessScores.length)
        : 0;
    document.getElementById('statBusinessScore').textContent = avgBusiness;
}

// Update to database
window.updateDatabase = async function () {
    if (!state.jsonData) {
        showMessage('No JSON data to update', 'error');
        return;
    }

    showLoading(true);

    try {
        const { zodiac1, zodiac2 } = state.jsonData.zodiacPair;

        // Generate document ID (alphabetically sorted)
        const docId = [zodiac1, zodiac2].sort().join('-');

        // Reference to the document
        const docRef = doc(db, 'zodiac-compatibility', docId);

        // Check if document exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Merge with existing data
            const existingData = docSnap.data();
            const mergedData = {
                ...existingData,
                zodiacPair: state.jsonData.zodiacPair,
                romance: {
                    ...existingData.romance,
                    ...state.jsonData.romance
                },
                business: {
                    ...existingData.business,
                    ...state.jsonData.business
                },
                metadata: {
                    ...existingData.metadata,
                    updatedAt: new Date().toISOString(),
                    version: (existingData.metadata?.version || 1) + 1
                }
            };

            await setDoc(docRef, mergedData);
            showMessage(`Successfully updated existing document: ${docId}`, 'success');
        } else {
            // Create new document
            const newData = {
                ...state.jsonData,
                metadata: {
                    ...state.jsonData.metadata,
                    createdAt: new Date().toISOString()
                }
            };

            await setDoc(docRef, newData);
            showMessage(`Successfully created new document: ${docId}`, 'success');
        }

        // Reset form after successful update
        setTimeout(() => {
            if (confirm('Data updated successfully! Do you want to reset the form for a new import?')) {
                location.reload();
            }
        }, 2000);

    } catch (error) {
        showMessage('Error updating database: ' + error.message, 'error');
        console.error('Database error:', error);
    } finally {
        showLoading(false);
    }
};

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type} show`;

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    messageDiv.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;

    container.innerHTML = '';
    container.appendChild(messageDiv);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Show/hide loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}
