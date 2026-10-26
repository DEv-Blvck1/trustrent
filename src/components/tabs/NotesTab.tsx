"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Copy,
  Check,
  Save,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Property } from "@/types/property";

interface NotesTabProps {
  property: Property;
  onSaveNotes: (notes: string) => void;
}

export function NotesTab({ property, onSaveNotes }: NotesTabProps) {
  const [localNotes, setLocalNotes] = useState(property.notes || "");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync when selected property changes
  useEffect(() => {
    setLocalNotes(property.notes || "");
  }, [property.id, property.notes]);

  const handleManualSave = () => {
    onSaveNotes(localNotes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertTemplate = (templateText: string) => {
    const separator = localNotes.trim() ? "\n\n-------------------------\n\n" : "";
    const updated = localNotes + separator + templateText;
    setLocalNotes(updated);
    onSaveNotes(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TEMPLATES = [
    {
      title: "Move-in Inspection Notice",
      text: `FORMAL MOVE-IN INSPECTION NOTICE\nDate: ${new Date().toLocaleDateString()}\nTo: Landlord / Caretaker\nProperty: ${property.address}, ${property.city}\n\nPlease take notice that following our move-in inspection, the following pre-existing defects were identified on the premises:\n1. [Specify defect, e.g., cracked window / water heater]\n2. [Specify second defect]\n\nKindly note these for repair or record so they are not attributed to our tenancy upon lease expiration.\n\nSigned,\nTenant`,
    },
    {
      title: "Caution Deposit Refund Demand",
      text: `FORMAL DEMAND FOR REFUND OF CAUTION DEPOSIT\nDate: ${new Date().toLocaleDateString()}\nTo: ${property.landlordName}\nRe: Tenancy at ${property.address}\n\nDear Sir/Madam,\nFollowing the expiration of our tenancy and the successful handover of keys and joint inspection on [Date], I hereby request the immediate refund of my caution deposit of ${property.cautionFee ? `₦${property.cautionFee.toLocaleString()}` : "the agreed amount"}.\n\nBank Account Details:\nBank: [Bank Name]\nAccount Name: [Account Name]\nAccount Number: [0123456789]\n\nThank you for your prompt compliance.\n\nRespectfully,\nTenant`,
    },
    {
      title: "Lease Renewal Negotiation Notice",
      text: `TENANCY RENEWAL PROPOSAL\nDate: ${new Date().toLocaleDateString()}\nTo: ${property.landlordName}\nProperty: ${property.address}\n\nDear Landlord,\nWith reference to the upcoming expiration of our lease on ${property.endDate}, I write to formally indicate our desire to renew our tenancy for another term. We would appreciate scheduling a brief discussion on terms.\n\nBest regards,\nTenant`,
    },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* Template Quick-Insert Bar */}
      <div className="card p-4 bg-white border border-[#e6ddce] shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[#c4601a]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1b130a]">
            Pre-Drafted Nigerian Tenancy Letter Templates
          </h4>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertTemplate(tmpl.text)}
              className="px-3 py-1.5 rounded-lg bg-[#faf6ef] border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] hover:bg-[#f3ece0] text-xs font-semibold transition-colors"
            >
              + {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Notes Editor */}
      <div className="card p-6 bg-white border border-[#e6ddce] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce] flex-wrap gap-2">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1b130a]">
              Property Notes & Verbal Agreements
            </h3>
            <p className="text-xs text-[#786953]">
              Record verbal promises, defect notes, caretaker commitments, and dispute logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] text-xs font-medium transition-colors"
            >
              {copied ? <Check size={13} className="text-[#226444]" /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy All"}</span>
            </button>

            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-colors shadow-sm"
            >
              {saved ? <Check size={13} /> : <Save size={13} />}
              <span>{saved ? "Saved!" : "Save Notes"}</span>
            </button>
          </div>
        </div>

        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={handleManualSave}
          rows={12}
          placeholder="Document everything here: verbal promises made by landlord ('promised to fix water pump by Friday'), gate keys given, prepaid meter meter number, repairs agreed upon..."
          className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl p-4 text-xs lg:text-sm text-[#1b130a] placeholder-[#786953] focus:outline-none focus:border-[#c4601a] leading-relaxed resize-y font-mono"
        />

        <div className="flex items-center justify-between text-xs text-[#786953] pt-1">
          <span>💡 Tip: Changes save automatically when you click outside or tap Save.</span>
          <span>{localNotes.length} characters</span>
        </div>
      </div>
    </div>
  );
}

