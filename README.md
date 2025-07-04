# ![icon48](https://github.com/user-attachments/assets/e6533f58-a536-446d-a4c0-347949d4246e) CP Calendar


CP Calendar is a Chrome extension that displays upcoming competitive programming contests from various platforms and allows you to add them to your Google Calendar.

![cp_calendar_combined_landscape](https://github.com/user-attachments/assets/9f7f6720-fad8-4397-8914-36a73ce5f4ff)


## Features

-   View upcoming contests from Codeforces, AtCoder, LeetCode, CodeChef, and GeeksforGeeks.
-   Filter contests by date (Today, Tomorrow, Next 7 Days).
-   Filter contests by platform.
-   Search for contests by title.
-   Add contests to your Google Calendar with a single click (opens a pre-filled event page).
-   Set reminders for contests.

## Installation

1.  Clone this repository or download the source code.
2.  Open Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click on "Load unpacked" and select the project folder.

## Configuration

The extension requires your CList API credentials to fetch contest data. You need to update the `config.js` file with your CList username and API key.

```javascript
// config.js
export const CLIST_USERNAME = 'YOUR_CLIST_USERNAME_HERE';
export const CLIST_API_KEY = 'YOUR_CLIST_API_KEY_HERE';
```

**Note:** You should replace the placeholder credentials in `config.js` with your own to ensure the extension functions correctly.

## Usage

-   Click on the extension icon in the Chrome toolbar to open the popup.
-   Use the filters and search bar to find contests.
-   Click on the "Add to Google Calendar" button to add a contest to your calendar.
-   Click on the "Set Reminder" button to set a reminder for a contest.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
