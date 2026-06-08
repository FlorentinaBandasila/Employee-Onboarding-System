"use client";

import { useState } from "react";
import { useUser } from "@/lib/user-context";
import { generateTicketPdf } from "@/lib/pdf";

interface Ticket {
  id: number;
  employee_name: string;
  role: string;
  start_date: string;
  hardware_tier: string;
  status: string;
  manager_status: string | null;
  finance_status: string | null;
  it_status: string | null;
  notes: string | null;
  job_description: string | null;
}

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
  ticket: Ticket;
  onClose: () => void;
  onUpdated: () => void;
}

const DEPT_ENDPOINT: Record<string, string> = {
  Management: "manager-status",
  Finance: "finance-status",
  IT: "it-status",
};

const DEPT_STATUS: Record<string, string> = {
  Management: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export default function ReviewModal({ ticket, onClose, onUpdated }: Props) {
  const { currentUser } = useUser();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    employee_name: ticket.employee_name,
    role: ticket.role,
    start_date: ticket.start_date,
    hardware_tier: ticket.hardware_tier,
  });

  const canReview =
    currentUser && DEPT_STATUS[currentUser.department] === ticket.status;

  const canResubmit =
    currentUser?.department === "HR" && ticket.status === "Needs Rework";

  async function submit(action: "Approved" | "Rejected") {
    if (!currentUser) return;
    const endpoint = DEPT_ENDPOINT[currentUser.department];
    if (!endpoint) return;

    setLoading(true);
    try {
      await fetch(`http://localhost:8000/onboarding/Tickets/${ticket.id}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          notes: action === "Rejected" ? note : undefined,
        }),
      });
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function resubmit() {
    setLoading(true);
    try {
      await fetch(`http://localhost:8000/onboarding/Tickets/${ticket.id}/resubmit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      onUpdated();
      onClose();
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
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{ticket.employee_name}</h2>
            <p className="text-slate-500 text-sm">Ticket #{ticket.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
        </div>

        {ticket.status === "Needs Rework" && ticket.notes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs uppercase text-red-700 font-semibold mb-1">Rejection reason</p>
            <p className="text-red-800 text-sm whitespace-pre-wrap">{ticket.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Role" value={ticket.role} />
          <Field label="Start Date" value={ticket.start_date} />
          <Field label="Hardware Tier" value={ticket.hardware_tier} />
          <Field label="Status" value={ticket.status} />
          <Field label="Manager Status" value={ticket.manager_status ?? "—"} />
          <Field label="Finance Status" value={ticket.finance_status ?? "—"} />
          <Field label="IT Status" value={ticket.it_status ?? "—"} />
        </div>

        {ticket.notes && ticket.status !== "Needs Rework" && (
          <div className="mb-6">
            <p className="text-xs uppercase text-slate-500 mb-1">Notes</p>
            <p className="text-slate-800 bg-slate-50 rounded-lg p-3 text-sm whitespace-pre-wrap">
              {ticket.notes}
            </p>
          </div>
        )}

        {ticket.job_description && (
          <div className="mb-6">
            <p className="text-xs uppercase text-slate-500 mb-1">Job Description</p>
            <p className="text-slate-800 bg-slate-50 rounded-lg p-3 text-sm whitespace-pre-wrap">
              {ticket.job_description}
            </p>
          </div>
        )}

        {resubmitting && (
          <div className="border-t border-slate-200 pt-6 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-slate-700 mb-1">Full name</p>
                <input
                  type="text"
                  value={editForm.employee_name}
                  onChange={(e) => setEditForm({ ...editForm, employee_name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 mb-1">Role</p>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 mb-1">Start date</p>
                <input
                  type="date"
                  value={editForm.start_date}
                  onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 mb-1">Hardware tier</p>
                <select
                  value={editForm.hardware_tier}
                  onChange={(e) => setEditForm({ ...editForm, hardware_tier: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setResubmitting(false)}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={resubmit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium"
              >
                Confirm Resubmit
              </button>
            </div>
          </div>
        )}

        {(currentUser?.department === "Management" || canReview || canResubmit) && !resubmitting && (
          <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
            {currentUser?.department === "Management" ? (
              <button
                onClick={() => generateTicketPdf(ticket)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium"
              >
                ↓ Download PDF
              </button>
            ) : <div />}

            {canResubmit && (
              <button
                onClick={() => setResubmitting(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
              >
                Edit & Resubmit
              </button>
            )}

            {canReview && (
              rejecting ? (
                <div className="flex-1 ml-4 space-y-3">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setRejecting(false)} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 text-sm">Cancel</button>
                    <button onClick={() => submit("Rejected")} disabled={!note || loading} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium">Confirm Reject</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setRejecting(true)} disabled={loading} className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-sm font-medium">Reject</button>
                  <button onClick={() => submit("Approved")} disabled={loading} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium">Approve</button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-500 mb-1">{label}</p>
      <p className="text-slate-900 text-sm font-medium">{value}</p>
    </div>
  );
}