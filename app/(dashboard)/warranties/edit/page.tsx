"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Warranty } from "@/lib/types";
import WarrantyForm from "../WarrantyForm";

function EditWarranty() {
  const id = useSearchParams().get("id");
  const [item, setItem] = useState<Warranty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Warranty>(`/warranties/${id}`)
      .then(setItem)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p className="text-slate-400">Loading…</p>;
  return <WarrantyForm existing={item} />;
}

export default function EditWarrantyPage() {
  return (
    <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
      <EditWarranty />
    </Suspense>
  );
}
