import type { TimetableEntriesByKey, TimetableEntry } from "@/types/timetable";

export type TimetableRepository = {
  load: () => Promise<TimetableEntriesByKey>;
  save: (entries: TimetableEntriesByKey) => Promise<void>;
  upsert: (entry: TimetableEntry) => Promise<TimetableEntriesByKey>;
  remove: (id: string) => Promise<TimetableEntriesByKey>;
};
