export function createTimetableKey(day: string, timeSlot: string) {
  return `${day}__${timeSlot}`;
}
