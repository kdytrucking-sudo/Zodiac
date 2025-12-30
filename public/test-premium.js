// Test script for Premium functionality
// Run this in browser console on the matching page

console.log('🧪 Premium Functionality Test Script Loaded');

// Test 1: Check current state
function testCurrentState() {
    console.log('📊 Current State:');
    console.log('- User:', window.matchingState.user?.email || 'Not logged in');
    console.log('- Is Premium:', window.matchingState.isPremium);
    console.log('- Match Type:', window.matchingState.matchType);
    console.log('- Person A:', window.matchingState.personA);
    console.log('- Person B:', window.matchingState.personB);
    console.log('- Current Data:', window.matchingState.currentData ? 'Loaded' : 'Not loaded');
}

// Test 2: Simulate premium user
function testAsPremium() {
    console.log('✅ Simulating Premium User...');
    window.matchingState.isPremium = true;

    // Remove locked classes
    document.querySelectorAll('.premium-locked').forEach(el => {
        el.classList.remove('premium-locked');
    });

    // Hide unlock buttons
    document.querySelectorAll('.btn-unlock-main').forEach(btn => {
        btn.style.display = 'none';
    });

    console.log('✅ Premium mode activated');
    console.log('- All content should be unlocked');
    console.log('- No lock icons should be visible');
    console.log('- Unlock buttons should be hidden');
}

// Test 3: Simulate free user
function testAsFree() {
    console.log('🔒 Simulating Free User...');
    window.matchingState.isPremium = false;

    // Add locked classes
    document.querySelectorAll('.detailed-analysis-card, .conflict-analysis-card').forEach(el => {
        el.classList.add('premium-locked');
    });

    // Show unlock buttons
    document.querySelectorAll('.btn-unlock-main').forEach(btn => {
        btn.style.display = 'flex';
    });

    console.log('🔒 Free mode activated');
    console.log('- Premium content should be locked');
    console.log('- Lock icons should be visible');
    console.log('- Unlock buttons should be shown');
}

// Test 4: Test data loading
async function testDataLoading() {
    console.log('📥 Testing data loading...');

    const testPairs = [
        { zodiac1: 'Rabbit', zodiac2: 'Snake' },
        { zodiac1: 'Dragon', zodiac2: 'Dragon' },
        { zodiac1: 'Rat', zodiac2: 'Ox' }
    ];

    for (const pair of testPairs) {
        window.matchingState.personA.zodiac = pair.zodiac1;
        window.matchingState.personB.zodiac = pair.zodiac2;

        console.log(`Testing ${pair.zodiac1} & ${pair.zodiac2}...`);
        await window.analyzeCompatibility();

        if (window.matchingState.currentData) {
            console.log(`✅ ${pair.zodiac1}-${pair.zodiac2}: Data loaded successfully`);
        } else {
            console.log(`❌ ${pair.zodiac1}-${pair.zodiac2}: Failed to load data`);
        }
    }
}

// Test 5: Check premium content structure
function testPremiumStructure() {
    console.log('🔍 Checking Premium Content Structure...');

    const data = window.matchingState.currentData;
    if (!data) {
        console.log('❌ No data loaded. Run analyzeCompatibility() first.');
        return;
    }

    const matchType = window.matchingState.matchType;
    const premium = data[matchType]?.premium;

    if (!premium) {
        console.log('❌ No premium data found');
        return;
    }

    console.log('✅ Premium sections:');
    console.log('- emotionalCompatibility:', !!premium.emotionalCompatibility);
    console.log('- intellectualAlignment:', !!premium.intellectualAlignment);
    console.log('- longTermPotential:', !!premium.longTermPotential);
    console.log('- others1:', !!premium.others1);
    console.log('- others2:', !!premium.others2);
    console.log('- conflicts:', premium.conflicts?.length || 0, 'items');

    if (premium.conflicts) {
        console.log('\n📋 Conflicts:');
        premium.conflicts.forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.type} (${c.severity}%)`);
        });
    }
}

// Test 6: UI Elements Check
function testUIElements() {
    console.log('🎨 Checking UI Elements...');

    const elements = {
        'Score Number': document.querySelector('.score-number'),
        'Score Label': document.querySelector('.score-label'),
        'Score Fill': document.querySelector('.score-fill'),
        'Overview Text': document.querySelector('.score-description p'),
        'Tags Container': document.querySelector('.compatibility-tags'),
        'Pair Display': document.querySelector('.zodiac-pair-display'),
        'Detailed Analysis Card': document.querySelector('.detailed-analysis-card'),
        'Conflict Analysis Card': document.querySelector('.conflict-analysis-card'),
        'Unlock Buttons': document.querySelectorAll('.btn-unlock-main')
    };

    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            if (element.length !== undefined) {
                console.log(`✅ ${name}: ${element.length} found`);
            } else {
                console.log(`✅ ${name}: Found`);
            }
        } else {
            console.log(`❌ ${name}: Not found`);
        }
    });
}

// Test 7: Full integration test
async function runFullTest() {
    console.log('🚀 Running Full Integration Test...\n');

    console.log('1️⃣ Checking current state...');
    testCurrentState();

    console.log('\n2️⃣ Checking UI elements...');
    testUIElements();

    console.log('\n3️⃣ Testing as free user...');
    testAsFree();
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n4️⃣ Testing as premium user...');
    testAsPremium();
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n5️⃣ Testing data loading...');
    await testDataLoading();

    console.log('\n6️⃣ Checking premium structure...');
    testPremiumStructure();

    console.log('\n✅ Full test complete!');
}

// Export test functions
window.premiumTests = {
    checkState: testCurrentState,
    asPremium: testAsPremium,
    asFree: testAsFree,
    loadData: testDataLoading,
    checkStructure: testPremiumStructure,
    checkUI: testUIElements,
    runAll: runFullTest
};

console.log('\n📚 Available test functions:');
console.log('- premiumTests.checkState()     - Check current state');
console.log('- premiumTests.asPremium()      - Simulate premium user');
console.log('- premiumTests.asFree()         - Simulate free user');
console.log('- premiumTests.loadData()       - Test data loading');
console.log('- premiumTests.checkStructure() - Check premium data structure');
console.log('- premiumTests.checkUI()        - Check UI elements');
console.log('- premiumTests.runAll()         - Run all tests');
console.log('\n💡 Quick start: premiumTests.runAll()');
