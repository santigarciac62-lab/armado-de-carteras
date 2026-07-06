/** Metodología de scoring simplificada (0-10) para Renta Variable — pondera señales técnicas y
 * fundamentales en un puntaje compuesto. Es una heurística de referencia para ordenar el
 * universo, no un modelo validado por la mesa; los pesos son un punto de partida razonable y
 * están pensados para revisarse/ajustarse con el equipo antes de usarse como única fuente de
 * una recomendación de inversión. */

export interface EntradaTecnica {
  precio: number;
  ma50: number;
  ma200: number;
  variacionDia: number; // %
  pct52: number; // 0-1, posición dentro del rango de 52 semanas
}

export function scoreTecnico(e: EntradaTecnica): number {
  let s = 5;
  if (e.precio > e.ma200) s += 1.5;
  if (e.precio > e.ma50) s += 1;
  if (e.ma50 > e.ma200) s += 0.8;
  if (e.variacionDia > 1) s += 0.5;
  if (e.variacionDia > 3) s += 0.5;
  if (e.pct52 > 0.6 && e.pct52 < 0.9) s += 0.7;
  if (e.variacionDia < -3) s -= 1.5;
  if (e.precio < e.ma200) s -= 1;
  return Math.round(Math.min(Math.max(s, 0), 10) * 10) / 10;
}

export interface EntradaFundamental {
  pe: number | null;
  roe: number | null;
  margenNeto: number | null;
  crecimientoRevenue: number | null;
  crecimientoEps: number | null;
  evEbitda: number | null;
  benchmarkPE: number;
}

export function scoreFundamental(e: EntradaFundamental): number {
  let s = 5;
  const { pe, roe, margenNeto: mn, crecimientoRevenue: rg, evEbitda: ev, benchmarkPE } = e;
  if (pe && pe > 0 && pe < benchmarkPE * 0.8) s += 1.2;
  else if (pe && pe > 0 && pe < benchmarkPE * 1.1) s += 0.5;
  if (roe && roe > 0.15) s += 1;
  if (roe && roe > 0.25) s += 0.5;
  if (mn && mn > 0.15) s += 0.8;
  if (mn && mn > 0.25) s += 0.5;
  if (rg && rg > 0.1) s += 0.7;
  if (rg && rg > 0.25) s += 0.5;
  if (e.crecimientoEps && e.crecimientoEps > 0.1) s += 0.5;
  if (ev && ev > 0 && ev < benchmarkPE * 0.6) s += 0.8;
  if (pe && pe < 0) s -= 1.5;
  return Math.round(Math.min(Math.max(s, 0), 10) * 10) / 10;
}

export type Señal = "COMPRA FUERTE" | "COMPRA" | "MANTENER" | "REDUCIR" | "VENTA";

export function señalDeScore(score: number): Señal {
  if (score >= 7.5) return "COMPRA FUERTE";
  if (score >= 6.2) return "COMPRA";
  if (score >= 4.5) return "MANTENER";
  if (score >= 3.2) return "REDUCIR";
  return "VENTA";
}
