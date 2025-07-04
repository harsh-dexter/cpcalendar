// background.js - Service Worker

// Listener for when an alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("Alarm fired:", alarm);
    if (alarm.name.startsWith("contest-reminder-")) {
        const alarmName = alarm.name;
        chrome.storage.local.get(alarmName, (data) => {
            const contestData = data[alarmName];
            if (contestData) {
                const notificationId = `contest-notification-${contestData.id}-${Date.now()}`;
                chrome.storage.local.set({ [notificationId]: contestData });

                chrome.notifications.create(notificationId, {
                    type: 'basic',
                    iconUrl: 'images/icon128.png',
                    title: `Contest Reminder: ${contestData.event}`,
                    message: `${contestData.event} on ${contestData.host} is starting soon!`,
                    priority: 2,
                    buttons: [
                        { title: 'Go to Contest', iconUrl: 'images/icon16.png' }
                    ]
                });

                console.log(`Notification created for ${contestData.event}`);
                chrome.storage.local.remove(alarmName);
            }
        });
    }
});

// Optional: Listener for notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    console.log(`Notification button clicked. ID: ${notificationId}, Button Index: ${buttonIndex}`);
    if (notificationId.startsWith("contest-notification-") && buttonIndex === 0) {
        chrome.storage.local.get(notificationId, (data) => {
            const contestData = data[notificationId];
            if (contestData && contestData.href) {
                chrome.tabs.create({ url: contestData.href });
                chrome.storage.local.remove(notificationId);
            }
        });
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
            return true;
        }

        const reminderTime = new Date(contest.start + 'Z').getTime() - (15 * 60 * 1000); // 15 minutes before
        const now = Date.now();

        if (reminderTime <= now) {
            console.log(`Contest "${contest.event}" start time is in the past or too soon for a 15-min reminder.`);
            sendResponse({ success: false, message: `"${contest.event}" is starting too soon or has passed.` });
            return true;
        }

        const alarmName = `contest-reminder-${contest.id}`;

        chrome.alarms.get(alarmName, (existingAlarm) => {
            if (existingAlarm) {
                console.log(`Reminder already exists for ${contest.event}`);
                sendResponse({ success: false, message: `Reminder already set for "${contest.event}".` });
            } else {
                chrome.storage.local.set({ [alarmName]: contest }, () => {
                    chrome.alarms.create(alarmName, {
                        when: reminderTime
                    });
                    
                    console.log(`Reminder set for ${contest.event} at ${new Date(reminderTime).toLocaleString()}`);
                    sendResponse({ success: true, message: `Reminder set for 15 minutes before "${contest.event}"!` });
                });
            }
        });
    }
    return true; // Indicates asynchronous response
});

console.log("Background service worker started.");
