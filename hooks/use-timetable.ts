import * as React from "react";

import { createTimetableKey } from "@/lib/timetable-key";
import { localStorageTimetableRepository } from "@/lib/repositories/localstorage-timetable-repository";
import type { TimetableRepository } from "@/lib/repositories/timetable-repository";
import type { TimetableEntriesByKey, TimetableEntry } from "@/types/timetable";

const seedEntries: TimetableEntriesByKey = {
  [createTimetableKey("월", "15:00 ~ 16:00")]: { id: createTimetableKey("월", "15:00 ~ 16:00"), subject: "첫째/영어", day: "월", timeSlot: "15:00 ~ 16:00", colorType: "first" },
  [createTimetableKey("수", "15:00 ~ 16:00")]: { id: createTimetableKey("수", "15:00 ~ 16:00"), subject: "둘째/미술", day: "수", timeSlot: "15:00 ~ 16:00", colorType: "second" },
  [createTimetableKey("금", "15:00 ~ 16:00")]: { id: createTimetableKey("금", "15:00 ~ 16:00"), subject: "첫째/수학", day: "금", timeSlot: "15:00 ~ 16:00", colorType: "first" },
  [createTimetableKey("토", "15:00 ~ 16:00")]: { id: createTimetableKey("토", "15:00 ~ 16:00"), subject: "둘째/피아노", day: "토", timeSlot: "15:00 ~ 16:00", colorType: "second" },
  [createTimetableKey("월", "16:00 ~ 17:00")]: { id: createTimetableKey("월", "16:00 ~ 17:00"), subject: "둘째/태권도", day: "월", timeSlot: "16:00 ~ 17:00", colorType: "second" },
  [createTimetableKey("화", "16:00 ~ 17:00")]: { id: createTimetableKey("화", "16:00 ~ 17:00"), subject: "첫째/코딩", day: "화", timeSlot: "16:00 ~ 17:00", colorType: "first" },
  [createTimetableKey("목", "16:00 ~ 17:00")]: { id: createTimetableKey("목", "16:00 ~ 17:00"), subject: "첫째/과학", day: "목", timeSlot: "16:00 ~ 17:00", colorType: "first" },
  [createTimetableKey("금", "16:00 ~ 17:00")]: { id: createTimetableKey("금", "16:00 ~ 17:00"), subject: "둘째/영어", day: "금", timeSlot: "16:00 ~ 17:00", colorType: "second" },
  [createTimetableKey("월", "17:00 ~ 18:00")]: { id: createTimetableKey("월", "17:00 ~ 18:00"), subject: "첫째 수학 · 둘째 발레", day: "월", timeSlot: "17:00 ~ 18:00", colorType: "both" },
  [createTimetableKey("화", "17:00 ~ 18:00")]: { id: createTimetableKey("화", "17:00 ~ 18:00"), subject: "둘째/독서논술", day: "화", timeSlot: "17:00 ~ 18:00", colorType: "second" },
  [createTimetableKey("수", "17:00 ~ 18:00")]: { id: createTimetableKey("수", "17:00 ~ 18:00"), subject: "첫째/피아노", day: "수", timeSlot: "17:00 ~ 18:00", colorType: "first" },
  [createTimetableKey("목", "17:00 ~ 18:00")]: { id: createTimetableKey("목", "17:00 ~ 18:00"), subject: "둘째/수학", day: "목", timeSlot: "17:00 ~ 18:00", colorType: "second" },
  [createTimetableKey("토", "17:00 ~ 18:00")]: { id: createTimetableKey("토", "17:00 ~ 18:00"), subject: "첫째/축구", day: "토", timeSlot: "17:00 ~ 18:00", colorType: "first" },
  [createTimetableKey("화", "18:00 ~ 19:00")]: { id: createTimetableKey("화", "18:00 ~ 19:00"), subject: "첫째 영어 · 둘째 영어", day: "화", timeSlot: "18:00 ~ 19:00", colorType: "both" },
  [createTimetableKey("수", "18:00 ~ 19:00")]: { id: createTimetableKey("수", "18:00 ~ 19:00"), subject: "둘째/수영", day: "수", timeSlot: "18:00 ~ 19:00", colorType: "second" },
  [createTimetableKey("금", "18:00 ~ 19:00")]: { id: createTimetableKey("금", "18:00 ~ 19:00"), subject: "첫째/논술", day: "금", timeSlot: "18:00 ~ 19:00", colorType: "first" }
};

export function useTimetable(repository: TimetableRepository = localStorageTimetableRepository) {
  const [entries, setEntries] = React.useState<TimetableEntriesByKey>({});

  React.useEffect(() => {
    const init = async () => {
      const stored = await repository.load();

      if (Object.keys(stored).length === 0) {
        await repository.save(seedEntries);
        setEntries(seedEntries);
        return;
      }

      setEntries(stored);
    };

    void init();
  }, [repository]);

  const upsertEntry = React.useCallback(
    async (payload: Omit<TimetableEntry, "id"> & { id?: string }) => {
      const id = payload.id ?? createTimetableKey(payload.day, payload.timeSlot);
      const nextEntries = await repository.upsert({ ...payload, id });
      setEntries(nextEntries);
    },
    [repository]
  );

  const removeEntry = React.useCallback(
    async (id: string) => {
      const nextEntries = await repository.remove(id);
      setEntries(nextEntries);
    },
    [repository]
  );

  return {
    entries,
    upsertEntry,
    removeEntry
  };
}
