"use client";

import React, { useState } from "react";
import {
  Shield,
  Building,
  CreditCard,
  Bell,
  Save,
  Check,
  Clock,
  Briefcase,
} from "lucide-react";
import { OwnerProfile } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { validateEmail, validatePhoneNumber, sanitizeInput } from "@/lib/security";

interface OwnerProfileSettingsProps {
  profile: OwnerProfile;
  onSave: (updated: OwnerProfile) => void;
}

export function OwnerProfileSettings({
  profile,
  onSave,
}: OwnerProfileSettingsProps) {
  const [formData, setFormData] = useState<OwnerProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showToast("Please provide a valid corporate email.", "error");
      return;
    }
    if (!validatePhoneNumber(formData.phone)) {
      showToast("Please provide a valid contact phone number.", "error");
      return;
    }

    const cleaned: OwnerProfile = {
      ...formData,
      name: sanitizeInput(formData.name),
      companyName: sanitizeInput(formData.companyName),
      bankName: sanitizeInput(formData.bankName),
      accountNumber: sanitizeInput(formData.accountNumber),
      accountName: sanitizeInput(formData.accountName),
      defaultNoticeDays: Number(formData.defaultNoticeDays) || 60,
    };

    onSave(cleaned);
    setIsSaved(true);
    showToast("Super Admin profile and tenancy policy settings updated!", "success");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 fade-in px-2 sm:px-0">
      <div className="flex items-center justify-between pb-4 border-b border-[#e6ddce]">
        <div>
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1b130a]">
            Super Admin Profile & Asset Holdings Settings
          </h2>
          <p className="text-xs text-[#786953]">
            Configure property owner identity, rent inflow payout accounts, and automated lease reminder timelines
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Owner & Company Entity */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <Building size={18} className="text-[#c4601a]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Property Owner & Corporate Entity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Owner Legal Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Real Estate Holding Company / Trust Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Direct Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Rent Inflow Remittance Account */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <CreditCard size={18} className="text-[#166534]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Rent Collection & Remittance Bank Account
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Account Number (NUBAN)
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Automated Reminder & Notice Policy */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <Clock size={18} className="text-[#0f4c81]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Automated Lease Renewal & Reminders Policy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Default Renewal Notice Period (Days Before Expiry)
              </label>
              <select
                value={formData.defaultNoticeDays}
                onChange={(e) =>
                  setFormData({ ...formData, defaultNoticeDays: Number(e.target.value) })
                }
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              >
                <option value={30}>30 Days (Standard 1 Month Notice)</option>
                <option value={60}>60 Days (Recommended 2 Months Window)</option>
                <option value={90}>90 Days (Quarterly Statutory Notice)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6ef] cursor-pointer hover:bg-[#f3ece0]/60 transition-colors">
                <div>
                  <span className="font-bold text-[#1b130a] text-xs block">
                    Auto-Dispatch 11th-Month Reminders
                  </span>
                  <span className="text-[10px] text-[#786953]">
                    Automatically ping tenant and owner when lease enters month 11
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoRemindTenant}
                  onChange={(e) =>
                    setFormData({ ...formData, autoRemindTenant: e.target.checked })
                  }
                  className="w-4 h-4 text-[#c4601a] rounded focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#c4601a] hover:bg-[#aa5014] text-white text-xs font-bold transition-all shadow-md shadow-[#c4601a]/20 flex items-center justify-center gap-2"
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? "Saved Successfully!" : "Save Owner Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

