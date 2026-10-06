"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / animation panel */}
      <div className="animated-gradient relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 text-white">
        {/* floating blobs */}
        <div className="animate-float absolute -right-10 top-24 h-40 w-40 rounded-full bg-white/10 blur-xl" />
        <div
          className="animate-float absolute left-16 bottom-28 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="animate-float absolute right-28 bottom-16 h-24 w-24 rounded-full bg-white/10 blur-lg"
          style={{ animationDelay: "0.8s" }}
        />

        <div className="relative z-10 text-sm font-semibold tracking-wide">
          A2IT · Warranty Management
        </div>

        {/* animated shield */}
        <div className="relative z-10 flex flex-col items-center gap-8 self-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-white/40 [animation:pulse-ring_2.4s_ease-out_infinite]" />
            <span
              className="absolute inset-0 rounded-full bg-white/30 [animation:pulse-ring_2.4s_ease-out_infinite]"
              style={{ animationDelay: "0.8s" }}
            />
            <div className="relative grid h-28 w-28 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.5l7 2.8v5.2c0 4.6-3 8.3-7 9.6-4-1.3-7-5-7-9.6V5.3l7-2.8z"
                  fill="rgba(255,255,255,0.18)"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12.2l2.4 2.4 4.6-4.9"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="14"
                  strokeDashoffset="14"
                  style={{ animation: "draw-check 0.9s 0.5s ease forwards" }}
                />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Warranty, made simple.</h2>
            <p className="mt-2 max-w-xs text-sm text-white/80">
              Issue warranty cards, search by order or customer, and print in
              seconds.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} A2IT. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="animated-gradient grid h-11 w-11 place-items-center rounded-xl text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
            <span className="font-semibold">A2IT Warranty</span>
          </div>

          <div className="animate-rise">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to your account to continue.
            </p>
          </div>

          {error && (
            <p className="animate-rise mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          )}

          <div className="animate-rise anim-delay-1 mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </span>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-16 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-7 rounded-md px-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          </div>

          <button
            disabled={busy}
            className="animate-rise anim-delay-2 mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
