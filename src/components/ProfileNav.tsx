"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileNav({ isStaff }: { isStaff: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Profile Details", href: "/profile", icon: "👤" },
    { label: "My Orders", href: "/orders", icon: "📦" },
    { label: "Report Issue", href: "/orders/report", icon: "🚩" },
    { label: "Recent Invoices", href: "/profile/invoices", icon: "📄" },
    { label: "Appearance", href: "/profile/appearance", icon: "🎨" },
    { label: "Messages", href: "/profile/support", icon: "💬" },
  ];

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] ${
              isActive
                ? "bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      {isStaff && (
        <>
          <div className="my-2 border-t border-slate-100 dark:border-slate-800" />
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-amber-600 hover:bg-amber-500/10 transition-all active:scale-[0.98] border border-transparent hover:border-amber-500/20"
          >
            <span className="text-base">⚙️</span>
            Admin Panel
          </Link>
        </>
      )}
    </nav>
  );
}
