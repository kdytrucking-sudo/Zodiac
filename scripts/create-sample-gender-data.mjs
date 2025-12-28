/**
 * Create high-quality sample gender-specific data for Rat-Rat and Rabbit-Snake pairings
 * This script creates detailed, realistic content for all 6 gender combinations
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

/**
 * High-quality gender-specific data for Rat-Rat pairing
 */
const ratRatGenderData = {
    'male-male': {
        romance: {
            score: 68,
            rating: 'Good',
            summary: 'Two male Rats create an intellectually stimulating partnership with strong mutual understanding. Their shared ambition and quick wit make for engaging companionship, though competitive tendencies may require conscious management.',
            detailedAnalysis: 'When two male Rats come together romantically, they form a relationship built on intellectual connection and shared ambitions. Both partners are naturally charming, intelligent, and socially adept, which creates a strong foundation of mutual respect. They understand each other\'s drive for success and security, rarely needing to explain their motivations. However, the competitive nature that serves them well professionally can sometimes spill into the relationship, creating unnecessary tension. Both may struggle with vulnerability, preferring to maintain a strong exterior even with their partner. The key to success lies in consciously choosing collaboration over competition and creating a safe space for emotional openness. When they achieve this balance, two male Rats can build a powerful partnership that supports both individual and shared goals.',
            highlights: [
                'Strong intellectual connection and stimulating conversations',
                'Mutual understanding of ambition and career goals',
                'Excellent problem-solving as a team',
                'Shared social skills create a vibrant social life'
            ],
            challenges: [
                'Competitive tendencies may create relationship tension',
                'Both may struggle with emotional vulnerability',
                'Risk of prioritizing career over relationship'
            ],
            advice: 'Focus on being teammates rather than competitors. Schedule regular quality time that isn\'t about achievements or goals. Practice emotional openness and vulnerability with each other, creating a safe space where both can let their guard down. Celebrate each other\'s successes genuinely and support each other through setbacks.'
        },
        business: {
            score: 85,
            rating: 'Excellent',
            summary: 'Two male Rats in business create a powerhouse partnership. Their combined intelligence, resourcefulness, and networking abilities make them formidable in any industry, though clear role definition is essential.',
            detailedAnalysis: 'In business, two male Rats are exceptionally well-matched. Both bring sharp analytical minds, excellent networking skills, and a natural ability to spot opportunities. They work well under pressure and are adept at navigating complex business situations. Their shared understanding of risk and reward means they rarely disagree on fundamental business strategy. However, both being natural leaders, power dynamics must be carefully managed. The partnership thrives when they divide responsibilities clearly—perhaps one focusing on external relations while the other manages operations, or splitting by product lines or geographic regions. Their combined resourcefulness means they can overcome almost any business challenge, and their loyalty to the partnership (once committed) is strong. The main risk is that both may be tempted by outside opportunities if they feel undervalued or constrained.',
            highlights: [
                'Exceptional combined intelligence and analytical ability',
                'Superior networking and relationship-building skills',
                'Quick adaptation to market changes',
                'Strong problem-solving under pressure'
            ],
            challenges: [
                'Power struggles if roles aren\'t clearly defined',
                'Both may be tempted by outside opportunities',
                'Need to balance individual ambition with partnership goals'
            ],
            advice: 'Establish clear areas of authority from the start. Create a partnership agreement that addresses decision-making, profit-sharing, and exit strategies. Play to each other\'s strengths rather than competing. Regular strategic meetings can ensure alignment and address any brewing tensions before they become problems.'
        }
    },

    'male-female': {
        romance: {
            score: 75,
            rating: 'Good',
            summary: 'A male and female Rat pairing combines intellectual compatibility with complementary approaches to life. Their shared values and mutual respect create a solid foundation, with traditional gender dynamics potentially reducing competitive tension.',
            detailedAnalysis: 'The male-female Rat pairing often benefits from complementary approaches to their shared characteristics. Both are intelligent, ambitious, and value security, but they may express these traits differently based on their socialization and personal preferences. The male Rat might focus more on external achievement and providing material security, while the female Rat might balance career ambition with relationship nurturing, though these roles are flexible and modern couples often share responsibilities more equally. What matters most is that they respect each other\'s contributions and support each other\'s goals. This pairing tends to have less competitive tension than same-gender Rat pairings, as they\'re less likely to directly compare themselves. They make excellent partners in building a comfortable, secure life together, with both contributing their intelligence and resourcefulness to shared goals.',
            highlights: [
                'Strong intellectual and emotional compatibility',
                'Complementary approaches to shared goals',
                'Reduced competitive tension compared to same-gender pairings',
                'Excellent teamwork in building security and comfort'
            ],
            challenges: [
                'Both may struggle with emotional expression',
                'Shared anxiety can amplify rather than soothe',
                'May prioritize material success over emotional connection'
            ],
            advice: 'Make emotional intimacy a priority alongside material goals. Take turns being the optimist when one is worried. Support each other\'s individual ambitions while maintaining shared goals. Create rituals that foster emotional connection beyond practical partnership.'
        },
        business: {
            score: 82,
            rating: 'Excellent',
            summary: 'Male and female Rats in business create a balanced, effective partnership. Their combined skills and different perspectives enhance decision-making, while mutual respect prevents gender-based conflicts.',
            detailedAnalysis: 'In business, a male-female Rat partnership combines the best of both partners\' abilities while benefiting from diverse perspectives. Both bring intelligence, resourcefulness, and business acumen to the table. They may approach problems from slightly different angles, which enhances their collective problem-solving ability. In modern business environments, they can leverage their partnership to appeal to diverse clients and stakeholders. The key is ensuring both partners have equal authority and respect, avoiding any traditional gender-based power imbalances. When they achieve this equality, they create a dynamic partnership that\'s both strategic and adaptable. Their combined networking abilities are particularly powerful, as they can connect with a wider range of people and build diverse business relationships.',
            highlights: [
                'Diverse perspectives enhance decision-making',
                'Combined networking reaches broader audiences',
                'Balanced approach to risk and opportunity',
                'Strong mutual respect and equal partnership'
            ],
            challenges: [
                'Must actively ensure equal authority and respect',
                'External gender biases may affect business interactions',
                'Need to present united front despite different styles'
            ],
            advice: 'Establish clear equality in decision-making and authority from the start. Support each other in external business situations, especially if gender biases arise. Leverage your different perspectives as a strength. Maintain open communication about any concerns regarding respect or authority in the partnership.'
        }
    },

    'male-others': {
        romance: {
            score: 72,
            rating: 'Good',
            summary: 'A male Rat with a non-binary Rat partner creates a relationship that challenges traditional dynamics while maintaining the strong intellectual connection characteristic of Rat pairings.',
            detailedAnalysis: 'This pairing brings together the Rat\'s natural intelligence and adaptability with the opportunity to create a relationship free from traditional gender expectations. The male Rat may need to examine and potentially unlearn some traditional masculine conditioning, while the non-binary Rat brings a fresh perspective on relationship dynamics. Both partners benefit from the freedom to express themselves authentically without rigid gender roles. The intellectual connection remains strong, as both share the Rat\'s quick wit and analytical mind. Success in this relationship requires open communication about needs, expectations, and boundaries, as well as mutual respect for each other\'s gender identity and expression. When both partners embrace this opportunity for authentic connection, they can create a uniquely fulfilling relationship.',
            highlights: [
                'Freedom from traditional gender role expectations',
                'Opportunity for authentic self-expression',
                'Strong intellectual and emotional connection',
                'Mutual growth through challenging assumptions'
            ],
            challenges: [
                'Navigating external social expectations and biases',
                'Requires conscious communication about needs and boundaries',
                'May face unique relationship challenges without traditional templates'
            ],
            advice: 'Communicate openly and frequently about your needs, boundaries, and expectations. Create your own relationship template rather than following traditional models. Support each other in external situations where gender biases may arise. Celebrate the freedom and authenticity your partnership allows.'
        },
        business: {
            score: 78,
            rating: 'Good',
            summary: 'In business, a male and non-binary Rat partnership combines traditional business acumen with innovative perspectives, creating a modern, adaptive business approach.',
            detailedAnalysis: 'This business partnership benefits from combining different perspectives and approaches. The male Rat may bring more traditional business experience and networks, while the non-binary Rat often brings fresh, innovative thinking and connection to diverse communities. Together, they can create a business that appeals to both traditional and progressive markets. The key is ensuring equal respect and authority regardless of gender identity, and leveraging each partner\'s unique strengths and perspectives. This partnership can be particularly effective in modern, progressive industries where diversity and innovation are valued. Both partners should be prepared to educate clients or stakeholders about their partnership dynamic if needed, presenting a united, professional front.',
            highlights: [
                'Diverse perspectives drive innovation',
                'Appeal to both traditional and progressive markets',
                'Combined networks reach varied communities',
                'Modern, adaptive business approach'
            ],
            challenges: [
                'May face external biases or misunderstandings',
                'Requires clear communication about roles and authority',
                'Need to navigate traditional business environments together'
            ],
            advice: 'Establish clear, equal partnership from the start. Leverage your diverse perspectives as a competitive advantage. Support each other when facing external biases. Focus on results and professionalism to overcome any skepticism about your partnership dynamic.'
        }
    },

    'female-female': {
        romance: {
            score: 77,
            rating: 'Good',
            summary: 'Two female Rats create a relationship with strong emotional intelligence and mutual understanding. Their shared experiences and intuitive connection enhance the natural Rat compatibility.',
            detailedAnalysis: 'When two female Rats come together, they often create a relationship with exceptional emotional depth and understanding. While maintaining the intellectual connection characteristic of all Rat pairings, they may be more comfortable with emotional vulnerability and expression than their male counterparts. Both partners understand the unique challenges and experiences of being female, which creates an additional layer of empathy and support. They excel at creating a warm, comfortable home environment while both pursuing their ambitions. The competitive tendencies that can plague Rat relationships may manifest more subtly here, perhaps as comparison or jealousy rather than overt competition. The key is celebrating each other\'s successes genuinely and supporting each other through challenges. When they achieve this, two female Rats create a powerful, nurturing partnership that supports both emotional fulfillment and practical success.',
            highlights: [
                'Deep emotional understanding and connection',
                'Strong mutual support and empathy',
                'Excellent communication and emotional expression',
                'Shared experiences create additional bonding'
            ],
            challenges: [
                'Subtle competition or comparison may arise',
                'Shared anxiety may amplify without external balance',
                'May struggle with decision-making if both are overly cautious'
            ],
            advice: 'Celebrate each other\'s successes without comparison or jealousy. Take turns being the optimist and decision-maker. Create space for both emotional connection and individual growth. Support each other\'s ambitions while maintaining your strong partnership bond.'
        },
        business: {
            score: 80,
            rating: 'Very Good',
            summary: 'Two female Rats in business combine sharp intelligence with strong collaborative skills. Their partnership excels in relationship-based industries and creates a supportive, effective work environment.',
            detailedAnalysis: 'In business, two female Rats create a partnership that\'s both strategically sound and emotionally intelligent. They bring the Rat\'s natural business acumen while often excelling at building and maintaining client relationships. Their collaborative approach means they work well together, making decisions through discussion and consensus rather than power struggles. They\'re particularly effective in industries that value relationships, communication, and emotional intelligence alongside traditional business skills. However, they must be prepared to advocate for themselves in male-dominated industries and ensure they\'re not underestimated or overlooked. Their combined strength is formidable when they present a united, confident front. They should also guard against being overly cautious in decision-making, as two Rats can amplify each other\'s risk-aversion.',
            highlights: [
                'Excellent relationship-building and client management',
                'Strong collaborative decision-making',
                'Emotional intelligence enhances business interactions',
                'Supportive, effective partnership dynamic'
            ],
            challenges: [
                'May face gender biases in some industries',
                'Shared risk-aversion may limit growth opportunities',
                'Need to balance collaboration with decisive action'
            ],
            advice: 'Support each other in advocating for your business and yourselves. Balance your natural caution with calculated risk-taking. Leverage your relationship skills as a competitive advantage. Present a united, confident front in all business situations.'
        }
    },

    'female-others': {
        romance: {
            score: 74,
            rating: 'Good',
            summary: 'A female Rat with a non-binary Rat partner creates a relationship that combines emotional depth with freedom from traditional expectations, allowing both partners to express themselves authentically.',
            detailedAnalysis: 'This pairing offers the opportunity for a deeply authentic relationship. The female Rat may bring emotional intelligence and relationship skills, while the non-binary Rat contributes fresh perspectives on gender and relationships. Together, they can create a partnership that honors both partners\' authentic selves without rigid role expectations. The intellectual connection remains strong, enhanced by their different perspectives and experiences. Both partners benefit from examining and potentially releasing traditional gender expectations, creating space for genuine connection based on who they truly are rather than societal roles. Success requires open communication, mutual respect for each other\'s gender identity and expression, and willingness to create their own relationship template rather than following traditional models.',
            highlights: [
                'Authentic self-expression without rigid roles',
                'Deep emotional and intellectual connection',
                'Mutual growth and learning',
                'Freedom to create unique relationship dynamic'
            ],
            challenges: [
                'Navigating external expectations and potential biases',
                'Requires conscious communication about needs',
                'Creating relationship template without traditional models'
            ],
            advice: 'Communicate openly about your needs, boundaries, and expectations. Support each other in being authentic. Create your own relationship traditions and dynamics. Stand together when facing external biases or misunderstanding.'
        },
        business: {
            score: 79,
            rating: 'Good',
            summary: 'In business, a female and non-binary Rat partnership brings diverse perspectives and modern sensibilities, creating an innovative and inclusive business approach.',
            detailedAnalysis: 'This business partnership combines different perspectives and experiences to create a modern, inclusive business. The female Rat may bring strong relationship skills and emotional intelligence, while the non-binary Rat often contributes innovative thinking and connection to diverse communities. Together, they can create a business that values both traditional excellence and progressive values. They\'re particularly well-suited for industries that value diversity, innovation, and social consciousness. The partnership requires clear communication about roles, authority, and decision-making, ensuring both partners feel equally valued and respected. When they achieve this balance, they create a business that\'s both successful and aligned with contemporary values.',
            highlights: [
                'Diverse perspectives drive innovation',
                'Strong connection to varied communities and markets',
                'Modern, inclusive business approach',
                'Combined emotional intelligence and fresh thinking'
            ],
            challenges: [
                'May face external biases or misunderstandings',
                'Requires clear role definition and equal authority',
                'Navigating traditional business environments together'
            ],
            advice: 'Establish equal partnership and clear roles from the start. Leverage your diverse perspectives as strengths. Support each other when facing biases. Focus on results and professionalism to build credibility.'
        }
    },

    'others-others': {
        romance: {
            score: 73,
            rating: 'Good',
            summary: 'Two non-binary Rats create a relationship with exceptional freedom and authenticity. Their shared understanding of gender complexity enhances the natural Rat intellectual connection.',
            detailedAnalysis: 'When two non-binary Rats come together, they create a relationship with unique potential for authenticity and freedom from traditional constraints. Both partners understand the complexity of gender identity and the importance of being seen and accepted for who they truly are. This shared understanding creates a foundation of deep empathy and acceptance. The intellectual connection characteristic of Rat pairings is enhanced by their willingness to question assumptions and create their own path. They have the freedom to define their relationship entirely on their own terms, without pressure to conform to traditional gender roles or expectations. Success requires excellent communication, as they\'re creating their own template rather than following established patterns. When both partners commit to this authentic, intentional approach, they can create a deeply fulfilling partnership.',
            highlights: [
                'Complete freedom from traditional gender role expectations',
                'Deep mutual understanding and acceptance',
                'Opportunity for fully authentic self-expression',
                'Strong intellectual and emotional connection'
            ],
            challenges: [
                'Creating relationship template without traditional models',
                'Navigating external misunderstanding or bias',
                'Requires exceptional communication and intentionality'
            ],
            advice: 'Communicate frequently and openly about your needs and boundaries. Create your own relationship traditions and dynamics. Support each other in being authentic. Build community with others who understand and support your relationship. Celebrate the freedom and authenticity your partnership allows.'
        },
        business: {
            score: 77,
            rating: 'Good',
            summary: 'Two non-binary Rats in business create an innovative, progressive partnership. Their combined fresh perspectives and freedom from traditional constraints can lead to unique business success.',
            detailedAnalysis: 'In business, two non-binary Rats bring exceptional innovation and modern thinking. Both partners are likely comfortable questioning traditional business assumptions and creating new approaches. They can build a business that reflects contemporary values around diversity, inclusion, and innovation. Their combined intelligence and resourcefulness, enhanced by their willingness to think outside traditional boxes, can lead to unique business opportunities. They\'re particularly well-suited for progressive industries, creative fields, or businesses serving diverse communities. The partnership requires clear communication about roles, decision-making, and authority, as they\'re creating their own business dynamic rather than following traditional partnership models. When they leverage their unique perspectives and modern approach, they can create a business that\'s both successful and aligned with their values.',
            highlights: [
                'Exceptional innovation and fresh thinking',
                'Freedom from traditional business constraints',
                'Strong appeal to progressive, diverse markets',
                'Combined intelligence and modern perspectives'
            ],
            challenges: [
                'May face biases in traditional business environments',
                'Creating partnership template without traditional models',
                'Requires clear communication about roles and authority'
            ],
            advice: 'Establish clear, equal partnership from the start. Leverage your unique perspectives as competitive advantages. Build networks in progressive business communities. Focus on results and innovation to overcome any skepticism. Support each other when facing external biases.'
        }
    }
};

/**
 * High-quality gender-specific data for Rabbit-Snake pairing
 */
const rabbitSnakeGenderData = {
    'male-male': {
        romance: {
            score: 86,
            rating: 'Excellent',
            summary: 'Two males in a Rabbit-Snake pairing create a relationship of quiet strength and deep understanding. Their shared preference for peace and thoughtfulness creates a harmonious, intellectually rich partnership.',
            detailedAnalysis: 'When a male Rabbit and male Snake come together, they create a relationship characterized by depth, intelligence, and mutual respect. Both value peace, privacy, and meaningful connection over superficial socializing. The Rabbit brings warmth and social grace, helping the Snake navigate social situations with more ease, while the Snake provides wisdom and strategic thinking that grounds the Rabbit\'s sometimes idealistic nature. In this gender combination, both partners may be more comfortable with emotional reserve, which can create a peaceful relationship but may also mean they need to consciously work on emotional expression and vulnerability. They excel at creating a beautiful, comfortable home environment and enjoy intellectual pursuits together. The relationship deepens over time as both partners slowly reveal their inner worlds to each other.',
            highlights: [
                'Deep intellectual and emotional connection',
                'Shared appreciation for peace and privacy',
                'Mutual respect and admiration',
                'Harmonious home life and shared interests'
            ],
            challenges: [
                'Both may struggle with emotional expression',
                'Decision-making can be slow with two cautious partners',
                'May become too insular without outside connections'
            ],
            advice: 'Make conscious effort to express emotions verbally, not just through actions. Set decision-making timelines to avoid analysis paralysis. Maintain some outside friendships and activities to bring fresh energy to the relationship. Create rituals that encourage emotional sharing.'
        },
        business: {
            score: 80,
            rating: 'Very Good',
            summary: 'Male Rabbit and Snake in business create a sophisticated, strategic partnership. The Rabbit\'s networking skills combined with the Snake\'s analytical mind make them formidable in professional settings.',
            detailedAnalysis: 'In business, a male Rabbit-Snake partnership combines complementary strengths effectively. The Rabbit excels at building relationships, creating positive work environments, and representing the business publicly. The Snake provides strategic vision, careful analysis, and long-term planning. This gender combination often works well in professional settings, as both partners may be comfortable with traditional business approaches while bringing their unique zodiac strengths. The Rabbit handles client relations and team management, while the Snake focuses on strategy and operations. They make decisions carefully and thoughtfully, which prevents reckless mistakes but may mean they miss some time-sensitive opportunities. Their combined intelligence and professionalism create a business that\'s both successful and respected.',
            highlights: [
                'Complementary professional skills',
                'Strong client relationships and strategic planning',
                'Professional, respected business approach',
                'Careful decision-making prevents major errors'
            ],
            challenges: [
                'May be too cautious and miss opportunities',
                'Both prefer to avoid conflict, which can delay necessary confrontations',
                'Need to balance relationship focus with profitability'
            ],
            advice: 'Set decision-making deadlines to balance caution with timeliness. Designate one partner to handle necessary confrontations. Create metrics to ensure relationship-building translates to profitability. Challenge each other to take calculated risks occasionally.'
        }
    },

    'male-female': {
        romance: {
            score: 90,
            rating: 'Perfect',
            summary: 'Male Rabbit with female Snake (or vice versa) creates a classic, harmonious pairing. Their complementary energies and mutual respect make this one of the most successful zodiac combinations.',
            detailedAnalysis: 'The male-female Rabbit-Snake pairing is often considered ideal in traditional Chinese zodiac compatibility. Whether the Rabbit is male and Snake female, or vice versa, the combination brings beautiful balance. The Rabbit\'s gentle, nurturing energy complements the Snake\'s wisdom and depth. The Rabbit provides emotional warmth and social connection, while the Snake offers security and strategic thinking. In traditional dynamics, a male Rabbit with female Snake creates a relationship where his diplomatic charm balances her intensity, while she provides the depth and wisdom he admires. Reversed, a female Rabbit with male Snake brings her warmth to soften his reserve, while he provides the security and wisdom she values. Modern couples in this pairing often blend these energies more fluidly, but the fundamental compatibility remains exceptional. Both partners feel truly seen and valued by the other.',
            highlights: [
                'Exceptional emotional and intellectual compatibility',
                'Complementary energies create perfect balance',
                'Deep mutual respect and admiration',
                'Relationship improves with time and shared experiences'
            ],
            challenges: [
                'Different communication styles require patience',
                'Decision-making speed differences can cause friction',
                'Rabbit needs more verbal affection than Snake naturally gives'
            ],
            advice: 'Snake should make effort to verbalize feelings regularly. Rabbit should recognize and appreciate Snake\'s non-verbal expressions of love. Create decision-making framework that honors both styles. Maintain individual interests while building shared life together.'
        },
        business: {
            score: 78,
            rating: 'Good',
            summary: 'Male-female Rabbit-Snake business partnerships combine diverse strengths effectively. Their different approaches enhance decision-making and create a well-rounded business.',
            detailedAnalysis: 'In business, a male-female Rabbit-Snake partnership (in either configuration) brings together complementary skills and perspectives. The Rabbit partner excels at relationship-building, team management, and creating positive business culture. The Snake partner provides strategic thinking, careful analysis, and long-term vision. The gender diversity can be an asset, allowing them to connect with and understand a broader range of clients and stakeholders. They must ensure equal authority and respect regardless of gender, avoiding any traditional power imbalances. When they achieve this equality, they create a business that\'s both people-focused and strategically sound. Their different approaches to risk and decision-making can enhance their collective judgment when they learn to value and integrate both perspectives.',
            highlights: [
                'Complementary skills and perspectives',
                'Diverse viewpoints enhance decision-making',
                'Broad appeal to varied clients and stakeholders',
                'Balance of relationship focus and strategic thinking'
            ],
            challenges: [
                'Must actively ensure equal authority and respect',
                'Different paces can cause frustration',
                'Risk tolerance differences require compromise'
            ],
            advice: 'Establish clear equality in partnership from the start. Create decision-making processes that honor both perspectives. Leverage your different approaches as strength. Support each other in external business situations.'
        }
    },

    'male-others': {
        romance: {
            score: 87,
            rating: 'Excellent',
            summary: 'Male Rabbit or Snake with non-binary partner creates a relationship that honors both traditional compatibility and modern authenticity, allowing for deep connection without rigid role expectations.',
            detailedAnalysis: 'This pairing maintains the excellent Rabbit-Snake compatibility while adding the dimension of freedom from traditional gender expectations. Whether the male partner is the Rabbit or Snake, the dynamic benefits from the non-binary partner\'s fresh perspective on relationships and gender. The male partner may need to examine traditional masculine conditioning, while the non-binary partner brings authenticity and willingness to create new relationship templates. The fundamental Rabbit-Snake compatibility—intellectual connection, shared values, complementary strengths—remains strong. Success requires open communication about needs, boundaries, and expectations, as well as mutual respect for each other\'s gender identity. When both partners embrace this opportunity for authentic connection, they create a uniquely fulfilling relationship that honors both zodiac compatibility and individual authenticity.',
            highlights: [
                'Strong zodiac compatibility enhanced by authentic expression',
                'Freedom from rigid gender role expectations',
                'Deep intellectual and emotional connection',
                'Opportunity for mutual growth and learning'
            ],
            challenges: [
                'Navigating external expectations and potential biases',
                'Creating relationship template without traditional models',
                'Requires conscious communication about needs and boundaries'
            ],
            advice: 'Communicate openly about needs, boundaries, and expectations. Honor both zodiac compatibility and individual authenticity. Create your own relationship traditions. Support each other when facing external biases. Celebrate the freedom your partnership allows.'
        },
        business: {
            score: 79,
            rating: 'Good',
            summary: 'Male and non-binary Rabbit-Snake partnership combines traditional business strengths with innovative perspectives, creating a modern, effective business approach.',
            detailedAnalysis: 'In business, this partnership leverages the strong Rabbit-Snake complementarity while benefiting from diverse perspectives. The male partner (whether Rabbit or Snake) may bring more traditional business experience, while the non-binary partner often contributes fresh thinking and connection to diverse communities. Together, they can create a business that appeals to both traditional and progressive markets. The Rabbit\'s relationship skills and Snake\'s strategic thinking remain assets regardless of which partner holds which zodiac sign. The key is ensuring equal respect and authority, and leveraging each partner\'s unique strengths. This partnership can be particularly effective in modern industries where diversity and innovation are valued.',
            highlights: [
                'Strong zodiac complementarity plus diverse perspectives',
                'Appeal to both traditional and progressive markets',
                'Combined traditional strengths and innovative thinking',
                'Modern, inclusive business approach'
            ],
            challenges: [
                'May face external biases or misunderstandings',
                'Requires clear communication about roles and authority',
                'Navigating traditional business environments together'
            ],
            advice: 'Establish clear, equal partnership from the start. Leverage diverse perspectives as competitive advantage. Support each other when facing biases. Focus on results and professionalism to build credibility.'
        }
    },

    'female-female': {
        romance: {
            score: 91,
            rating: 'Perfect',
            summary: 'Two females in a Rabbit-Snake pairing create a relationship of exceptional emotional depth and intuitive understanding. Their compatibility is enhanced by shared experiences and emotional intelligence.',
            detailedAnalysis: 'When a female Rabbit and female Snake come together, they create one of the most emotionally rich and harmonious pairings possible. The excellent zodiac compatibility is enhanced by their comfort with emotional expression and deep intuitive understanding. The Rabbit brings warmth, optimism, and social grace, while the Snake provides wisdom, depth, and unwavering loyalty. Both partners may be more comfortable with vulnerability and emotional sharing than their male counterparts, creating a relationship with exceptional intimacy. They excel at creating a beautiful, nurturing home environment while both pursuing their individual goals. The relationship is characterized by deep conversations, mutual support, and growing emotional connection over time. They understand each other\'s needs often without words, and provide exactly the right kind of support at the right time.',
            highlights: [
                'Exceptional emotional depth and intimacy',
                'Intuitive understanding of each other\'s needs',
                'Strong mutual support and encouragement',
                'Beautiful, nurturing home environment'
            ],
            challenges: [
                'Both may be overly cautious in decision-making',
                'Shared sensitivity can amplify hurts',
                'May become too insular without outside connections'
            ],
            advice: 'Balance emotional depth with practical decision-making. Take turns being the optimist and decision-maker. Maintain individual friendships and interests. Create safe space for addressing hurts before they grow. Celebrate your deep connection while staying engaged with the world.'
        },
        business: {
            score: 77,
            rating: 'Good',
            summary: 'Female Rabbit and Snake in business create a partnership strong in relationships and strategy. Their emotional intelligence and careful planning make them effective, especially in relationship-based industries.',
            detailedAnalysis: 'In business, two females in a Rabbit-Snake partnership combine excellent relationship skills with strategic thinking. The Rabbit excels at building client relationships and creating positive team culture, while the Snake provides careful analysis and long-term planning. Their emotional intelligence enhances all business interactions, from client relations to team management. They work well together through collaboration and consensus, making thoughtful decisions that consider both people and profits. However, they must guard against being overly cautious or avoiding necessary confrontations. They should also be prepared to advocate for themselves in male-dominated industries. When they present a united, confident front and balance their natural caution with calculated risk-taking, they create a successful, values-aligned business.',
            highlights: [
                'Excellent relationship-building and client management',
                'Strong emotional intelligence in business interactions',
                'Collaborative, thoughtful decision-making',
                'Values-aligned business approach'
            ],
            challenges: [
                'May face gender biases in some industries',
                'Shared caution may limit growth opportunities',
                'Both may avoid necessary confrontations'
            ],
            advice: 'Support each other in advocating for your business. Balance caution with calculated risk-taking. Designate one partner to handle confrontations when needed. Leverage relationship skills as competitive advantage. Present united, confident front in all business situations.'
        }
    },

    'female-others': {
        romance: {
            score: 89,
            rating: 'Excellent',
            summary: 'Female Rabbit or Snake with non-binary partner creates a relationship combining emotional depth with authentic self-expression, honoring both strong zodiac compatibility and individual identity.',
            detailedAnalysis: 'This pairing brings together the excellent Rabbit-Snake compatibility with the freedom for authentic self-expression. The female partner (whether Rabbit or Snake) may bring emotional intelligence and relationship skills, while the non-binary partner contributes fresh perspectives on gender and relationships. Together, they create a partnership that honors both partners\' authentic selves. The fundamental compatibility—the Rabbit\'s warmth with the Snake\'s wisdom, their shared values and complementary strengths—remains strong. Both partners benefit from examining traditional gender expectations and creating space for genuine connection based on who they truly are. Success requires open communication, mutual respect for each other\'s gender identity, and willingness to create their own relationship template. The result can be a deeply fulfilling partnership that combines zodiac harmony with personal authenticity.',
            highlights: [
                'Strong zodiac compatibility plus authentic expression',
                'Deep emotional and intellectual connection',
                'Freedom to create unique relationship dynamic',
                'Mutual growth through honoring authentic selves'
            ],
            challenges: [
                'Navigating external expectations and potential biases',
                'Creating relationship template without traditional models',
                'Requires conscious communication about needs'
            ],
            advice: 'Communicate openly about needs, boundaries, and expectations. Honor both zodiac compatibility and individual authenticity. Create your own relationship traditions. Support each other when facing external biases. Celebrate the depth and freedom your partnership allows.'
        },
        business: {
            score: 78,
            rating: 'Good',
            summary: 'Female and non-binary Rabbit-Snake partnership combines relationship excellence with innovative thinking, creating a modern, inclusive business that honors both traditional strengths and contemporary values.',
            detailedAnalysis: 'In business, this partnership leverages the Rabbit-Snake complementarity while benefiting from diverse perspectives. The female partner may bring strong relationship skills and emotional intelligence, while the non-binary partner often contributes innovative thinking and connection to diverse communities. Whether the female is the Rabbit or Snake, the partnership benefits from combining traditional business strengths with modern sensibilities. They can create a business that values both excellence and inclusivity, appealing to diverse markets. The key is ensuring equal respect and authority, clear communication about roles, and leveraging each partner\'s unique strengths. This partnership can be particularly effective in industries that value both relationship skills and innovation.',
            highlights: [
                'Strong relationship skills plus innovative thinking',
                'Appeal to diverse markets and communities',
                'Modern, inclusive business approach',
                'Combined emotional intelligence and fresh perspectives'
            ],
            challenges: [
                'May face external biases or misunderstandings',
                'Requires clear role definition and equal authority',
                'Navigating traditional business environments together'
            ],
            advice: 'Establish equal partnership and clear roles from the start. Leverage diverse perspectives as strengths. Support each other when facing biases. Focus on results and professionalism to build credibility. Create business that reflects your shared values.'
        }
    },

    'others-others': {
        romance: {
            score: 88,
            rating: 'Excellent',
            summary: 'Two non-binary individuals in a Rabbit-Snake pairing create a relationship of exceptional authenticity and freedom. Their strong zodiac compatibility is enhanced by shared understanding of gender complexity.',
            detailedAnalysis: 'When two non-binary individuals come together in a Rabbit-Snake pairing, they create a relationship with unique potential for authenticity and depth. The excellent zodiac compatibility—whether one is Rabbit and one Snake, or they share other zodiac combinations—provides a strong foundation. Both partners understand the complexity of gender identity and the importance of being seen and accepted authentically. This shared understanding creates deep empathy and acceptance. They have complete freedom to define their relationship on their own terms, without pressure to conform to traditional gender roles. The Rabbit\'s warmth and the Snake\'s wisdom combine beautifully regardless of which partner holds which sign. Success requires excellent communication, as they\'re creating their own template. When both partners commit to this authentic, intentional approach, they create a deeply fulfilling partnership that honors both zodiac harmony and personal truth.',
            highlights: [
                'Exceptional authenticity and freedom from constraints',
                'Strong zodiac compatibility plus deep mutual understanding',
                'Complete freedom to define relationship on own terms',
                'Deep intellectual and emotional connection'
            ],
            challenges: [
                'Creating relationship template without traditional models',
                'Navigating external misunderstanding or bias',
                'Requires exceptional communication and intentionality'
            ],
            advice: 'Communicate frequently and openly about needs and boundaries. Create your own relationship traditions and dynamics. Support each other in being authentic. Build community with others who understand. Celebrate the freedom and depth your partnership allows.'
        },
        business: {
            score: 78,
            rating: 'Good',
            summary: 'Two non-binary Rabbit-Snake partners in business create an innovative, values-driven partnership. Their combined fresh perspectives and strong zodiac complementarity can lead to unique business success.',
            detailedAnalysis: 'In business, two non-binary individuals in a Rabbit-Snake partnership bring exceptional innovation and modern thinking. The Rabbit\'s relationship skills and Snake\'s strategic thinking remain valuable regardless of gender identity. Both partners likely feel comfortable questioning traditional business assumptions and creating new approaches. They can build a business that reflects contemporary values around diversity, inclusion, and innovation while maintaining the strategic soundness that comes from their zodiac compatibility. They\'re particularly well-suited for progressive industries, creative fields, or businesses serving diverse communities. The partnership requires clear communication about roles and decision-making, as they\'re creating their own business dynamic. When they leverage their unique perspectives and strong zodiac complementarity, they create a business that\'s both successful and values-aligned.',
            highlights: [
                'Strong zodiac complementarity plus innovative thinking',
                'Freedom from traditional business constraints',
                'Appeal to progressive, diverse markets',
                'Values-driven business approach'
            ],
            challenges: [
                'May face biases in traditional business environments',
                'Creating partnership template without traditional models',
                'Requires clear communication about roles and authority'
            ],
            advice: 'Establish clear, equal partnership from the start. Leverage unique perspectives as competitive advantages. Build networks in progressive business communities. Focus on results and innovation. Support each other when facing external biases.'
        }
    }
};

/**
 * Update a specific pairing with high-quality gender-specific data
 */
async function updatePairingWithGenderData(pairId, genderData) {
    try {
        console.log(`\n📝 Updating ${pairId} with high-quality gender-specific data...`);

        const docRef = doc(db, 'zodiac-compatibility', pairId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`❌ Document ${pairId} does not exist!`);
            return false;
        }

        const existingData = docSnap.data();

        // Update with new gender-specific data
        await setDoc(docRef, {
            ...existingData,
            genderSpecificMatching: genderData,
            metadata: {
                ...existingData.metadata,
                updatedAt: new Date().toISOString(),
                version: 2.0,
                hasGenderSpecificData: true,
                dataQuality: 'high-quality-sample'
            }
        });

        console.log(`✅ Successfully updated ${pairId} with high-quality data`);
        return true;

    } catch (error) {
        console.error(`❌ Error updating ${pairId}:`, error.message);
        return false;
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Creating high-quality sample gender-specific data...\n');

    // Update Rat-Rat
    await updatePairingWithGenderData('Rat-Rat', ratRatGenderData);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update Rabbit-Snake
    await updatePairingWithGenderData('Rabbit-Snake', rabbitSnakeGenderData);

    console.log('\n🎉 Sample data creation complete!');
    console.log('\nYou can now test the frontend with these two pairings:');
    console.log('  - Rat-Rat (all 6 gender combinations)');
    console.log('  - Rabbit-Snake (all 6 gender combinations)');

    process.exit(0);
}

main();
