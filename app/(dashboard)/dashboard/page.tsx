"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Warranty } from "@/lib/types";

type ListResponse = {
  items: Warranty[];
  total: number;
  page: number;
  pages: number;
};

type RangeKey = "all" | "today" | "7days" | "month";
type SortKey = "newest" | "oldest";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 days" },
  { key: "month", label: "Last month" },
];

export default function WarrantiesPage() {
  const { can } = useAuth();
  const [data, setData] = useState<ListResponse>({
    items: [],
    total: 0,
    page: 1,
    pages: 1,
  });
  const [q, setQ] = useState("");
  const [range, setRange] = useState<RangeKey>("all");
  const [from, setFrom] = useState(""); // custom range start (YYYY-MM-DD)
  const [to, setTo] = useState(""); // custom range end (YYYY-MM-DD)
  const [month, setMonth] = useState(""); // month picker value (YYYY-MM)
  const [sort, setSort] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(true);

  // Any field omitted from `opts` falls back to the current state.
  const load = async (
    opts: {
      query?: string;
      page?: number;
      range?: RangeKey;
      from?: string;
      to?: string;
      sort?: SortKey;
    } = {}
  ) => {
    const query = opts.query ?? q;
    const page = opts.page ?? 1;
    const rangeKey = opts.range ?? range;
    const fromV = opts.from ?? from;
    const toV = opts.to ?? to;
    const sortKey = opts.sort ?? sort;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(page));
    params.set("sort", sortKey);
    // A custom from/to range wins over the preset quick range.
    if (fromV || toV) {
      if (fromV) params.set("from", fromV);
      if (toV) params.set("to", toV);
    } else {
      params.set("range", rangeKey);
    }

    setLoading(true);
    try {
      setData(await api<ListResponse>(`/warranties?${params.toString()}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    load({ query: q, page: 1 });
  };

  // Sort order: reload from page 1 with the new order.
  const changeSort = (sortKey: SortKey) => {
    setSort(sortKey);
    load({ page: 1, sort: sortKey });
  };

  // Quick preset range: clears any custom range / month selection.
  const changeRange = (rangeKey: RangeKey) => {
    setRange(rangeKey);
    setFrom("");
    setTo("");
    setMonth("");
    load({ page: 1, range: rangeKey, from: "", to: "" });
  };

  // Custom From / To date: clears the preset range and month picker.
  const changeFrom = (v: string) => {
    setFrom(v);
    setRange("all");
    setMonth("");
    load({ page: 1, from: v, range: "all" });
  };
  const changeTo = (v: string) => {
    setTo(v);
    setRange("all");
    setMonth("");
    load({ page: 1, to: v, range: "all" });
  };

  // Month picker (YYYY-MM): filters the whole chosen month.
  const changeMonth = (ym: string) => {
    setMonth(ym);
    if (!ym) {
      changeRange("all");
      return;
    }
    const [y, m] = ym.split("-").map(Number);
    const first = `${ym}-01`;
    const lastDay = new Date(y, m, 0).getDate(); // day 0 of next month = last of this
    const last = `${ym}-${String(lastDay).padStart(2, "0")}`;
    setFrom(first);
    setTo(last);
    setRange("all");
    load({ page: 1, from: first, to: last, range: "all" });
  };

  const remove = async (w: Warranty) => {
    if (!confirm(`Delete warranty "${w.orderId}"? This cannot be undone.`))
      return;
    await api(`/warranties/${w._id}`, { method: "DELETE" });
    // Stay on the current page, or step back if it just emptied.
    const nextPage =
      data.items.length === 1 && data.page > 1 ? data.page - 1 : data.page;
    load({ page: nextPage });
  };

  const { items, page, pages, total } = data;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Warranties</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading…" : `${total} record${total === 1 ? "" : "s"}`}
          </p>
        </div>
        {can("warranty:create") && (
          <Link
            href="/warranties/new"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
          >
            + New warranty
          </Link>
        )}
      </div>

      <form
        onSubmit={search}
        className="mb-5 flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200"
      >
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
            <path d="M21 21l-4-4" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by Order ID, customer name or phone…"
            className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm outline-none"
          />
        </div>
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              load({ query: "", page: 1 });
            }}
            className="rounded-xl px-3 text-sm text-slate-500 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
        <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          Search
        </button>
      </form>

      {/* Date-range filter + sort order */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => changeRange(r.key)}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                range === r.key
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Sort
          <select
            value={sort}
            onChange={(e) => changeSort(e.target.value as SortKey)}
            className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 outline-none transition hover:bg-slate-50"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {/* Custom date range: any month, or any From–To span (by purchase date) */}
      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-200">
        <label className="flex items-center gap-2 text-slate-500">
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => changeMonth(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        <span className="hidden h-5 w-px bg-slate-200 sm:block" />

        <label className="flex items-center gap-2 text-slate-500">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => changeFrom(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>
        <label className="flex items-center gap-2 text-slate-500">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => changeTo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </label>

        {(from || to || month) && (
          <button
            type="button"
            onClick={() => changeRange("all")}
            className="ml-auto rounded-xl px-3 py-1.5 font-medium text-slate-500 hover:bg-slate-100"
          >
            Clear dates
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full min-w-160 text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Purchase date</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  <span className="mx-auto block h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 11h6M9 15h4M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">No warranties found</p>
                  <p className="text-sm text-slate-400">Try a different search, or create a new one.</p>
                </td>
              </tr>
            ) : (
              items.map((w, i) => (
                <tr
                  key={w._id}
                  className="animate-rise transition hover:bg-slate-50"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}
                >
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {w.orderId}
                  </td>
                  <td className="px-5 py-3.5">
                    {w.customerName}
                    {w.customerPhone && (
                      <span className="block text-xs text-slate-400">
                        {w.customerPhone}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{w.productName}</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {new Date(w.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/warranties/view?id=${w._id}`}
                        className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                      >
                        View
                      </Link>
                      {can("warranty:delete") && (
                        <button
                          onClick={() => remove(w)}
                          title="Delete"
                          className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => load({ page: page - 1 })}
              disabled={page <= 1}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => load({ page: page + 1 })}
              disabled={page >= pages}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
