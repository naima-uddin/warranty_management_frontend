const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

type Options = { method?: string; body?: unknown; auth?: boolean };

// Thin fetch wrapper. JSON body by default; pass a FormData body for uploads.
export async function api<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: Options = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data as T;
}
