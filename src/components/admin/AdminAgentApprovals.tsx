"use client";

import React from "react";
import {
  ShieldCheck,
  Check,
  X,
  Phone,
  Mail,
  Building,
  FileCheck,
  Award,
} from "lucide-react";
import { AgentApplication } from "@/types/property";
import { useToast } from "@/components/common/Toast";

interface AdminAgentApprovalsProps {
  agents: AgentApplication[];
  onUpdateStatus: (id: string, newStatus: "approved" | "rejected") => void;
}

export function AdminAgentApprovals({
  agents,
  onUpdateStatus,
}: AdminAgentApprovalsProps) {
  const { showToast } = useToast();

  const handleApprove = (agent: AgentApplication) => {
    onUpdateStatus(agent.id, "approved");
    showToast(`Agent ${agent.name} (${agent.agencyName}) approved and verified!`, "success");
  };

  const handleReject = (agent: AgentApplication) => {
    onUpdateStatus(agent.id, "rejected");
    showToast(`Agent application for ${agent.name} declined.`, "info");
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            House Agent Verification & Credentials
          </h3>
          <p className="text-xs text-[#786953]">
            Review, verify CAC / NIESV licenses, and grant verified status to real estate agents representing your properties.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0f4c81]/10 text-[#0f4c81]">
          {agents.filter((a) => a.status === "pending").length} Pending Approvals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="card p-5 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:border-[#0f4c81]/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-lg text-[#1b130a]">
                    {agent.name}
                  </h4>
                  <p className="text-xs text-[#786953] flex items-center gap-1">
                    <Building size={12} className="text-[#0f4c81]" />
                    <span>{agent.agencyName}</span>
                  </p>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    agent.status === "approved"
                      ? "badge-active"
                      : agent.status === "rejected"
                      ? "badge-overdue"
                      : "badge-pending"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#faf6ef] border border-[#e6ddce]/60 text-xs space-y-1.5">
                <p className="text-[#786953]">
                  License No: <strong className="text-[#1b130a] font-mono">{agent.licenseNumber}</strong>
                </p>
                <p className="text-[#786953]">
                  Location: <strong className="text-[#1b130a]">{agent.city}</strong>
                </p>
                <p className="text-[#786953]">
                  Applied On: {agent.appliedDate}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#786953]">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-1 hover:text-[#0f4c81]"
                >
                  <Phone size={12} /> {agent.phone}
                </a>
              </div>
            </div>

            {/* Approval Action Buttons */}
            <div className="pt-3 border-t border-[#e6ddce]/60 flex items-center gap-2">
              {agent.status !== "approved" && (
                <button
                  onClick={() => handleApprove(agent)}
                  className="flex-1 py-2 rounded-xl bg-[#166534] text-white text-xs font-bold hover:bg-[#14532d] flex items-center justify-center gap-1 shadow-sm transition-all"
                >
                  <Check size={14} /> Approve & Verify
                </button>
              )}

              {agent.status !== "rejected" && (
                <button
                  onClick={() => handleReject(agent)}
                  className="py-2 px-3 rounded-xl border border-[#fee2e2] text-[#b91c1c] hover:bg-[#fee2e2] text-xs font-bold transition-all"
                >
                  <X size={14} /> Reject
                </button>
              )}

              {agent.status === "approved" && (
                <div className="w-full py-1.5 rounded-xl bg-[#eaf6ee] text-[#166534] text-xs font-bold flex items-center justify-center gap-1">
                  <ShieldCheck size={14} /> Verified Partner
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

