"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Property, PropertyStatus } from "@/types/property";
import { daysUntil, fmtNaira } from "@/lib/utils";

interface SidebarProps {
  properties: Property[];
  selectedId: string;
  onSelectProperty: (id: string) => void;
  onAddProperty: () => void;
  searchQuery: string;
}

export function Sidebar({
  properties,
  selectedId,
  onSelectProperty,
  onAddProperty,
  searchQuery,
}: SidebarProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | PropertyStatus>("all");

  // Calculate portfolio financial statistics
  const stats = React.useMemo(() => {
    let totalPaid = 0;
    let totalOwed = 0;
    let totalCaution = 0;
    let totalSpent = 0;

    for (const p of properties) {
      totalCaution += p.cautionFee || 0;
      totalSpent += (p.cautionFee || 0) + (p.agentFee || 0) + (p.legalAgreementFee || 0) + (p.serviceCharge || 0);

      for (const pay of p.payments) {
        if (pay.status === "paid") {
          totalPaid += pay.amount;
          totalSpent += pay.amount;
        } else if (pay.status === "pending" || pay.status === "overdue") {
          totalOwed += pay.amount;
        }
      }
    }

    return { totalPaid, totalOwed, totalCaution, totalSpent };
  }, [properties]);

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const matchesFilter = statusFilter === "all" || p.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.address.toLowerCase().includes(query) ||
      p.area.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.landlordName.toLowerCase().includes(query) ||
      (p.agentName && p.agentName.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const STATUS_BADGE = {
    active: { label: "Active", cls: "badge-active" },
    expired: { label: "Expired", cls: "badge-overdue" },
    terminated: { label: "Terminated", cls: "badge-terminated" },
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
      {/* Portfolio Financial Summary Card */}
      <div className="card p-5 bg-white border border-[#e6ddce] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce]">
          <h3 className="font-display font-bold text-lg text-[#1b130a]">
            Portfolio Summary
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#faf6ef] text-[#786953] border border-[#e6ddce]">
            {properties.length} {properties.length === 1 ? "Property" : "Properties"}
          </span>
        </div>

        <div className="space-y-3 pt-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#786953] flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#226444]" /> Total Rent Paid
            </span>
            <span className="font-mono font-bold text-[#226444]">
              {fmtNaira(stats.totalPaid)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#786953] flex items-center gap-1.5">
              <Clock size={13} className="text-[#b91c1c]" /> Due / Outstanding
            </span>
            <span className="font-mono font-bold text-[#b91c1c]">
              {fmtNaira(stats.totalOwed)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#786953] flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-[#c4601a]" /> Caution Deposits Held
            </span>
            <span className="font-mono font-bold text-[#c4601a]">
              {fmtNaira(stats.totalCaution)}
            </span>
          </div>

          <div className="pt-2 border-t border-[#e6ddce] flex justify-between items-center">
            <span className="text-xs font-bold text-[#1b130a]">
              Total Housing Outlay
            </span>
            <span className="font-mono font-bold text-sm text-[#1b130a]">
              {fmtNaira(stats.totalSpent)}
            </span>
          </div>
        </div>
      </div>

      {/* Property Switcher Header & Filter Tabs */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#786953]">
            Your Rentals ({filteredProperties.length})
          </span>
          <div className="flex gap-1 text-[11px] font-semibold">
            {(["all", "active", "expired"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2 py-0.5 rounded-lg capitalize transition-colors ${
                  statusFilter === filter
                    ? "bg-[#1b130a] text-white"
                    : "text-[#786953] hover:bg-[#e6ddce]/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Property List Cards */}
        <div className="space-y-2.5">
          {filteredProperties.map((p) => {
            const isSelected = selectedId === p.id;
            const days = daysUntil(p.endDate);

            return (
              <button
                key={p.id}
                onClick={() => onSelectProperty(p.id)}
                className={`w-full text-left card p-4 transition-all duration-150 relative overflow-hidden group ${
                  isSelected
                    ? "border-[#c4601a] bg-[#faf3ea] shadow-md ring-1 ring-[#c4601a]/30"
                    : "hover:border-[#c4601a]/40 bg-white"
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#c4601a]" />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#1b130a] truncate leading-snug">
                      {p.title || p.address}
                    </p>
                    <p className="text-xs text-[#786953] mt-1 flex items-center gap-1 truncate">
                      <MapPin size={11} className="flex-shrink-0 text-[#c4601a]" />
                      <span className="truncate">
                        {p.area}, {p.city}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 uppercase tracking-wider ${
                      STATUS_BADGE[p.status].cls
                    }`}
                  >
                    {STATUS_BADGE[p.status].label}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#e6ddce]/60 flex items-center justify-between text-xs">
                  <p className="font-mono font-bold text-[#c4601a]">
                    {fmtNaira(p.rentAmount)}
                    <span className="text-[10px] font-normal text-[#786953]">
                      /{p.frequency === "annually" ? "yr" : p.frequency === "monthly" ? "mo" : "qtr"}
                    </span>
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-[#786953]">
                    <Calendar size={11} />
                    <span
                      className={`font-semibold ${
                        days < 30
                          ? "text-[#b91c1c]"
                          : days < 60
                          ? "text-[#c4601a]"
                          : "text-[#226444]"
                      }`}
                    >
                      {days > 0 ? `${days}d left` : `Expired`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredProperties.length === 0 && (
            <div className="card p-8 text-center text-[#786953] border-dashed border-[#e6ddce]">
              <Building size={32} className="mx-auto mb-2 opacity-30 text-[#c4601a]" />
              <p className="text-xs font-semibold text-[#1b130a]">
                No properties found
              </p>
              <p className="text-[11px] mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Add your first tenancy record to begin tracking"}
              </p>
              <button
                onClick={onAddProperty}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014]"
              >
                <PlusCircle size={13} /> Add Property
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

