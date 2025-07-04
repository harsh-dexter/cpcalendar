# Privacy Policy for CP Calendar Extension

**Last Updated:** July 4, 2025

Thank you for using CP Calendar (the "Extension"), developed by [Your Name/Developer Name - User to fill this]. This Privacy Policy explains how the Extension handles information.

## Information We Collect and Access

The CP Calendar Extension interacts with the following types of information:

1.  **Contest Information:**
    *   The Extension fetches competitive programming contest schedules (including event names, start/end times, platform hosts, and links to contest pages) from the public API provided by CList.by.
    *   To do this, the Extension uses a pre-configured API key and username for CList.by that belongs to the developer of this Extension. No CList.by credentials are collected from you, the user.

2.  **Local Settings for Reminders:**
    *   If you use the "Set Reminder" feature, the Extension will use contest details (such as event name and start time) to create a local alarm using the `chrome.alarms` API.
    *   This information is used solely to trigger a local notification via the `chrome.notifications` API at the time you specify.

## How We Use Information

The information accessed by the Extension is used solely for the following purposes:

*   To display upcoming competitive programming contest schedules within the Extension popup.
*   To generate a pre-filled Google Calendar event link when you use the "Add to Google Calendar" feature. The Extension does not directly access your calendar.
*   To set and trigger local reminders for contests when you explicitly use the "Set Reminder" feature.

## Data Storage and Security

*   **Contest Information:** Fetched contest data is displayed within the Extension and is not stored persistently by the Extension beyond what is necessary for its immediate operation during a session.
*   **No Server-Side Storage:** The CP Calendar Extension does not have its own backend server and does not transmit or store any of your personal data on any third-party servers controlled by the developer of this Extension. All operations occur locally within your browser or through direct communication with the CList.by API.

## Third-Party Services

The Extension relies on the following third-party services:

*   **CList.by:** Used to fetch contest information. You can review their terms and privacy policy on their website.
*   **Google Calendar:** The "Add to Google Calendar" feature redirects you to Google Calendar's web interface. Your interaction with Google services is subject to Google's Privacy Policy and Terms of Service.

## User Choices and Control

*   The "Add to Google Calendar" feature works by opening a new tab with a pre-filled Google Calendar event creation page. You are not required to grant any special permissions to the Extension. You have full control over whether to save the event in your own Google Calendar.
*   You can uninstall the Extension at any time through your browser's extension management page.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the Extension or on its Chrome Web Store listing. You are advised to review this Privacy Policy periodically for any changes.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:
[Your Email Address or a Link to a Contact Page - User to fill this]

---

**Note to Developer (User):**
*   Replace bracketed placeholders like `[Your Name/Developer Name - User to fill this]` and `[Your Email Address or a Link to a Contact Page - User to fill this]` with your actual information.
*   Update the "Last Updated" date.
*   You need to host this privacy policy on a publicly accessible URL (e.g., a simple webpage on GitHub Pages, a personal website, or a service like `privacypolicies.com` that can host it). You will provide this URL when submitting your extension to the Chrome Web Store.
*   Review this template carefully to ensure it accurately reflects all data handling practices of your extension as it evolves.
