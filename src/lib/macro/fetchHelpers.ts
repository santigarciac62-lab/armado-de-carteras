/** fetch con timeout corto: estas fuentes externas no deben trabar el dashboard. */
export async function fetchConTimeout(url: string, ms = 6000, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/** Parsea el CSV diario que devuelve stooq.com (Date,Open,High,Low,Close,Volume). */
export function parseStooqCsv(csv: string): { fecha: string; close: number }[] {
  const lineas = csv.trim().split("\n").slice(1); // descarta el header
  const filas: { fecha: string; close: number }[] = [];
  for (const linea of lineas) {
    const [fecha, , , , close] = linea.split(",");
    const c = parseFloat(close);
    if (fecha && Number.isFinite(c)) filas.push({ fecha, close: c });
  }
  return filas;
}

export function variacionPct(actual: number, previo: number): number | null {
  if (!Number.isFinite(previo) || previo === 0) return null;
  return ((actual - previo) / previo) * 100;
}
