"use client";

import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Plus,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { TenantDocument, Property, PaymentRecord } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { genId } from "@/lib/utils";
import { validateFileUpload, sanitizeInput } from "@/lib/security";

interface TenantDocumentsVaultProps {
  property: Property;
  onUpdateDocuments: (docs: TenantDocument[]) => void;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export function TenantDocumentsVault({
  property,
  onUpdateDocuments,
  onViewReceipt,
}: TenantDocumentsVaultProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState<TenantDocument["category"]>("tenancy_agreement");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const documents = property.documents || [];
  const paidPayments = property.payments.filter((p) => p.status === "paid");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFileUpload(file, 5 * 1024 * 1024);
      if (!validation.isValid) {
        showToast(validation.error || "File upload rejected by security filter.", "error");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      if (!docName) {
        setDocName(sanitizeInput(file.name));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      showToast("Please provide a name for the document.", "error");
      return;
    }

    const fileSizeStr = selectedFile
      ? (selectedFile.size / 1024 / 1024).toFixed(1) + " MB"
      : "1.2 MB";

    const newDoc: TenantDocument = {
      id: genId(),
      propertyId: property.id,
      name: docName.trim(),
      category,
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: fileSizeStr,
    };

    onUpdateDocuments([newDoc, ...documents]);
    setDocName("");
    setSelectedFile(null);
    setShowUploadModal(false);
    showToast("Document saved to your personal vault.", "success");
  };

  const handleDeleteDoc = (docId: string) => {
    if (!confirm("Are you sure you want to delete this document from your vault?")) return;
    onUpdateDocuments(documents.filter((d) => d.id !== docId));
    showToast("Document removed.", "info");
  };

  const CATEGORY_NAMES: Record<TenantDocument["category"], string> = {
    tenancy_agreement: "Tenancy Agreement",
    id_card: "Valid ID / KYC",
    utility_bill: "Utility / Power Bill",
    inspection_sheet: "Inspection Report",
    receipt: "Payment Receipt",
    other: "Other Record",
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Vault Overview Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            Documents & Official Receipt Vault
          </h3>
          <p className="text-xs text-[#786953]">
            Store and access all your tenancy contracts, landlord receipts, and verified IDs in one secure place.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] transition-all shadow-md shadow-[#0f4c81]/20 whitespace-nowrap"
        >
          <UploadCloud size={15} /> Upload Document
        </button>
      </div>

      {/* Section 1: Official Landlord Receipts Available */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f4c81] flex items-center gap-1.5">
          <FileCheck2 size={16} /> Official Landlord Receipts Received ({paidPayments.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {paidPayments.map((pay) => (
            <div
              key={pay.id}
              className="card p-4 bg-white border border-[#e6ddce] rounded-2xl shadow-sm hover:border-[#0f4c81]/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#eaf6ee] text-[#166534] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b130a] truncate">
                    Receipt: {pay.receiptNo || "TR-RCT-" + pay.id}
                  </p>
                  <p className="text-[11px] text-[#786953]">
                    {pay.period} • Paid On: {pay.paidDate || pay.dueDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewReceipt(pay)}
                className="px-3 py-1.5 rounded-xl bg-[#faf6ef] hover:bg-[#f3ece0] border border-[#e6ddce] text-xs font-bold text-[#0f4c81] flex items-center gap-1 flex-shrink-0"
              >
                <Eye size={13} /> View
              </button>
            </div>
          ))}

          {paidPayments.length === 0 && (
            <div className="md:col-span-2 p-6 rounded-2xl border border-dashed border-[#e6ddce] text-center text-xs text-[#786953]">
              No payments marked as paid yet. Logged and landlord-verified payments will automatically generate official receipts here.
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Uploaded Personal Tenancy Documents */}
      <div className="space-y-3 pt-4 border-t border-[#e6ddce]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953]">
          Uploaded Files ({documents.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="card p-4 bg-white border border-[#e6ddce] rounded-2xl shadow-sm hover:border-[#0f4c81]/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#0f4c81]/10 text-[#0f4c81] flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b130a] truncate">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-[#786953]">
                    {CATEGORY_NAMES[doc.category]} • {doc.fileSize} • {doc.uploadDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() =>
                    showToast(`Simulated download of ${doc.name}.`, "info")
                  }
                  className="p-2 rounded-xl text-[#786953] hover:text-[#0f4c81] hover:bg-[#faf6ef]"
                  title="Download File"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => handleDeleteDoc(doc.id)}
                  className="p-2 rounded-xl text-[#786953] hover:text-[#b91c1c] hover:bg-[#fee2e2]"
                  title="Delete Document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {documents.length === 0 && (
            <div className="md:col-span-2 p-8 rounded-2xl border border-dashed border-[#e6ddce] text-center text-xs text-[#786953] space-y-2">
              <UploadCloud size={32} className="mx-auto text-[#0f4c81] opacity-40" />
              <p className="font-semibold text-[#1b130a]">Your vault is empty</p>
              <p>Upload signed tenancy agreements, utility bills, or IDs for safe keeping.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl relative border border-[#e6ddce]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6ddce]">
              <h4 className="font-display font-bold text-lg text-[#1b130a]">
                Upload Tenancy Document
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-lg text-[#786953] hover:bg-[#faf6ef]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025 Tenancy Agreement Signed"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Document Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TenantDocument["category"])}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                >
                  <option value="tenancy_agreement">Tenancy Agreement</option>
                  <option value="id_card">Valid ID / KYC</option>
                  <option value="utility_bill">Utility Bill (IKEDC/EKEDC)</option>
                  <option value="inspection_sheet">Move-in Condition Sheet</option>
                  <option value="receipt">Bank Transfer Slip</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Select File (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-[#786953] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#faf6ef] file:text-[#0f4c81]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e6ddce]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c]"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

