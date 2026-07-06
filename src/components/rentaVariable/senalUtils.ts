import { Señal } from "@/lib/rentaVariable/scoring";

export const SEÑAL_PILL: Record<Señal, string> = {
  "COMPRA FUERTE": "pill-green",
  COMPRA: "pill-green",
  MANTENER: "pill-amber",
  REDUCIR: "pill-red",
  VENTA: "pill-red",
};

export function colorDeScore(score: number): string {
  if (score >= 7.5) return "var(--green)";
  if (score >= 6.2) return "#4d9c2e";
  if (score >= 4.5) return "var(--amber)";
  if (score >= 3.2) return "#c2660a";
  return "var(--red)";
}
