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
