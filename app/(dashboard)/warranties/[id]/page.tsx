"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Warranty } from "@/lib/types";
import Slip from "./Slip";

export default function WarrantyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { can } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Warranty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
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
    <div className="mx-auto max-w-[640px]">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:underline">
          ← Back
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Print slip
          </button>
          {can("warranty:edit") && (
            <Link
              href={`/warranties/${id}/edit`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Edit
            </Link>
          )}
          {can("warranty:delete") && (
            <button
              onClick={remove}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <Slip w={item} />
    </div>
  );
}
