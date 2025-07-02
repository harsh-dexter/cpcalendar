// Debounce helper function
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Helper function to clear existing countdown intervals
export function clearCountdownIntervals(countdownIntervals) {
    countdownIntervals.forEach(clearInterval);
    return [];
}

// Helper function to format date and time
export function formatDateTime(isoString) {
    if (!isoString) return 'N/A';
    // Append 'Z' to treat the string as UTC
    const date = new Date(isoString + 'Z');
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Helper function to format duration (seconds to H M S or D H M)
export function formatDuration(seconds) {
    if (seconds === null || seconds === undefined) return 'N/A';
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor(seconds % (3600 * 24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);

    let parts = [];
    if (d > 0) parts.push(d + 'd');
    if (h > 0) parts.push(h + 'h');
    if (m > 0) parts.push(m + 'm');
    if (parts.length === 0 && seconds > 0) return '<1m'; // For very short durations
    if (parts.length === 0) return '0m'; // Or handle as 'N/A' or specific text

    return parts.join(' ');
}

// Helper function to normalize strings for searching
export function normalizeSearchString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[.#(),;:!?&/-]/g, ' ') // Replace common punctuation with a space
        .replace(/\s+/g, ' ')           // Collapse multiple spaces into one
        .trim();
}
