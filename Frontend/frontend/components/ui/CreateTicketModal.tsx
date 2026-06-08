"use client";

import { useState } from "react";

const ROLES = [
  "Software Engineer",
  "Product Manager",
  "HR Specialist",
  "DevOps Engineer",
  "QA Engineer",
  "UX Designer",
  "Finance Analyst",
  "Sales Representative",
];

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTicketModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    employee_name: "",
    role: ROLES[0],
    start_date: "",
    hardware_tier: "Standard",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.employee_name || !form.start_date) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/onboarding/Tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Initiate onboarding</h2>
              <p className="text-slate-500 text-sm">
                Create a new hire profile. It routes to the hiring manager for review on submit.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Field label="Full name" required>
            <input
              type="text"
              value={form.employee_name}
              onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
              placeholder="e.g. Elena Vasquez"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </Field>

          <Field label="Role / title" required>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          <Field label="Start date" required>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </Field>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-slate-900 mb-2">
            Hardware tier <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <TierOption
              selected={form.hardware_tier === "Standard"}
              onClick={() => setForm({ ...form, hardware_tier: "Standard" })}
              title="Standard"
              subtitle="Skips Finance review"
            />
            <TierOption
              selected={form.hardware_tier === "Premium"}
              onClick={() => setForm({ ...form, hardware_tier: "Premium" })}
              title="Premium"
              subtitle="Needs Finance approval"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Premium routes through Finance for budget approval; Standard skips it.
          </p>
        </div>

        <Field label="Notes (optional)">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Anything the Management, finance, or IT should know..."
            rows={3}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </Field>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {loading ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      {children}
    </div>
  );
}

function TierOption({ selected, onClick, title, subtitle }: { selected: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border-2 transition-colors ${
        selected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </button>
  );
}