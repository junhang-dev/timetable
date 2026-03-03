import type { ReactNode } from "react";

export type TimetableCellStatus = "빈칸" | "첫째" | "둘째" | "공동";

type TimetableCellProps = {
  status: TimetableCellStatus;
  label?: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
};

const STYLE_BY_STATUS: Record<TimetableCellStatus, string> = {
  빈칸: "bg-slate-50 text-slate-400",
  첫째: "bg-blue-50 text-blue-700",
  둘째: "bg-amber-50 text-amber-700",
  공동: "bg-[linear-gradient(135deg,#eff6ff_0_50%,#fffbeb_50_100%)] text-slate-700",
};

export function TimetableCell({ status, label, ariaLabel, onClick }: TimetableCellProps) {
  const content = label ?? "-";
  const className = `min-h-12 w-full rounded-md px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 ${STYLE_BY_STATUS[status]} ${onClick ? "cursor-pointer hover:brightness-95" : "cursor-default"}`;

  if (!onClick) {
    return (
      <div aria-label={ariaLabel} className={className}>
        {content}
      </div>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} onClick={onClick} className={className}>
      {content}
    </button>
  );
}
