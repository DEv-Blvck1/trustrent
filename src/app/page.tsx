"use client";

import { useState, useMemo } from "react";
import {
  Home, Plus, CheckCircle, AlertCircle, Clock, Trash2,
  FileText, ChevronDown, ChevronUp, Phone, MapPin, Calendar,
  DollarSign, TrendingUp, User, X, Download, Shield, Bell
} from "lucide-react";

type PaymentStatus = "paid" | "pending" | "overdue";
type RentFrequency = "monthly" | "quarterly" | "annually";

interface PaymentRecord {
  id: string;
  period: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  receiptNo?: string;
}

interface Property {
  id: string;
  address: string;
  area: string;
  city: string;
  landlordName: string;
  landlordPhone: string;
  agentName?: string;
  agentPhone?: string;
  rentAmount: number;
  frequency: RentFrequency;
  startDate: string;
  endDate: string;
  cautionFee: number;
  agentFee: number;
  payments: PaymentRecord[];
  notes: string;
  status: "active" | "expired" | "terminated";
}

function genId() { return Math.random().toString(36).slice(2, 9); }

function fmtNaira(n: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(n);
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const SEED_PROPERTIES: Property[] = [
  {
    id: "prop1",
    address: "12B Okoye Close",
    area: "GRA",
    city: "Benin City",
    landlordName: "Chief Emmanuel Eze",
    landlordPhone: "08031234567",
    agentName: "Mr. Rotimi Adeyemi",
    agentPhone: "07051234567",
    rentAmount: 600000,
    frequency: "annually",
    startDate: "2025-04-01",
    endDate: "2026-03-31",
    cautionFee: 150000,
    agentFee: 60000,
    notes: "Gate painted green. Water heater in master bathroom needs fixing. Landlord prefers payments by 31st.",
    status: "active",
    payments: [
      { id: "pay1", period: "Apr 2025 – Mar 2026", amount: 600000, dueDate: "2025-04-01", paidDate: "2025-04-03", status: "paid", receiptNo: "RCT-2025-001" },
      { id: "pay2", period: "Apr 2026 – Mar 2027", amount: 650000, dueDate: "2026-04-01", status: "pending" },
    ],
  },
  {
    id: "prop2",
    address: "Flat 4, Sunrise Estate",
    area: "Ugbowo",
    city: "Benin City",
    landlordName: "Mrs. Patience Okafor",
    landlordPhone: "08091234567",
    rentAmount: 350000,
    frequency: "annually",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    cautionFee: 100000,
    agentFee: 35000,
    notes: "Previous apartment. Caution fee of ₦100,000 not yet refunded.",
    status: "expired",
    payments: [
      { id: "pay3", period: "Jan 2024 – Jan 2025", amount: 350000, dueDate: "2024-01-15", paidDate: "2024-01-15", status: "paid", receiptNo: "RCT-2024-001" },
    ],
  },
];

export default function TrustRent() {
  const [properties, setProperties] = useState<Property[]>(SEED_PROPERTIES);
  const [selectedId, setSelectedId] = useState<string>("prop1");
  const [tab, setTab] = useState<"overview" | "payments" | "notes">("overview");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [expandNotes, setExpandNotes] = useState(false);

  const [payForm, setPayForm] = useState({ period: "", amount: "", dueDate: "", paidDate: "", status: "pending" as PaymentStatus, receiptNo: "" });
  const [propForm, setPropForm] = useState({ address: "", area: "", city: "", landlordName: "", landlordPhone: "", rentAmount: "", frequency: "annually" as RentFrequency, startDate: "", endDate: "", cautionFee: "", agentFee: "", notes: "" });

  const selected = properties.find(p => p.id === selectedId) ?? properties[0];

  const stats = useMemo(() => {
    const allPaid = properties.flatMap(p => p.payments.filter(pay => pay.status === "paid"));
    const allPending = properties.flatMap(p => p.payments.filter(pay => pay.status === "pending" || pay.status === "overdue"));
    const totalPaid = allPaid.reduce((a, p) => a + p.amount, 0);
    const totalOwed = allPending.reduce((a, p) => a + p.amount, 0);
    const totalCaution = properties.reduce((a, p) => a + p.cautionFee, 0);
    const totalSpent = properties.reduce((a, p) => a + p.cautionFee + p.agentFee, 0) + totalPaid;
    return { totalPaid, totalOwed, totalCaution, totalSpent };
  }, [properties]);

  const daysLeft = daysUntil(selected.endDate);

  const addPayment = () => {
    if (!payForm.period || !payForm.amount) return;
    const payment: PaymentRecord = {
      id: genId(), period: payForm.period, amount: parseFloat(payForm.amount),
      dueDate: payForm.dueDate, paidDate: payForm.paidDate || undefined,
      status: payForm.status, receiptNo: payForm.receiptNo || undefined,
    };
    setProperties(prev => prev.map(p => p.id === selectedId ? { ...p, payments: [...p.payments, payment] } : p));
    setPayForm({ period: "", amount: "", dueDate: "", paidDate: "", status: "pending", receiptNo: "" });
    setShowAddPayment(false);
  };

  const addProperty = () => {
    if (!propForm.address || !propForm.landlordName) return;
    const prop: Property = {
      id: genId(),
      address: propForm.address, area: propForm.area, city: propForm.city,
      landlordName: propForm.landlordName, landlordPhone: propForm.landlordPhone,
      rentAmount: parseFloat(propForm.rentAmount)||0,
      frequency: propForm.frequency,
      startDate: propForm.startDate, endDate: propForm.endDate,
      cautionFee: parseFloat(propForm.cautionFee)||0,
      agentFee: parseFloat(propForm.agentFee)||0,
      notes: propForm.notes, status: "active", payments: [],
    };
    setProperties(prev => [prop, ...prev]);
    setSelectedId(prop.id);
    setShowAddProperty(false);
    setPropForm({ address: "", area: "", city: "", landlordName: "", landlordPhone: "", rentAmount: "", frequency: "annually", startDate: "", endDate: "", cautionFee: "", agentFee: "", notes: "" });
  };

  const STATUS_BADGE: Record<PaymentStatus, string> = {
    paid: "badge-paid", pending: "badge-pending", overdue: "badge-overdue"
  };

  const PROP_STATUS: Record<Property["status"], { label: string; cls: string }> = {
    active: { label: "Active", cls: "badge-active" },
    expired: { label: "Expired", cls: "badge-overdue" },
    terminated: { label: "Terminated", cls: "badge-pending" },
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2d9c8] px-5 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c4601a] flex items-center justify-center shadow-sm">
              <Home size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-2xl leading-none text-[#1a1208]">TrustRent</h1>
              <p className="text-xs text-[#7a6a50]">Your rental records, organized</p>
            </div>
          </div>
          <button onClick={() => setShowAddProperty(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4601a] text-white text-sm font-semibold hover:bg-[#a84e14] transition-all shadow-sm shadow-[#c4601a]/20">
            <Plus size={15}/> Add Property
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="card p-4 fade-in">
            <h3 className="font-display text-lg text-[#1a1208] mb-3">Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#e2d9c8]">
                <span className="text-sm text-[#7a6a50]">Total Rent Paid</span>
                <span className="font-mono font-semibold text-[#2d6a4f]">{fmtNaira(stats.totalPaid)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e2d9c8]">
                <span className="text-sm text-[#7a6a50]">Outstanding</span>
                <span className="font-mono font-semibold text-[#c1121f]">{fmtNaira(stats.totalOwed)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e2d9c8]">
                <span className="text-sm text-[#7a6a50]">Caution Fees</span>
                <span className="font-mono font-semibold text-[#c4601a]">{fmtNaira(stats.totalCaution)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold text-[#1a1208]">Total Housing Spend</span>
                <span className="font-mono font-bold text-[#1a1208]">{fmtNaira(stats.totalSpent)}</span>
              </div>
            </div>
          </div>

          {/* Property list */}
          <div className="space-y-2 fade-in delay-1">
            <p className="text-xs font-semibold text-[#7a6a50] uppercase tracking-wide px-1">Your Properties</p>
            {properties.map(p => (
              <button key={p.id} onClick={() => setSelectedId(p.id)}
                className={`w-full text-left card p-4 transition-all ${selectedId === p.id ? "border-[#c4601a] bg-[#fdf5ec]" : "hover:border-[#c4601a]/30"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#1a1208] truncate">{p.address}</p>
                    <p className="text-xs text-[#7a6a50] mt-0.5 flex items-center gap-1"><MapPin size={10}/>{p.area}, {p.city}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${PROP_STATUS[p.status].cls}`}>{PROP_STATUS[p.status].label}</span>
                </div>
                <p className="font-mono text-sm font-semibold text-[#c4601a] mt-2">{fmtNaira(p.rentAmount)}<span className="text-xs font-normal text-[#7a6a50]">/{p.frequency === "annually" ? "yr" : p.frequency === "monthly" ? "mo" : "qtr"}</span></p>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-4">
          {selected && (
            <>
              {/* Property header */}
              <div className="card p-5 fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display text-3xl font-semibold text-[#1a1208]">{selected.address}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PROP_STATUS[selected.status].cls}`}>{PROP_STATUS[selected.status].label}</span>
                    </div>
                    <p className="text-[#7a6a50] flex items-center gap-1 text-sm"><MapPin size={13}/>{selected.area}, {selected.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-2xl text-[#c4601a]">{fmtNaira(selected.rentAmount)}</p>
                    <p className="text-xs text-[#7a6a50] capitalize">{selected.frequency}</p>
                  </div>
                </div>

                {/* Lease timeline */}
                <div className="mt-4 p-3 rounded-xl bg-[#f0e8d8]">
                  <div className="flex items-center justify-between text-xs text-[#7a6a50] mb-2">
                    <span className="flex items-center gap-1"><Calendar size={11}/> Lease period</span>
                    <span className={`font-semibold ${daysLeft < 30 ? "text-[#c1121f]" : daysLeft < 90 ? "text-[#c4601a]" : "text-[#2d6a4f]"}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : `Expired ${Math.abs(daysLeft)} days ago`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e2d9c8] overflow-hidden">
                    <div className="h-full rounded-full bg-[#c4601a] transition-all" style={{
                      width: `${Math.max(0, Math.min(100, ((Date.now() - new Date(selected.startDate).getTime()) / (new Date(selected.endDate).getTime() - new Date(selected.startDate).getTime())) * 100))}%`
                    }}/>
                  </div>
                  <div className="flex justify-between text-xs text-[#7a6a50] mt-1.5">
                    <span>{selected.startDate}</span><span>{selected.endDate}</span>
                  </div>
                </div>

                {/* Renewal alert */}
                {daysLeft > 0 && daysLeft < 60 && (
                  <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-[#fee2e2] border border-[#fecaca]">
                    <Bell size={14} className="text-[#c1121f] flex-shrink-0"/>
                    <p className="text-xs text-[#991b1b]">Lease renews in <strong>{daysLeft} days</strong>. Contact your landlord to negotiate terms before it's too late.</p>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-[#f0e8d8] rounded-xl p-1 w-fit">
                {(["overview","payments","notes"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-[#1a1208] shadow-sm" : "text-[#7a6a50] hover:text-[#1a1208]"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* OVERVIEW TAB */}
              {tab === "overview" && (
                <div className="space-y-4 fade-in">
                  {/* Landlord / Agent contacts */}
                  <div className="card p-5">
                    <h3 className="font-display text-lg font-semibold text-[#1a1208] mb-4">Contacts</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f0e8d8] flex items-center justify-center">
                          <User size={16} className="text-[#c4601a]"/>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a1208]">{selected.landlordName}</p>
                          <p className="text-xs text-[#7a6a50]">Landlord</p>
                        </div>
                        <a href={`tel:${selected.landlordPhone}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-semibold hover:bg-[#2d6a4f]/20 transition-colors">
                          <Phone size={12}/>{selected.landlordPhone}
                        </a>
                      </div>
                      {selected.agentName && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f0e8d8] flex items-center justify-center">
                            <Shield size={16} className="text-[#7a6a50]"/>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#1a1208]">{selected.agentName}</p>
                            <p className="text-xs text-[#7a6a50]">Agent</p>
                          </div>
                          <a href={`tel:${selected.agentPhone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7a6a50]/10 text-[#7a6a50] text-xs font-semibold hover:bg-[#7a6a50]/20 transition-colors">
                            <Phone size={12}/>{selected.agentPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial breakdown */}
                  <div className="card p-5">
                    <h3 className="font-display text-lg font-semibold text-[#1a1208] mb-4">Financial Summary</h3>
                    <div className="space-y-2">
                      {[
                        { label: "Annual Rent", value: selected.rentAmount, color: "#c4601a" },
                        { label: "Caution Fee (refundable)", value: selected.cautionFee, color: "#2d6a4f" },
                        { label: "Agent Fee (non-refundable)", value: selected.agentFee, color: "#7a6a50" },
                        { label: "Total Initial Outlay", value: selected.rentAmount + selected.cautionFee + selected.agentFee, color: "#1a1208", bold: true },
                      ].map(row => (
                        <div key={row.label} className={`flex justify-between items-center py-2 ${row.bold ? "border-t border-[#e2d9c8] pt-3 mt-1" : ""}`}>
                          <span className={`text-sm ${row.bold ? "font-semibold text-[#1a1208]" : "text-[#7a6a50]"}`}>{row.label}</span>
                          <span className={`font-mono font-semibold text-sm`} style={{ color: row.color }}>{fmtNaira(row.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENTS TAB */}
              {tab === "payments" && (
                <div className="space-y-3 fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#7a6a50]">{selected.payments.length} payment records</p>
                    <button onClick={() => setShowAddPayment(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-semibold hover:bg-[#a84e14] transition-all">
                      <Plus size={13}/> Log Payment
                    </button>
                  </div>
                  {selected.payments.map(pay => (
                    <div key={pay.id} className="card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pay.status === "paid" ? "bg-green-100" : pay.status === "overdue" ? "bg-red-100" : "bg-yellow-100"}`}>
                            {pay.status === "paid" ? <CheckCircle size={16} className="text-green-600"/> : pay.status === "overdue" ? <AlertCircle size={16} className="text-red-600"/> : <Clock size={16} className="text-yellow-600"/>}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1208]">{pay.period}</p>
                            <p className="text-xs text-[#7a6a50]">Due: {pay.dueDate}{pay.paidDate ? ` · Paid: ${pay.paidDate}` : ""}</p>
                            {pay.receiptNo && <p className="text-xs text-[#7a6a50] font-mono">{pay.receiptNo}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-[#1a1208]">{fmtNaira(pay.amount)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[pay.status]}`}>{pay.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selected.payments.length === 0 && (
                    <div className="card p-8 text-center text-[#7a6a50]">
                      <FileText size={28} className="mx-auto mb-2 opacity-30"/>
                      <p className="text-sm">No payment records yet. Log your first payment above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* NOTES TAB */}
              {tab === "notes" && (
                <div className="fade-in">
                  <div className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-lg font-semibold text-[#1a1208]">Property Notes</h3>
                      <p className="text-xs text-[#7a6a50]">Issues, agreements & disputes</p>
                    </div>
                    <textarea
                      value={selected.notes}
                      onChange={e => setProperties(prev => prev.map(p => p.id === selectedId ? {...p, notes: e.target.value} : p))}
                      rows={8}
                      placeholder="Record important details — defects on arrival, verbal agreements, dispute notes, repairs promised..."
                      className="w-full bg-[#faf7f2] border border-[#e2d9c8] rounded-xl p-4 text-sm text-[#1a1208] placeholder-[#7a6a50] focus:outline-none focus:border-[#c4601a]/50 resize-none leading-relaxed"
                    />
                    <p className="text-xs text-[#7a6a50] mt-2">💡 Tip: Document defects when you move in. Take photos and list them here as evidence.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ADD PAYMENT MODAL */}
      {showAddPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card w-full max-w-sm p-6 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold text-[#1a1208]">Log Payment</h3>
              <button onClick={() => setShowAddPayment(false)} className="text-[#7a6a50] hover:text-[#1a1208]"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Period (e.g. Apr 2026 – Mar 2027)", key: "period", type: "text", ph: "Apr 2026 – Mar 2027" },
                { label: "Amount (₦)", key: "amount", type: "number", ph: "600000" },
                { label: "Due Date", key: "dueDate", type: "date", ph: "" },
                { label: "Paid Date (if paid)", key: "paidDate", type: "date", ph: "" },
                { label: "Receipt / Teller No.", key: "receiptNo", type: "text", ph: "RCT-2026-001" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-[#7a6a50] uppercase tracking-wide mb-1.5 block font-semibold">{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={(payForm as Record<string,string>)[f.key]}
                    onChange={e => setPayForm(prev => ({...prev, [f.key]: e.target.value}))}
                    className="w-full bg-[#faf7f2] border border-[#e2d9c8] rounded-xl px-4 py-2.5 text-sm text-[#1a1208] focus:outline-none focus:border-[#c4601a]/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-xs text-[#7a6a50] uppercase tracking-wide mb-1.5 block font-semibold">Status</label>
                <div className="flex gap-2">
                  {(["paid","pending","overdue"] as PaymentStatus[]).map(s => (
                    <button key={s} onClick={() => setPayForm(f => ({...f, status: s}))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${payForm.status === s ? STATUS_BADGE[s] : "border-[#e2d9c8] text-[#7a6a50]"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addPayment} className="w-full py-3 rounded-xl bg-[#c4601a] text-white font-semibold hover:bg-[#a84e14] transition-all">
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {showAddProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold text-[#1a1208]">Add Property</h3>
              <button onClick={() => setShowAddProperty(false)} className="text-[#7a6a50] hover:text-[#1a1208]"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Street Address", key: "address", type: "text", ph: "12B Okoye Close" },
                { label: "Area / Estate", key: "area", type: "text", ph: "GRA" },
                { label: "City", key: "city", type: "text", ph: "Benin City" },
                { label: "Landlord Name", key: "landlordName", type: "text", ph: "Chief Emmanuel Eze" },
                { label: "Landlord Phone", key: "landlordPhone", type: "tel", ph: "08031234567" },
                { label: "Annual Rent (₦)", key: "rentAmount", type: "number", ph: "600000" },
                { label: "Caution Fee (₦)", key: "cautionFee", type: "number", ph: "150000" },
                { label: "Agent Fee (₦)", key: "agentFee", type: "number", ph: "60000" },
                { label: "Lease Start", key: "startDate", type: "date", ph: "" },
                { label: "Lease End", key: "endDate", type: "date", ph: "" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-[#7a6a50] uppercase tracking-wide mb-1.5 block font-semibold">{f.label}</label>
                  <input type={f.type} placeholder={f.ph}
                    value={(propForm as Record<string,string>)[f.key]}
                    onChange={e => setPropForm(prev => ({...prev, [f.key]: e.target.value}))}
                    className="w-full bg-[#faf7f2] border border-[#e2d9c8] rounded-xl px-4 py-2.5 text-sm text-[#1a1208] focus:outline-none focus:border-[#c4601a]/50 transition-colors" />
                </div>
              ))}
              <button onClick={addProperty} className="w-full py-3 rounded-xl bg-[#c4601a] text-white font-semibold hover:bg-[#a84e14] transition-all">
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
