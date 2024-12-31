import React, { useState } from 'react';
import { Meeting, MEETING_SLOTS } from '../../types/meetings';
import { isValidMeetingTime, isPastDate } from '../../utils/meetings';

interface RescheduleModalProps {
  meeting: Meeting;
  onClose: () => void;
  onConfirm: (newStartTime: Date) => void;
  existingMeetings: Meeting[];
}

export default function RescheduleModal({
  meeting,
  onClose,
  onConfirm,
  existingMeetings,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStartTime = new Date(`${selectedDate}T${selectedTime}`);
    onConfirm(newStartTime);
  };

  const getAvailableSlots = () => {
    return MEETING_SLOTS.filter(slot => {
      const [hour] = slot.start.split(':').map(Number);
      const testDate = new Date(`${selectedDate}T${slot.start}`);
      
      if (isPastDate(testDate) || !isValidMeetingTime(testDate)) {
        return false;
      }

      // Check if slot is already booked
      return !existingMeetings.some(existingMeeting => {
        const existingStart = new Date(existingMeeting.start_time);
        return existingStart.getHours() === hour &&
               existingStart.toDateString() === testDate.toDateString();
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Reschedule Meeting</h2>
        <p className="mb-4 text-gray-600">
          Current time: {new Date(meeting.start_time).toLocaleString()}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Time
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedTime}
                onChange={e => setSelectedTime(e.target.value)}
              >
                <option value="">Select a time</option>
                {getAvailableSlots().map(slot => (
                  <option key={slot.start} value={slot.start}>
                    {slot.start} - {slot.end}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}