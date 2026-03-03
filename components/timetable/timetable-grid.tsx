import { createTimetableKey } from "@/lib/timetable-key";

import { TimetableCell, type TimetableCellEntry } from "@/components/timetable/timetable-cell";

type TimetableGridProps = {
  days: string[];
  timeSlots: string[];
  entries: Record<string, TimetableCellEntry>;
  selectedKey?: string | null;
  onCellClick?: (day: string, timeSlot: string) => void;
};

export function TimetableGrid({ days, timeSlots, entries, selectedKey, onCellClick }: TimetableGridProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full table-fixed border-collapse text-center text-sm md:text-base" aria-label="주간 학원 시간표">
        <thead>
          <tr className="bg-slate-100">
            <th scope="col" className="w-28 border-b border-r border-slate-200 bg-slate-200 px-2 py-3 font-semibold">
              시간
            </th>
            {days.map((day) => (
              <th key={day} scope="col" className="border-b border-r border-slate-200 px-2 py-3 font-semibold last:border-r-0">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <th scope="row" className="border-b border-r border-slate-200 bg-slate-50 px-2 py-3 text-xs font-medium md:text-sm">
                {timeSlot}
              </th>
              {days.map((day) => {
                const key = createTimetableKey(day, timeSlot);

                return (
                  <TimetableCell
                    key={key}
                    day={day}
                    timeSlot={timeSlot}
                    entry={entries[key]}
                    selected={selectedKey === key}
                    onClick={onCellClick}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
