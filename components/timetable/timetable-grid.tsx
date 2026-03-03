import { TimetableCell, type TimetableCellStatus } from "@/components/timetable/timetable-cell";
import { createTimetableKey } from "@/lib/timetable-key";

export type TimetableEntry = {
  status: TimetableCellStatus;
  label?: string;
};

type TimetableGridProps = {
  days: string[];
  timeSlots: string[];
  entries: Record<string, TimetableEntry>;
  onCellClick?: (day: string, timeSlot: string, entry?: TimetableEntry) => void;
};

export function TimetableGrid({ days, timeSlots, entries, onCellClick }: TimetableGridProps) {
  return (
    <table aria-label="자녀 주간 시간표" className="w-full table-fixed border-collapse text-center">
      <caption className="sr-only">요일과 시간대별 수업 배정표</caption>
      <thead>
        <tr>
          <th scope="col" className="border border-slate-200 bg-slate-100 px-3 py-2">
            시간
          </th>
          {days.map((day) => (
            <th key={day} scope="col" className="border border-slate-200 bg-slate-100 px-3 py-2">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th scope="row" className="border border-slate-200 bg-slate-50 px-3 py-2">
              {timeSlot}
            </th>
            {days.map((day) => {
              const key = createTimetableKey(day, timeSlot);
              const entry = entries[key];
              const status = entry?.status ?? "빈칸";
              const classLabel = entry?.label ?? "비어 있음";
              const ariaLabel = `${day}요일 ${timeSlot} ${classLabel}`;

              return (
                <td key={key} className="border border-slate-200 px-2 py-2">
                  <TimetableCell
                    status={status}
                    label={entry?.label}
                    ariaLabel={ariaLabel}
                    onClick={onCellClick ? () => onCellClick(day, timeSlot, entry) : undefined}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
