"use client";
import { useState } from "react";
import ReviewModal from "./ReviewModal";

export interface Ticket {
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

interface Props {
  tickets: Ticket[];
  onRefresh?: () => void;
}

const AVATAR_COLORS = [
  "bg-purple-200", "bg-blue-100", "bg-green-100",
  "bg-red-100", "bg-yellow-100", "bg-pink-100",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { formatted, diffDays };
}

function ProgressBar({ ticket }: { ticket: Ticket }) {
  const steps = [
    { label: "Manager", done: ticket.manager_status === "Approved" },
    { label: "Finance", done: ticket.finance_status === "Approved" },
    { label: "IT", done: ticket.it_status === "Approved" },
  ];

  return (
    <div className="flex gap-1 items-center">
      {steps.map(({ label, done }) => (
        <div
          key={label}
          title={`${label}: ${done ? "Approved" : "Waiting"}`}
          className={`h-1.5 w-8 rounded-full ${done ? "bg-blue-500" : "bg-slate-600"}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Waiting Manager": "bg-blue-500 border-blue-500/20",
    "Waiting Finance": "bg-yellow-500 border-yellow-500/20",
    "Waiting IT": "bg-purple-500 border-purple-500/20",
    "Needs Rework": "bg-red-500 border-red-500/20",
    "Completed": "bg-green-600 border-green-500/20",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full border ${map[status] ?? "bg-slate-500/10 text-black"}`}>
       {status}
    </span>
  );
}

export default function TicketsTable({ tickets, onRefresh }: Props) {
  const [selected, setSelected] = useState<Ticket | null>(null);

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-slate-500 max-w-[1300px] overflow-y-scroll h-129">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-20" />
            <col className="w-64" />
            <col className="w-40" />
            <col className="w-32" />
            <col className="w-32" />
            <col className="w-40" />
            <col className="w-28" />
          </colgroup>
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-black text-xs uppercase border-b border-slate-800">
              <th className="text-left px-6 py-3">Ticket</th>
              <th className="text-left px-6 py-3">Employee</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Hardware</th>
              <th className="text-left px-6 py-3">Start Date</th>
              <th className="text-left px-6 py-3">Progress</th>
              <th className="text-left px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const { formatted, diffDays } = formatDate(ticket.start_date);
              return (
                <tr key={ticket.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-black">#{ticket.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-black text-xs font-bold ${getAvatarColor(ticket.employee_name)}`}>
                        {getInitials(ticket.employee_name)}
                      </div>
                      <div>
                        <div className="text-black font-medium">{ticket.employee_name}</div>
                        <div className="text-black text-xs">{ticket.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4">
                    <span className="text-black border border-slate-700 px-3 py-1 rounded-full text-xs">
                      {ticket.hardware_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-black">{formatted}</div>
                    <div className="text-black text-xs">
                      {diffDays > 0 ? `in ${diffDays}d` : diffDays === 0 ? "today" : `${Math.abs(diffDays)}d ago`}
                    </div>
                  </td>
                  <td className="px-6 py-4"><ProgressBar ticket={ticket} /></td>
                  <td className="px-6 py-4">
                    <button
                        onClick={() => setSelected(ticket)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors w-20 text-center"
                    >
                        {ticket.status === "Completed" ? "View" : "Review"}
                    </button>
                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <ReviewModal
          ticket={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => onRefresh?.()}
        />
      )}
    </>
  );
}