import { InstrumentoRentaFija, LineaRentaFija, Moneda } from "@/lib/types";
import { ActivoRV } from "@/data/rentaVariable";
import { TC_REFERENCIA } from "@/lib/constants";
import { LineaCarteraCombinada, LineaCombinadaCalculada } from "./tipos";

export function sumaPct(lineas: LineaCarteraCombinada[]): number {
  return Math.round(lineas.reduce((acc, l) => acc + l.pct, 0) * 100) / 100;
}

/** Convierte un monto de `desde` a `hasta` al tipo de cambio de referencia — mismo
 * criterio que ya usa ArmarCarteraPorMonto.tsx (simulador standalone de Renta Fija). */
function convertirMoneda(monto: number, desde: Moneda, hasta: Moneda): number {
  if (desde === hasta) return monto;
  return desde === "ARS" ? monto / TC_REFERENCIA : monto * TC_REFERENCIA;
}

/** Resuelve cada línea contra su instrumento de origen y calcula monto/nominal
 * aproximado. Para Renta Fija, el nominal se aproxima a partir del precio (expresado
 * como % de la par, ej. 65 = 65%): nominal ≈ monto / (precio/100). Para Renta Variable,
 * nominal ≈ monto / precio por unidad. Es una aproximación para dimensionar la cartera
 * y el calendario — no un cálculo de ejecución real (mismo criterio de simplificación
 * que ya usa el simulador de Renta Fija).
 *
 * El monto de cada línea siempre llega en `monedaMonto` (la moneda que el asesor eligió
 * para el monto a invertir), pero el precio de cada instrumento está cotizado en SU
 * propia moneda (ej. bonos soberanos USD, CEDEARs en ARS) — antes de calcular el nominal
 * hay que convertir el monto a esa moneda, si no el nominal (y por lo tanto el calendario
 * de pagos) queda inflado o achicado por el tipo de cambio. */
export function calcularLineasCombinadas(
  lineas: LineaCarteraCombinada[],
  montoTotal: number,
  monedaMonto: Moneda,
  rentaFijaPorTicker: Map<string, InstrumentoRentaFija>,
  rentaVariablePorTicker: Map<string, ActivoRV>
): LineaCombinadaCalculada[] {
  return lineas.map((linea) => {
    const monto = (montoTotal * linea.pct) / 100;

    if (linea.clase === "rentaFija") {
      const inst = rentaFijaPorTicker.get(linea.ticker);
      const monedaInstrumento: Moneda = inst?.moneda ?? "ARS";
      const montoEnMonedaInstrumento = convertirMoneda(monto, monedaMonto, monedaInstrumento);
      // Mismo criterio que ArmarCarteraPorMonto.tsx (Renta Fija): preferir precioDirty
      // (algunas subcategorías como Lecap/Boncap solo traen dirty, sin clean).
      const precio = inst?.precioDirty ?? inst?.precioClean ?? null;
      const nominalAprox = precio && precio > 0 ? (montoEnMonedaInstrumento / precio) * 100 : null;
      return {
        ...linea,
        nombre: inst ? `${inst.emisor} · ${inst.subcategoria}` : linea.ticker,
        categoriaLabel: inst?.categoria ?? "—",
        moneda: monedaInstrumento,
        precio,
        monto,
        nominalAprox,
        instrumentoRentaFija: inst,
      };
    }

    const activo = rentaVariablePorTicker.get(linea.ticker);
    // Los CEDEARs/acciones de este universo siempre cotizan en ARS.
    const montoEnArs = convertirMoneda(monto, monedaMonto, "ARS");
    const nominalAprox = activo && activo.precio > 0 ? montoEnArs / activo.precio : null;
    return {
      ...linea,
      nombre: activo?.nombre ?? linea.ticker,
      categoriaLabel: activo?.sector ?? "—",
      moneda: "ARS",
      precio: activo?.precio ?? null,
      monto,
      nominalAprox,
      activoRentaVariable: activo,
    };
  });
}

/** Las líneas de Renta Fija de la cartera, en el formato que espera el motor de
 * calendario ya existente (`consolidarCalendario`/`agruparPorMes` en lib/rentaFija.ts). */
export function lineasRentaFijaComoNominal(calculadas: LineaCombinadaCalculada[]): LineaRentaFija[] {
  return calculadas
    .filter((l): l is LineaCombinadaCalculada & { nominalAprox: number } => l.clase === "rentaFija" && !!l.nominalAprox && l.nominalAprox > 0)
    .map((l) => ({ ticker: l.ticker, nominal: Math.round(l.nominalAprox) }));
}
