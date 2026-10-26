"use client";

import React, { useState } from "react";
import { X, Receipt, CheckCircle, Sparkles } from "lucide-react";
import { Property, PaymentRecord } from "@/types/property";
import { generateReceiptNumber, genId, fmtNaira } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

interface AdminIssueReceiptModalProps {
  property: Property;
  onClose: () => void;
  onReceiptIssued: (payment: PaymentRecord) => void;
}

export function AdminIssueReceiptModal({
  property,
  onClose,
  onReceiptIssued,
}: AdminIssueReceiptModalProps) {
  const [period, setPeriod] = useState(
    `${new Date().toLocaleString("default", { month: "short" })} ${new Date().getFullYear()} – Annual Rent`
  );
  const [amount, setAmount] = useState(String(property.rentAmount || ""));
  const [paymentMethod, setPaymentMethod] = useState("Direct Bank Transfer (GTBank)");
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiptNo, setReceiptNo] = useState(generateReceiptNumber());
  const [notes, setNotes] = useState("Rent received in full and verified by Property Owner.");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !period) {
      showToast("Please enter payment period and amount.", "error");
      return;
    }

    const newPayment: PaymentRecord = {
      id: genId(),
      period: period.trim(),
      amount: parseFloat(amount) || 0,
      dueDate: paidDate,
      paidDate: paidDate,
      status: "paid",
      paymentMethod,
      receiptNo,
      notes: notes.trim(),
      issuedByOwner: true,
    };

    onReceiptIssued(newPayment);
    showToast(`Receipt ${receiptNo} issued and dispatched to tenant vault!`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl relative border border-[#e6ddce]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6ddce]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0f4c81]/15 text-[#0f4c81] flex items-center justify-center">
              <Receipt size={18} />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-[#1b130a]">
                Issue Official Rent Receipt
              </h4>
              <p className="text-xs text-[#786953]">
                Tenant: {property.landlordName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#786953] hover:bg-[#faf6ef]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Covered Period *
            </label>
            <input
              type="text"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Amount Received (₦) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Date Payment Confirmed
              </label>
              <input
                type="date"
                required
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Receipt Reference No.
              </label>
              <input
                type="text"
                required
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Payment Channel / Bank
            </label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Acknowledgment Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e6ddce]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] shadow-md shadow-[#0f4c81]/25"
            >
              Issue & Dispatch to Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

