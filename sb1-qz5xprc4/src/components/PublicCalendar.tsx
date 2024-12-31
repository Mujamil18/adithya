import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Meeting } from '../types/meetings';
import BookingModal from './BookingModal';
import CalendarView from './calendar/CalendarView';
import OTPVerification from './OTPVerification';
import { isValidMeetingTime, isPastDate } from '../utils/meetings';

export default function PublicCalendar() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const fetchMeetings = async () => {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('status', 'confirmed');
    
    if (error) {
      toast.error('Failed to load meetings');
      return;
    }
    
    setMeetings(data || []);
  };

  useEffect(() => {
    if (isVerified) {
      fetchMeetings();
    }
  }, [isVerified]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    if (isPastDate(start)) {
      toast.error('Cannot book meetings in the past');
      return;
    }

    if (!isValidMeetingTime(start)) {
      toast.error('Please select a valid meeting slot');
      return;
    }

    const hour = start.getHours();
    if (hour === 13) {
      toast.error('This slot is not available for booking');
      return;
    }

    setSelectedSlot(start);
    setShowModal(true);
  };

  const events = meetings.map(meeting => ({
    title: 'Busy',
    start: new Date(meeting.start_time),
    end: new Date(meeting.end_time),
    allDay: false,
  }));

  if (!isVerified) {
    return <OTPVerification onVerified={() => setIsVerified(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Rajendran's Meeting Scheduler</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <CalendarView
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {showModal && selectedSlot && (
        <BookingModal
          selectedTime={selectedSlot}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
}