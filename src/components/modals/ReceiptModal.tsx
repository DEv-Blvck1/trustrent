"use client";

import React from "react";
import { X, Printer, ShieldCheck, Home, CheckCircle2 } from "lucide-react";
import { PaymentRecord, Property } from "@/types/property";
import { fmtNaira, formatDate } from "@/lib/utils";

interface ReceiptModalProps {
  property: Property;
  payment: PaymentRecord;
  onClose: () => void;
}

export function ReceiptModal({ property, payment, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-2xl bg-white p-6 sm:p-8 shadow-2xl relative my-8 border border-[#e6ddce]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e6ddce] no-print">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#786953]">
            <ShieldCheck size={16} className="text-[#226444]" />
            <span>Official Tenancy Payment Record</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="printable-area space-y-6 text-[#1b130a]">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-[#1b130a] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c4601a] text-white flex items-center justify-center font-bold">
                  <Home size={18} />
                </div>
                <h1 className="font-display font-bold text-2xl tracking-tight text-[#1b130a]">
                  TrustRent Receipt
                </h1>
              </div>
              <p className="text-xs text-[#786953] mt-1">
                Tenancy Payment & Audit Certificate
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-[#786953]">
                Receipt Reference
              </p>
              <p className="font-mono font-bold text-base text-[#c4601a]">
                {payment.receiptNo || "TR-RCT-" + payment.id}
              </p>
              <p className="text-xs text-[#786953] mt-0.5">
                Issue Date: {formatDate(payment.paidDate || payment.dueDate)}
              </p>
            </div>
          </div>

          {/* Verification Watermark Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#eaf6ee] border border-[#bbf7d0]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#226444]" />
              <div>
                <p className="text-xs font-bold text-[#166534]">
                  PAYMENT STATUS: {payment.status.toUpperCase()}
                </p>
                <p className="text-[11px] text-[#166534]">
                  Acknowledged Rent Transaction
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-lg text-[#166534]">
                {fmtNaira(payment.amount)}
              </span>
            </div>
          </div>

          {/* Tenancy & Party Details Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs py-2 border-b border-[#e6ddce]">
            <div>
              <p className="font-bold uppercase tracking-wider text-[#786953] mb-1">
                Demised Property
              </p>
              <p className="font-semibold text-sm text-[#1b130a]">
                {property.title || property.address}
              </p>
              <p className="text-[#786953]">
                {property.address}, {property.area}, {property.city}
              </p>
              <p className="text-[#786953] mt-1">
                Lease Cycle: {formatDate(property.startDate)} – {formatDate(property.endDate)}
              </p>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-[#786953] mb-1">
                Landlord / Recipient
              </p>
              <p className="font-semibold text-sm text-[#1b130a]">
                {property.landlordName}
              </p>
              <p className="text-[#786953]">Tel: {property.landlordPhone}</p>
              {property.agentName && (
                <p className="text-[#786953] mt-1">
                  Managing Agent: {property.agentName} ({property.agentPhone})
                </p>
              )}
            </div>
          </div>

          {/* Transaction Line Items */}
          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-xs text-[#786953]">
              Payment Particulars
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e6ddce] text-left text-[#786953]">
                  <th className="py-2">Description</th>
                  <th className="py-2">Covered Period</th>
                  <th className="py-2">Payment Method</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6ddce]/60 font-medium">
                <tr>
                  <td className="py-3 text-[#1b130a]">
                    Rental Consideration
                    {payment.notes && (
                      <span className="block text-[11px] text-[#786953] italic">
                        {payment.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-[#786953]">{payment.period}</td>
                  <td className="py-3 text-[#786953]">
                    {payment.paymentMethod || "Electronic Bank Transfer"}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-sm text-[#1b130a]">
                    {fmtNaira(payment.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Caution Deposit Note */}
          <div className="p-3.5 rounded-xl bg-[#faf6ef] border border-[#e6ddce] text-xs space-y-1">
            <p className="font-bold text-[#1b130a]">
              Statutory Caution Fee Notice
            </p>
            <p className="text-[#786953] text-[11px] leading-relaxed">
              Caution deposit on this premises ({fmtNaira(property.cautionFee)}) remains held in trust and refundable at tenancy vacation subject to pre-existing defect documentation and joint inspection.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-[#e6ddce] grid grid-cols-2 gap-8 text-xs text-[#786953]">
            <div className="space-y-4">
              <div className="h-8 border-b border-dashed border-[#786953]" />
              <p>Landlord / Managing Agent Signature</p>
            </div>
            <div className="space-y-4 text-right">
              <div className="h-8 border-b border-dashed border-[#786953]" />
              <p>Tenant Acknowledgment Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

