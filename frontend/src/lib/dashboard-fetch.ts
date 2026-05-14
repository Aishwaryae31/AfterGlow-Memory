export async function afterglowJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const opts: RequestInit = {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
  };
  let res = await fetch(path, opts);
  if (res.status === 401) {
    await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" });
    res = await fetch(path, opts);
  }
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.json() as Promise<T>;
}
