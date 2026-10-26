"use client";

import React, { useState } from "react";
import {
  Building,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Settings,
  Briefcase,
  Plus,
} from "lucide-react";
import { Property, AgentProfile } from "@/types/property";
import { fmtNaira, formatDate } from "@/lib/utils";
import { AgentProfileSettings } from "@/components/profile/AgentProfileSettings";

interface AgentDashboardProps {
  properties: Property[];
  agentProfile: AgentProfile;
  onSaveAgentProfile: (profile: AgentProfile) => void;
  onSelectProperty: (property: Property) => void;
}

export function AgentDashboard({
  properties,
  agentProfile,
  onSaveAgentProfile,
  onSelectProperty,
}: AgentDashboardProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "commissions" | "profile">("listings");

  // Filter properties assigned to this agent (or show all available agency listings)
  const agentProperties = properties.filter(
    (p) =>
      p.agentName?.toLowerCase().includes(agentProfile.name.toLowerCase()) ||
      p.agentEmail?.toLowerCase() === agentProfile.email.toLowerCase() ||
      properties.length > 0
  );

  // Calculate potential & realized commissions (standard 10% agent fee)
  const totalCommissionVolume = properties.reduce(
    (acc, p) => acc + (p.agentFee || p.rentAmount * 0.1),
    0
  );

  return (
    <div className="w-full flex-1 flex flex-col space-y-6 fade-in">
      {/* Top Agent Bar */}
      <div className="w-full bg-[#1e293b] text-white px-4 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f4c81] text-white flex items-center justify-center font-bold">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white">
                Agent Portal • {agentProfile.agencyName}
              </h2>
              {agentProfile.isVerified && (
                <span className="px-2 py-0.5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck size={11} /> Verified Partner
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Agent: <strong>{agentProfile.name}</strong> • Lic: {agentProfile.licenseNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            <Settings size={14} /> Profile & Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-4 lg:px-8 py-2 bg-white border-b border-[#e6ddce] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "listings"
              ? "bg-[#0f4c81] text-white shadow-sm"
              : "text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
          }`}
        >
          <Building size={14} />
          <span>My Mandated Properties ({agentProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("commissions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "commissions"
              ? "bg-[#0f4c81] text-white shadow-sm"
              : "text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
          }`}
        >
          <TrendingUp size={14} />
          <span>Commission Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-[#0f4c81] text-white shadow-sm"
              : "text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
          }`}
        >
          <Settings size={14} />
          <span>Agent Profile & Settings</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="w-full px-4 lg:px-8 py-4 flex-1">
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm">
                <span className="text-xs uppercase font-bold text-[#786953]">
                  Assigned Mandates
                </span>
                <p className="font-mono font-bold text-3xl text-[#0f4c81] mt-1">
                  {agentProperties.length}
                </p>
                <p className="text-[11px] text-[#786953]">Active listings under marketing</p>
              </div>

              <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm">
                <span className="text-xs uppercase font-bold text-[#786953]">
                  Projected Commissions
                </span>
                <p className="font-mono font-bold text-3xl text-[#166534] mt-1">
                  {fmtNaira(totalCommissionVolume)}
                </p>
                <p className="text-[11px] text-[#786953]">10% professional agency commission</p>
              </div>

              <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm">
                <span className="text-xs uppercase font-bold text-[#786953]">
                  Licensing Status
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#eaf6ee] text-[#166534] border border-[#bbf7d0]">
                    Verified by Owner
                  </span>
                </div>
                <p className="text-[11px] text-[#786953] mt-1">
                  NIESV/CAC verified badge active
                </p>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {agentProperties.map((p) => (
                <div
                  key={p.id}
                  className="card bg-white rounded-3xl border border-[#e6ddce] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#faf6ef] text-[#0f4c81] font-bold uppercase tracking-wider border border-[#e6ddce]">
                        For {p.listingType}
                      </span>
                      <span className="font-mono font-bold text-base text-[#166534]">
                        {fmtNaira(p.rentAmount)}
                        <span className="text-[10px] text-[#786953] font-normal">/yr</span>
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[#1b130a]">
                      {p.title || p.address}
                    </h4>

                    <p className="text-xs text-[#786953] flex items-center gap-1">
                      <MapPin size={12} className="text-[#c4601a]" />
                      <span>{p.area}, {p.city}</span>
                    </p>

                    <div className="p-3 rounded-2xl bg-[#faf6ef] text-xs space-y-1">
                      <p className="text-[#786953]">
                        Landlord / Owner: <strong>{p.landlordName}</strong>
                      </p>
                      <p className="text-[#786953]">
                        Owner Phone: <a href={`tel:${p.landlordPhone}`} className="text-[#0f4c81] font-semibold">{p.landlordPhone}</a>
                      </p>
                      <p className="text-[#786953]">
                        Agency Fee Due: <strong className="font-mono text-[#166534]">{fmtNaira(p.agentFee || p.rentAmount * 0.1)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#faf6ef]/50 border-t border-[#e6ddce] flex justify-end">
                    <button
                      onClick={() => onSelectProperty(p)}
                      className="px-4 py-2 rounded-xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold shadow-sm"
                    >
                      View Tenancy Records
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "commissions" && (
          <div className="card p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
            <h3 className="font-display font-bold text-xl text-[#1b130a]">
              Commission Remittance Ledger
            </h3>
            <p className="text-xs text-[#786953]">
              10% standard agency fee collected or receivable upon agreement signing
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#e6ddce] text-[#786953] bg-[#faf6ef]">
                    <th className="py-3 px-4 font-bold">Property</th>
                    <th className="py-3 px-4 font-bold">Annual Consideration</th>
                    <th className="py-3 px-4 font-bold">Tenancy Status</th>
                    <th className="py-3 px-4 font-bold text-right">Commission Receivable (10%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6ddce]/60 font-medium">
                  {agentProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-[#faf6ef]/30">
                      <td className="py-3.5 px-4 font-bold text-[#1b130a]">
                        {p.title || p.address}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {fmtNaira(p.rentAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize">{p.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#166534]">
                        +{fmtNaira(p.agentFee || p.rentAmount * 0.1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <AgentProfileSettings
            profile={agentProfile}
            onSave={onSaveAgentProfile}
          />
        )}
      </div>
    </div>
  );
}

