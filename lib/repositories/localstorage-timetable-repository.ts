import type { TimetableEntriesByKey, TimetableEntry } from "@/types/timetable";

import type { TimetableRepository } from "@/lib/repositories/timetable-repository";

const STORAGE_KEY = "timetable.entries.v1";

function readEntries(): TimetableEntriesByKey {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as TimetableEntriesByKey;
  } catch {
    return {};
  }
}

function writeEntries(entries: TimetableEntriesByKey) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export class LocalStorageTimetableRepository implements TimetableRepository {
  async load() {
    return readEntries();
  }

  async save(entries: TimetableEntriesByKey) {
    writeEntries(entries);
  }

  async upsert(entry: TimetableEntry) {
    const nextEntries = {
      ...readEntries(),
      [entry.id]: entry
    };

    writeEntries(nextEntries);

    return nextEntries;
  }

  async remove(id: string) {
    const { [id]: _deleted, ...rest } = readEntries();
    writeEntries(rest);

    return rest;
  }
}

export const localStorageTimetableRepository = new LocalStorageTimetableRepository();
