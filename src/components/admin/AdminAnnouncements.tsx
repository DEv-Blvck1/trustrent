"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  BellRing,
  Wrench,
  X,
} from "lucide-react";
import { Announcement } from "@/types/property";
import { formatDate, genId } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

interface AdminAnnouncementsProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export function AdminAnnouncements({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
}: AdminAnnouncementsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("normal");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast("Please provide announcement title and content.", "error");
      return;
    }

    const newAnnouncement: Announcement = {
      id: genId(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split("T")[0],
      priority,
      authorName: "Property Owner / Management",
    };

    onAddAnnouncement(newAnnouncement);
    setTitle("");
    setContent("");
    setShowAddModal(false);
    showToast("Announcement broadcasted to all onboarded tenants!", "success");
  };

  const PRIORITY_BADGE = {
    normal: { label: "General Notice", cls: "bg-[#faf6ef] text-[#0f4c81] border-[#0f4c81]/30" },
    urgent: { label: "Urgent Action Required", cls: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]" },
    maintenance: { label: "Scheduled Maintenance", cls: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]" },
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            Tenant Broadcast Announcements
          </h3>
          <p className="text-xs text-[#786953]">
            Broadcast maintenance advisories, estate power updates, or lease notices to all property tenants.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] transition-all shadow-md shadow-[#0f4c81]/20 whitespace-nowrap"
        >
          <Megaphone size={15} /> Send Broadcast
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="card p-5 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:border-[#0f4c81]/30 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      PRIORITY_BADGE[ann.priority].cls
                    }`}
                  >
                    {PRIORITY_BADGE[ann.priority].label}
                  </span>
                  <span className="text-[11px] text-[#786953]">
                    Published: {formatDate(ann.date)}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg text-[#1b130a]">
                  {ann.title}
                </h4>
              </div>

              <button
                onClick={() => {
                  if (confirm("Delete this broadcast?")) onDeleteAnnouncement(ann.id);
                }}
                className="p-2 rounded-xl text-[#786953] hover:text-[#b91c1c] hover:bg-[#fee2e2]"
                title="Delete announcement"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <p className="text-xs text-[#786953] leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="pt-2 border-t border-[#e6ddce]/60 flex items-center justify-between text-[11px] text-[#786953]">
              <span>Issued by: <strong>{ann.authorName}</strong></span>
              <span className="text-[#166534] font-semibold">✓ Dispatched to all tenant inboxes</span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="card p-12 text-center text-[#786953] border-dashed border-[#e6ddce] rounded-3xl">
            <Megaphone size={36} className="mx-auto mb-2 opacity-30 text-[#0f4c81]" />
            <p className="text-sm font-semibold text-[#1b130a]">No announcements published</p>
            <p className="text-xs mt-1">Broadcast important estate notices to your tenants.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl relative border border-[#e6ddce]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6ddce]">
              <h4 className="font-display font-bold text-lg text-[#1b130a]">
                New Tenant Broadcast
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[#786953] hover:bg-[#faf6ef]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water Treatment Plant Maintenance Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Priority Classification
                </label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as Announcement["priority"])
                  }
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                >
                  <option value="normal">General Estate Notice</option>
                  <option value="maintenance">Scheduled Maintenance</option>
                  <option value="urgent">Urgent Action Notice</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the message for your tenants..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl p-3 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e6ddce]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c]"
                >
                  Publish & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

