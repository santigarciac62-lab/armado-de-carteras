import { Cotizacion, Instrumento } from "@/lib/types";
import { UNIVERSO_INSTRUMENTOS } from "@/data/instrumentos";
import { getCotizacionMock } from "./mockProvider";
import { getCotizacionesData912 } from "./data912Provider";

const USE_DATA912 = process.env.USE_DATA912 === "true";

/**
 * Punto único de acceso a precios. Intenta el proveedor real (Data912) si
 * está habilitado por env; para lo que no resuelva (falla de red, FCI que
 * data912 no cubre, ticker no encontrado) completa con el proveedor mock,
 * para que la pantalla nunca se quede sin datos que mostrar.
 */
export async function getCotizaciones(
  instrumentos: Instrumento[] = UNIVERSO_INSTRUMENTOS
): Promise<Record<string, Cotizacion>> {
  const resultado: Record<string, Cotizacion> = {};

  let reales = new Map<string, Cotizacion>();
  if (USE_DATA912) {
    try {
      reales = await getCotizacionesData912(instrumentos);
    } catch {
      reales = new Map();
    }
  }

  for (const inst of instrumentos) {
    resultado[inst.ticker] = reales.get(inst.ticker) ?? getCotizacionMock(inst);
  }

  return resultado;
}

export const PRICE_PROVIDER_ACTIVO = USE_DATA912 ? "data912" : "mock";
