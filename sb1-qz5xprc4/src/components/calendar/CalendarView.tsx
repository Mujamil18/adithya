import React from 'react';
import { Calendar, type View } from 'react-big-calendar';
import { localizer, isWeekend } from '../../lib/calendar';
import { MEETING_SLOTS } from '../../types/meetings';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  email?: string;
  description?: string;
  meeting?: any;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onEventClick?: (event: CalendarEvent) => void;
  selectable?: boolean;
  height?: number;
  isAdminView?: boolean;
}

export default function CalendarView({
  events,
  onSelectSlot,
  onEventClick,
  selectable = false,
  height = 600,
  isAdminView = false,
}: CalendarViewProps) {
  const minTime = new Date();
  minTime.setHours(10, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(18, 0, 0);

  // Custom event component with tooltip
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    if (!isAdminView && !event.meeting) {
      return (
        <div className="p-1 bg-blue-500 text-white rounded pointer-events-none">
          Busy
        </div>
      );
    }

    return (
      <div 
        className="relative group cursor-pointer"
        onClick={() => onEventClick && onEventClick(event)}
      >
        <div className="p-1 bg-blue-500 text-white rounded">
          {event.title}
        </div>
        {isAdminView && event.meeting && (
          <div className="absolute hidden group-hover:block z-50 bg-gray-900 text-white p-3 rounded shadow-lg text-sm -mt-1 left-full ml-2 w-80">
            <p className="font-semibold text-lg mb-2">{event.title}</p>
            <p className="text-gray-300">ID: {event.meeting.id}</p>
            <p className="text-gray-300">Email: {event.email}</p>
            <p className="text-gray-300 mt-2">Description: {event.description}</p>
            <p className="text-blue-300 mt-3 text-xs">Click to reschedule</p>
          </div>
        )}
      </div>
    );
  };

  // Custom slot wrapper to show busy/free status
  const SlotWrapper = ({ children, value }: any) => {
    const isBusy = events.some(event => {
      const eventStart = new Date(event.start);
      return eventStart.getHours() === value.getHours() &&
             eventStart.getDate() === value.getDate();
    });
    const isLunchHour = value.getHours() === 13;
    const isWeekendDay = isWeekend(value);

    return (
      <div className={`
        ${isBusy ? 'bg-red-100' : 'bg-green-50'} 
        ${isLunchHour ? 'bg-gray-200' : ''}
        ${isWeekendDay ? 'bg-gray-100' : ''}
        transition-colors
      `}>
        {children}
      </div>
    );
  };

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    if (isWeekend(slotInfo.start)) {
      return;
    }
    onSelectSlot?.(slotInfo);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height }}
      selectable={selectable}
      onSelectSlot={handleSelectSlot}
      defaultView="week"
      views={['day', 'week']}
      min={minTime}
      max={maxTime}
      step={60}
      timeslots={1}
      components={{
        event: EventComponent,
        timeSlotWrapper: SlotWrapper
      }}
    />
  );
}