"use client";

import React from "react";
import {
  User,
  Shield,
  Phone,
  Mail,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Property } from "@/types/property";
import { fmtNaira, formatDate, cleanPhoneForWhatsApp } from "@/lib/utils";

interface OverviewTabProps {
  property: Property;
}

export function OverviewTab({ property }: OverviewTabProps) {
  const landlordWhatsApp = property.landlordPhone
    ? `https://wa.me/${cleanPhoneForWhatsApp(property.landlordPhone)}`
    : null;
  const agentWhatsApp = property.agentPhone
    ? `https://wa.me/${cleanPhoneForWhatsApp(property.agentPhone)}`
    : null;

  const totalInitialOutlay =
    (property.rentAmount || 0) +
    (property.cautionFee || 0) +
    (property.agentFee || 0) +
    (property.legalAgreementFee || 0) +
    (property.serviceCharge || 0);

  return (
    <div className="space-y-6 fade-in">
      {/* 2-Column Grid: Contacts & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information Card */}
        <div className="card p-5 bg-white border border-[#e6ddce] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce]">
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Key Contacts
            </h3>
            <span className="text-xs text-[#786953]">Landlord & Caretaker</span>
          </div>

          {/* Landlord Details */}
          <div className="p-3.5 rounded-xl bg-[#faf6ef] border border-[#e6ddce]/60 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c4601a]/15 text-[#c4601a] flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1b130a]">
                    {property.landlordName}
                  </p>
                  <p className="text-xs text-[#786953]">Property Owner / Landlord</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <a
                href={`tel:${property.landlordPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#226444]/10 text-[#226444] text-xs font-semibold hover:bg-[#226444]/20 transition-colors"
              >
                <Phone size={12} /> {property.landlordPhone}
              </a>

              {landlordWhatsApp && (
                <a
                  href={landlordWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#226444] text-white text-xs font-semibold hover:bg-[#1a4f35] transition-colors"
                >
                  <MessageSquare size={12} /> WhatsApp
                </a>
              )}

              {property.landlordEmail && (
                <a
                  href={`mailto:${property.landlordEmail}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  <Mail size={12} /> Email
                </a>
              )}
            </div>
          </div>

          {/* Agent / Facility Manager (If present) */}
          {property.agentName ? (
            <div className="p-3.5 rounded-xl bg-[#faf6ef] border border-[#e6ddce]/60 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#786953]/15 text-[#786953] flex items-center justify-center font-bold">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1b130a]">
                      {property.agentName}
                    </p>
                    <p className="text-xs text-[#786953]">Managing Agent / Caretaker</p>
                  </div>
                </div>
              </div>

              {property.agentPhone && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <a
                    href={`tel:${property.agentPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#786953]/10 text-[#786953] text-xs font-semibold hover:bg-[#786953]/20 transition-colors"
                  >
                    <Phone size={12} /> {property.agentPhone}
                  </a>

                  {agentWhatsApp && (
                    <a
                      href={agentWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#226444] text-white text-xs font-semibold hover:bg-[#1a4f35] transition-colors"
                    >
                      <MessageSquare size={12} /> WhatsApp
                    </a>
                  )}

                  {property.agentEmail && (
                    <a
                      href={`mailto:${property.agentEmail}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Mail size={12} /> Email
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-[#e6ddce] text-center text-xs text-[#786953]">
              No estate agent or caretaker recorded for this property.
            </div>
          )}
        </div>

        {/* Financial Breakdown Card */}
        <div className="card p-5 bg-white border border-[#e6ddce] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce]">
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Financial Breakdown
            </h3>
            <span className="text-xs text-[#786953]">Tenancy Agreement Costing</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-[#e6ddce]/60">
              <span className="text-[#786953]">Contract Rent ({property.frequency})</span>
              <span className="font-mono font-bold text-sm text-[#c4601a]">
                {fmtNaira(property.rentAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#e6ddce]/60">
              <div className="space-y-0.5">
                <span className="text-[#1b130a] font-medium">Caution Deposit</span>
                <p className="text-[10px] text-[#226444] font-semibold">
                  Refundable at end of lease
                </p>
              </div>
              <span className="font-mono font-bold text-sm text-[#226444]">
                {fmtNaira(property.cautionFee)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#e6ddce]/60">
              <div className="space-y-0.5">
                <span className="text-[#786953]">Agency Commission (10%)</span>
                <p className="text-[10px] text-[#786953]">Non-refundable professional fee</p>
              </div>
              <span className="font-mono font-semibold text-sm text-[#786953]">
                {fmtNaira(property.agentFee)}
              </span>
            </div>

            {property.legalAgreementFee ? (
              <div className="flex justify-between items-center py-1.5 border-b border-[#e6ddce]/60">
                <div className="space-y-0.5">
                  <span className="text-[#786953]">Legal & Agreement Draft (5-10%)</span>
                  <p className="text-[10px] text-[#786953]">Tenancy contract preparation</p>
                </div>
                <span className="font-mono font-semibold text-sm text-[#786953]">
                  {fmtNaira(property.legalAgreementFee)}
                </span>
              </div>
            ) : null}

            {property.serviceCharge ? (
              <div className="flex justify-between items-center py-1.5 border-b border-[#e6ddce]/60">
                <div className="space-y-0.5">
                  <span className="text-[#786953]">Estate Service Charge</span>
                  <p className="text-[10px] text-[#786953]">Security, cleaning & generator</p>
                </div>
                <span className="font-mono font-semibold text-sm text-[#786953]">
                  {fmtNaira(property.serviceCharge)}
                </span>
              </div>
            ) : null}

            <div className="pt-2 flex justify-between items-center bg-[#faf6ef] p-3 rounded-xl border border-[#e6ddce]">
              <div>
                <span className="text-xs font-bold text-[#1b130a] block">
                  Total Initial Outlay
                </span>
                <span className="text-[10px] text-[#786953]">
                  Actual funds required at inception
                </span>
              </div>
              <span className="font-mono font-bold text-base text-[#1b130a]">
                {fmtNaira(totalInitialOutlay)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenancy Terms & Rights Box */}
      <div className="card p-5 bg-[#faf6ef] border border-[#e6ddce]">
        <div className="flex items-start gap-3">
          <FileCheck2 size={20} className="text-[#c4601a] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-[#1b130a]">Nigerian Tenancy Guidelines & Protection</h4>
            <p className="text-[#786953] leading-relaxed">
              Under Nigerian tenancy law, written proof of payment and dated defects documentation protect you against sudden unlawful ejectment and unreasonable caution fee deductions. Keep your receipt reference numbers safe and request joint inspection before moving out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

