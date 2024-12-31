import React from 'react';
import { Meeting } from '../../types/meetings';
import MeetingRequest from './MeetingRequest';

interface MeetingListProps {
  meetings: Meeting[];
  onConfirm: (meeting: Meeting) => void;
  onCancel: (meeting: Meeting) => void;
  onReschedule: (meeting: Meeting) => void;
}

export default function MeetingList({
  meetings,
  onConfirm,
  onCancel,
  onReschedule,
}: MeetingListProps) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending meeting requests
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map(meeting => (
        <MeetingRequest
          key={meeting.id}
          meeting={meeting}
          onConfirm={() => onConfirm(meeting)}
          onCancel={() => onCancel(meeting)}
          onReschedule={() => onReschedule(meeting)}
        />
      ))}
    </div>
  );
}