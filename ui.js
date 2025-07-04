import { FIXED_PLATFORMS, PLATFORM_COLORS } from './config.js';
import { formatDateTime, formatDuration } from './utils.js';
import { handleAddToGoogleCalendar } from './googleCalendar.js';
import { handleSetReminder } from './reminders.js';

let globalCountdownInterval = null;

function updateAllCountdowns() {
    const countdownElements = document.querySelectorAll('.contest-countdown');
    countdownElements.forEach(countdownElement => {
        const startTime = parseInt(countdownElement.dataset.startTime, 10);
        if (isNaN(startTime)) return;

        const now = new Date().getTime();
        const diff = startTime - now;

        countdownElement.classList.remove('countdown-urgent');

        if (diff <= 0) {
            countdownElement.textContent = 'Started / Ended';
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
            countdownElement.classList.add('countdown-urgent');
        }
        countdownText += `${hours}h ${minutes}m ${seconds}s`;
        countdownElement.textContent = `Starts in: ${countdownText}`;
    });
}

function startGlobalCountdown() {
    if (globalCountdownInterval) {
        clearInterval(globalCountdownInterval);
    }
    updateAllCountdowns(); // Initial call
    globalCountdownInterval = setInterval(updateAllCountdowns, 1000);
}

export function renderContests(contests, contestListElement) {
    contestListElement.innerHTML = '';

    if (!contests || contests.length === 0) {
        contestListElement.innerHTML = '<p>No upcoming contests found for the selected platforms.</p>';
        return;
    }

    contests.forEach(contest => {
        const contestElement = document.createElement('div');
        contestElement.className = 'contest';

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
        const startTimeMs = new Date(contest.start + 'Z').getTime();

        contestElement.innerHTML = `
            <div class="contest-title">${contest.event}</div>
            <div class="contest-host">Platform: ${contest.host}</div>
            <div class="contest-time">Start: ${startDateTime}</div>
            <div class="contest-duration">Duration: ${contestDuration}</div>
            <div class="contest-countdown" data-start-time="${startTimeMs}">Calculating...</div>
            <div class="contest-link"><a href="${contest.href}" target="_blank">Go to Contest</a></div>
            <div class="contest-actions">
                <button class="gcal-btn" data-contest-id="${contest.id}">Add to Google Calendar</button>
                <button class="reminder-btn" data-contest-id="${contest.id}">Set Reminder</button>
            </div>
        `;
        contestListElement.appendChild(contestElement);

        contestElement.querySelector('.gcal-btn').addEventListener('click', () => handleAddToGoogleCalendar(contest));
        contestElement.querySelector('.reminder-btn').addEventListener('click', () => handleSetReminder(contest));
    });

    startGlobalCountdown();
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

        if (activePlatformFilters.includes(name)) {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            const platformName = button.dataset.platformName;
            const index = activePlatformFilters.indexOf(platformName);

            if (index > -1) {
                activePlatformFilters.splice(index, 1);
            } else {
                activePlatformFilters.push(platformName);
            }
            applyFiltersAndRender();
        });
        platformFilterElement.appendChild(button);
    });
}

export function renderCalendar(contests, calendarGrid, monthYear, date) {
    calendarGrid.innerHTML = '';
    monthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date other-month';
        calendarGrid.appendChild(emptyCell);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dateCell.classList.add('today');
        }

        const dateNum = document.createElement('div');
        dateNum.className = 'date-num';
        dateNum.textContent = i;
        dateCell.appendChild(dateNum);

        const contestsForDay = contests.filter(contest => {
            const contestDate = new Date(contest.start + 'Z');
            return contestDate.getDate() === i && contestDate.getMonth() === month && contestDate.getFullYear() === year;
        });

        contestsForDay.forEach(contest => {
            const contestElement = document.createElement('div');
            contestElement.className = 'calendar-contest';
            contestElement.textContent = contest.event;
            contestElement.title = contest.event;

            let platformColor = PLATFORM_COLORS.default;
            for (const name in FIXED_PLATFORMS) {
                if (FIXED_PLATFORMS[name] === contest.resource_id) {
                    platformColor = PLATFORM_COLORS[name] || PLATFORM_COLORS.default;
                    break;
                }
            }
            contestElement.style.backgroundColor = platformColor;

            contestElement.addEventListener('click', () => {
                window.open(contest.href, '_blank');
            });
            dateCell.appendChild(contestElement);
        });

        calendarGrid.appendChild(dateCell);
    }
}
