"use client";

import React, { useState } from "react";
import { X, Building, DollarSign, Calendar, User, Shield } from "lucide-react";
import { Property, RentFrequency, ListingType } from "@/types/property";
import { genId } from "@/lib/utils";
import { NIGERIAN_CITIES } from "@/lib/constants";

interface AddPropertyModalProps {
  onClose: () => void;
  onAddProperty: (newProperty: Property) => void;
}

export function AddPropertyModal({ onClose, onAddProperty }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    area: "",
    city: "Lagos",
    landlordName: "Chief Emmanuel Eze",
    landlordPhone: "08031234567",
    landlordEmail: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    listingType: "rent" as ListingType,
    rentAmount: "2500000",
    frequency: "annually" as RentFrequency,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    cautionFee: "250000",
    agentFee: "250000",
    legalAgreementFee: "125000",
    serviceCharge: "150000",
    bedrooms: "3",
    bathrooms: "3",
    kitchens: "1",
    squareFeet: "2400",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address.trim() || !formData.landlordName.trim()) {
      alert("Please provide the property address and landlord name.");
      return;
    }

    const rent = parseFloat(formData.rentAmount) || 0;
    const caution = parseFloat(formData.cautionFee) || 0;

    const newProperty: Property = {
      id: genId(),
      title: formData.title.trim() || undefined,
      address: formData.address.trim(),
      area: formData.area.trim(),
      city: formData.city.trim(),
      landlordName: formData.landlordName.trim(),
      landlordPhone: formData.landlordPhone.trim(),
      landlordEmail: formData.landlordEmail.trim() || undefined,
      agentName: formData.agentName.trim() || undefined,
      agentPhone: formData.agentPhone.trim() || undefined,
      agentEmail: formData.agentEmail.trim() || undefined,
      listingType: formData.listingType,
      rentAmount: rent,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      cautionFee: caution,
      agentFee: parseFloat(formData.agentFee) || 0,
      legalAgreementFee: parseFloat(formData.legalAgreementFee) || 0,
      serviceCharge: parseFloat(formData.serviceCharge) || 0,
      bedrooms: parseInt(formData.bedrooms) || 3,
      bathrooms: parseInt(formData.bathrooms) || 2,
      kitchens: parseInt(formData.kitchens) || 1,
      squareFeet: parseInt(formData.squareFeet) || 2200,
      imageUrl: formData.imageUrl.trim() || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      featured: true,
      publishedToHome: true,
      notes: formData.notes.trim(),
      status: "active",
      payments: [],
      defects: [],
      expenses: [],
      documents: [],
      cautionTracker: {
        depositAmount: caution,
        refundStatus: "held",
      },
      conversationSettings: {
        isLocked: false,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    };

    onAddProperty(newProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-2xl bg-white p-6 sm:p-7 rounded-3xl shadow-2xl relative my-8 border border-[#e6ddce] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#e6ddce]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0f4c81]/15 text-[#0f4c81] flex items-center justify-center font-bold">
              <Building size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#1b130a]">
                Add Property (Super Admin)
              </h3>
              <p className="text-xs text-[#786953]">
                Add to your managed portfolio and publish to public marketplace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
              1. Listing & Specs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Property Title / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Luxury 4-Bedroom Villa with Swimming Pool"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Listing Type
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) =>
                    setFormData({ ...formData, listingType: e.target.value as ListingType })
                  }
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="lease">Long Lease</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Admiralty Way, Lekki"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  list="city-options"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
                <datalist id="city-options">
                  {NIGERIAN_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Area / Estate
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lekki Phase 1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#e6ddce]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
              2. Financial & Lease Terms
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Rent / Price (₦) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.rentAmount}
                  onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Caution Deposit (₦)
                </label>
                <input
                  type="number"
                  value={formData.cautionFee}
                  onChange={(e) => setFormData({ ...formData, cautionFee: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Agency Fee (₦)
                </label>
                <input
                  type="number"
                  value={formData.agentFee}
                  onChange={(e) => setFormData({ ...formData, agentFee: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Lease Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Lease Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Billing Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value as RentFrequency })
                  }
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                >
                  <option value="annually">Annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#e6ddce]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
              3. Owner / Primary Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.landlordName}
                  onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                  Owner Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.landlordPhone}
                  onChange={(e) => setFormData({ ...formData, landlordPhone: e.target.value })}
                  className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#e6ddce]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] shadow-md shadow-[#0f4c81]/25"
            >
              Add Property to Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
