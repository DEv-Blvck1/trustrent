"use client";

import React, { useState } from "react";
import { X, CreditCard, Sparkles } from "lucide-react";
import { PaymentRecord, PaymentStatus, Property } from "@/types/property";
import { genId, generateReceiptNumber } from "@/lib/utils";

interface AddPaymentModalProps {
  property: Property;
  onClose: () => void;
  onAddPayment: (newPayment: PaymentRecord) => void;
}

export function AddPaymentModal({
  property,
  onClose,
  onAddPayment,
}: AddPaymentModalProps) {
  const [formData, setFormData] = useState({
    period: "",
    amount: String(property.rentAmount || ""),
    dueDate: new Date().toISOString().split("T")[0],
    paidDate: new Date().toISOString().split("T")[0],
    status: "paid" as PaymentStatus,
    paymentMethod: "Direct Bank Transfer",
    receiptNo: generateReceiptNumber(),
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.period.trim() || !formData.amount) {
      alert("Please enter the rental period and amount.");
      return;
    }

    const newPayment: PaymentRecord = {
      id: genId(),
      period: formData.period.trim(),
      amount: parseFloat(formData.amount) || 0,
      dueDate: formData.dueDate,
      paidDate: formData.status === "paid" ? formData.paidDate || undefined : undefined,
      status: formData.status,
      paymentMethod: formData.paymentMethod.trim() || undefined,
      receiptNo: formData.receiptNo.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    onAddPayment(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-md bg-white p-6 shadow-2xl relative my-8 border border-[#e6ddce]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e6ddce]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c4601a]/15 text-[#c4601a] flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1b130a]">
                Log Rent Payment
              </h3>
              <p className="text-xs text-[#786953]">
                Record rent payment for {property.address}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Covered Period *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apr 2026 – Mar 2027"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Amount Paid / Due (₦) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 1800000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Paid Date (if paid)
              </label>
              <input
                type="date"
                value={formData.paidDate}
                onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1.5">
              Payment Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["paid", "pending", "overdue"] as PaymentStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setFormData({ ...formData, status: st })}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    formData.status === st
                      ? st === "paid"
                        ? "badge-paid border-[#bbf7d0]"
                        : st === "overdue"
                        ? "badge-overdue border-[#fecaca]"
                        : "badge-pending border-[#fde68a]"
                      : "bg-[#faf6ef] border-[#e6ddce] text-[#786953]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Payment Method
            </label>
            <input
              type="text"
              placeholder="e.g. GTBank Mobile App, Zenith Transfer, Bank Draft"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953]">
                Receipt / Teller Ref Number
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, receiptNo: generateReceiptNumber() })
                }
                className="text-[10px] text-[#c4601a] font-semibold hover:underline"
              >
                Regenerate
              </button>
            </div>
            <input
              type="text"
              placeholder="TR-RCT-2026-001"
              value={formData.receiptNo}
              onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a] font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Notes / Acknowledgment
            </label>
            <input
              type="text"
              placeholder="e.g. Landlord confirmed credit via SMS"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#e6ddce]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953] hover:bg-[#faf6ef]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm"
            >
              Save Payment Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

