"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Warranty } from "@/lib/types";
import Slip from "./Slip";

function WarrantyDetail() {
  const id = useSearchParams().get("id");
  const { can } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Warranty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Warranty>(`/warranties/${id}`)
      .then(setItem)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  const remove = async () => {
    if (!confirm("Delete this warranty permanently?")) return;
    await api(`/warranties/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="mx-auto max-w-160">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ← Back
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 9V3h12v6M6 18H4v-6a2 2 0 012-2h12a2 2 0 012 2v6h-2M8 14h8v7H8z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Print slip
          </button>
          {can("warranty:edit") && (
            <Link
              href={`/warranties/edit?id=${id}`}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-100"
            >
              Edit
            </Link>
          )}
          {can("warranty:delete") && (
            <button
              onClick={remove}
              className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Slip w={item} />
      </div>
    </div>
  );
}

export default function WarrantyDetailPage() {
  return (
    <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
      <WarrantyDetail />
    </Suspense>
  );
}
