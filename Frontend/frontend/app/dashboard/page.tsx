"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/user-context";
import TicketsTable from "@/components/ui/TicketsTable";

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
  notes: string;
  job_description: string;
}

const ACTION_STATUS: Record<string, string> = {
  HR: "Needs Rework",
  Management: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export default function DashboardPage() {
  const { currentUser } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/onboarding/Tickets")
      .then((r) => r.json())
      .then(setTickets)
      .catch(() => {});
  }, []);

  const active = tickets.filter(
    (t) => t.status !== "Completed" && t.status !== "Needs Rework"
  ).length;

  const needsAction = currentUser
    ? tickets.filter((t) => t.status === ACTION_STATUS[currentUser.department]).length
    : 0;

  const needsRework = tickets.filter((t) => t.status === "Needs Rework").length;
  const completed = tickets.filter((t) => t.status === "Completed").length;

  const cards = [
    { label: "Active onboardings", value: active, sub: "Currently in progress" },
    { label: "Needs your action", value: needsAction, sub: `As ${currentUser?.department ?? "..."}` },
    { label: "Needs rework", value: needsRework, sub: "Returned to HR" },
    { label: "Completed", value: completed, sub: "Ready for day one" },
  ];

  const myTickets = currentUser
    ? tickets.filter((t) => t.status === ACTION_STATUS[currentUser.department])
    : [];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-4 pt-4">
        {cards.map(({ label, value, sub }) => (
          <div key={label} className="bg-blue-50 rounded-xl p-4">
  <p className="text-slate-600 text-sm mb-1">{label}</p>
  <p className="text-slate-900 text-3xl font-bold mb-1">{value}</p>
  <p className="text-slate-500 text-xs">{sub}</p>
</div>
        ))}
      </div>
      <TicketsTable tickets={myTickets} />
    </div>
  );
}