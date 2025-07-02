// background.js - Service Worker

// Listener for when an alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm fired:", alarm);
    if (alarm.name.startsWith("contest-reminder-")) {
        // Extract contest details from the alarm name or fetch from storage if needed
        // For simplicity, we'll assume the contest event name is part of the alarm name
        // A more robust solution might store contest details in chrome.storage.local when the alarm is set.
        const contestDataString = alarm.name.substring("contest-reminder-".length);
        try {
            const contestData = JSON.parse(decodeURIComponent(contestDataString));
            const notificationId = `contest-notification-${contestData.id}-${Date.now()}`;

            chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: 'images/icon128.png', // Ensure you have this icon
                title: `Contest Reminder: ${contestData.event}`,
                message: `${contestData.event} on ${contestData.host} is starting soon!`,
                priority: 2, // High priority
                buttons: [ // Optional: Add a button to go to the contest
                    { title: 'Go to Contest', iconUrl: 'images/icon16.png' } // Ensure you have this icon
                ]
            });

            console.log(`Notification created for ${contestData.event}`);

        } catch (e) {
            console.error("Error parsing contest data from alarm name:", e);
            // Fallback notification if parsing fails
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon128.png',
                title: 'Contest Reminder',
                message: 'A contest is starting soon!',
                priority: 2
            });
        }
    }
});

// Optional: Listener for notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    console.log(`Notification button clicked. ID: ${notificationId}, Button Index: ${buttonIndex}`);
    // Example: If we have a contest URL stored or can derive it
    // This part needs to be more robust if we want to open specific contest links
    // For now, it's a placeholder.
    if (notificationId.startsWith("contest-notification-") && buttonIndex === 0) {
        // Attempt to extract contest ID and find its URL if stored, or open a generic site
        // This requires a more complex setup to pass the contest URL or ID effectively.
        // For now, let's log it. A real implementation would need to retrieve the contest.href.
        console.log("User clicked 'Go to Contest'. Implement navigation logic.");
        // Example: chrome.tabs.create({ url: contest.href }); (href would need to be available here)
    }
    chrome.notifications.clear(notificationId);
});


// Listener for messages from popup.js (or other extension parts)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received:", request);
    if (request.type === "SET_REMINDER") {
        const contest = request.contest;
        if (!contest || !contest.id || !contest.start || !contest.event) {
            console.error("Invalid contest data for reminder:", contest);
            sendResponse({ success: false, message: "Invalid contest data for reminder." });
            return;
        }

        // DEMO: Set reminder for 15 seconds from now for quick testing
        const reminderTime = Date.now() + (15 * 1000);

        const contestDataForAlarm = {
            id: contest.id,
            event: contest.event,
            host: contest.host,
            href: contest.href
        };
        const alarmName = `contest-reminder-${encodeURIComponent(JSON.stringify(contestDataForAlarm))}`;

        chrome.alarms.create(alarmName, {
            when: reminderTime
        });
        
        console.log(`Reminder set for ${contest.event} at ${new Date(reminderTime).toLocaleString()}`);
        sendResponse({ success: true, message: `Reminder set for "${contest.event}"!` });
    }
});

console.log("Background service worker started.");
