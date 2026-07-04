import raw from "./raw/rentaFija.json";
import { InstrumentoRentaFija } from "@/lib/types";

/**
 * Universo de renta fija (soberanos ARS, soberanos USD, corporativos energía),
 * cargado a mano a partir de una planilla de mesa con fecha de operación
 * 03/07/2026. Se actualiza reemplazando este JSON — no hay fuente en vivo
 * conectada todavía (ver README para el mismo caveat que con Data912/FCI).
 *
 * Importante: los "vencimiento" de Globales/Bonares/BCRA no venían en la
 * planilla original (esas filas solo traían plazo vía duración modificada) —
 * se completaron con las fechas de pago públicas conocidas de la
 * reestructuración 2020 y de los BOPREAL, PERO conviene verificarlas contra
 * el prospecto antes de confiar en el simulador de calendario de pagos para
 * decisiones reales con clientes.
 */
export const INSTRUMENTOS_RENTA_FIJA: InstrumentoRentaFija[] = raw as InstrumentoRentaFija[];

export const FECHA_SEED_RENTA_FIJA = "2026-07-03";

export function getInstrumentoRentaFija(ticker: string) {
  return INSTRUMENTOS_RENTA_FIJA.find((i) => i.ticker === ticker);
}

export const EMISORES_RENTA_FIJA = Array.from(
  new Set(INSTRUMENTOS_RENTA_FIJA.map((i) => i.emisor))
).sort();

export const SUBCATEGORIAS_RENTA_FIJA = Array.from(
  new Set(INSTRUMENTOS_RENTA_FIJA.map((i) => i.subcategoria))
).sort();
