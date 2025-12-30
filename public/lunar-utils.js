import { Solar } from "https://cdn.skypack.dev/lunar-javascript";

/**
 * 1. Function to convert Solar (Gregorian) date to Lunar date.
 * Uses the lunar-javascript library for astronomical accuracy.
 * 
 * @param {string} dateString - Format "YYYY-MM-DD"
 * @returns {object} - { lunarDate: string, lunarYear: number }
 */
export function solarToLunar(dateString) {
    if (!dateString) return null;

    try {
        const [year, month, day] = dateString.split('-').map(Number);
        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();

        return {
            lunarDate: lunar.toString(), // e.g., "二〇二三年六月十五"
            lunarYear: lunar.getYear(),  // e.g., 2023
            lunarMonth: lunar.getMonth(),
            lunarDay: lunar.getDay()
        };
    } catch (e) {
        console.error("Error converting to lunar:", e);
        return null;
    }
}

/**
 * 2. Function to calculate Zodiac based on Lunar Year.
 * Note: This calculates based on the Lunar Year (Chinese New Year), 
 * which is the traditional way.
 * 
 * @param {number} lunarYear - The year from the Lunar calendar
 * @returns {string} - The English Zodiac sign (e.g., "Dragon")
 */
export function calculateZodiac(lunarYear) {
    if (!lunarYear) return "";

    const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

    // 1900 was the Year of the Rat.
    // (Year - 1900) % 12 gives the index.
    // We handle negative results for years before 1900 just in case.
    const offset = (lunarYear - 1900) % 12;
    const index = offset >= 0 ? offset : offset + 12;

    return zodiacs[index];
}
