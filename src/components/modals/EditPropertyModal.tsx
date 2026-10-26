"use client";

import React, { useState } from "react";
import { X, Edit3 } from "lucide-react";
import { Property, PropertyStatus, RentFrequency, ListingType } from "@/types/property";

interface EditPropertyModalProps {
  property: Property;
  onClose: () => void;
  onSaveProperty: (updated: Property) => void;
}

export function EditPropertyModal({
  property,
  onClose,
  onSaveProperty,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: property.title || "",
    address: property.address,
    area: property.area,
    city: property.city,
    landlordName: property.landlordName,
    landlordPhone: property.landlordPhone,
    landlordEmail: property.landlordEmail || "",
    agentName: property.agentName || "",
    agentPhone: property.agentPhone || "",
    agentEmail: property.agentEmail || "",
    listingType: property.listingType || "rent",
    rentAmount: String(property.rentAmount),
    frequency: property.frequency,
    status: property.status,
    startDate: property.startDate,
    endDate: property.endDate,
    cautionFee: String(property.cautionFee || 0),
    agentFee: String(property.agentFee || 0),
    legalAgreementFee: String(property.legalAgreementFee || 0),
    serviceCharge: String(property.serviceCharge || 0),
    bedrooms: String(property.bedrooms || 3),
    bathrooms: String(property.bathrooms || 2),
    kitchens: String(property.kitchens || 1),
    squareFeet: String(property.squareFeet || 2200),
    imageUrl: property.imageUrl || "",
    publishedToHome: property.publishedToHome ?? true,
    notes: property.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Property = {
      ...property,
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
      listingType: formData.listingType as ListingType,
      rentAmount: parseFloat(formData.rentAmount) || 0,
      frequency: formData.frequency,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      cautionFee: parseFloat(formData.cautionFee) || 0,
      agentFee: parseFloat(formData.agentFee) || 0,
      legalAgreementFee: parseFloat(formData.legalAgreementFee) || 0,
      serviceCharge: parseFloat(formData.serviceCharge) || 0,
      bedrooms: parseInt(formData.bedrooms) || 3,
      bathrooms: parseInt(formData.bathrooms) || 2,
      kitchens: parseInt(formData.kitchens) || 1,
      squareFeet: parseInt(formData.squareFeet) || 2200,
      imageUrl: formData.imageUrl || property.imageUrl,
      publishedToHome: formData.publishedToHome,
      notes: formData.notes.trim(),
    };
    onSaveProperty(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="card w-full max-w-2xl bg-white p-6 sm:p-7 rounded-3xl shadow-2xl relative my-8 border border-[#e6ddce] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#e6ddce]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0f4c81]/15 text-[#0f4c81] flex items-center justify-center font-bold">
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-[#1b130a]">
                Edit Property Details
              </h3>
              <p className="text-xs text-[#786953]">
                Update contract terms, specifications, and public listing status
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Property Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Tenancy Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as PropertyStatus })
                }
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
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
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              >
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
                <option value="lease">Long Lease</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Contract Rent / Price (₦) *
              </label>
              <input
                type="number"
                required
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Caution Fee (₦)
              </label>
              <input
                type="number"
                value={formData.cautionFee}
                onChange={(e) => setFormData({ ...formData, cautionFee: e.target.value })}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3.5 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e6ddce]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
