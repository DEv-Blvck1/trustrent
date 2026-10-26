"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  UtensilsCrossed,
  Maximize2,
  MapPin,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Property } from "@/types/property";
import { fmtNaira } from "@/lib/utils";

interface PropertyCarouselProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export function PropertyCarousel({
  properties,
  onSelectProperty,
}: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show up to 3 cards at once on desktop, 1 on mobile
  const maxIndex = Math.max(0, properties.length - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
            Our Properties
          </span>
          <h2 className="font-display font-bold text-3xl text-[#1b130a]">
            Latest Properties
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#e6ddce] bg-white hover:bg-[#0f4c81] hover:text-white text-[#1b130a] flex items-center justify-center shadow-sm transition-all"
            aria-label="Previous property"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#e6ddce] bg-white hover:bg-[#0f4c81] hover:text-white text-[#1b130a] flex items-center justify-center shadow-sm transition-all"
            aria-label="Next property"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {properties.slice(currentIndex, currentIndex + 3).concat(
          properties.slice(0, Math.max(0, currentIndex + 3 - properties.length))
        ).map((prop, idx) => (
          <div
            key={prop.id + idx}
            className="card bg-white rounded-3xl overflow-hidden border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
          >
            {/* Image Thumbnail */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-100">
              <img
                src={
                  prop.imageUrl ||
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                }
                alt={prop.title || prop.address}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#0f4c81] backdrop-blur-md shadow-sm">
                  For {prop.listingType}
                </span>
                {prop.isAgentVerified && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#166534] text-white flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={11} /> Verified Agent
                  </span>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-display font-bold text-xl text-[#1b130a] group-hover:text-[#0f4c81] transition-colors line-clamp-1">
                  {prop.title || prop.address}
                </h3>
                <p className="text-xs text-[#786953] flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-[#c4601a]" />
                  <span>
                    {prop.area}, {prop.city}
                  </span>
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#e6ddce]/60 text-[#786953] text-[11px]">
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#faf6ef]">
                  <Bed size={15} className="text-[#0f4c81] mb-0.5" />
                  <span className="font-bold text-[#1b130a]">{prop.bedrooms} Beds</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#faf6ef]">
                  <Bath size={15} className="text-[#0f4c81] mb-0.5" />
                  <span className="font-bold text-[#1b130a]">{prop.bathrooms} Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#faf6ef]">
                  <UtensilsCrossed size={15} className="text-[#0f4c81] mb-0.5" />
                  <span className="font-bold text-[#1b130a]">{prop.kitchens} Kitchen</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#faf6ef]">
                  <Maximize2 size={15} className="text-[#0f4c81] mb-0.5" />
                  <span className="font-bold text-[#1b130a]">{prop.squareFeet} Sq ft</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-[#e6ddce]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#786953] block">
                    Price
                  </span>
                  <p className="font-mono font-bold text-lg text-[#0f4c81]">
                    {fmtNaira(prop.rentAmount)}
                    {prop.listingType !== "sale" && (
                      <span className="text-xs font-normal text-[#786953]">/yr</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => onSelectProperty(prop)}
                  className="px-4 py-2 rounded-xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold shadow-md transition-all"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
