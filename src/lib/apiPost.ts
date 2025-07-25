export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('401 error, Please Log in');
    }
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}
