"use client";

import { useUser } from "@/lib/user-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateTicketModal from "@/components/ui/CreateTicketModal";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "All Tickets", href: "/tickets" },
];

export default function Sidebar() {
  const { currentUser, setCurrentUser, users } = useUser();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <aside className="w-60 min-h-screen bg-[#0f1117] px-4 py-8 flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-white font-bold text-lg">OnboardSync</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors
                ${pathname === href
                  ? "bg-[#1c2030] text-white font-semibold"
                  : "text-slate-400 hover:bg-[#1c2030] hover:text-white"
                }`}
            >
              {label}
            </Link>
          ))}
          <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-[#1c2030] hover:text-white transition-colors"
        >
          New Ticket
        </button>

        {createOpen && (
          <CreateTicketModal
            onClose={() => setCreateOpen(false)}
            onCreated={() => window.location.reload()}
          />
        )}
        </nav>
      </div>

      {/* User switcher */}
      <div className="relative">
        {dropdownOpen && (
          <div className="absolute bottom-16 left-0 w-full bg-[#1c2030] rounded-lg overflow-hidden shadow-lg">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#2a3150] hover:text-white transition-colors"
              >
                <div className="font-medium">{user.full_name}</div>
                <div className="text-xs text-slate-500">{user.role}</div>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#1c2030] transition-colors"
        >
          <div className="text-sm text-white font-medium">{currentUser?.full_name ?? "Loading..."}</div>
          <div className="text-xs text-slate-500 mt-0.5">Switch user</div>
        </button>
      </div>
    </aside>
  );
}