export type MeetingCategory = 'vivu' | 'vinu' | 'nivu' | 'ninu';
export type MeetingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rescheduled';

export interface Meeting {
  id: string;
  name: string;
  email: string;
  category: MeetingCategory;
  start_time: string;
  end_time: string;
  status: MeetingStatus;
  created_at: string;
}

export const MEETING_SLOTS = [
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
];

export const MEETING_CATEGORIES = [
  { id: 'vivu', name: 'Very Important & Very Urgent', color: 'bg-red-500' },
  { id: 'vinu', name: 'Very Important but Not Urgent', color: 'bg-orange-500' },
  { id: 'nivu', name: 'Not Important but Very Urgent', color: 'bg-yellow-500' },
  { id: 'ninu', name: 'Not Important & Not Urgent', color: 'bg-blue-500' },
];