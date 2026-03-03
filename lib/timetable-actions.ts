import { createTimetableKey } from "@/lib/timetable-key";

import type { TimetableCellEntry } from "@/components/timetable/timetable-cell";

export type TimetableAction = "add" | "edit" | "delete";

export type SelectedCell = {
  day: string;
  timeSlot: string;
};

export type ActionRequest =
  | { kind: "select-cell" }
  | { kind: "confirm-delete"; cell: SelectedCell; currentEntry?: TimetableCellEntry }
  | { kind: "open-editor"; mode: "add" | "edit"; cell: SelectedCell; currentEntry?: TimetableCellEntry };

export type EditorPayload = {
  content: string;
  type: Exclude<TimetableCellEntry["type"], "empty">;
};

export function applyBlock(
  entries: Record<string, TimetableCellEntry>,
  cell: SelectedCell,
  mode: "upsert" | "delete",
  payload?: EditorPayload
): Record<string, TimetableCellEntry> {
  const key = createTimetableKey(cell.day, cell.timeSlot);

  if (mode === "delete") {
    const { [key]: _deleted, ...rest } = entries;
    return rest;
  }

  const safeContent = payload?.content.trim() || "수업";

  return {
    ...entries,
    [key]: {
      content: safeContent,
      type: payload?.type ?? "first"
    }
  };
}

export function runAction(
  action: TimetableAction,
  selectedCell: SelectedCell | null,
  entries: Record<string, TimetableCellEntry>
): ActionRequest {
  if (!selectedCell) {
    return { kind: "select-cell" };
  }

  const key = createTimetableKey(selectedCell.day, selectedCell.timeSlot);
  const currentEntry = entries[key];

  if (action === "delete") {
    return { kind: "confirm-delete", cell: selectedCell, currentEntry };
  }

  if (action === "add") {
    return {
      kind: "open-editor",
      mode: "add",
      cell: selectedCell,
      currentEntry
    };
  }

  return {
    kind: "open-editor",
    mode: "edit",
    cell: selectedCell,
    currentEntry
  };
}
