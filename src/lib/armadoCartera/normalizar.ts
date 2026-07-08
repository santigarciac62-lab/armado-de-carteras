import { InstrumentoRentaFija, Moneda } from "@/lib/types";
import { ActivoRV } from "@/data/rentaVariable";
import { FilaSelector } from "./tipos";

/** Junta el universo completo de Renta Fija (167 instrumentos) y Renta Variable (30
 * tickers) en una única lista para el selector combinado, ordenada por ticker. */
export function normalizarUniverso(
  rentaFija: InstrumentoRentaFija[],
  rentaVariable: ActivoRV[]
): FilaSelector[] {
  const filasRentaFija: FilaSelector[] = rentaFija.map((i) => ({
    ticker: i.ticker,
    nombre: `${i.emisor} · ${i.subcategoria}`,
    clase: "rentaFija",
    categoriaLabel: i.categoria,
    moneda: i.moneda,
    precio: i.precioClean,
    original: i,
  }));

  const filasRentaVariable: FilaSelector[] = rentaVariable.map((a) => ({
    ticker: a.ticker,
    nombre: a.nombre,
    clase: "rentaVariable",
    categoriaLabel: a.sector,
    moneda: "ARS" as Moneda,
    precio: a.precio,
    original: a,
  }));

  return [...filasRentaFija, ...filasRentaVariable].sort((a, b) => a.ticker.localeCompare(b.ticker));
}
