export function params(payload) {
  const searchParams = new URLSearchParams();
  Object.entries(payload).map(([k, v]) => searchParams.set(k, String(v)));
  return searchParams.toString();
}

export function getJSONStorage(name: string) {
  const store = localStorage.getItem(name);
  if (!store) return '';
  try {
    return JSON.parse(store);
  } catch (e) {
    throw new e;
  }
}

export function checkToday(): boolean {
  const today = new Date().toDateString();
  const res = today === localStorage.getItem('date');
  if (!res) localStorage.setItem('date', today);
  return res;
}
