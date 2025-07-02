# ![icon128](https://github.com/user-attachments/assets/5a7471be-0d6f-4940-a1ed-fa3980552027) CP Calendar

CP Calendar is a Chrome extension that displays upcoming competitive programming contests from various platforms and allows you to add them to your Google Calendar.

## Features

-   View upcoming contests from Codeforces, AtCoder, LeetCode, CodeChef, and GeeksforGeeks.
-   Filter contests by date (Today, Tomorrow, Next 7 Days).
-   Filter contests by platform.
-   Search for contests by title.
-   Add contests to your Google Calendar with a single click.
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

**Note:** The current configuration in this repository exposes the developer's CList credentials. You should replace them with your own.

You also need to provide your Google OAuth2 client ID in `manifest.json` to use the "Add to Google Calendar" feature.

## Usage

-   Click on the extension icon in the Chrome toolbar to open the popup.
-   Use the filters and search bar to find contests.
-   Click on the "Add to Google Calendar" button to add a contest to your calendar.
-   Click on the "Set Reminder" button to set a reminder for a contest.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
