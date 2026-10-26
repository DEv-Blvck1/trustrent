"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import {
  Camera,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Image as ImageIcon,
  Wrench,
  X,
  FileCheck,
} from "lucide-react";
import { DefectEvidence, Property } from "@/types/property";
import { fmtNaira, formatDate, genId } from "@/lib/utils";

interface DefectsTabProps {
  property: Property;
  onUpdateDefects: (updatedDefects: DefectEvidence[]) => void;
}

export function DefectsTab({ property, onUpdateDefects }: DefectsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DefectEvidence["category"]>("plumbing");
  const [description, setDescription] = useState("");
  const [costEstimate, setCostEstimate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle local image selection as Base64 Data URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDefect: DefectEvidence = {
      id: genId(),
      title: title.trim(),
      category,
      description: description.trim(),
      dateLogged: new Date().toISOString().split("T")[0],
      imageUrl: imagePreview || undefined,
      isResolved: false,
      costEstimate: costEstimate ? parseFloat(costEstimate) : undefined,
    };

    onUpdateDefects([newDefect, ...(property.defects || [])]);
    setTitle("");
    setDescription("");
    setCostEstimate("");
    setImagePreview(null);
    setShowAddForm(false);
  };

  const toggleResolved = (id: string) => {
    const updated = (property.defects || []).map((d) =>
      d.id === id ? { ...d, isResolved: !d.isResolved } : d
    );
    onUpdateDefects(updated);
  };

  const deleteDefect = (id: string) => {
    if (!confirm("Are you sure you want to delete this defect record?")) return;
    const updated = (property.defects || []).filter((d) => d.id !== id);
    onUpdateDefects(updated);
  };

  const CATEGORY_LABELS: Record<DefectEvidence["category"], string> = {
    plumbing: "Plumbing & Water",
    electrical: "Electrical & Fittings",
    walls_paint: "Walls & Paint",
    fixtures: "Doors, Windows & Locks",
    roof_ceiling: "Roof & Ceiling",
    other: "General / Other",
  };

  const defectsList = property.defects || [];
  const unresolvedCount = defectsList.filter((d) => !d.isResolved).length;

  return (
    <div className="space-y-5 fade-in">
      {/* Evidence Tip Banner */}
      <div className="card p-4 bg-[#faf6ef] border border-[#e6ddce] flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#c4601a]/15 text-[#c4601a] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Camera size={18} />
        </div>
        <div className="space-y-1 text-xs">
          <p className="font-bold text-[#1b130a]">
            Move-In Evidence & Caution Fee Protection
          </p>
          <p className="text-[#786953] leading-relaxed">
            Photograph and log every pre-existing crack, faulty socket, or water leak during your first 7 days in the property. Storing dated photo evidence prevents Nigerian landlords and caretakers from deducting repairs from your caution deposit when you vacate.
          </p>
        </div>
      </div>

      {/* Header & Add Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-lg text-[#1b130a]">
            Documented Defects & Conditions
          </h3>
          <p className="text-xs text-[#786953]">
            {defectsList.length} items logged ({unresolvedCount} unresolved)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014] transition-all shadow-sm shadow-[#c4601a]/20"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} className="stroke-[2.5]" />}
          <span>{showAddForm ? "Cancel" : "Add Defect Evidence"}</span>
        </button>
      </div>

      {/* Add Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddDefect}
          className="card p-5 bg-white border-2 border-[#c4601a]/30 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
            <h4 className="font-bold text-sm text-[#1b130a]">
              Log New Defect / Pre-existing Damage
            </h4>
            <span className="text-[11px] text-[#786953]">Dated with today&apos;s timestamp</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Defect Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Broken tile in guest toilet, Damp ceiling patch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DefectEvidence["category"])}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Estimated Repair Cost (₦) (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={costEstimate}
                onChange={(e) => setCostEstimate(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Attach Photo Evidence
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-[#786953] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#faf6ef] file:text-[#c4601a] hover:file:bg-[#f3ece0]"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="mt-2">
              <p className="text-[11px] text-[#786953] mb-1 font-semibold">Photo Preview:</p>
              <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-[#e6ddce] shadow-sm">
                <img
                  src={imagePreview}
                  alt="Defect preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
              Description & Context
            </label>
            <textarea
              rows={3}
              placeholder="Explain where it is, when you discovered it, and if you informed the caretaker or landlord."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl p-3 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953] hover:bg-[#faf6ef]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014]"
            >
              Save Defect Evidence
            </button>
          </div>
        </form>
      )}

      {/* Defects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defectsList.map((defect) => (
          <div
            key={defect.id}
            className={`card p-4 bg-white border transition-all space-y-3 ${
              defect.isResolved
                ? "border-[#e6ddce] opacity-80"
                : "border-[#e6ddce] hover:border-[#c4601a]/40"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#faf6ef] text-[#786953] border border-[#e6ddce]">
                    {CATEGORY_LABELS[defect.category]}
                  </span>
                  <span className="text-[11px] text-[#786953]">
                    Logged: {formatDate(defect.dateLogged)}
                  </span>
                </div>
                <h4
                  className={`text-sm font-bold text-[#1b130a] ${
                    defect.isResolved ? "line-through text-[#786953]" : ""
                  }`}
                >
                  {defect.title}
                </h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleResolved(defect.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                    defect.isResolved
                      ? "bg-[#eaf6ee] text-[#226444]"
                      : "bg-[#faf6ef] text-[#786953] hover:text-[#1b130a]"
                  }`}
                  title={defect.isResolved ? "Mark unresolved" : "Mark resolved"}
                >
                  <CheckCircle2 size={16} />
                </button>
                <button
                  onClick={() => deleteDefect(defect.id)}
                  className="p-1.5 rounded-lg text-xs text-[#b91c1c] hover:bg-[#fee2e2] transition-colors"
                  title="Delete defect record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {defect.imageUrl && (
              <div className="w-full h-36 rounded-xl overflow-hidden border border-[#e6ddce] bg-[#faf6ef]">
                <img
                  src={defect.imageUrl}
                  alt={defect.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {defect.description && (
              <p className="text-xs text-[#786953] leading-relaxed">
                {defect.description}
              </p>
            )}

            <div className="pt-2 border-t border-[#e6ddce]/60 flex items-center justify-between text-xs">
              <span
                className={`font-semibold text-[11px] ${
                  defect.isResolved ? "text-[#226444]" : "text-[#b45309]"
                }`}
              >
                {defect.isResolved ? "✓ Resolved by Landlord" : "⏳ Pending Resolution"}
              </span>

              {defect.costEstimate ? (
                <span className="font-mono text-[11px] font-semibold text-[#786953]">
                  Est: {fmtNaira(defect.costEstimate)}
                </span>
              ) : null}
            </div>
          </div>
        ))}

        {defectsList.length === 0 && (
          <div className="md:col-span-2 card p-10 text-center text-[#786953] border-dashed border-[#e6ddce]">
            <Wrench size={32} className="mx-auto mb-2 opacity-30 text-[#c4601a]" />
            <p className="text-sm font-semibold text-[#1b130a]">
              No defects or damages logged yet
            </p>
            <p className="text-xs mt-1">
              Always document chips, leaks, or broken switches early to safeguard your caution fee.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#aa5014]"
            >
              <Plus size={14} /> Add First Defect Evidence
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
