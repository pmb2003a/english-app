"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules";

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 md:flex-col">
      {MODULES.map((m) => {
        const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            className={`rounded px-3 py-2 text-sm ${
              active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
