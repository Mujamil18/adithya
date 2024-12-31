import React from 'react';
import { format } from 'date-fns';
import { Meeting } from '../../types/meetings';
import { getCategoryColor } from '../../utils/meetings';

interface PostponedMeetingsProps {
  meetings: Meeting[];
  onReschedule: (meeting: Meeting) => void;
}

export default function PostponedMeetings({ meetings, onReschedule }: PostponedMeetingsProps) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No postponed meetings
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map(meeting => (
        <div
          key={meeting.id}
          className={`${getCategoryColor(meeting.category)} bg-opacity-10 p-4 rounded-lg`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{meeting.name}</h3>
              <p className="text-sm text-gray-600">{meeting.email}</p>
              <p className="text-sm mt-1">{meeting.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Original time: {format(new Date(meeting.start_time), 'PPP p')}
              </p>
            </div>
            <button
              onClick={() => onReschedule(meeting)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}