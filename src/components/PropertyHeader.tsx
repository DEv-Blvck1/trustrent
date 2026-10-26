"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  Bell,
  Plus,
  Printer,
  Edit3,
  Trash2,
  MessageSquare,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Property } from "@/types/property";
import {
  calculateLeaseProgress,
  daysUntil,
  fmtNaira,
  formatDate,
  cleanPhoneForWhatsApp,
  createWhatsAppRenewalMessage,
} from "@/lib/utils";

interface PropertyHeaderProps {
  property: Property;
  onLogPayment: () => void;
  onEditProperty: () => void;
  onDeleteProperty: () => void;
  onPrintStatement: () => void;
}

export function PropertyHeader({
  property,
  onLogPayment,
  onEditProperty,
  onDeleteProperty,
  onPrintStatement,
}: PropertyHeaderProps) {
  const daysLeft = daysUntil(property.endDate);
  const progress = calculateLeaseProgress(property.startDate, property.endDate);

  const PROP_STATUS = {
    active: { label: "Active Tenancy", cls: "badge-active" },
    expired: { label: "Expired Lease", cls: "badge-overdue" },
    terminated: { label: "Terminated", cls: "badge-terminated" },
  };

  // WhatsApp quick negotiation URL for renewal
  const recipientPhone = property.agentPhone || property.landlordPhone;
  const recipientName = property.agentName || property.landlordName;
  const whatsAppUrl = recipientPhone
    ? `https://wa.me/${cleanPhoneForWhatsApp(recipientPhone)}?text=${createWhatsAppRenewalMessage({
        landlordOrAgentName: recipientName,
        propertyAddress: property.address,
        endDate: formatDate(property.endDate),
        daysRemaining: Math.max(0, daysLeft),
      })}`
    : null;

  return (
    <div className="card p-6 bg-white border border-[#e6ddce] shadow-sm space-y-5 fade-in">
      {/* Top Details & Action Buttons */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Title and Location */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1b130a] tracking-tight">
              {property.title || property.address}
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                PROP_STATUS[property.status].cls
              }`}
            >
              {PROP_STATUS[property.status].label}
            </span>
          </div>

          <p className="text-sm text-[#786953] flex items-center gap-1.5">
            <MapPin size={14} className="text-[#c4601a] flex-shrink-0" />
            <span>
              {property.address}, {property.area}, {property.city}
            </span>
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="flex items-center gap-5 xl:text-right w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-[#e6ddce]">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-[#786953]">
              Contract Rent
            </p>
            <p className="font-mono font-bold text-2xl lg:text-3xl text-[#c4601a] leading-tight">
              {fmtNaira(property.rentAmount)}
            </p>
            <p className="text-xs text-[#786953] capitalize">
              Billed {property.frequency}
            </p>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 pt-3 border-t border-[#e6ddce]">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onLogPayment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm shadow-[#c4601a]/20"
          >
            <Plus size={14} className="stroke-[2.5]" /> Log Payment
          </button>

          {whatsAppUrl && (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#226444]/10 text-[#226444] text-xs font-semibold hover:bg-[#226444]/20 transition-colors"
            >
              <MessageSquare size={14} /> WhatsApp {property.agentName ? "Agent" : "Landlord"}
            </a>
          )}

          <button
            onClick={onPrintStatement}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6ef] border border-[#e6ddce] text-[#1b130a] text-xs font-semibold hover:bg-[#f3ece0] transition-colors"
          >
            <Printer size={14} /> Printable Statement
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onEditProperty}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef] text-xs font-medium transition-colors"
            title="Edit property details"
          >
            <Edit3 size={14} /> Edit
          </button>

          <button
            onClick={onDeleteProperty}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#fee2e2] text-[#b91c1c] hover:bg-[#fee2e2] text-xs font-medium transition-colors"
            title="Delete this property"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Visual Lease Timeline Bar */}
      <div className="p-4 rounded-xl bg-[#faf6ef] border border-[#e6ddce]">
        <div className="flex items-center justify-between text-xs text-[#786953] mb-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-[#c4601a]" /> Lease Duration:{" "}
            <strong className="text-[#1b130a]">{formatDate(property.startDate)}</strong> to{" "}
            <strong className="text-[#1b130a]">{formatDate(property.endDate)}</strong>
          </span>
          <span
            className={`font-bold flex items-center gap-1 ${
              daysLeft < 30
                ? "text-[#b91c1c]"
                : daysLeft < 90
                ? "text-[#c4601a]"
                : "text-[#226444]"
            }`}
          >
            <Clock size={13} />
            {daysLeft > 0 ? `${daysLeft} days remaining` : `Expired ${Math.abs(daysLeft)} days ago`}
          </span>
        </div>

        <div className="h-2.5 rounded-full bg-[#e6ddce] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              daysLeft <= 0
                ? "bg-[#b91c1c]"
                : daysLeft < 60
                ? "bg-[#c4601a]"
                : "bg-[#226444]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-[#786953] mt-2">
          <span>Started: {formatDate(property.startDate)}</span>
          <span className="font-semibold">{Math.round(progress)}% of term elapsed</span>
          <span>Expires: {formatDate(property.endDate)}</span>
        </div>
      </div>

      {/* Nigerian Tenancy Renewal Alert (triggers at <60 days) */}
      {daysLeft > 0 && daysLeft <= 60 && (
        <div className="flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#991b1b]">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-[#b91c1c] flex-shrink-0" />
            <p className="text-xs">
              <strong>Lease Renewal Notice:</strong> Only <strong>{daysLeft} days</strong> left. Under Nigerian tenancy laws, 30–60 days notice is required to negotiate rent adjustments or give quit intentions before lease rollover.
            </p>
          </div>
          {whatsAppUrl && (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#b91c1c] text-white text-xs font-semibold hover:bg-[#991b1b] whitespace-nowrap"
            >
              Contact Now
            </a>
          )}
        </div>
      )}
    </div>
  );
}

