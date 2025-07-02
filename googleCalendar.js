export async function handleAddToGoogleCalendar(contest) {
    console.log('Attempting to add to Google Calendar:', contest.event);
    try {
        const token = await new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(token);
                }
            });
        });

        if (!token) {
            alert('Could not authenticate with Google Calendar. Please try again.');
            return;
        }

        // Ensure dateTime strings are in full ISO 8601 UTC format for Google Calendar
        const formatDateTimeForGoogle = (dateTimeString) => {
            if (!dateTimeString) return null;
            // If Z or +/- offset is not present, assume it's UTC and append 'Z'
            if (!/Z|[+-]\d{2}:\d{2}$/.test(dateTimeString)) {
                return `${dateTimeString}Z`;
            }
            return dateTimeString;
        };

        const startDateTimeGoogle = formatDateTimeForGoogle(contest.start);
        const endDateTimeGoogle = formatDateTimeForGoogle(contest.end);

        if (!startDateTimeGoogle || !endDateTimeGoogle) {
            alert('Contest start or end time is invalid.');
            return;
        }

        const eventDetails = {
            summary: contest.event,
            description: `Platform: ${contest.host}\nContest Link: ${contest.href}`,
            start: {
                dateTime: startDateTimeGoogle,
                // timeZone: 'UTC' // Explicitly stating UTC, though 'Z' in dateTime should suffice
            },
            end: {
                dateTime: endDateTimeGoogle,
                // timeZone: 'UTC' 
            },
            // Optional: Add a reminder
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 30 }, // 30-minute popup reminder
                    { method: 'email', minutes: 60 }  // 1-hour email reminder
                ]
            }
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventDetails)
        });

        if (response.ok) {
            const eventData = await response.json();
            console.log('Event created:', eventData);
            alert(`"${contest.event}" added to your Google Calendar!`);
        } else {
            const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
            console.error('Error creating Google Calendar event:', response.status, errorData);
            let errorMessage = `Failed to add event: ${response.status}`;
            if (errorData.error && errorData.error.message) {
                errorMessage += ` - ${errorData.error.message}`;
            }
            alert(errorMessage);
        }

    } catch (error) {
        console.error('Error in handleAddToGoogleCalendar:', error);
        alert(`Error adding to Google Calendar: ${error.message}`);
    }
}
