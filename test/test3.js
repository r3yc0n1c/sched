const express = require('express');
const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');

/*
const GOOGLE_CLIENT_ID = "REDACTED"
const GOOGLE_CLIENT_SECRET = "REDACTED"
const GOOGLE_REDIRECT_URI = "REDACTED"
*/

const app = express();
const PORT = 3000;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    res.redirect(authUrl);
});

app.get('/api/auth/callback/google', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    oauth2Client.setCredentials(tokens);

    res.json({
        msg: "login successful"
    });
});

app.get('/schedule', async (req, res) => {
    const meetingName = "Test Meeting", date = "2025-04-20", startTime = "10:00", email = "0xsr1337@gmail.com"

    // Format date and time for Google Calendar
    const [year, month, day] = date.split('-');
    const [hours, minutes] = startTime.split(':');
    const startDateTime = new Date(year, month - 1, day, hours, minutes);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 min duration

    // Create calendar instance with the OAuth2Client

    // Insert the event
    const response = await calendar.events.insert({
        calendarId: 'primary',
        // auth: oauth2Client,
        conferenceDataVersion: 1,
        requestBody: {
            summary: meetingName,
            description: `Let's talk`,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(7),
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            attendees: email ? [{ email }] : [],
        },
        sendUpdates: 'all',
    });

    console.log('Meeting created:');
    console.log(response.data);
    res.json({
        msg: "meeting created successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
