import { cn } from "@/lib/utils";
import type { TimetableColorType } from "@/types/timetable";

export type TimetableCellType = TimetableColorType;

export type TimetableCellEntry = {
  content: string;
  type: TimetableCellType;
};

type TimetableCellProps = {
  day: string;
  timeSlot: string;
  entry?: TimetableCellEntry;
  selected?: boolean;
  onClick?: (day: string, timeSlot: string) => void;
};

const stateStyles: Record<TimetableCellType, string> = {
  first: "bg-blue-50 text-blue-700",
  second: "bg-amber-100/60 text-amber-900",
  both: "bg-[linear-gradient(135deg,#e8f2ff_0_50%,#fff8df_50%_100%)] text-slate-700",
  empty: "bg-transparent text-slate-300"
};

const stateLabels: Record<TimetableCellType, string> = {
  first: "첫째 일정",
  second: "둘째 일정",
  both: "공동 일정",
  empty: "빈칸"
};

export function TimetableCell({ day, timeSlot, entry, selected = false, onClick }: TimetableCellProps) {
  const value = entry ?? { content: "—", type: "empty" as const };

  return (
    <td className="border-b border-r border-slate-200 p-2 last:border-r-0">
      <button
        type="button"
        onClick={() => onClick?.(day, timeSlot)}
        className={cn(
          "grid min-h-12 w-full place-items-center rounded-lg px-2 py-2 text-xs font-semibold leading-relaxed md:text-sm",
          stateStyles[value.type],
          selected && "outline outline-2 outline-offset-2 outline-slate-500"
        )}
        aria-label={`${day} ${timeSlot} ${stateLabels[value.type]}: ${value.content}`}
        aria-pressed={selected}
      >
        {value.content.split("/").map((line) => (
          <span key={`${day}-${timeSlot}-${line}`}>{line}</span>
        ))}
      </button>
    </td>
  );
}
