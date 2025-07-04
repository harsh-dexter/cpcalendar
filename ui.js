import { FIXED_PLATFORMS, PLATFORM_COLORS } from './config.js';
import { formatDateTime, formatDuration } from './utils.js';
import { handleAddToGoogleCalendar } from './googleCalendar.js';
import { handleSetReminder } from './reminders.js';

let countdownIntervals = [];

function updateCountdown(contestElement, contest) {
    const now = new Date().getTime();
    const start = new Date(contest.start + 'Z').getTime(); // Treat as UTC
    const diff = start - now;

    const countdownElement = contestElement.querySelector('.contest-countdown');
    countdownElement.classList.remove('countdown-urgent'); // Reset class

    if (diff <= 0) {
        countdownElement.textContent = 'Started / Ended';
        countdownElement.classList.remove('countdown-urgent'); // Ensure it's removed if contest just ended
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let countdownText = '';
    if (days > 0) {
        countdownText += `${days}d `;
    } else {
        // Under 24 hours
        countdownElement.classList.add('countdown-urgent');
    }
    countdownText += `${hours}h ${minutes}m ${seconds}s`;
    countdownElement.textContent = `Starts in: ${countdownText}`;
}

export function renderContests(contests, contestListElement) {
    countdownIntervals.forEach(clearInterval);
    countdownIntervals = [];
    contestListElement.innerHTML = ''; // Clear previous list or "Loading..."

    if (!contests || contests.length === 0) {
        contestListElement.innerHTML = '<p>No upcoming contests found for the selected platforms.</p>';
        return;
    }

    contests.forEach(contest => {
        const contestElement = document.createElement('div');
        contestElement.className = 'contest';

        // Determine platform color
        let platformColor = PLATFORM_COLORS.default;
        for (const name in FIXED_PLATFORMS) {
            if (FIXED_PLATFORMS[name] === contest.resource_id) {
                platformColor = PLATFORM_COLORS[name] || PLATFORM_COLORS.default;
                break;
            }
        }
        contestElement.style.borderLeft = `4px solid ${platformColor}`;

        const startDateTime = formatDateTime(contest.start);
        const contestDuration = formatDuration(contest.duration);

        contestElement.innerHTML = `
            <div class="contest-title">${contest.event}</div>
            <div class="contest-host">Platform: ${contest.host}</div>
            <div class="contest-time">Start: ${startDateTime}</div>
            <div class="contest-duration">Duration: ${contestDuration}</div>
            <div class="contest-countdown">Calculating...</div>
            <div class="contest-link"><a href="${contest.href}" target="_blank">Go to Contest</a></div>
            <div class="contest-actions">
                <button class="gcal-btn" data-contest-id="${contest.id}">Add to Google Calendar</button>
                <button class="reminder-btn" data-contest-id="${contest.id}">Set Reminder</button>
            </div>
        `;
        contestListElement.appendChild(contestElement);

        // Initial call to set countdown and then update it every second
        if (new Date(contest.start + 'Z').getTime() > new Date().getTime()) {
            updateCountdown(contestElement, contest);
            const intervalId = setInterval(() => updateCountdown(contestElement, contest), 1000);
            countdownIntervals.push(intervalId);
        } else {
            updateCountdown(contestElement, contest); // Show "Started / Ended"
        }

        // Add event listeners for buttons
        contestElement.querySelector('.gcal-btn').addEventListener('click', () => handleAddToGoogleCalendar(contest));
        contestElement.querySelector('.reminder-btn').addEventListener('click', () => handleSetReminder(contest));
    });
}

export function renderDayFilters(dayFilterElement, DAY_FILTER_OPTIONS, getActiveDayFilter, setActiveDayFilter, fetchContests) {
    dayFilterElement.innerHTML = '';
    DAY_FILTER_OPTIONS.forEach(filterType => {
        const button = document.createElement('button');
        button.className = 'day-filter-button';
        button.textContent = filterType;
        button.dataset.filterType = filterType;

        if (filterType === getActiveDayFilter()) {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            setActiveDayFilter(filterType);
            // Update selected state for all buttons
            dayFilterElement.querySelectorAll('.day-filter-button').forEach(btn => {
                btn.classList.toggle('selected', btn.dataset.filterType === getActiveDayFilter());
            });
            fetchContests();
        });
        dayFilterElement.appendChild(button);
    });
}

export function renderPlatformFilters(platformFilterElement, activePlatformFilters, applyFiltersAndRender) {
    platformFilterElement.innerHTML = '';
    const platformNames = Object.keys(FIXED_PLATFORMS);

    platformNames.forEach(name => {
        const button = document.createElement('button');
        button.className = 'platform-filter-button';
        button.textContent = name;
        button.dataset.platformName = name;

        // Initially, no buttons are selected.
        // The 'selected' class will be toggled on click.

        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            const platformName = button.dataset.platformName;
            const index = activePlatformFilters.indexOf(platformName);

            if (index > -1) {
                // Platform exists, so remove it
                activePlatformFilters.splice(index, 1);
            } else {
                // Platform doesn't exist, so add it
                activePlatformFilters.push(platformName);
            }
            applyFiltersAndRender();
        });
        platformFilterElement.appendChild(button);
    });
}
