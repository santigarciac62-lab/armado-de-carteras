export function fmtPct(v: number | null, decimales = 2): string {
  if (v === null) return "—";
  return `${(v * 100).toFixed(decimales)}%`;
}

export function fmtNum(v: number | null, decimales = 2): string {
  if (v === null) return "—";
  return v.toLocaleString("es-AR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

export function fmtFecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function diasEntre(desde: string, hasta: string): number {
  const a = new Date(desde + "T00:00:00Z").getTime();
  const b = new Date(hasta + "T00:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
