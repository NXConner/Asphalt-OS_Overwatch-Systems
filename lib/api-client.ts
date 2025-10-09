export async function apiPost<TReq extends object, TRes = any>(url: string, body: TReq, init?: RequestInit): Promise<TRes> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    body: JSON.stringify(body),
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    let detail: any = undefined;
    try { detail = await res.json(); } catch {}
    throw new Error(detail?.error || `Request failed: ${res.status}`);
  }
  return (await res.json()) as TRes;
}
