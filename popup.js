import { FIXED_PLATFORMS } from './config.js';
import { debounce, normalizeSearchString } from './utils.js';
import { fetchContests as fetchContestsFromApi } from './api.js';
import { renderContests, renderDayFilters, renderPlatformFilters, renderCalendar } from './ui.js';

const contestListElement = document.getElementById('contest-list');
const dayFilterElement = document.getElementById('day-filter');
const platformFilterElement = document.getElementById('platform-filter');
const searchBar = document.getElementById('search-bar');
const errorMessageElement = document.getElementById('error-message');
const loaderContainer = document.getElementById('loader-container');
const listViewBtn = document.getElementById('list-view-btn');
const calendarViewBtn = document.getElementById('calendar-view-btn');
const listView = document.getElementById('list-view');
const calendarView = document.getElementById('calendar-view');
const calendarGrid = document.getElementById('calendar-grid');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');

let allFetchedContests = [];
let activeDayFilter = 'All Upcoming';
let activePlatformFilters = [];
const DAY_FILTER_OPTIONS = ['All Upcoming', 'Today', 'Tomorrow', 'Next 7 Days'];
let currentCalendarDate = new Date();

function getSelectedPlatformIds() {
    if (activePlatformFilters.length === 0) {
        return Object.values(FIXED_PLATFORMS);
    }
    return activePlatformFilters.map(name => FIXED_PLATFORMS[name]);
}

function getDateRangeForFilter(filterType) {
    const now = new Date();
    let startDateGTE, startDateLT;

    switch (filterType) {
        case 'Today':
            startDateGTE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            startDateLT = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            break;
        case 'Tomorrow':
            startDateGTE = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
            startDateLT = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0, 0);
            break;
        case 'Next 7 Days':
            startDateGTE = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            startDateLT = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0, 0);
            break;
        case 'All Upcoming':
        default:
            startDateGTE = now; // From current time onwards
            startDateLT = null; // No upper bound for end date
            break;
    }
    return {
        startDateGTE: startDateGTE.toISOString(),
        startDateLT: startDateLT ? startDateLT.toISOString() : null
    };
}

function applyFiltersAndRender() {
    const normalizedSearchTerm = normalizeSearchString(searchBar.value);
    let contestsToRender = allFetchedContests;

    // Filter by platform
    if (activePlatformFilters.length > 0) {
        const selectedPlatformIds = getSelectedPlatformIds();
        contestsToRender = contestsToRender.filter(contest => selectedPlatformIds.includes(contest.resource_id));
    }

    // Filter by search term
    if (normalizedSearchTerm) {
        contestsToRender = contestsToRender.filter(contest => {
            const normalizedEventName = normalizeSearchString(contest.event);
            return normalizedEventName.includes(normalizedSearchTerm);
        });
    }
    renderContests(contestsToRender, contestListElement);
}

async function fetchContests() {
    loaderContainer.style.display = 'flex';
    errorMessageElement.style.display = 'none';
    contestListElement.innerHTML = '';

    try {
        const allPlatformIds = () => Object.values(FIXED_PLATFORMS);
        allFetchedContests = await fetchContestsFromApi(allPlatformIds, getDateRangeForFilter, activeDayFilter);
        applyFiltersAndRender();
    } catch (error) {
        allFetchedContests = [];
        applyFiltersAndRender();
        console.error('Failed to fetch contests:', error);
        errorMessageElement.textContent = error.message || 'Failed to load contests. Check console for details.';
        errorMessageElement.style.display = 'block';
    } finally {
        loaderContainer.style.display = 'none';
    }
}

async function fetchCalendarContests() {
    loaderContainer.style.display = 'flex';
    errorMessageElement.style.display = 'none';
    calendarGrid.innerHTML = '';

    try {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const dateRange = {
            startDateGTE: firstDayOfMonth.toISOString(),
            startDateLT: lastDayOfMonth.toISOString()
        };

        const allPlatformIds = () => Object.values(FIXED_PLATFORMS);
        const contests = await fetchContestsFromApi(allPlatformIds, () => dateRange, 'All Upcoming');
        renderCalendar(calendarGrid, monthYear, contests, currentCalendarDate);
    } catch (error) {
        console.error('Failed to fetch calendar contests:', error);
        errorMessageElement.textContent = error.message || 'Failed to load calendar. Check console for details.';
        errorMessageElement.style.display = 'block';
    } finally {
        loaderContainer.style.display = 'none';
    }
}

function switchView(view) {
    if (view === 'list') {
        listView.classList.add('active');
        calendarView.classList.remove('active');
        listViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
        fetchContests();
    } else {
        listView.classList.remove('active');
        calendarView.classList.add('active');
        listViewBtn.classList.remove('active');
        calendarViewBtn.classList.add('active');
        fetchCalendarContests();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const getActiveDayFilter = () => activeDayFilter;
    const setActiveDayFilter = (filter) => {
        activeDayFilter = filter;
    };

    renderDayFilters(dayFilterElement, DAY_FILTER_OPTIONS, getActiveDayFilter, setActiveDayFilter, fetchContests);
    renderPlatformFilters(platformFilterElement, activePlatformFilters, applyFiltersAndRender);
    
    searchBar.addEventListener('input', debounce(applyFiltersAndRender, 300));

    listViewBtn.addEventListener('click', () => switchView('list'));
    calendarViewBtn.addEventListener('click', () => switchView('calendar'));

    prevMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        fetchCalendarContests();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        fetchCalendarContests();
    });

    fetchContests(); 
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // The countdown intervals are now managed within ui.js
    }
});
