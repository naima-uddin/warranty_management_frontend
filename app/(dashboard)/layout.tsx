"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const ICONS: Record<string, React.ReactNode> = {
  list: (
    <path d="M4 6h16M4 12h16M4 18h10" strokeWidth="1.8" strokeLinecap="round" />
  ),
  plus: (
    <path d="M12 5v14M5 12h14" strokeWidth="1.8" strokeLinecap="round" />
  ),
  users: (
    <path
      d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4M12 11a3 3 0 100-6 3 3 0 000 6z"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

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
      <div className="flex min-h-screen items-center justify-center gap-3 text-slate-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
        Loading…
      </div>
    );

  const links = [
    { href: "/dashboard", label: "Warranties", icon: "list" },
    { href: "/warranties/new", label: "New warranty", icon: "plus" },
    ...(user.role === "admin"
      ? [{ href: "/users", label: "Moderators", icon: "users" }]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="no-print sticky top-0 flex h-screen w-60 flex-col border-r border-slate-200 bg-white px-4 py-5">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="animated-gradient grid h-10 w-10 place-items-center rounded-xl text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5l7 2.8v5.2c0 4.6-3 8.3-7 9.6-4-1.3-7-5-7-9.6V5.3l7-2.8z"
                fill="rgba(255,255,255,0.2)"
                stroke="white"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 12.2l2.4 2.4 4.6-4.9"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">A2IT Warranty</p>
            <p className="text-xs capitalize text-slate-400">{user.role}</p>
          </div>
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
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  {ICONS[l.icon]}
                </svg>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-2.5 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
