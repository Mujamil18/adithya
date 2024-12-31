import React from 'react';
import CalendarView from '../calendar/CalendarView';
import { Meeting } from '../../types/meetings';

interface MeetingCalendarProps {
  meetings: Meeting[];
  onEventClick?: (meeting: Meeting) => void;
}

export default function MeetingCalendar({ meetings, onEventClick }: MeetingCalendarProps) {
  const events = meetings.map(meeting => ({
    title: meeting.name,
    start: new Date(meeting.start_time),
    end: new Date(meeting.end_time),
    allDay: false,
    email: meeting.email,
    description: meeting.description,
    meeting // Pass the full meeting object
  }));

  const handleEventClick = (event: any) => {
    if (onEventClick && event.meeting) {
      onEventClick(event.meeting);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
      <CalendarView 
        events={events} 
        height={500}
        onEventClick={handleEventClick}
        isAdminView={true}
      />
    </div>
  );
}