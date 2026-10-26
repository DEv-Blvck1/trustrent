"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs font-semibold transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
              toast.type === "success"
                ? "bg-[#166534] text-white border border-[#22c55e]/40 shadow-green-900/20"
                : toast.type === "error"
                ? "bg-[#991b1b] text-white border border-[#ef4444]/40 shadow-red-900/20"
                : toast.type === "warning"
                ? "bg-[#b45309] text-white border border-[#f59e0b]/40 shadow-amber-900/20"
                : "bg-[#0f4c81] text-white border border-[#38bdf8]/40 shadow-blue-900/20"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" && <CheckCircle2 size={16} className="text-white flex-shrink-0" />}
              {toast.type === "error" && <AlertCircle size={16} className="text-white flex-shrink-0" />}
              {(toast.type === "info" || toast.type === "warning") && (
                <Info size={16} className="text-white flex-shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

