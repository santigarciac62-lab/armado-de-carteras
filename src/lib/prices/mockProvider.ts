import { Cotizacion, Instrumento } from "@/lib/types";

/**
 * Proveedor de precios "demo": no depende de red y siempre responde.
 * Genera un precio base determinístico por ticker (hash simple) y lo hace
 * fluctuar con una caminata aleatoria acotada, ligada a la ventana de tiempo
 * actual, para simular variación intradiaria sin persistir estado.
 *
 * Se usa como fallback automático si el proveedor real (Data912) no está
 * configurado o falla — ver src/lib/prices/index.ts.
 */

function hashSeed(ticker: string): number {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) {
    h = (h * 31 + ticker.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Precio base "razonable" por clase de activo, para que los montos se vean creíbles.
const PRECIO_BASE_POR_CLASE: Record<Instrumento["claseActivo"], number> = {
  FCI: 1500, // valor de cuotaparte típico
  Bono: 65, // % de la par, bono en dólares
  ON: 92,
  Accion: 4200,
  Cedear: 3100,
  LetraTasaFija: 88,
};

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getCotizacionMock(instrumento: Instrumento): Cotizacion {
  const seed = hashSeed(instrumento.ticker);
  const rand = mulberry32(seed);
  const base = PRECIO_BASE_POR_CLASE[instrumento.claseActivo] * (0.85 + rand() * 0.3);

  const esEOD = instrumento.claseActivo === "FCI";
  // Ventana temporal: cambia cada 60s (activos líquidos) o cada día hábil (FCI).
  const ventana = esEOD
    ? Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    : Math.floor(Date.now() / (1000 * 60));
  const randMovimiento = mulberry32(seed ^ ventana);

  const amplitud = esEOD ? 0.15 : 2.5; // % de variación máxima simulada
  const variacionPct = (randMovimiento() - 0.5) * 2 * amplitud;
  const ultimo = base * (1 + variacionPct / 100);

  return {
    ticker: instrumento.ticker,
    ultimo: Math.round(ultimo * 100) / 100,
    variacionPct: Math.round(variacionPct * 100) / 100,
    moneda: instrumento.moneda,
    fuente: "mock",
    actualizadoEn: new Date().toISOString(),
    esEOD,
  };
}
