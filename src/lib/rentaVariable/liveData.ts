import { getCotizacionesData912 } from "@/lib/prices/data912Provider";
import { Moneda } from "@/lib/types";

const USE_DATA912 = process.env.USE_DATA912 === "true";

export interface TickerRV {
  ticker: string;
  /** Se pide siempre como "Cedear" salvo los locales (arg_stocks); si data912 no tiene
   * el ticker en ese endpoint (ETFs de EE.UU., algunos nombres poco frecuentes), se
   * resuelve con el precio/variación semilla — ver ActivoRV.fuentePrecio en la UI. */
  claseActivo: "Accion" | "Cedear";
  moneda: Moneda;
}

export interface CotizacionRV {
  precio: number;
  variacionDia: number;
}

/** Intenta Data912 en vivo para el universo de Renta Variable (mismo criterio que
 * USE_DATA912 en Armado de carteras). Lo que no resuelva queda para el llamador, que
 * completa con el precio/variación semilla — nunca se rompe por un ticker faltante. */
export async function obtenerCotizacionesEnVivo(tickers: TickerRV[]): Promise<Map<string, CotizacionRV>> {
  if (!USE_DATA912) return new Map();
  try {
    const cotizaciones = await getCotizacionesData912(tickers);
    const salida = new Map<string, CotizacionRV>();
    for (const [ticker, c] of cotizaciones) {
      salida.set(ticker, { precio: c.ultimo, variacionDia: c.variacionPct });
    }
    return salida;
  } catch {
    return new Map();
  }
}

export const RV_PROVIDER_ACTIVO: "data912" | "demo" = USE_DATA912 ? "data912" : "demo";
