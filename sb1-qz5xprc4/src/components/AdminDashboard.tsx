import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Meeting } from '../types/meetings';
import MeetingList from './meetings/MeetingList';
import RescheduleModal from './meetings/RescheduleModal';
import PostponedMeetings from './meetings/PostponedMeetings';
import AdminSettings from './admin/AdminSettings';
import MeetingCalendar from './admin/MeetingCalendar';
import { useMeetings } from '../hooks/useMeetings';
import { sendEmail } from '../utils/email';

export default function AdminDashboard() {
  const {
    meetings,
    confirmedMeetings,
    postponedMeetings,
    isLoading,
    refetch
  } = useMeetings();

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showPostponedMeetings, setShowPostponedMeetings] = useState(false);

  const handleConfirm = async (meeting: Meeting) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ status: 'confirmed' })
        .eq('id', meeting.id);

      if (error) throw error;

      await sendEmail({
        to: meeting.email,
        subject: 'Meeting Confirmed',
        body: `Your meeting schedule has been confirmed for ${new Date(meeting.start_time).toLocaleString()}`,
        from: 'admin@example.com'
      });

      toast.success('Meeting confirmed successfully');
      await Promise.all([
        refetch.fetchMeetings(),
        refetch.fetchConfirmedMeetings()
      ]);
    } catch (error) {
      console.error('Error confirming meeting:', error);
      toast.error('Failed to confirm meeting');
    }
  };

  const handlePostpone = async (meeting: Meeting) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ 
          status: 'postponed'
        })
        .eq('id', meeting.id);

      if (error) throw error;

      await sendEmail({
        to: meeting.email,
        subject: 'Meeting Postponed',
        body: `Your meeting has been postponed. We will contact you with a new schedule.`,
        from: 'admin@example.com'
      });

      toast.success('Meeting postponed successfully');
      await Promise.all([
        refetch.fetchMeetings(),
        refetch.fetchPostponedMeetings()
      ]);
    } catch (error) {
      console.error('Error postponing meeting:', error);
      toast.error('Failed to postpone meeting');
    }
  };

  const handleReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowRescheduleModal(true);
  };

  const handleCalendarEventClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowRescheduleModal(true);
  };

  const handleRescheduleConfirm = async (newStartTime: Date) => {
    if (!selectedMeeting) return;

    try {
      const newEndTime = new Date(newStartTime);
      newEndTime.setHours(newStartTime.getHours() + 1);

      const { error } = await supabase
        .from('meetings')
        .update({
          start_time: newStartTime.toISOString(),
          end_time: newEndTime.toISOString(),
          status: 'confirmed'
        })
        .eq('id', selectedMeeting.id);

      if (error) throw error;

      await sendEmail({
        to: selectedMeeting.email,
        subject: 'Meeting Rescheduled',
        body: `Your meeting has been rescheduled to ${newStartTime.toLocaleString()}`,
        from: 'admin@example.com'
      });

      setShowRescheduleModal(false);
      setSelectedMeeting(null);
      toast.success('Meeting rescheduled successfully');
      await Promise.all([
        refetch.fetchMeetings(),
        refetch.fetchConfirmedMeetings(),
        refetch.fetchPostponedMeetings()
      ]);
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
      toast.error('Failed to reschedule meeting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <AdminSettings />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowPostponedMeetings(!showPostponedMeetings)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          {showPostponedMeetings ? 'Hide' : 'Show'} Postponed Meetings ({postponedMeetings.length})
        </button>
      </div>

      {showPostponedMeetings ? (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Postponed Meetings</h2>
          <PostponedMeetings
            meetings={postponedMeetings}
            onReschedule={handleReschedule}
          />
        </div>
      ) : (
        <div className="grid gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Meeting Requests</h2>
            {isLoading ? (
              <div className="text-center py-4">Loading meetings...</div>
            ) : (
              <MeetingList
                meetings={meetings}
                onConfirm={handleConfirm}
                onPostpone={handlePostpone}
                onReschedule={handleReschedule}
              />
            )}
          </div>

          <MeetingCalendar 
            meetings={confirmedMeetings} 
            onEventClick={handleCalendarEventClick}
          />
        </div>
      )}

      {showRescheduleModal && selectedMeeting && (
        <RescheduleModal
          meeting={selectedMeeting}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedMeeting(null);
          }}
          onConfirm={handleRescheduleConfirm}
          existingMeetings={confirmedMeetings}
        />
      )}
    </div>
  );
}