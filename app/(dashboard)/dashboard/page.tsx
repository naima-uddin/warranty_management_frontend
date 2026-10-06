"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Warranty } from "@/lib/types";

export default function WarrantiesPage() {
  const { can } = useAuth();
  const [items, setItems] = useState<Warranty[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (query = "") => {
    setLoading(true);
    try {
      setItems(await api<Warranty[]>(`/warranties?q=${encodeURIComponent(query)}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    load(q);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Warranties</h1>
        {can("warranty:create") && (
          <Link
            href="/warranties/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New warranty
          </Link>
        )}
      </div>

      <form onSubmit={search} className="mb-5 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by Order ID, customer name or phone…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Search
        </button>
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              load("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </form>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Purchase date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No warranties found.
                </td>
              </tr>
            ) : (
              items.map((w) => (
                <tr key={w._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{w.orderId}</td>
                  <td className="px-4 py-3">
                    {w.customerName}
                    {w.customerPhone && (
                      <span className="block text-xs text-slate-400">
                        {w.customerPhone}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{w.productName}</td>
                  <td className="px-4 py-3">
                    {new Date(w.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/warranties/${w._id}`}
                      className="text-slate-900 underline-offset-2 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
