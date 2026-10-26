"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import {
  Search,
  Building,
  Key,
  Home,
  CheckCircle2,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Property, ListingType, AgentApplication } from "@/types/property";
import { RotatingHome3D } from "@/components/three/RotatingHome3D";
import { PropertyCarousel } from "@/components/home/PropertyCarousel";
import { AgentOnboardingSection } from "@/components/home/AgentOnboarding";
import { NIGERIAN_CITIES } from "@/lib/constants";
import { fmtNaira } from "@/lib/utils";

interface LandingPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onApplyAgent: (app: AgentApplication) => void;
  onOpenAuth: (mode: "login" | "signup") => void;
}

export function LandingPage({
  properties,
  onSelectProperty,
  onApplyAgent,
  onOpenAuth,
}: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<ListingType>("rent");
  const [location, setLocation] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const filteredProperties = properties.filter((p) => {
    const matchesTab = activeTab === "rent" ? p.listingType === "rent" || p.listingType === "lease" : p.listingType === activeTab;
    const matchesLocation = location === "all" || p.city.toLowerCase() === location.toLowerCase();
    return matchesTab && matchesLocation;
  });

  return (
    <div className="w-full flex flex-col space-y-16 lg:space-y-24">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Matching Sample Image 1 + Three.js 3D Home) */}
      {/* ========================================================= */}
      <section className="relative w-full pt-8 lg:pt-16 px-4 lg:px-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Glass Filter */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] text-xs font-bold border border-[#0f4c81]/20">
              <Sparkles size={14} /> The Trusted Way to Rent, Buy & Manage in Nigeria
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#1b130a] leading-[1.08] tracking-tight">
              Find Your <br />
              <span className="text-[#0f4c81]">Dream Place</span>
            </h1>

            <p className="text-sm lg:text-base text-[#786953] max-w-lg leading-relaxed">
              Buying or renting a home is a life-changing experience, so shouldn&apos;t your rental agreement manager and verified agents be life changers?
            </p>

            {/* Glassmorphism Search Filter Card (Matching Sample Image 1) */}
            <div className="glass-panel p-5 rounded-3xl space-y-4 max-w-xl">
              {/* Tabs: Buy | Sale | Rent */}
              <div className="flex gap-2">
                {(["buy", "sale", "rent"] as const).map((tab) => {
                  const mappedListing: ListingType = tab === "buy" ? "sale" : tab === "sale" ? "sale" : "rent";
                  const isSelected = activeTab === mappedListing;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(mappedListing)}
                      className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        isSelected
                          ? "bg-[#0f4c81] text-white shadow-md shadow-[#0f4c81]/25"
                          : "bg-white/70 text-[#786953] hover:bg-white border border-[#e6ddce]"
                      }`}
                    >
                      {tab === "buy" ? "Buy" : tab === "sale" ? "Sale" : "Rent"}
                    </button>
                  );
                })}
              </div>

              {/* Filter Dropdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953]">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/80 border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  >
                    <option value="all">All Cities</option>
                    {NIGERIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953]">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white/80 border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  >
                    <option value="all">All Types</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="duplex">Duplex</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953]">
                    Average Price
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-white/80 border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81]"
                  >
                    <option value="all">Any Price</option>
                    <option value="low">Under ₦2M</option>
                    <option value="mid">₦2M – ₦5M</option>
                    <option value="high">₦5M – ₦20M+</option>
                  </select>
                </div>
              </div>

              {/* Submit Search */}
              <button
                onClick={() => {
                  const el = document.getElementById("properties");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 rounded-2xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold transition-all shadow-lg shadow-[#0f4c81]/25 flex items-center justify-center gap-2"
              >
                <Search size={15} /> Search Properties ({filteredProperties.length} Available)
              </button>
            </div>
          </div>

          {/* Right Visual: 3D THREE.JS ROTATING HOME (User Requested) */}
          <div className="lg:col-span-6 w-full">
            <RotatingHome3D />
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. OUR HOME PARTNERS (Matching Sample Image 2) */}
      {/* ========================================================= */}
      <section className="w-full px-4 lg:px-8 py-8 border-y border-[#e6ddce] bg-white/60">
        <div className="text-center mb-6">
          <h3 className="font-display font-bold text-xl text-[#1b130a]">
            Our Home Partners & Financial Institutions
          </h3>
          <p className="text-xs text-[#786953] mt-1">
            Trusted by top mortgage, escrow, and banking partners
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14 text-sm font-bold text-[#786953] opacity-80">
          <span className="font-black tracking-tight text-xl text-[#0f4c81]">FIRST BANK</span>
          <span className="font-serif italic font-bold text-lg text-emerald-800">Blvck construct</span>
          <span className="font-black text-xl text-sky-900">hdfc</span>
          <span className="font-bold text-lg text-green-900 border border-green-900/30 px-3 py-1 rounded">MCB</span>
          <span className="font-black text-2xl tracking-tighter text-[#166534]">HBL</span>
          <span className="font-bold text-lg text-[#0f4c81]">Zenith Bank</span>
          <span className="font-bold text-lg text-[#c4601a]">GTBank</span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. ABOUT SECTION (Matching Sample Image 2) */}
      {/* ========================================================= */}
      <section id="about" className="w-full px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Image with Modern Blue Border Box */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-[#0f4c81] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Modern Architecture"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Background subtle offset accent */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#0f4c81]/10 rounded-3xl -z-10" />
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
              About TrustRent
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#1b130a] leading-tight">
              We Provide The Best Property & Tenancy Records For You
            </h2>
            <p className="text-sm text-[#786953] leading-relaxed">
              Real estate is considered to be one of the most valuable and important assets that people can own. In Nigeria, managing rent transparency, caution fee refunds, and verified agent representation gives tenants and property owners true peace of mind.
            </p>

            <ul className="space-y-2 text-xs font-bold text-[#1b130a] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0f4c81]" />
                <span>Residential and Commercial Sales</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0f4c81]" />
                <span>Verified Agent Mandate & Anti-Fraud Onboarding</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0f4c81]" />
                <span>Automated Caution Fee Tracking & Digital Rent Receipts</span>
              </li>
            </ul>

            <button
              onClick={() => onOpenAuth("signup")}
              className="mt-2 px-6 py-3 rounded-2xl bg-[#0f4c81] hover:bg-[#0a365c] text-white text-xs font-bold transition-all shadow-md shadow-[#0f4c81]/25 inline-flex items-center gap-2"
            >
              <span>Get Started</span> <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SERVICES / MAIN ACTIVITIES (Matching Sample Image 3) */}
      {/* ========================================================= */}
      <section id="services" className="w-full px-4 lg:px-8 py-8 bg-[#faf6ef]/70">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
            Services
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#1b130a] mt-1">
            Our Main Activities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Buy a Home */}
          <div className="card p-8 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-[#0f4c81] text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
              <Home size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[#1b130a]">
              Buy a Home
            </h3>
            <p className="text-xs text-[#786953] leading-relaxed">
              Share your budget and property requirements and we will ensure seamless transactions with verified owners and vetted title documents.
            </p>
          </div>

          {/* Card 2: Rent a Home */}
          <div className="card p-8 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-[#0f4c81] text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
              <Key size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[#1b130a]">
              Rent a Home
            </h3>
            <p className="text-xs text-[#786953] leading-relaxed">
              Find verified apartments with digital payment receipts, automated 11th-month renewal reminders, and move-in defect evidence logs.
            </p>
          </div>

          {/* Card 3: Sell a Home */}
          <div className="card p-8 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-xl transition-all text-center space-y-4 group">
            <div className="w-16 h-16 rounded-full bg-[#0f4c81] text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
              <Building size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-[#1b130a]">
              Sell a Home
            </h3>
            <p className="text-xs text-[#786953] leading-relaxed">
              Listing your properties through TrustRent connects you with vetted, credible buyers and corporate tenants in record time.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. OUR PROPERTIES CAROUSEL (Matching Sample Image 4) */}
      {/* ========================================================= */}
      <section id="properties" className="w-full px-4 lg:px-8 py-8">
        <PropertyCarousel
          properties={filteredProperties.length > 0 ? filteredProperties : properties}
          onSelectProperty={onSelectProperty}
        />
      </section>

      {/* ========================================================= */}
      {/* 6. AGENT ONBOARDING SECTION (User Requested Requirement) */}
      {/* ========================================================= */}
      <section id="agents" className="w-full px-4 lg:px-8 py-4">
        <AgentOnboardingSection onApply={onApplyAgent} />
      </section>

      {/* ========================================================= */}
      {/* 7. TESTIMONIALS (Matching Sample Image 5) */}
      {/* ========================================================= */}
      <section id="testimonials" className="w-full px-4 lg:px-8 py-8 bg-[#faf6ef]/70">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0f4c81]">
            Testimonials
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-[#1b130a] mt-1">
            Our Happy Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client 1: Amelia Kerr */}
          <div className="card p-6 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#0f4c81]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                alt="Amelia Kerr"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-display font-bold text-lg text-[#1b130a]">
              Amelia Kerr
            </h4>
            <div className="flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#786953] leading-relaxed">
              &quot;I am glad that I contacted TrustRent on the recommendation of friends. The caution fee recovery workflow saved me ₦300,000 on my move-out inspection.&quot;
            </p>
          </div>

          {/* Client 2: Henry Johns */}
          <div className="card p-6 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#0f4c81]">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Henry Johns"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-display font-bold text-lg text-[#1b130a]">
              Henry Johns
            </h4>
            <div className="flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#786953] leading-relaxed">
              &quot;The best real estate platform I have ever dealt with. Verified agents, two-way direct communication with the property owner, and clean receipts.&quot;
            </p>
          </div>

          {/* Client 3: James Smith */}
          <div className="card p-6 bg-white rounded-3xl border border-[#e6ddce] shadow-sm hover:shadow-md transition-all text-center space-y-3">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#0f4c81]">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="James Smith"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-display font-bold text-lg text-[#1b130a]">
              James Smith
            </h4>
            <div className="flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#786953] leading-relaxed">
              &quot;As a property owner with 4 luxury homes in Lekki and Abuja, managing automated reminders, revenue projections, and maintenance expenses in one portal is invaluable.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#1b130a] text-white py-12 px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10 text-xs">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0f4c81] flex items-center justify-center text-white font-bold">
                <Home size={16} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                TrustRent
              </span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Nigeria&apos;s premier rental agreement and property asset management platform. Bridging trust between property owners, tenants, and licensed real estate agents.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-white">Explore</p>
            <ul className="space-y-1.5 text-gray-400">
              <li><a href="#properties" className="hover:text-white">Properties for Rent</a></li>
              <li><a href="#properties" className="hover:text-white">Properties for Sale</a></li>
              <li><a href="#agents" className="hover:text-white">Agent Verification</a></li>
              <li><a href="#about" className="hover:text-white">About TrustRent</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold uppercase tracking-wider text-white">Support & Legal</p>
            <ul className="space-y-1.5 text-gray-400">
              <li><span>Lagos State Tenancy Law Guide</span></li>
              <li><span>Caution Fee Protection Policy</span></li>
              <li><span>Digital Receipts Validation</span></li>
              <li><span>contact@trustrent.ng</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} TrustRent Real Estate Management Ltd. All rights reserved.</p>
          <p>Made with high security & precision for Nigerian Real Estate.</p>
        </div>
      </footer>
    </div>
  );
}
