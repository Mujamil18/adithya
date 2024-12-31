import { MEETING_CATEGORIES, MEETING_SLOTS, type MeetingCategory } from '../types/meetings';

export function getCategoryColor(category: MeetingCategory): string {
  const categoryInfo = MEETING_CATEGORIES.find(c => c.id === category);
  return categoryInfo?.color || 'bg-gray-500';
}

export function isValidMeetingTime(date: Date): boolean {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  
  // Check if hour is within valid range and not lunch hour
  if (hour < 10 || hour >= 18 || hour === 13) {
    return false;
  }

  // Check if the time matches a slot start time
  return MEETING_SLOTS.some(slot => {
    const [slotHour] = slot.start.split(':').map(Number);
    return hour === slotHour && minutes === 0;
  });
}

export function isPastDate(date: Date): boolean {
  const now = new Date();
  now.setSeconds(0, 0);
  return date < now;
}