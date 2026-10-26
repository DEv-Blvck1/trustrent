"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Building,
  ShieldCheck,
  CreditCard,
  MapPin,
  Save,
  Check,
  FileText,
  Award,
} from "lucide-react";
import { AgentProfile } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { validateEmail, validatePhoneNumber, sanitizeInput } from "@/lib/security";

interface AgentProfileSettingsProps {
  profile: AgentProfile;
  onSave: (updated: AgentProfile) => void;
}

export function AgentProfileSettings({
  profile,
  onSave,
}: AgentProfileSettingsProps) {
  const [formData, setFormData] = useState<AgentProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showToast("Please provide a valid work email address.", "error");
      return;
    }
    if (!validatePhoneNumber(formData.phone)) {
      showToast("Please provide a valid phone number.", "error");
      return;
    }

    const cleaned: AgentProfile = {
      ...formData,
      name: sanitizeInput(formData.name),
      agencyName: sanitizeInput(formData.agencyName),
      licenseNumber: sanitizeInput(formData.licenseNumber),
      officeAddress: sanitizeInput(formData.officeAddress),
      operatingCities: sanitizeInput(formData.operatingCities),
      bankName: sanitizeInput(formData.bankName),
      accountNumber: sanitizeInput(formData.accountNumber),
      accountName: sanitizeInput(formData.accountName),
      bio: sanitizeInput(formData.bio),
    };

    onSave(cleaned);
    setIsSaved(true);
    showToast("Agent profile and verification details updated!", "success");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 fade-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#e6ddce]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1b130a]">
              Agent Profile & Agency Credentials
            </h2>
            {formData.isVerified && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#166534] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} /> Verified Partner
              </span>
            )}
          </div>
          <p className="text-xs text-[#786953]">
            Edit your professional credentials, commission remittance account, and bio shown to prospective tenants
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Agent & Agency Credentials */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <Award size={18} className="text-[#0f4c81]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Professional Credentials & Licensing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Agent Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Realty / Brokerage Name *
              </label>
              <input
                type="text"
                required
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                NIESV / CAC / LASRETR Registration Number *
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Operating Cities / Coverage
              </label>
              <input
                type="text"
                value={formData.operatingCities}
                onChange={(e) => setFormData({ ...formData, operatingCities: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Office / Firm Physical Address
              </label>
              <input
                type="text"
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Bio */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <Building size={18} className="text-[#0f4c81]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Direct Contact & Public Bio
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Direct Phone / WhatsApp Line *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Professional Bio (Visible on Property Mandates)
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl p-3 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Commission Remittance Bank Account */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <CreditCard size={18} className="text-[#166534]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Agency Commission Remittance Account
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
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
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
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono font-bold"
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
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold transition-all shadow-md shadow-[#0f4c81]/20 flex items-center justify-center gap-2"
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? "Saved Successfully!" : "Save Agency Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

