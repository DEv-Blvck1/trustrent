"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Printer,
  Trash2,
  FileText,
  Share2,
  Check,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { PaymentRecord, PaymentStatus, Property } from "@/types/property";
import {
  fmtNaira,
  formatDate,
  cleanPhoneForWhatsApp,
  createWhatsAppRentReceiptMessage,
} from "@/lib/utils";

interface PaymentsTabProps {
  property: Property;
  onAddPayment: () => void;
  onDeletePayment: (paymentId: string) => void;
  onTogglePaymentStatus: (paymentId: string, newStatus: PaymentStatus) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export function PaymentsTab({
  property,
  onAddPayment,
  onDeletePayment,
  onTogglePaymentStatus,
  onViewReceipt,
}: PaymentsTabProps) {
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");

  const filteredPayments = property.payments.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const STATUS_CONFIG: Record<
    PaymentStatus,
    { label: string; badgeCls: string; icon: React.ReactNode }
  > = {
    paid: {
      label: "Paid & Verified",
      badgeCls: "badge-paid",
      icon: <CheckCircle size={16} className="text-[#226444]" />,
    },
    pending: {
      label: "Pending Payment",
      badgeCls: "badge-pending",
      icon: <Clock size={16} className="text-[#b45309]" />,
    },
    overdue: {
      label: "Overdue",
      badgeCls: "badge-overdue",
      icon: <AlertCircle size={16} className="text-[#b91c1c]" />,
    },
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Action Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#e6ddce]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "paid", "pending", "overdue"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === s
                  ? "bg-[#1b130a] text-white shadow-sm"
                  : "bg-white text-[#786953] border border-[#e6ddce] hover:bg-[#faf6ef]"
              }`}
            >
              {s} ({s === "all" ? property.payments.length : property.payments.filter((p) => p.status === s).length})
            </button>
          ))}
        </div>

        <button
          onClick={onAddPayment}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm shadow-[#c4601a]/20"
        >
          <Plus size={14} className="stroke-[2.5]" /> Log New Payment
        </button>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filteredPayments.map((pay) => {
          const recipientPhone = property.agentPhone || property.landlordPhone;
          const recipientName = property.agentName || property.landlordName;
          const whatsAppUrl =
            recipientPhone && pay.status === "paid"
              ? `https://wa.me/${cleanPhoneForWhatsApp(recipientPhone)}?text=${createWhatsAppRentReceiptMessage({
                  landlordOrAgentName: recipientName,
                  propertyAddress: property.address,
                  amount: pay.amount,
                  period: pay.period,
                  receiptNo: pay.receiptNo || "N/A",
                  paidDate: formatDate(pay.paidDate || pay.dueDate),
                })}`
              : null;

          return (
            <div
              key={pay.id}
              className="card p-5 bg-white border border-[#e6ddce] hover:border-[#c4601a]/30 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left: Status Icon and Details */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      pay.status === "paid"
                        ? "bg-[#eaf6ee]"
                        : pay.status === "overdue"
                        ? "bg-[#fef2f2]"
                        : "bg-[#fffbeb]"
                    }`}
                  >
                    {STATUS_CONFIG[pay.status].icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-[#1b130a]">
                        {pay.period}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          STATUS_CONFIG[pay.status].badgeCls
                        }`}
                      >
                        {STATUS_CONFIG[pay.status].label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#786953] flex-wrap">
                      <span>Due: <strong>{formatDate(pay.dueDate)}</strong></span>
                      {pay.paidDate && (
                        <span>
                          • Paid: <strong className="text-[#226444]">{formatDate(pay.paidDate)}</strong>
                        </span>
                      )}
                      {pay.paymentMethod && (
                        <span>• Via: <em>{pay.paymentMethod}</em></span>
                      )}
                    </div>

                    {pay.receiptNo && (
                      <p className="text-xs text-[#786953] font-mono flex items-center gap-1.5 pt-0.5">
                        <FileText size={12} className="text-[#c4601a]" />
                        <span>Ref: {pay.receiptNo}</span>
                      </p>
                    )}

                    {pay.notes && (
                      <p className="text-xs text-[#786953] italic pt-1">
                        &quot;{pay.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-[#e6ddce]">
                  <div className="text-left lg:text-right">
                    <p className="font-mono font-bold text-xl text-[#1b130a]">
                      {fmtNaira(pay.amount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View/Print Receipt */}
                    <button
                      onClick={() => onViewReceipt(pay)}
                      className="p-2 rounded-xl border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View & Print Formal Receipt"
                    >
                      <Printer size={14} />
                      <span className="hidden sm:inline">Receipt</span>
                    </button>

                    {/* WhatsApp share */}
                    {whatsAppUrl && (
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#226444]/10 text-[#226444] hover:bg-[#226444]/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Share payment confirmation on WhatsApp"
                      >
                        <MessageSquare size={14} />
                        <span className="hidden sm:inline">Share</span>
                      </a>
                    )}

                    {/* Toggle Paid / Pending */}
                    {pay.status !== "paid" ? (
                      <button
                        onClick={() => onTogglePaymentStatus(pay.id, "paid")}
                        className="px-2.5 py-2 rounded-xl bg-[#226444] text-white hover:bg-[#1a4f35] text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Mark payment as Paid"
                      >
                        <Check size={13} className="stroke-[3]" />
                        <span>Mark Paid</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onTogglePaymentStatus(pay.id, "pending")}
                        className="px-2 py-1.5 rounded-lg border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] text-xs"
                        title="Revert to pending"
                      >
                        Revert
                      </button>
                    )}

                    {/* Delete payment */}
                    <button
                      onClick={() => onDeletePayment(pay.id)}
                      className="p-2 rounded-xl border border-[#fee2e2] text-[#b91c1c] hover:bg-[#fee2e2] text-xs transition-colors"
                      title="Delete payment entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPayments.length === 0 && (
          <div className="card p-12 text-center text-[#786953] border-dashed border-[#e6ddce]">
            <CreditCard size={32} className="mx-auto mb-2 opacity-30 text-[#c4601a]" />
            <p className="text-sm font-semibold text-[#1b130a]">
              No payment records found
            </p>
            <p className="text-xs mt-1">
              {filter !== "all"
                ? `No payments matching "${filter}" status.`
                : "Record your rent transfers and receipts to maintain an indisputable payment trail."}
            </p>
            <button
              onClick={onAddPayment}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014]"
            >
              <Plus size={14} /> Log First Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

