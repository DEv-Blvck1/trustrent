"use client";

import React from "react";
import { Home, Plus, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Property } from "@/types/property";
import { fmtNaira } from "@/lib/utils";

interface HeaderProps {
  properties: Property[];
  onAddProperty: () => void;
  onResetSeed: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  properties,
  onAddProperty,
  onResetSeed,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const activeCount = properties.filter((p) => p.status === "active").length;
  const totalRentVolume = properties
    .filter((p) => p.status === "active")
    .reduce((acc, p) => acc + p.rentAmount, 0);

  return (
    <header className="bg-white border-b border-[#e6ddce] sticky top-0 z-40 w-full px-4 lg:px-8 py-3.5 shadow-sm transition-all">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c4601a] to-[#9c460d] flex items-center justify-center shadow-md shadow-[#c4601a]/25 text-white flex-shrink-0">
            <Home size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-2xl tracking-tight text-[#1b130a] leading-none">
                TrustRent
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#faefe4] text-[#c4601a] border border-[#e6ddce]">
                Nigeria
              </span>
            </div>
            <p className="text-xs text-[#786953] font-medium mt-0.5">
              Tenancy Agreement, Payment & Caution Fee Manager
            </p>
          </div>
        </div>

        {/* Live Metrics Ticker (Visible on desktop) */}
        <div className="hidden xl:flex items-center gap-6 text-xs text-[#786953] bg-[#faf6ef] border border-[#e6ddce] px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#226444]" />
            <span>
              Active Tenancies:{" "}
              <strong className="text-[#1b130a]">{activeCount}</strong> of {properties.length}
            </span>
          </div>
          <div className="h-3.5 w-px bg-[#e6ddce]" />
          <div>
            Active Rent Book:{" "}
            <strong className="font-mono text-[#c4601a] font-semibold">
              {fmtNaira(totalRentVolume)}
            </strong>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <input
            type="text"
            placeholder="Search address, landlord..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-60 bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] placeholder-[#786953] focus:outline-none focus:border-[#c4601a] transition-all"
          />

          <button
            onClick={onResetSeed}
            title="Reset to default seed data"
            className="p-2.5 rounded-xl border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef] transition-colors"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onAddProperty}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4601a] text-white text-xs sm:text-sm font-semibold hover:bg-[#aa5014] transition-all shadow-sm shadow-[#c4601a]/25 whitespace-nowrap"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Add Property</span>
          </button>
        </div>
      </div>
    </header>
  );
}

