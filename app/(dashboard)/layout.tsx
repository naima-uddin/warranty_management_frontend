"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user)
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );

  const links = [
    { href: "/dashboard", label: "Warranties" },
    { href: "/warranties/new", label: "New warranty" },
    ...(user.role === "admin"
      ? [{ href: "/users", label: "Moderators" }]
      : []),
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="no-print flex w-56 flex-col border-r border-slate-200 bg-white p-4">
        <div className="mb-6 px-2">
          <p className="font-semibold">A2IT Warranty</p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 pt-3">
          <p className="truncate px-3 text-xs text-slate-500">{user.email}</p>
          <button
            onClick={logout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
