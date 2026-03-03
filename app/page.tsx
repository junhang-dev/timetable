"use client";

import * as React from "react";

import { TimetableGrid } from "@/components/timetable/timetable-grid";
import type { TimetableCellEntry } from "@/components/timetable/timetable-cell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applyBlock, runAction, type SelectedCell, type TimetableAction } from "@/lib/timetable-actions";
import { createTimetableKey } from "@/lib/timetable-key";

const days = ["월", "화", "수", "목", "금", "토"];
const timeSlots = ["15:00 ~ 16:00", "16:00 ~ 17:00", "17:00 ~ 18:00", "18:00 ~ 19:00"];

const initialEntries: Record<string, TimetableCellEntry> = {
  [createTimetableKey("월", "15:00 ~ 16:00")]: { content: "첫째/영어", type: "first" },
  [createTimetableKey("수", "15:00 ~ 16:00")]: { content: "둘째/미술", type: "second" },
  [createTimetableKey("금", "15:00 ~ 16:00")]: { content: "첫째/수학", type: "first" },
  [createTimetableKey("토", "15:00 ~ 16:00")]: { content: "둘째/피아노", type: "second" },
  [createTimetableKey("월", "16:00 ~ 17:00")]: { content: "둘째/태권도", type: "second" },
  [createTimetableKey("화", "16:00 ~ 17:00")]: { content: "첫째/코딩", type: "first" },
  [createTimetableKey("목", "16:00 ~ 17:00")]: { content: "첫째/과학", type: "first" },
  [createTimetableKey("금", "16:00 ~ 17:00")]: { content: "둘째/영어", type: "second" },
  [createTimetableKey("월", "17:00 ~ 18:00")]: { content: "첫째 수학 · 둘째 발레", type: "both" },
  [createTimetableKey("화", "17:00 ~ 18:00")]: { content: "둘째/독서논술", type: "second" },
  [createTimetableKey("수", "17:00 ~ 18:00")]: { content: "첫째/피아노", type: "first" },
  [createTimetableKey("목", "17:00 ~ 18:00")]: { content: "둘째/수학", type: "second" },
  [createTimetableKey("토", "17:00 ~ 18:00")]: { content: "첫째/축구", type: "first" },
  [createTimetableKey("화", "18:00 ~ 19:00")]: { content: "첫째 영어 · 둘째 영어", type: "both" },
  [createTimetableKey("수", "18:00 ~ 19:00")]: { content: "둘째/수영", type: "second" },
  [createTimetableKey("금", "18:00 ~ 19:00")]: { content: "첫째/논술", type: "first" }
};

type EditorState = {
  open: boolean;
  mode: "add" | "edit";
  cell: SelectedCell | null;
  content: string;
  type: "first" | "second" | "both";
};

export default function Home() {
  const [activeAction, setActiveAction] = React.useState<TimetableAction>("edit");
  const [selectedCell, setSelectedCell] = React.useState<SelectedCell | null>(null);
  const [entries, setEntries] = React.useState<Record<string, TimetableCellEntry>>(initialEntries);
  const [notice, setNotice] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editorState, setEditorState] = React.useState<EditorState>({
    open: false,
    mode: "add",
    cell: null,
    content: "",
    type: "first"
  });

  const selectedKey = selectedCell ? createTimetableKey(selectedCell.day, selectedCell.timeSlot) : null;

  const handleCellClick = (day: string, timeSlot: string) => {
    setNotice("");
    setSelectedCell((prev) => {
      if (prev?.day === day && prev.timeSlot === timeSlot) {
        return null;
      }

      return { day, timeSlot };
    });
  };

  const handleActionClick = (action: TimetableAction) => {
    setActiveAction(action);

    const request = runAction(action, selectedCell, entries);

    if (request.kind === "select-cell") {
      setNotice("먼저 시간표 셀을 선택해 주세요.");
      return;
    }

    if (request.kind === "confirm-delete") {
      setDeleteDialogOpen(true);
      return;
    }

    const defaultType = request.currentEntry?.type === "empty" || !request.currentEntry ? "first" : request.currentEntry.type;
    setEditorState({
      open: true,
      mode: request.mode,
      cell: request.cell,
      content: request.currentEntry?.content ?? "",
      type: defaultType
    });
  };

  const handleSubmitEditor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editorState.cell) {
      return;
    }

    setEntries((prev) => applyBlock(prev, editorState.cell as SelectedCell, "upsert", { content: editorState.content, type: editorState.type }));
    setEditorState((prev) => ({ ...prev, open: false }));
  };

  const handleDelete = () => {
    if (!selectedCell) {
      return;
    }

    setEntries((prev) => applyBlock(prev, selectedCell, "delete"));
    setDeleteDialogOpen(false);
    setNotice("선택한 셀 내용을 삭제했어요.");
  };

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
                <Button variant={activeAction === "add" ? "default" : "outline"} onClick={() => handleActionClick("add")}>
                  추가
                </Button>
                <Button variant={activeAction === "edit" ? "default" : "outline"} onClick={() => handleActionClick("edit")}>
                  수정
                </Button>
                <Button variant={activeAction === "delete" ? "destructive" : "outline"} onClick={() => handleActionClick("delete")}>
                  삭제
                </Button>
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
          <TimetableGrid days={days} timeSlots={timeSlots} entries={entries} selectedKey={selectedKey} onCellClick={handleCellClick} />
          {notice ? <p className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">{notice}</p> : null}
          <p className="text-sm text-slate-500">※ 필요하면 과목명/시간은 그대로 수정해서 바로 사용할 수 있어요.</p>
          <p className="text-xs text-slate-500 md:text-sm">사용법: 셀을 클릭해 선택/해제한 뒤, 추가/수정/삭제 버튼으로 작업하세요.</p>
        </CardContent>
      </Card>

      <Dialog
        open={editorState.open}
        onOpenChange={(open) => {
          setEditorState((prev) => ({ ...prev, open }));
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editorState.mode === "add" ? "수업 추가" : "수업 수정"}</DialogTitle>
            <DialogDescription>
              {editorState.cell ? `${editorState.cell.day}요일 ${editorState.cell.timeSlot}` : "셀을 선택해 주세요."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmitEditor}>
            <div className="space-y-2">
              <label htmlFor="class-content" className="text-sm font-medium text-slate-700">
                수업명
              </label>
              <Input
                id="class-content"
                value={editorState.content}
                onChange={(event) => setEditorState((prev) => ({ ...prev, content: event.target.value }))}
                placeholder="예: 첫째/영어"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="class-type" className="text-sm font-medium text-slate-700">
                색상 타입
              </label>
              <Select value={editorState.type} onValueChange={(value) => setEditorState((prev) => ({ ...prev, type: value as EditorState["type"] }))}>
                <SelectTrigger className="w-full" />
                <SelectValue />
                <SelectContent>
                  <SelectItem value="first">first (첫째)</SelectItem>
                  <SelectItem value="second">second (둘째)</SelectItem>
                  <SelectItem value="both">both (공동)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditorState((prev) => ({ ...prev, open: false }))}>
                취소
              </Button>
              <Button type="submit">저장</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>삭제 확인</DialogTitle>
            <DialogDescription>선택한 셀의 수업 내용을 삭제할까요?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
