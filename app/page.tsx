import { TimetableGrid, type TimetableEntry } from "@/components/timetable/timetable-grid";
import { createTimetableKey } from "@/lib/timetable-key";

const DAYS = ["월", "화", "수", "목", "금"];
const TIME_SLOTS = ["15:00", "16:00", "17:00", "18:00"];

const RAW_ENTRIES: Array<{ day: string; timeSlot: string; entry: TimetableEntry }> = [
  { day: "월", timeSlot: "15:00", entry: { status: "첫째", label: "수학" } },
  { day: "월", timeSlot: "17:00", entry: { status: "공동", label: "영어" } },
  { day: "화", timeSlot: "16:00", entry: { status: "둘째", label: "피아노" } },
  { day: "수", timeSlot: "18:00", entry: { status: "첫째", label: "과학" } },
  { day: "금", timeSlot: "17:00", entry: { status: "둘째", label: "미술" } },
];

const ENTRIES = RAW_ENTRIES.reduce<Record<string, TimetableEntry>>((acc, { day, timeSlot, entry }) => {
  acc[createTimetableKey(day, timeSlot)] = entry;
  return acc;
}, {});

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">주간 시간표</h1>
      <TimetableGrid days={DAYS} timeSlots={TIME_SLOTS} entries={ENTRIES} />
    </main>
  );
}
