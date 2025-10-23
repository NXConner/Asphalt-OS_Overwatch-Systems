"use client";

import * as React from "react";

export type Toast = { id: string; title?: string; description?: string; variant?: "default" | "destructive" };

const ToastContext = React.createContext<{ toasts: Toast[]; add: (t: Omit<Toast, "id">) => void; remove: (id: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const add = (t: Omit<Toast, "id">) => setToasts((prev) => [...prev, { id: Math.random().toString(36).slice(2), ...t }]);
  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return <ToastContext.Provider value={{ toasts, add, remove }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
