export function handleSetReminder(contest) {
    console.log('Attempting to set reminder for:', contest.event);
    // Implementation will use chrome.alarms API
    chrome.runtime.sendMessage({ type: "SET_REMINDER", contest: contest }, response => {
        if (chrome.runtime.lastError) {
            console.error("Error setting reminder:", chrome.runtime.lastError.message);
            alert(`Error setting reminder: ${chrome.runtime.lastError.message}`);
        } else {
            alert(response.message);
        }
    });
}
