"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Bell,
  Save,
  Check,
  Building,
  HeartHandshake,
} from "lucide-react";
import { TenantProfile } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { validateEmail, validatePhoneNumber, sanitizeInput } from "@/lib/security";

interface TenantProfileSettingsProps {
  profile: TenantProfile;
  onSave: (updated: TenantProfile) => void;
}

export function TenantProfileSettings({
  profile,
  onSave,
}: TenantProfileSettingsProps) {
  const [formData, setFormData] = useState<TenantProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      showToast("Please provide a valid email address.", "error");
      return;
    }
    if (!validatePhoneNumber(formData.phone)) {
      showToast("Please provide a valid phone number (10-14 digits).", "error");
      return;
    }

    const cleaned: TenantProfile = {
      ...formData,
      name: sanitizeInput(formData.name),
      occupation: sanitizeInput(formData.occupation),
      emergencyContactName: sanitizeInput(formData.emergencyContactName),
      bankName: sanitizeInput(formData.bankName),
      accountNumber: sanitizeInput(formData.accountNumber),
      accountName: sanitizeInput(formData.accountName),
    };

    onSave(cleaned);
    setIsSaved(true);
    showToast("Tenant profile & refund bank details updated successfully!", "success");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 fade-in px-2 sm:px-0">
      <div className="flex items-center justify-between pb-4 border-b border-[#e6ddce]">
        <div>
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-[#1b130a]">
            Tenant Profile & Tenancy Settings
          </h2>
          <p className="text-xs text-[#786953]">
            Manage your personal verification, refund payout account, and notification preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Personal Particulars */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <User size={18} className="text-[#0f4c81]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Full Legal Name *
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
                Email Address *
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
                Phone Number (WhatsApp Active) *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Profession / Occupation
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Caution Deposit Refund Bank Account */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#166534]" />
              <h3 className="font-display font-bold text-lg text-[#1b130a]">
                Caution Fee Refund Bank Account
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#eaf6ee] text-[#166534] font-bold">
              Secure Payout
            </span>
          </div>

          <p className="text-xs text-[#786953]">
            This is the verified account where the property owner or agent will remit your refundable caution deposit upon tenancy completion and joint inspection.
          </p>

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

        {/* Card 3: Emergency Contact & Next of Kin */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <HeartHandshake size={18} className="text-[#c4601a]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Emergency Contact & Next of Kin
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Emergency Contact Name & Relationship
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactName: e.target.value })
                }
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContactPhone: e.target.value })
                }
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Notification Alerts */}
        <div className="card p-5 sm:p-6 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e6ddce]">
            <Bell size={18} className="text-[#0f4c81]" />
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Tenancy Alerts & Reminder Channels
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6ef] cursor-pointer hover:bg-[#f3ece0]/60 transition-colors">
              <div>
                <span className="font-bold text-[#1b130a] block">Email Notifications</span>
                <span className="text-[11px] text-[#786953]">Receive digital rent receipts and renewal reminders via email</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyEmail}
                onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
                className="w-4 h-4 text-[#0f4c81] rounded focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf6ef] cursor-pointer hover:bg-[#f3ece0]/60 transition-colors">
              <div>
                <span className="font-bold text-[#1b130a] block">WhatsApp Alerts</span>
                <span className="text-[11px] text-[#786953]">Instant WhatsApp notifications for landlord announcements and receipts</span>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyWhatsApp}
                onChange={(e) => setFormData({ ...formData, notifyWhatsApp: e.target.checked })}
                className="w-4 h-4 text-[#0f4c81] rounded focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold transition-all shadow-md shadow-[#0f4c81]/20 flex items-center justify-center gap-2"
          >
            {isSaved ? <Check size={16} /> : <Save size={16} />}
            <span>{isSaved ? "Saved Successfully!" : "Save Profile Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

