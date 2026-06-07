"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "All Tickets", href: "/tickets" },
  { label: "New Ticket", href: "/tickets/new" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[#0f1117] px-4 py-8 flex flex-col gap-8">
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
      </nav>
    </aside>
  );
}