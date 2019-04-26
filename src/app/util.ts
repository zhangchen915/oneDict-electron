export function params(payload) {
  const searchParams = new URLSearchParams();
  Object.entries(payload).map(([k, v]) => searchParams.set(k, String(v)));
  return searchParams.toString();
}

export function getDaily() {
  try {
    return JSON.parse(localStorage.getItem('daily'));
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
