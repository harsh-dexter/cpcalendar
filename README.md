# ![icon48](https://github.com/user-attachments/assets/e6533f58-a536-446d-a4c0-347949d4246e) CP Calendar


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

### Google Calendar Integration

To use the "Add to Google Calendar" feature, you need to create your own Google OAuth2 client ID and configure it in the `manifest.json` file.

1.  **Find your Extension ID:**
    *   Load the extension in Chrome by following the installation steps.
    *   Go to `chrome://extensions`.
    *   Find the "CP Calendar" extension and copy the **ID**.

2.  **Create an OAuth 2.0 Client ID:**
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project or select an existing one.
    *   Go to **APIs & Services > Credentials**.
    *   Click on **+ CREATE CREDENTIALS** and select **OAuth client ID**.
    *   Choose **Chrome App** as the application type.
    *   Enter a name for your client ID.
    *   Paste your **Extension ID** into the **Application ID** field.
    *   Click **Create**.

3.  **Configure `manifest.json`:**
    *   Copy the **Client ID** that was just created.
    *   Open the `manifest.json` file in the project.
    *   Find the `oauth2` section and replace the existing `client_id` with your new one.

    ```json
    "oauth2": {
      "client_id": "YOUR_GOOGLE_OAUTH2_CLIENT_ID_HERE",
      "scopes": [
        "https://www.googleapis.com/auth/calendar.events"
      ]
    }
    ```

## Usage

-   Click on the extension icon in the Chrome toolbar to open the popup.
-   Use the filters and search bar to find contests.
-   Click on the "Add to Google Calendar" button to add a contest to your calendar.
-   Click on the "Set Reminder" button to set a reminder for a contest.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
