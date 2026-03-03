import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { ClassType, ScheduleRow } from "@/types/timetable";

const days = ["월", "화", "수", "목", "금", "토"];

const schedule: ScheduleRow[] = [
  {
    time: "15:00 ~ 16:00",
    classes: [
      { content: "첫째/영어", type: "first" },
      { content: "—", type: "empty" },
      { content: "둘째/미술", type: "second" },
      { content: "—", type: "empty" },
      { content: "첫째/수학", type: "first" },
      { content: "둘째/피아노", type: "second" }
    ]
  },
  {
    time: "16:00 ~ 17:00",
    classes: [
      { content: "둘째/태권도", type: "second" },
      { content: "첫째/코딩", type: "first" },
      { content: "—", type: "empty" },
      { content: "첫째/과학", type: "first" },
      { content: "둘째/영어", type: "second" },
      { content: "—", type: "empty" }
    ]
  },
  {
    time: "17:00 ~ 18:00",
    classes: [
      { content: "첫째 수학 · 둘째 발레", type: "both" },
      { content: "둘째/독서논술", type: "second" },
      { content: "첫째/피아노", type: "first" },
      { content: "둘째/수학", type: "second" },
      { content: "—", type: "empty" },
      { content: "첫째/축구", type: "first" }
    ]
  },
  {
    time: "18:00 ~ 19:00",
    classes: [
      { content: "—", type: "empty" },
      { content: "첫째 영어 · 둘째 영어", type: "both" },
      { content: "둘째/수영", type: "second" },
      { content: "—", type: "empty" },
      { content: "첫째/논술", type: "first" },
      { content: "—", type: "empty" }
    ]
  }
];

const classStyles: Record<ClassType, string> = {
  first: "bg-blue-50 text-blue-700",
  second: "bg-amber-100/60 text-amber-900",
  both: "bg-[linear-gradient(135deg,#e8f2ff_0_50%,#fff8df_50%_100%)] text-slate-700",
  empty: "bg-transparent text-slate-300"
};

export default function Home() {
  return (
    <main className="container flex min-h-screen items-center py-6 md:py-10" aria-label="초등학생 두 명의 주간 학원 시간표">
      <Card className="w-full rounded-3xl border border-slate-200 bg-white/95 shadow-xl">
        <CardHeader className="gap-4 pb-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <CardTitle className="text-2xl md:text-3xl">주간 학원 시간표</CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">첫째(파란색) · 둘째(노란색) 한눈에 보기</CardDescription>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex flex-wrap gap-2" aria-label="시간표 편집 버튼">
                <Button variant="outline">추가</Button>
                <Button>수정</Button>
                <Button variant="outline">삭제</Button>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="색상 구분">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />첫째
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-amber-100/70 px-3 py-1.5 text-sm font-semibold text-amber-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />둘째
                </span>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-600">
              과목 빠른 검색
            </label>
            <Input id="subject" placeholder="예: 영어, 수학" className="max-w-sm" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full table-fixed border-collapse text-center text-sm md:text-base">
              <thead>
                <tr className="bg-slate-100">
                  <th className="w-28 border-b border-r border-slate-200 bg-slate-200 px-2 py-3 font-semibold">시간</th>
                  {days.map((day) => (
                    <th key={day} className="border-b border-r border-slate-200 px-2 py-3 font-semibold last:border-r-0">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.time}>
                    <th className="border-b border-r border-slate-200 bg-slate-50 px-2 py-3 text-xs font-medium md:text-sm">{row.time}</th>
                    {row.classes.map((item, index) => (
                      <td key={`${row.time}-${index}`} className="border-b border-r border-slate-200 p-2 last:border-r-0">
                        <div
                          className={`grid min-h-12 place-items-center rounded-lg px-2 py-2 text-xs font-semibold leading-relaxed md:text-sm ${classStyles[item.type]}`}
                        >
                          {item.content.split("/").map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500">※ 필요하면 과목명/시간은 그대로 수정해서 바로 사용할 수 있어요.</p>
          <p className="text-xs text-slate-500 md:text-sm">
            사용법: 블록을 한 번 클릭하면 선택되고, 같은 블록을 다시 클릭하면 현재 모드(추가/수정/삭제)가 적용돼요. 버튼을 누르면 선택된 블록에 즉시 적용됩니다.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
