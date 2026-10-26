"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Building,
  CheckCircle,
  FileCheck2,
  Award,
} from "lucide-react";
import { AgentApplication } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { genId } from "@/lib/utils";

interface AgentOnboardingProps {
  onApply: (application: AgentApplication) => void;
}

export function AgentOnboardingSection({ onApply }: AgentOnboardingProps) {
  const [name, setName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Lagos");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !agencyName || !phone || !licenseNumber) {
      showToast("Please fill all required verification fields.", "error");
      return;
    }

    const application: AgentApplication = {
      id: genId(),
      name: name.trim(),
      agencyName: agencyName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, "")}@realty.ng`,
      city: city.trim(),
      licenseNumber: licenseNumber.trim(),
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    onApply(application);
    setSubmitted(true);
    showToast("Application submitted! Property Owner will review and verify your license.", "success");
  };

  return (
    <div className="w-full card bg-gradient-to-br from-[#0f4c81]/5 via-white to-[#faf6ef] rounded-3xl p-6 lg:p-10 border border-[#e6ddce] shadow-md my-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Information */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] text-xs font-bold">
            <ShieldCheck size={16} /> Partner Verification Program
          </div>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#1b130a] leading-tight">
            Are You a Licensed Real Estate Agent?
          </h2>
          <p className="text-sm text-[#786953] leading-relaxed">
            Join the TrustRent Verified Partner Network. All onboarded property agents undergo direct credential and CAC/NIESV verification by property owners, giving prospective tenants and buyers 100% confidence against tenancy fraud.
          </p>

          <div className="space-y-2.5 pt-2 text-xs font-semibold text-[#1b130a]">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[#166534]" />
              <span>Official TrustRent Verified Agent Badge on your listings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[#166534]" />
              <span>Direct property owner representation mandate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-[#166534]" />
              <span>Automated digital agreement and commission tracking</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="card bg-white p-6 rounded-2xl border border-[#e6ddce] shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#eaf6ee] text-[#166534] flex items-center justify-center mx-auto">
                <Award size={28} />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1b130a]">
                Application Received!
              </h3>
              <p className="text-xs text-[#786953]">
                Your license (<strong>{licenseNumber}</strong>) has been queued for Super Admin review. You will receive notification once approved.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-4 py-2 rounded-xl bg-[#0f4c81] text-white text-xs font-bold"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <h3 className="font-display font-bold text-lg text-[#1b130a]">
                Agent Onboarding Application
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotimi Adeyemi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                    Agency / Realtor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeyemi Premier Ltd"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08031234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                    Operating City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Lagos / Abuja / Benin"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  License / Registration / CAC Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIESV/EDO/2024/099 or RC-198822"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] transition-all shadow-md shadow-[#0f4c81]/20 mt-2"
              >
                Submit for Landlord Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

