import { Cotizacion, Instrumento, Moneda } from "@/lib/types";

/** Forma mínima que necesita este proveedor — cualquier `Instrumento` la satisface, pero
 * también permite reusarlo desde pantallas (ej. Renta Variable) que no tienen el tipo
 * `Instrumento` completo (nombre/categoria/bucket/presenteEn) para cada ticker. */
export interface TickerParaPrecio {
  ticker: string;
  claseActivo: Instrumento["claseActivo"];
  moneda: Moneda;
}

/**
 * Proveedor real de precios usando https://data912.com (API pública, gratuita,
 * pensada para uso educativo/hobby — no es tick-by-tick: cachea ~2hs detrás
 * de Cloudflare y tiene un límite informal de 120 req/min).
 *
 * IMPORTANTE — antes de habilitar en producción (env USE_DATA912=true):
 * 1. Confirmar contra una respuesta real cuáles son los nombres de campo
 *    exactos de cada endpoint (acá se asumen `symbol`/`ticker`, `c`/`px_bid`,
 *    `pct_change`/`change_pct` como alternativas más comunes, con parsing
 *    defensivo, pero no se verificaron en vivo desde este entorno).
 * 2. data912 NO tiene FCI (son fondos, no cotizan en el mercado). El valor de
 *    cuotaparte de los FCI recomendados en la Visión hay que traerlo de otra
 *    fuente (ej. scraping/API de CAFCI, o carga manual diaria) — ver
 *    `esEOD` en el tipo Cotizacion.
 */

const BASE_URL = "https://data912.com/live";

// Cada endpoint agrupa un tipo de instrumento del mercado argentino.
const ENDPOINT_POR_CLASE: Partial<Record<Instrumento["claseActivo"], string>> = {
  Bono: "arg_bonds",
  ON: "arg_corp", // obligaciones negociables ("corporate debt")
  Accion: "arg_stocks",
  Cedear: "arg_cedears",
  LetraTasaFija: "arg_notes", // letras / instrumentos de tasa fija de corto plazo
};

interface RawQuote {
  [key: string]: unknown;
}

function readNumber(raw: RawQuote, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return undefined;
}

function readSymbol(raw: RawQuote): string | undefined {
  const v = raw["symbol"] ?? raw["ticker"] ?? raw["simbolo"];
  return typeof v === "string" ? v.toUpperCase() : undefined;
}

async function fetchEndpoint(endpoint: string): Promise<RawQuote[]> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    // Cachea 2 minutos de nuestro lado; data912 ya cachea ~2hs del suyo.
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`data912 ${endpoint} respondió ${res.status}`);
  const body = await res.json();
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function getCotizacionesData912(
  instrumentos: TickerParaPrecio[]
): Promise<Map<string, Cotizacion>> {
  const resultado = new Map<string, Cotizacion>();

  const porEndpoint = new Map<string, TickerParaPrecio[]>();
  for (const inst of instrumentos) {
    const endpoint = ENDPOINT_POR_CLASE[inst.claseActivo];
    if (!endpoint) continue; // FCI: no aplica, ver docstring
    porEndpoint.set(endpoint, [...(porEndpoint.get(endpoint) ?? []), inst]);
  }

  await Promise.all(
    Array.from(porEndpoint.entries()).map(async ([endpoint, insts]) => {
      let rows: RawQuote[];
      try {
        rows = await fetchEndpoint(endpoint);
      } catch {
        return; // se resuelve con fallback (mock) en index.ts
      }
      const bySymbol = new Map<string, RawQuote>();
      for (const row of rows) {
        const symbol = readSymbol(row);
        if (symbol) bySymbol.set(symbol, row);
      }
      for (const inst of insts) {
        const row = bySymbol.get(inst.ticker.toUpperCase());
        if (!row) continue;
        const ultimo = readNumber(row, ["c", "close", "px_bid", "last", "ultimo_precio"]);
        const variacionPct = readNumber(row, ["pct_change", "change_pct", "variacion", "var"]);
        if (ultimo === undefined) continue;
        resultado.set(inst.ticker, {
          ticker: inst.ticker,
          ultimo,
          variacionPct: variacionPct ?? 0,
          moneda: inst.moneda,
          fuente: "data912",
          actualizadoEn: new Date().toISOString(),
          esEOD: false,
        });
      }
    })
  );

  return resultado;
}
