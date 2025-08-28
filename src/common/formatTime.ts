export function formatDue(due?: number | string | null) { 
  if (!due && due !== 0) return "";
  const n = typeof due === "string" ? Number(due) : due;
  if (!Number.isFinite(n)) return String(due);
  const d = new Date(n);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export function toTimestamp(local: string) { // input[type=datetime-local] → number(ms), 빈 값이면 undefined
  return local ? new Date(local).getTime() : undefined;
}

export function toLocalDatetimeInput(ms?: number | string | null) { // return ISO date format 
  if (!ms && ms !== 0) return "";
  const n = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(n)) return "";
  const d = new Date(n); // YYYY-MM-DDTHH:mm 형식
  const pad = (x: number) => String(x).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}