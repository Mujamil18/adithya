import React from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Meeting, MEETING_CATEGORIES } from '../../types/meetings';
import { getCategoryColor } from '../../utils/meetings';

interface MeetingRequestProps {
  meeting: Meeting;
  onConfirm: () => void;
  onPostpone: () => void;
  onReschedule: () => void;
}

export default function MeetingRequest({
  meeting,
  onConfirm,
  onPostpone,
  onReschedule,
}: MeetingRequestProps) {
  const category = MEETING_CATEGORIES.find(c => c.id === meeting.category);
  const colorClass = getCategoryColor(meeting.category);

  return (
    <div className={clsx('p-4 rounded-lg', colorClass, 'bg-opacity-10')}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{meeting.name}</h3>
          <p className="text-sm text-gray-600">{meeting.email}</p>
          <p className="text-sm font-medium">{category?.name}</p>
          <p className="text-sm">
            {format(new Date(meeting.start_time), 'PPP p')}
          </p>
          {meeting.description && (
            <p className="text-sm text-gray-600 mt-2">{meeting.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            Confirm
          </button>
          <button
            onClick={onReschedule}
            className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
          >
            Reschedule
          </button>
          <button
            onClick={onPostpone}
            className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
          >
            Postpone
          </button>
        </div>
      </div>
    </div>
  );
}