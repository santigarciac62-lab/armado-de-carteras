import { fetchConTimeout } from "@/lib/macro/fetchHelpers";
import { CotizacionRV } from "./liveData";

/**
 * Proveedor complementario para Renta Variable usando Twelve Data (plan gratuito:
 * 8 credits/min, 800 requests/día — el endpoint `/quote` cobra 1 credit por símbolo
 * pedido en el batch). Se usa SOLO para lo que Data912 no resolvió (típicamente ETFs
 * de EE.UU. y algún nombre poco frecuente) — nunca pisa un ticker que ya vino de Data912.
 *
 * La key se lee únicamente de `process.env.TWELVE_DATA_API_KEY` (variable de entorno de
 * servidor, sin prefijo NEXT_PUBLIC_) — este módulo solo corre en el Server Component de
 * la página, nunca se importa desde un componente "use client", así que la key no llega
 * al bundle del cliente.
 */

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = "https://api.twelvedata.com";
const TAMAÑO_LOTE = 8; // tope de símbolos por request, para no pasarse de 8 credits/min

interface TickerParaTwelveData {
  ticker: string;
  /** Símbolo real de mercado si difiere del ticker interno (ej. YPFD → YPF, PAMP → PAM). */
  simboloExterno?: string;
}

interface RawQuote {
  symbol?: string;
  close?: string | number;
  previous_close?: string | number;
  percent_change?: string | number;
  status?: string;
}

function normalizarRespuesta(body: unknown): RawQuote[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.symbol === "string") return [obj as RawQuote];
    return Object.values(obj) as RawQuote[];
  }
  return [];
}

function aNumero(v: string | number | undefined): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

async function pedirLote(simbolos: string[]): Promise<RawQuote[]> {
  const qs = new URLSearchParams({ symbol: simbolos.join(","), apikey: API_KEY! }).toString();
  const res = await fetchConTimeout(`${BASE_URL}/quote?${qs}`, 8000, {
    // Cachea 5 minutos de nuestro lado: en el plan free hay que cuidar 8 credits/min y
    // 800 requests/día, así que no tiene sentido volver a pedir en cada request de página.
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`twelvedata /quote respondió ${res.status}`);
  const body = await res.json();
  return normalizarRespuesta(body);
}

export async function obtenerCotizacionesTwelveData(
  tickers: TickerParaTwelveData[]
): Promise<Map<string, CotizacionRV>> {
  const resultado = new Map<string, CotizacionRV>();
  if (!API_KEY || tickers.length === 0) return resultado;

  const porSimbolo = new Map<string, string>(); // símbolo externo -> ticker interno
  for (const t of tickers) porSimbolo.set(t.simboloExterno ?? t.ticker, t.ticker);

  const simbolos = [...porSimbolo.keys()];
  const lotes: string[][] = [];
  for (let i = 0; i < simbolos.length; i += TAMAÑO_LOTE) lotes.push(simbolos.slice(i, i + TAMAÑO_LOTE));

  // Los lotes se piden en paralelo: con revalidate de 5 min, esto solo golpea la red de
  // verdad una vez cada 5 minutos por lote (no en cada visita a la pantalla).
  const respuestas = await Promise.allSettled(lotes.map(pedirLote));

  for (const r of respuestas) {
    if (r.status !== "fulfilled") continue;
    for (const q of r.value) {
      if (!q.symbol || q.status === "error") continue;
      const ticker = porSimbolo.get(q.symbol.toUpperCase()) ?? porSimbolo.get(q.symbol);
      if (!ticker) continue;
      const precio = aNumero(q.close);
      if (precio === undefined) continue;
      const previo = aNumero(q.previous_close);
      const variacionDia = previo && previo > 0 ? ((precio - previo) / previo) * 100 : (aNumero(q.percent_change) ?? 0);
      resultado.set(ticker, { precio, variacionDia: Math.round(variacionDia * 100) / 100 });
    }
  }

  return resultado;
}
