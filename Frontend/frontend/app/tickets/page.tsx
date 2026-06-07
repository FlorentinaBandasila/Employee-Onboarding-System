"use client";

import { useEffect, useState } from "react";
import TicketsTable, { Ticket } from "@/components/ui/TicketsTable";

const FILTERS = ["All", "Needs my action", "In progress", "Needs rework", "Completed"];

const ACTION_STATUS: Record<string, string> = {
  HR: "Needs Rework",
  Manager: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState<{ department: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/onboarding/Tickets")
      .then((r) => r.json())
      .then(setTickets)
      .catch(() => {});

    const stored = localStorage.getItem("currentUser");
    if (stored) setCurrentUser(JSON.parse(stored));

    const handler = () => {
      const stored = localStorage.getItem("currentUser");
      if (stored) setCurrentUser(JSON.parse(stored));
    };
    window.addEventListener("userChanged", handler);
    return () => window.removeEventListener("userChanged", handler);
  }, []);

  const filtered = tickets.filter((t) => {
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

      <div className="flex gap-2 mb-6">
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

      <TicketsTable tickets={filtered} />
    </div>
  );
}