export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('401 error, Please Log in');
    }
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}
