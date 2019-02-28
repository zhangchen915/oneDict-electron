export function params(payload) {
  const searchParams = new URLSearchParams();
  Object.entries(payload).map(([k, v]) => searchParams.set(k, String(v)));
  return searchParams.toString();
}
