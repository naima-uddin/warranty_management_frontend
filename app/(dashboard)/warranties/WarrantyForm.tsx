"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Warranty } from "@/lib/types";
import { TEMPLATE } from "@/lib/types";

type Props = { existing?: Warranty };

export default function WarrantyForm({ existing }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    existing?.imageUrl || null
  );
  const [removed, setRemoved] = useState(false); // existing image cleared?
  const fileRef = useRef<HTMLInputElement>(null);

  // Editable template lists (pre-filled from existing entry or the default template).
  const [covered, setCovered] = useState<string[]>(
    existing?.covered ?? TEMPLATE.covered
  );
  const [notCovered, setNotCovered] = useState<string[]>(
    existing?.notCovered ?? TEMPLATE.notCovered
  );
  const [claimSteps, setClaimSteps] = useState<string[]>(
    existing?.claimSteps ?? TEMPLATE.claimSteps
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Drop empty image input so we don't overwrite on edit.
      if (!(fd.get("image") as File)?.size) fd.delete("image");
      // Tell the server to clear the existing image if the user removed it.
      if (removed && !fd.has("image")) fd.set("removeImage", "true");

      // Attach the editable lists as JSON (so an emptied list is saved too).
      fd.set("covered", JSON.stringify(covered.filter((x) => x.trim())));
      fd.set("notCovered", JSON.stringify(notCovered.filter((x) => x.trim())));
      fd.set("claimSteps", JSON.stringify(claimSteps.filter((x) => x.trim())));

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

  const card =
    "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {existing ? "Edit warranty" : "New warranty"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to generate the warranty card.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      {/* Core details */}
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${card}`}>
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
          <label className={label}>Warranty end date *</label>
          <input
            type="date"
            name="warrantyEndDate"
            required
            defaultValue={existing?.warrantyEndDate?.slice(0, 10)}
            className={field}
          />
          <p className="mt-1 text-xs text-slate-400">
            The date the warranty is valid until.
          </p>
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
            ref={fileRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setRemoved(false);
              setPreview(
                file ? URL.createObjectURL(file) : existing?.imageUrl || null
              );
            }}
            className="block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
          {preview && (
            <div className="relative mt-2 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="preview"
                className="h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <button
                type="button"
                title="Remove image"
                onClick={() => {
                  setPreview(null);
                  setRemoved(true);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white shadow ring-2 ring-white transition hover:bg-red-700"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 6l12 12M18 6L6 18" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Warranty card template — editable */}
      <div className={`${card} space-y-6`}>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Warranty card content
          </h2>
          <p className="text-xs text-slate-500">
            These appear on the printed slip. Edit or remove any line — they are
            pre-filled with the standard template.
          </p>
        </div>

        <EditableList
          title="Covered under warranty"
          items={covered}
          setItems={setCovered}
          prefix="✓"
          placeholder="e.g. Manufacturing defects"
        />
        <EditableList
          title="Not covered"
          items={notCovered}
          setItems={setNotCovered}
          prefix="✕"
          placeholder="e.g. Liquid damage"
        />
        <EditableList
          title="How to claim warranty"
          items={claimSteps}
          setItems={setClaimSteps}
          ordered
          placeholder="e.g. Contact customer support…"
        />

        <div>
          <label className={label}>N.B. / Refund note</label>
          <textarea
            name="refundNote"
            rows={3}
            defaultValue={existing?.refundNote ?? TEMPLATE.refundNote}
            className={field}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Support phone</label>
            <input
              name="supportPhone"
              defaultValue={existing?.supportPhone ?? TEMPLATE.supportPhone}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Support email</label>
            <input
              name="supportEmail"
              defaultValue={existing?.supportEmail ?? TEMPLATE.supportEmail}
              className={field}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
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

/* ---------- Editable list of lines (add / edit / delete) ---------- */
function EditableList({
  title,
  items,
  setItems,
  prefix,
  ordered,
  placeholder,
}: {
  title: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  prefix?: string;
  ordered?: boolean;
  placeholder?: string;
}) {
  const update = (i: number, v: string) =>
    setItems((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setItems((prev) => [...prev, ""]);

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center text-sm text-slate-400">
              {ordered ? `${i + 1}.` : prefix}
            </span>
            <input
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              title="Remove line"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 7h12M9 7V5h6v2M8 7l1 12h6l1-12" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
      >
        + Add line
      </button>
    </div>
  );
}
