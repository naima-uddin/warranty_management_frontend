"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/types";

type Moderator = {
  _id: string;
  name: string;
  email: string;
  permissions: string[];
  active: boolean;
};

export default function UsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<Moderator[]>([]);
  const [editing, setEditing] = useState<Moderator | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // Admin-only guard.
  useEffect(() => {
    if (!loading && user?.role !== "admin") router.replace("/dashboard");
  }, [user, loading, router]);

  const load = () =>
    api<{ users: Moderator[] }>("/users").then((d) => setList(d.users));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this moderator?")) return;
    await api(`/users/${id}`, { method: "DELETE" });
    load();
  };

  const toggleActive = async (m: Moderator) => {
    await api(`/users/${m._id}`, { method: "PUT", body: { active: !m.active } });
    load();
  };

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const permissions = PERMISSIONS.map((p) => p.key).filter((k) => fd.get(k));
    const body: Record<string, unknown> = {
      name: fd.get("name"),
      permissions,
    };
    try {
      if (editing) {
        if (fd.get("password")) body.password = fd.get("password");
        await api(`/users/${editing._id}`, { method: "PUT", body });
      } else {
        body.email = fd.get("email");
        body.password = fd.get("password");
        await api("/users", { method: "POST", body });
      }
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const openNew = () => {
    setEditing(null);
    setError("");
    setShowForm(true);
  };
  const openEdit = (m: Moderator) => {
    setEditing(m);
    setError("");
    setShowForm(true);
  };

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Moderators</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create moderators and control what they can do.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"
        >
          + Add moderator
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full min-w-160 text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Permissions</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No moderators yet.
                </td>
              </tr>
            ) : (
              list.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {m.permissions.length === 0 && (
                        <span className="text-xs text-slate-400">none</span>
                      )}
                      {m.permissions.map((p) => (
                        <span
                          key={p}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                        >
                          {p.replace("warranty:", "")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleActive(m)}
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        m.active
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {m.active ? "active" : "disabled"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openEdit(m)}
                      className="mr-3 text-slate-900 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(m._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <form
            onSubmit={save}
            className="animate-rise w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
          >
            <h2 className="text-lg font-semibold">
              {editing ? "Edit moderator" : "New moderator"}
            </h2>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <input
              name="name"
              placeholder="Name"
              required
              defaultValue={editing?.name}
              className={field}
            />
            {!editing && (
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className={field}
              />
            )}
            <input
              name="password"
              type="password"
              placeholder={editing ? "New password (optional)" : "Password"}
              required={!editing}
              className={field}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Permissions</p>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map((p) => (
                  <label key={p.key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name={p.key}
                      defaultChecked={editing?.permissions.includes(p.key)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
