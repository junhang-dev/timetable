export const timetableColorTypes = ["first", "second", "both", "empty"] as const;

export type TimetableColorType = (typeof timetableColorTypes)[number];

export type TimetableEntry = {
  id: string;
  subject: string;
  day: string;
  timeSlot: string;
  colorType: Exclude<TimetableColorType, "empty">;
};

export type TimetableEntriesByKey = Record<string, TimetableEntry>;

export type ClassType = TimetableColorType;

export type ScheduleRow = {
  time: string;
  classes: {
    content: string;
    type: ClassType;
  }[];
};
