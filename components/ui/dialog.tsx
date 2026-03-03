"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog 컴포넌트는 Dialog 내부에서만 사용해야 합니다.");
  }

  return context;
}

export function Dialog({ open, onOpenChange, children }: React.PropsWithChildren<DialogContextValue>) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

export function DialogPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

export function DialogOverlay({ className }: { className?: string }) {
  const { open } = useDialogContext();

  if (!open) {
    return null;
  }

  return <div className={cn("fixed inset-0 z-40 bg-black/40", className)} aria-hidden="true" />;
}

export function DialogContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const { open, onOpenChange } = useDialogContext();

  if (!open) {
    return null;
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
        <div className={cn("w-full max-w-md rounded-xl border bg-white p-6 shadow-xl", className)}>
          {children}
          <button type="button" className="sr-only" onClick={() => onOpenChange(false)}>
            닫기
          </button>
        </div>
      </div>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />;
}
