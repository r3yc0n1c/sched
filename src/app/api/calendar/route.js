import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const meetingDetails = await request.json();
    
    // Format the date for Google Calendar URL
    const startDate = new Date(meetingDetails.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    // Format dates for Google Calendar URL
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    // Create Google Calendar event URL
    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.append('action', 'TEMPLATE');
    calendarUrl.searchParams.append('text', meetingDetails.name);
    calendarUrl.searchParams.append('details', `Google Meet Link: ${meetingDetails.link}`);
    calendarUrl.searchParams.append('dates', `${formatDate(startDate)}/${formatDate(endDate)}`);
    calendarUrl.searchParams.append('add', 'Google Meet');
    calendarUrl.searchParams.append('location', meetingDetails.link);
    
    return NextResponse.json({
      success: true,
      meeting: meetingDetails,
      calendarUrl: calendarUrl.toString()
    });
  } catch (error) {
    console.error('Error processing meeting:', error);
    return NextResponse.json(
      { error: 'Failed to process meeting' },
      { status: 500 }
    );
  }
} 