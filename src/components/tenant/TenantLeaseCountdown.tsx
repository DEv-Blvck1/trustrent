"use client";

import React from "react";
import { Clock, Calendar, AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import { Property } from "@/types/property";
import { formatDate, fmtNaira } from "@/lib/utils";

interface TenantLeaseCountdownProps {
  property: Property;
  onSendRenewalInquiry?: () => void;
}

export function TenantLeaseCountdown({
  property,
  onSendRenewalInquiry,
}: TenantLeaseCountdownProps) {
  const start = new Date(property.startDate + "T00:00:00").getTime();
  const end = new Date(property.endDate + "T00:00:00").getTime();
  const now = Date.now();

  const totalDuration = Math.max(1, end - start);
  const elapsed = Math.max(0, now - start);
  const remaining = Math.max(0, end - now);

  // Remaining percentage for the horizontal bar that reduces as tenancy gets closer to expiry
  const remainingPct = Math.min(100, Math.max(0, (remaining / totalDuration) * 100));
  const daysLeft = Math.ceil(remaining / (1000 * 60 * 60 * 24));

  // Calculate elapsed months of an assumed standard 12-month lease
  const totalMonthsApprox = Math.max(1, totalDuration / (1000 * 60 * 60 * 24 * 30.4));
  const monthsElapsed = (elapsed / totalDuration) * 12;

  // Determine pulsating color according to prompt requirements:
  // "pulsate in green for the first 6 month and after 8 months it becomes yellow and on the 10th month it becomes red pulsating faster"
  let glowClass = "pulse-glow-green";
  let barColor = "from-emerald-500 to-green-600";
  let stageLabel = "Healthy Lease Term (Month 1 – 6)";
  let stageTextColor = "text-green-700";

  if (monthsElapsed >= 10 || daysLeft <= 60) {
    // 10th month and above: RED pulsating FASTER!
    glowClass = "pulse-glow-red";
    barColor = "from-rose-500 to-red-600";
    stageLabel = "Critical Expiration Window (Month 10+)";
    stageTextColor = "text-red-700";
  } else if (monthsElapsed >= 8) {
    // 8th month and above: YELLOW pulsating
    glowClass = "pulse-glow-yellow";
    barColor = "from-amber-400 to-yellow-500";
    stageLabel = "Lease Renewal Preparation (Month 8 – 10)";
    stageTextColor = "text-amber-800";
  }

  // 11th Month check: triggers automated reminder banner
  const is11thMonthOrCloser = monthsElapsed >= 10.5 || daysLeft <= 45;

  return (
    <div className="card p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#0f4c81]">
              Tenancy Time Remaining
            </span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white border border-[#e6ddce] ${stageTextColor}`}
            >
              {stageLabel}
            </span>
          </div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            {daysLeft > 0 ? `${daysLeft} Days Remaining` : "Lease Has Expired"}
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-[#786953]">Contract Cycle</p>
          <p className="text-xs font-bold text-[#1b130a]">
            {formatDate(property.startDate)} – {formatDate(property.endDate)}
          </p>
        </div>
      </div>

      {/* Horizontal Bar that Reduces as Expiry Approaches, with pulsating glow */}
      <div className="space-y-2">
        <div className="h-5 w-full bg-[#f3ece0] rounded-full overflow-hidden p-1 border border-[#e6ddce]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} ${glowClass} transition-all duration-700`}
            style={{ width: `${remainingPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#786953] font-semibold">
          <span>Move-In (Day 1)</span>
          <span className="text-[#1b130a] font-mono">{Math.round(remainingPct)}% term balance</span>
          <span>Lease Rollover (Day 365)</span>
        </div>
      </div>

      {/* 11th-Month Automated Reminder Alert */}
      {is11thMonthOrCloser && (
        <div className="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3.5 text-[#991b1b] animate-in slide-in-from-top-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-white text-[#b91c1c] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bell size={18} className="animate-bounce" />
          </div>
          <div className="space-y-1 flex-1 text-xs">
            <p className="font-bold text-sm">
              🚨 11th-Month Automated Rent Renewal Alert
            </p>
            <p className="leading-relaxed">
              You are now within your 11th month of tenancy. An automated notification has been dispatched to both you and the Property Owner (<strong>{property.landlordName}</strong>) to finalize rent renewal consideration or arrange mutual exit inspections.
            </p>
            {onSendRenewalInquiry && (
              <button
                onClick={onSendRenewalInquiry}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b91c1c] text-white text-xs font-bold hover:bg-[#991b1b]"
              >
                Initiate Renewal Discussion
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

