/* Kleiner localStorage-Wrapper – Fortschritt bleibt auf dem Handy gespeichert. */
const PREFIX = 'banu:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* voll/privat */ }
}
export function remove(key) {
  try { localStorage.removeItem(PREFIX + key); } catch { /* egal */ }
}

/* Lernstatistik je Eintrag: { r: richtig, w: falsch, last: 0/1 } */
export function recordResult(bucket, id, ok) {
  const all = load(bucket, {});
  const e = all[id] || { r: 0, w: 0, last: 0 };
  ok ? e.r++ : e.w++;
  e.last = ok ? 1 : 0;
  all[id] = e;
  save(bucket, all);
}
export function stats(bucket) { return load(bucket, {}); }
/* Gewicht für die Auswahl: unbekannte und falsch beantwortete zuerst */
export function weight(entry) {
  if (!entry) return 3;
  const n = entry.r + entry.w;
  const err = entry.w / n;
  return 1 + err * 4 + (entry.last ? 0 : 2);
}
