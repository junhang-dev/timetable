"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("Select 컴포넌트는 Select 내부에서만 사용해야 합니다.");
  }

  return context;
}

export function Select({ value, onValueChange, children }: React.PropsWithChildren<SelectContextValue>) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const { value, onValueChange } = useSelectContext();

  return (
    <select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </select>
  );
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: React.PropsWithChildren<{ value: string }>) {
  return <option value={value}>{children}</option>;
}
