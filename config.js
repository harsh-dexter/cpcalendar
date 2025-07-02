// config.js
// IMPORTANT: Replace with your actual CLIST username and API key
export const CLIST_USERNAME = 'harshtekriwal01';
export const CLIST_API_KEY = 'bd18c024a13966b55f9855a16c0f5c8d54b9bb63';

// Defines the fixed set of platforms for which contests will be fetched.
export const FIXED_PLATFORMS = {
    'Codeforces': 1,
    'AtCoder': 93,
    'LeetCode': 102,
    'CodeChef': 2,
    'GeeksforGeeks': 7
    // Add or remove platforms here to change the fixed set.
};

// Colors for platform-specific accents on contest cards
export const PLATFORM_COLORS = {
    'Codeforces': '#4051B5', // Blue
    'AtCoder': '#FF8C00',     // Dark Orange
    'LeetCode': '#FFA116',    // Yellow-Orange
    'CodeChef': '#795548',    // Brownish
    'GeeksforGeeks': '#009900', // Green
    'default': '#6c757d'      // Default grey for others if a platform is somehow missed
};

// Number of contests to fetch
export const CONTEST_LIMIT = 30;
