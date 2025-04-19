import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.accessToken) {
      return NextResponse.json({ error: 'Access token not available' }, { status: 401 });
    }

    const { meetingName, startDateTime, endDateTime, email, userTimeZone } = await req.json();

    // Initialize OAuth2Client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      token_type: 'Bearer',
      scope: 'https://www.googleapis.com/auth/calendar'
    });

    // Create calendar instance
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: meetingName,
        description: `Let's talk`,
        start: {
          dateTime: startDateTime,
          timeZone: userTimeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: userTimeZone,
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

    return NextResponse.json({
      success: true,
      meeting: {
        meetingName,
        date: new Date(startDateTime).toISOString().split('T')[0],
        startTime: new Date(startDateTime).toTimeString().slice(0, 5),
        duration: Math.round((new Date(endDateTime) - new Date(startDateTime)) / (60 * 1000)),
        email,
        meetLink: response.data.hangoutLink,
        calendarEventId: response.data.id,
        calendarEventLink: response.data.htmlLink,
      },
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
} 