"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Warranty } from "@/lib/types";
import WarrantyForm from "../../WarrantyForm";

export default function EditWarrantyPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Warranty | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Warranty>(`/warranties/${id}`)
      .then(setItem)
      .catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!item) return <p className="text-slate-400">Loading…</p>;
  return <WarrantyForm existing={item} />;
}
