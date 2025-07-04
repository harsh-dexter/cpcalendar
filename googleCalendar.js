export function handleAddToGoogleCalendar(contest) {
    console.log('Generating Google Calendar link for:', contest.event);

    const formatForGoogleURL = (dateString) => {
        // Converts "YYYY-MM-DD HH:MM:SS" to "YYYYMMDDTHHMMSSZ"
        return new Date(dateString + 'Z').toISOString().replace(/[-:]|\.\d{3}/g, '');
    };

    const startTime = formatForGoogleURL(contest.start);
    const endTime = formatForGoogleURL(contest.end);

    const details = `Platform: ${contest.host}\nContest Link: <a href="${contest.href}">${contest.href}</a>\n\n---\nAdded via CP Calendar`;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.event)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(contest.host)}`;

    chrome.tabs.create({ url: calendarUrl });
}
