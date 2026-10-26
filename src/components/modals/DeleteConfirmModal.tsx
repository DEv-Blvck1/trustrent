"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  title,
  message,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-sm bg-white p-6 shadow-2xl relative border border-[#fee2e2]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              {title}
            </h3>
            <p className="text-xs text-[#786953] mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-[#e6ddce]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953] hover:bg-[#faf6ef]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#b91c1c] text-white text-xs font-semibold hover:bg-[#991b1b] transition-all shadow-sm flex items-center gap-1.5"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

