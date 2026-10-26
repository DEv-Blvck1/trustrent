"use client";

import React, { useState } from "react";
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Building,
  Calendar,
  AlertTriangle,
  Receipt,
  UserX,
  UserCheck,
} from "lucide-react";
import { Property, PaymentRecord } from "@/types/property";
import { fmtNaira, formatDate, cleanPhoneForWhatsApp } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

interface AdminTenantDirectoryProps {
  properties: Property[];
  onOpenChat: (propertyId: string) => void;
  onIssueReceipt: (property: Property) => void;
}

export function AdminTenantDirectory({
  properties,
  onOpenChat,
  onIssueReceipt,
}: AdminTenantDirectoryProps) {
  const [filter, setFilter] = useState<"all" | "active" | "terminated">("all");
  const { showToast } = useToast();

  const activeTenants = properties.filter((p) => p.status === "active");
  const terminatedTenants = properties.filter((p) => p.status === "terminated" || p.status === "expired");

  const filtered = properties.filter((p) => {
    if (filter === "active") return p.status === "active";
    if (filter === "terminated") return p.status === "terminated" || p.status === "expired";
    return true;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Managed Tenants
            </span>
            <Users size={18} className="text-[#0f4c81]" />
          </div>
          <p className="font-mono font-bold text-3xl text-[#1b130a]">
            {properties.length}
          </p>
          <p className="text-[11px] text-[#786953]">Across all registered locations</p>
        </div>

        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Active Leases
            </span>
            <UserCheck size={18} className="text-[#166534]" />
          </div>
          <p className="font-mono font-bold text-3xl text-[#166534]">
            {activeTenants.length}
          </p>
          <p className="text-[11px] text-[#786953]">Current occupants with live tenancies</p>
        </div>

        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Expired / Terminated
            </span>
            <UserX size={18} className="text-[#b91c1c]" />
          </div>
          <p className="font-mono font-bold text-3xl text-[#b91c1c]">
            {terminatedTenants.length}
          </p>
          <p className="text-[11px] text-[#786953]">Vacated or awaiting caution refund</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            Occupant & Tenant Contacts
          </h3>
          <p className="text-xs text-[#786953]">
            Direct contact numbers, lease status, and communication channels
          </p>
        </div>

        <div className="flex gap-1.5 bg-[#faf6ef] p-1 rounded-2xl border border-[#e6ddce]">
          {(["all", "active", "terminated"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f
                  ? "bg-white text-[#1b130a] shadow-sm"
                  : "text-[#786953] hover:text-[#1b130a]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((prop) => {
          const whatsAppUrl = prop.landlordPhone
            ? `https://wa.me/${cleanPhoneForWhatsApp(prop.landlordPhone)}`
            : null;

          return (
            <div
              key={prop.id}
              className="card p-5 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:border-[#0f4c81]/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        prop.status === "active"
                          ? "badge-active"
                          : prop.status === "expired"
                          ? "badge-overdue"
                          : "badge-terminated"
                      }`}
                    >
                      {prop.status}
                    </span>
                    <h4 className="font-display font-bold text-lg text-[#1b130a] mt-1">
                      {prop.title || prop.address}
                    </h4>
                    <p className="text-xs text-[#786953]">
                      {prop.address}, {prop.area}, {prop.city}
                    </p>
                  </div>

                  <p className="font-mono font-bold text-base text-[#0f4c81]">
                    {fmtNaira(prop.rentAmount)}
                    <span className="text-[10px] text-[#786953] font-normal">/yr</span>
                  </p>
                </div>

                {/* Occupant Details */}
                <div className="p-3 rounded-2xl bg-[#faf6ef] border border-[#e6ddce]/60 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#786953]">Primary Occupant:</span>
                    <strong className="text-[#1b130a]">
                      {prop.landlordName} (Tenant)
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#786953]">Lease Period:</span>
                    <span>
                      {formatDate(prop.startDate)} – {formatDate(prop.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#786953]">Caution Deposit:</span>
                    <span className="font-mono font-semibold text-[#166534]">
                      {fmtNaira(prop.cautionFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-[#e6ddce]/60 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <a
                    href={`tel:${prop.landlordPhone}`}
                    className="p-2 rounded-xl bg-[#226444]/10 text-[#226444] hover:bg-[#226444]/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Direct Call"
                  >
                    <Phone size={13} /> Call
                  </a>

                  {whatsAppUrl && (
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#226444] text-white hover:bg-[#1a4f35] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Direct WhatsApp"
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </a>
                  )}

                  <button
                    onClick={() => onOpenChat(prop.id)}
                    className="p-2 rounded-xl bg-[#0f4c81]/10 text-[#0f4c81] hover:bg-[#0f4c81]/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Open Two-Way Internal Chat"
                  >
                    <MessageSquare size={13} /> Chat
                  </button>
                </div>

                <button
                  onClick={() => onIssueReceipt(prop)}
                  className="px-3 py-1.5 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] transition-all shadow-sm flex items-center gap-1"
                >
                  <Receipt size={13} /> Issue Receipt
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

