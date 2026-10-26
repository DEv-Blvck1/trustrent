"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Wrench,
  Receipt,
  PieChart,
  Calendar,
  Building,
} from "lucide-react";
import { Property, PropertyExpense } from "@/types/property";
import { fmtNaira, formatDate, genId } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";

interface AdminRevenueExpensesProps {
  properties: Property[];
  onAddExpense: (expense: PropertyExpense) => void;
}

export function AdminRevenueExpenses({
  properties,
  onAddExpense,
}: AdminRevenueExpensesProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.id || ""
  );
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PropertyExpense["category"]>("repair");
  const [amount, setAmount] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [notes, setNotes] = useState("");
  const { showToast } = useToast();

  // Aggregate Total Revenue & Expenses across all properties
  let totalRevenue = 0;
  let totalExpenses = 0;
  const allExpenses: (PropertyExpense & { propertyTitle: string })[] = [];

  for (const p of properties) {
    for (const pay of p.payments) {
      if (pay.status === "paid") {
        totalRevenue += pay.amount;
      }
    }
    for (const exp of p.expenses || []) {
      totalExpenses += exp.amount;
      allExpenses.push({
        ...exp,
        propertyTitle: p.title || p.address,
      });
    }
  }

  // Sort expenses by date descending
  allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const netIncome = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !selectedPropertyId) {
      showToast("Please fill in expense details and amount.", "error");
      return;
    }

    const newExpense: PropertyExpense = {
      id: genId(),
      propertyId: selectedPropertyId,
      title: title.trim(),
      category,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split("T")[0],
      vendorName: vendorName.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onAddExpense(newExpense);
    setTitle("");
    setAmount("");
    setVendorName("");
    setNotes("");
    setShowAddExpense(false);
    showToast("Property expense recorded.", "success");
  };

  const CATEGORY_NAMES: Record<PropertyExpense["category"], string> = {
    repair: "Repairs & Maintenance",
    remodeling: "Remodeling",
    renovation: "Renovation",
    plumbing: "Plumbing",
    electrical: "Electrical",
    generator_fuel: "Generator & Fuel",
    cleaning: "Estate Cleaning",
    other: "Other Expense",
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Financial Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Inflow / Rent Paid
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#eaf6ee] text-[#166534] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="font-mono font-bold text-3xl text-[#166534]">
            {fmtNaira(totalRevenue)}
          </p>
          <p className="text-[11px] text-[#786953]">
            Collected across {properties.length} managed properties
          </p>
        </div>

        {/* Total Expenses */}
        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Property Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="font-mono font-bold text-3xl text-[#b91c1c]">
            {fmtNaira(totalExpenses)}
          </p>
          <p className="text-[11px] text-[#786953]">
            Repairs, remodeling, servicing & fixtures
          </p>
        </div>

        {/* Net Operating Income & Margin */}
        <div className="card p-5 bg-white border border-[#e6ddce] rounded-3xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#786953]">
            <span className="text-xs font-bold uppercase tracking-wider">
              Net Operating Yield
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#faf6ef] text-[#0f4c81] flex items-center justify-center">
              <PieChart size={16} />
            </div>
          </div>
          <p className="font-mono font-bold text-3xl text-[#0f4c81]">
            {fmtNaira(netIncome)}
          </p>
          <p className="text-[11px] font-semibold text-[#166534]">
            Operating Margin: {margin}%
          </p>
        </div>
      </div>

      {/* Toolbar: Log Expense Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
        <div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            Expenses & Outlay Ledger
          </h3>
          <p className="text-xs text-[#786953]">
            Track fixes, renovations, repairs, and contractor expenses per property
          </p>
        </div>

        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#c4601a] text-white text-xs font-bold hover:bg-[#aa5014] transition-all shadow-md shadow-[#c4601a]/20"
        >
          <Plus size={15} /> Log Property Expense
        </button>
      </div>

      {/* Add Expense Form Drawer */}
      {showAddExpense && (
        <form
          onSubmit={handleExpenseSubmit}
          className="card p-6 bg-white border-2 border-[#c4601a]/30 rounded-3xl shadow-lg space-y-4"
        >
          <h4 className="font-bold text-sm text-[#1b130a]">
            Record Fix / Remodeling / Maintenance Outlay
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Property *
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || p.address} ({p.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Expense Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Borehole pump replacement, Gate painting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as PropertyExpense["category"])
                }
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              >
                {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Cost Amount (₦) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 85000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Contractor / Vendor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mikano Technicians / Alfa Plumber"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#786953] block mb-1">
                Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Replaced 3-inch pipes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#faf6ef] border border-[#e6ddce] rounded-xl px-3 py-2 text-xs text-[#1b130a] focus:outline-none focus:border-[#c4601a]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e6ddce]">
            <button
              type="button"
              onClick={() => setShowAddExpense(false)}
              className="px-4 py-2 rounded-xl border border-[#e6ddce] text-xs font-semibold text-[#786953]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#c4601a] text-white text-xs font-bold hover:bg-[#aa5014]"
            >
              Save Expense Entry
            </button>
          </div>
        </form>
      )}

      {/* Itemized Expenses Table */}
      <div className="card bg-white rounded-3xl border border-[#e6ddce] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#faf6ef] border-b border-[#e6ddce] flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#1b130a]">
            Itemized Maintenance & Outlay History ({allExpenses.length})
          </h4>
          <span className="text-xs text-[#786953]">Deducted from gross yield</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#e6ddce] text-[#786953] bg-[#faf6ef]/50">
                <th className="py-3 px-4 font-bold">Property</th>
                <th className="py-3 px-4 font-bold">Expense Description</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Vendor</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6ddce]/60">
              {allExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#faf6ef]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1b130a]">
                    {exp.propertyTitle}
                  </td>
                  <td className="py-3.5 px-4 text-[#1b130a]">
                    <span className="font-bold">{exp.title}</span>
                    {exp.notes && (
                      <span className="block text-[11px] text-[#786953] italic">
                        {exp.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#faf6ef] border border-[#e6ddce] text-[10px] font-bold text-[#786953]">
                      {CATEGORY_NAMES[exp.category]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#786953]">
                    {exp.vendorName || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-[#786953]">
                    {formatDate(exp.date)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#b91c1c]">
                    -{fmtNaira(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {allExpenses.length === 0 && (
          <div className="p-8 text-center text-xs text-[#786953]">
            No expenses logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

