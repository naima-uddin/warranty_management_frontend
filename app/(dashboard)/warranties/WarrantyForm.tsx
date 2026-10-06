"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Warranty } from "@/lib/types";

const DEFAULT_WARRANTY =
  "7 calendar days from the delivery date.";

type Props = { existing?: Warranty };

export default function WarrantyForm({ existing }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    existing?.imageUrl || null
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Drop empty image input so we don't overwrite on edit.
      if (!(fd.get("image") as File)?.size) fd.delete("image");

      const saved = existing
        ? await api<Warranty>(`/warranties/${existing._id}`, {
            method: "PUT",
            body: fd,
          })
        : await api<Warranty>("/warranties", { method: "POST", body: fd });

      router.push(`/warranties/${saved._id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const label = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {existing ? "Edit warranty" : "New warranty"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to generate the warranty card.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2">
        <div>
          <label className={label}>Order ID *</label>
          <input
            name="orderId"
            required
            defaultValue={existing?.orderId}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Purchase date *</label>
          <input
            type="date"
            name="purchaseDate"
            required
            defaultValue={existing?.purchaseDate?.slice(0, 10)}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Customer name *</label>
          <input
            name="customerName"
            required
            defaultValue={existing?.customerName}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Customer phone</label>
          <input
            name="customerPhone"
            defaultValue={existing?.customerPhone}
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Customer email</label>
          <input
            type="email"
            name="customerEmail"
            defaultValue={existing?.customerEmail}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Product name *</label>
          <input
            name="productName"
            required
            defaultValue={existing?.productName}
            className={field}
          />
        </div>
        <div>
          <label className={label}>Quantity *</label>
          <input
            type="number"
            name="quantity"
            min={1}
            required
            defaultValue={existing?.quantity ?? 1}
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Warranty period *</label>
          <input
            name="warrantyPeriod"
            required
            defaultValue={existing?.warrantyPeriod || DEFAULT_WARRANTY}
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Note</label>
          <textarea
            name="note"
            rows={2}
            defaultValue={existing?.note}
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Product image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : existing?.imageUrl || null);
            }}
            className="text-sm"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200"
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {busy && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {busy ? "Saving…" : existing ? "Save changes" : "Create warranty"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
