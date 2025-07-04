import { CLIST_USERNAME, CLIST_API_KEY, CONTEST_LIMIT } from './config.js';

const cache = new Map();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function fetchContests(getSelectedPlatformIds, getDateRangeForFilter, activeDayFilter) {
    if (!CLIST_USERNAME || CLIST_USERNAME === 'YOUR_CLIST_USERNAME_HERE' || !CLIST_API_KEY || CLIST_API_KEY === 'YOUR_CLIST_API_KEY_HERE') {
        throw new Error('CLIST API Username or Key not configured. Please update config.js.');
    }

    const platformIds = getSelectedPlatformIds().join(',');

    if (!platformIds) {
        return [];
    }

    const { startDateGTE, startDateLT } = getDateRangeForFilter(activeDayFilter);
    
    let apiUrl = `https://clist.by/api/v4/contest/?username=${CLIST_USERNAME}&api_key=${CLIST_API_KEY}&format=json&resource_id__in=${platformIds}&order_by=start&limit=${CONTEST_LIMIT}`;

    if (startDateGTE) {
        apiUrl += `&start__gte=${encodeURIComponent(startDateGTE)}`;
    }
    if (startDateLT) {
        apiUrl += `&start__lt=${encodeURIComponent(startDateLT)}`;
    }

    const now = Date.now();
    if (cache.has(apiUrl)) {
        const { timestamp, data } = cache.get(apiUrl);
        if (now - timestamp < CACHE_DURATION_MS) {
            console.log('Returning cached data for:', apiUrl);
            return data;
        }
    }

    console.log('Fetching fresh data for:', apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        let errorMsg = `Error fetching contests: ${response.status}`;
        if (errorData && errorData.detail) {
            errorMsg += ` - ${errorData.detail}`;
        } else if (response.status === 400) {
            errorMsg += " - Bad Request. Check API parameters (especially resource_id__in) or API version compatibility.";
        } else if (response.status === 401) {
            errorMsg += " - Unauthorized. Please check your CLIST username and API key in config.js.";
        }
        throw new Error(errorMsg);
    }
    const data = await response.json();
    const contests = data.objects || [];
    cache.set(apiUrl, { timestamp: now, data: contests });
    return contests;
}
