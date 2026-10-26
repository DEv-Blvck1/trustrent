"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  AlertTriangle,
  Scale,
  Calendar,
} from "lucide-react";
import { CautionFeeTracker, Property } from "@/types/property";
import { fmtNaira, formatDate } from "@/lib/utils";

interface CautionTrackerTabProps {
  property: Property;
  onUpdateCautionTracker: (tracker: CautionFeeTracker) => void;
}

export function CautionTrackerTab({
  property,
  onUpdateCautionTracker,
}: CautionTrackerTabProps) {
  const currentTracker: CautionFeeTracker = property.cautionTracker || {
    depositAmount: property.cautionFee || 0,
    refundStatus: property.status === "expired" ? "requested" : "held",
  };

  const [status, setStatus] = useState<CautionFeeTracker["refundStatus"]>(
    currentTracker.refundStatus
  );
  const [refundReceived, setRefundReceived] = useState(
    currentTracker.refundAmountReceived ? String(currentTracker.refundAmountReceived) : ""
  );
  const [deductions, setDeductions] = useState(
    currentTracker.deductionsProposed ? String(currentTracker.deductionsProposed) : ""
  );
  const [reasons, setReasons] = useState(currentTracker.deductionReasons || "");
  const [requestDate, setRequestDate] = useState(
    currentTracker.requestDate || ""
  );
  const [targetDate, setTargetDate] = useState(
    currentTracker.targetRefundDate || ""
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CautionFeeTracker = {
      depositAmount: property.cautionFee || 0,
      refundStatus: status,
      refundAmountReceived: refundReceived ? parseFloat(refundReceived) : undefined,
      deductionsProposed: deductions ? parseFloat(deductions) : undefined,
      deductionReasons: reasons.trim() || undefined,
      requestDate: requestDate || undefined,
      targetRefundDate: targetDate || undefined,
    };
    onUpdateCautionTracker(updated);
    alert("Caution fee recovery status saved.");
  };

  const STEPS = [
    {
      title: "1. Deposit Held",
      desc: "Caution fee paid upon move-in and held in trust by landlord or agent.",
      active: status === "held",
      done: ["requested", "in_review", "partially_refunded", "fully_refunded", "disputed"].includes(status),
    },
    {
      title: "2. Joint Inspection",
      desc: "Move-out walk-through using initial move-in defect logs as reference.",
      active: status === "in_review",
      done: ["partially_refunded", "fully_refunded", "disputed"].includes(status),
    },
    {
      title: "3. Written Request",
      desc: "Formal notice demanding caution fee refund sent via letter or email.",
      active: status === "requested",
      done: ["partially_refunded", "fully_refunded", "disputed"].includes(status),
    },
    {
      title: "4. Resolution / Refund",
      desc: "Full or negotiated refund dispatched to tenant bank account.",
      active: ["partially_refunded", "fully_refunded"].includes(status),
      done: status === "fully_refunded",
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Overview Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 bg-white border border-[#e6ddce] shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-[#786953]">
            Deposit Amount Locked
          </p>
          <p className="font-mono font-bold text-2xl text-[#c4601a] mt-1">
            {fmtNaira(property.cautionFee || 0)}
          </p>
          <p className="text-[11px] text-[#786953] mt-0.5">
            100% refundable subject to genuine damage
          </p>
        </div>

        <div className="card p-5 bg-white border border-[#e6ddce] shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-[#786953]">
            Recovery Status
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                status === "fully_refunded"
                  ? "badge-paid"
                  : status === "disputed"
                  ? "badge-overdue"
                  : "badge-pending"
              }`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
          <p className="text-[11px] text-[#786953] mt-1">
            Target window: within 14–30 days of key return
          </p>
        </div>

        <div className="card p-5 bg-white border border-[#e6ddce] shadow-sm">
          <p className="text-xs uppercase font-bold tracking-wider text-[#786953]">
            Refund Recovered
          </p>
          <p className="font-mono font-bold text-2xl text-[#226444] mt-1">
            {fmtNaira(parseFloat(refundReceived) || 0)}
          </p>
          <p className="text-[11px] text-[#786953] mt-0.5">
            Deductions: {fmtNaira(parseFloat(deductions) || 0)}
          </p>
        </div>
      </div>

      {/* Step Progress Visualizer */}
      <div className="card p-6 bg-white border border-[#e6ddce] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-lg text-[#1b130a]">
          Caution Deposit Recovery Workflow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                step.done
                  ? "bg-[#eaf6ee] border-[#bbf7d0]"
                  : step.active
                  ? "bg-[#faf3ea] border-[#c4601a]"
                  : "bg-[#faf6ef] border-[#e6ddce]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#1b130a]">{step.title}</span>
                {step.done ? (
                  <CheckCircle size={15} className="text-[#226444]" />
                ) : step.active ? (
                  <Clock size={15} className="text-[#c4601a]" />
                ) : null}
              </div>
              <p className="text-[11px] text-[#786953] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form: Update Status & Track Proposed Deductions */}
      <form
        onSubmit={handleSave}
        className="card p-6 bg-white border border-[#e6ddce] shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce]">
          <h3 className="font-display font-bold text-lg text-[#1b130a]">
            Manage Caution Status & Disputes
          </h3>
          <span className="text-xs text-[#786953]">Audit Trail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as CautionFeeTracker["refundStatus"])
              }
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            >
              <option value="held">Held by Landlord / Agent (Active Tenancy)</option>
              <option value="requested">Refund Requested (Move-out notice given)</option>
              <option value="in_review">In Review / Joint Inspection Pending</option>
              <option value="partially_refunded">Partially Refunded (Some deductions)</option>
              <option value="fully_refunded">Fully Refunded (100% returned)</option>
              <option value="disputed">Disputed / Unlawful Withholding</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Refund Amount Received (₦)
            </label>
            <input
              type="number"
              placeholder="0"
              value={refundReceived}
              onChange={(e) => setRefundReceived(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Proposed Deductions (₦)
            </label>
            <input
              type="number"
              placeholder="e.g. 35000"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Date Refund Was Demanded
            </label>
            <input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
            Landlord&apos;s Stated Reasons for Deductions / Dispute Notes
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Landlord claimed ₦40,000 for repainting sitting room. Countered with evidence that paint was peeling on move-in day."
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
            className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl p-3 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a] resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm"
          >
            Save Status & Record
          </button>
        </div>
      </form>

      {/* Legal Guide & Rights Accordion */}
      <div className="card p-5 bg-[#faf6ef] border border-[#e6ddce] space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1b130a]">
          <Scale size={18} className="text-[#c4601a]" />
          <h4>Your Legal Rights Under Nigerian Tenancy Law</h4>
        </div>
        <ul className="text-xs text-[#786953] space-y-1.5 list-disc pl-5 leading-relaxed">
          <li>
            <strong>Reasonable Wear and Tear:</strong> Landlords cannot deduct costs for natural fading of paint, sun-exposed roofs, or aging pipe fixtures resulting from normal usage.
          </li>
          <li>
            <strong>Receipt Requirement:</strong> If a landlord deducts money from your caution fee, they are legally obligated to present genuine third-party receipts/invoices for the actual repairs performed.
          </li>
          <li>
            <strong>Pre-existing Defects:</strong> Any damage present before your tenancy commencement date cannot be billed to your caution account.
          </li>
        </ul>
      </div>
    </div>
  );
}

