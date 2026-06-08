"use client";

import { useEffect, useState } from "react";
import TicketsTable, { Ticket } from "@/components/ui/TicketsTable";
import { useUser } from "@/lib/user-context";

const FILTERS = ["All", "Needs my action", "In progress", "Needs rework", "Completed"];

const ACTION_STATUS: Record<string, string> = {
  HR: "Needs Rework",
  Management: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export default function TicketsPage() {
  const { currentUser } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchTickets = () => {
    fetch("http://localhost:8000/onboarding/Tickets")
      .then((r) => r.json())
      .then(setTickets)
      .catch(() => {});
  };

  useEffect(() => { fetchTickets(); }, []);

  const filtered = tickets.filter((t) => {
    if (search && !t.employee_name.toLowerCase().includes(search.toLowerCase())) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Needs my action")
      return currentUser ? t.status === ACTION_STATUS[currentUser.department] : false;
    if (activeFilter === "In progress")
      return t.status !== "Completed" && t.status !== "Needs Rework";
    if (activeFilter === "Needs rework") return t.status === "Needs Rework";
    if (activeFilter === "Completed") return t.status === "Completed";
    return true;
  });

  const counts: Record<string, number> = {
    All: tickets.length,
    "Needs my action": currentUser
      ? tickets.filter((t) => t.status === ACTION_STATUS[currentUser.department]).length
      : 0,
    "In progress": tickets.filter((t) => t.status !== "Completed" && t.status !== "Needs Rework").length,
    "Needs rework": tickets.filter((t) => t.status === "Needs Rework").length,
    Completed: tickets.filter((t) => t.status === "Completed").length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-6">All Tickets</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors border
                ${activeFilter === f
                  ? "text-black border-slate-700 hover:border-slate-500 hover:text-black"
                  : "bg-transparent text-black border-white font-medium"
                }`}
            >
              {f} <span className="ml-1 opacity-60">{counts[f]}</span>
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search employee..."
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <TicketsTable tickets={filtered} onRefresh={fetchTickets} />
    </div>
  );
}