import { generarHistoricoSintetico } from "@/lib/rentaVariable/syntheticHistory";
import { mediaMovil, calcularRSI, calcularMACD, MACDResultado } from "@/lib/rentaVariable/indicadoresTecnicos";
import { scoreTecnico, scoreFundamental, señalDeScore, Señal } from "@/lib/rentaVariable/scoring";
import { obtenerCotizacionesEnVivo, TickerRV, CotizacionRV } from "@/lib/rentaVariable/liveData";
import { obtenerCotizacionesTwelveData } from "@/lib/rentaVariable/twelveDataProvider";

export type FuentePrecioRV = "data912" | "twelvedata" | "demo";

export type TipoActivoRV = "local" | "cedear" | "etf";

export const SECTORES_RV = [
  "Argentina/Merval",
  "Tecnología/Semiconductores",
  "Consumo",
  "Fintech/LatAm",
  "Cripto",
  "Otros/emergentes",
  "Commodities/sectoriales",
  "ETFs generales",
] as const;
export type SectorRV = (typeof SECTORES_RV)[number];

interface Fundamentales {
  pe: number | null;
  pb: number | null;
  evEbitda: number | null;
  roe: number | null;
  margenNeto: number | null;
  crecimientoRevenue: number | null;
  crecimientoEps: number | null;
}

interface SeedActivoRV extends Fundamentales {
  ticker: string;
  nombre: string;
  tipo: TipoActivoRV;
  sector: SectorRV;
  /** Precio actual en ARS (las locales y los CEDEARs cotizan en pesos en BYMA) — dato de
   * referencia (demo); se reemplaza por el precio/variación en vivo de Data912 (o, si ese
   * no lo cubre, de Twelve Data) — ver obtenerUniversoRentaVariable. */
  precio: number;
  variacionDia: number; // %
  /** Símbolo real de mercado para Twelve Data, si difiere del ticker interno (ej. la
   * acción local YPFD cotiza en NYSE como "YPF"; PAMP, como "PAM"). */
  simboloExterno?: string;
}

const SIN_FUNDAMENTALES: Fundamentales = {
  pe: null,
  pb: null,
  evEbitda: null,
  roe: null,
  margenNeto: null,
  crecimientoRevenue: null,
  crecimientoEps: null,
};

const BENCHMARK_PE_SECTOR: Record<SectorRV, number> = {
  "Argentina/Merval": 9,
  "Tecnología/Semiconductores": 28,
  Consumo: 24,
  "Fintech/LatAm": 22,
  Cripto: 18,
  "Otros/emergentes": 18,
  "Commodities/sectoriales": 18,
  "ETFs generales": 18,
};

/** Universo de Renta Variable: locales, CEDEARs y ETFs de EE.UU., agrupados por sector.
 * Precios/variaciones semilla tomados del panel de referencia (demo); se sobreescriben con
 * Data912 en vivo para lo que ese proveedor cubra (ver obtenerUniversoRentaVariable). Los ETFs
 * y algunos nombres poco frecuentes (SATL, SPCX, IBIT) probablemente no tengan CEDEAR en BYMA
 * y necesiten una segunda fuente ("Panda", pendiente de datos concretos) para salir en vivo. */
const SEED: SeedActivoRV[] = [
  // Argentina/Merval
  { ticker: "GGAL", nombre: "Grupo Financiero Galicia", tipo: "local", sector: "Argentina/Merval", precio: 8185, variacionDia: 2.8, pe: 8, pb: 1.5, evEbitda: 5, roe: 0.18, margenNeto: 0.24, crecimientoRevenue: 0.221, crecimientoEps: 0.18 },
  { ticker: "BMA", nombre: "Banco Macro", tipo: "local", sector: "Argentina/Merval", precio: 14710, variacionDia: 1.85, pe: 7, pb: 1.2, evEbitda: 4.8, roe: 0.16, margenNeto: 0.242, crecimientoRevenue: 0.184, crecimientoEps: 0.15 },
  { ticker: "YPFD", nombre: "YPF", tipo: "local", sector: "Argentina/Merval", precio: 71975, variacionDia: 0.56, simboloExterno: "YPF", pe: 5, pb: 0.8, evEbitda: 3.9, roe: 0.13, margenNeto: 0.089, crecimientoRevenue: 0.142, crecimientoEps: 0.12 },
  { ticker: "PAMP", nombre: "Pampa Energía", tipo: "local", sector: "Argentina/Merval", precio: 5085, variacionDia: -0.97, simboloExterno: "PAM", pe: 10, pb: 2, evEbitda: 6, roe: 0.14, margenNeto: 0.124, crecimientoRevenue: 0.098, crecimientoEps: 0.09 },
  { ticker: "VIST", nombre: "Vista Energy (Cedear)", tipo: "cedear", sector: "Argentina/Merval", precio: 38000, variacionDia: 1.2, pe: 8, pb: 4, evEbitda: 6, roe: 0.43, margenNeto: 0.284, crecimientoRevenue: 0.684, crecimientoEps: 0.72 },

  // Tecnología/Semiconductores
  { ticker: "GOOGL", nombre: "Alphabet (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 9840, variacionDia: -0.3, pe: 22, pb: 7, evEbitda: 17, roe: 0.32, margenNeto: 0.242, crecimientoRevenue: 0.128, crecimientoEps: 0.29 },
  { ticker: "MSFT", nombre: "Microsoft (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 20240, variacionDia: -2.65, pe: 35, pb: 12, evEbitda: 27, roe: 0.38, margenNeto: 0.358, crecimientoRevenue: 0.162, crecimientoEps: 0.18 },
  { ticker: "AAPL", nombre: "Apple (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 24590, variacionDia: 1.7, pe: 33, pb: 50, evEbitda: 25, roe: 1.47, margenNeto: 0.264, crecimientoRevenue: 0.051, crecimientoEps: 0.11 },
  { ticker: "NVDA", nombre: "NVIDIA (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 12830, variacionDia: -0.93, pe: 48, pb: 42, evEbitda: 38, roe: 0.91, margenNeto: 0.568, crecimientoRevenue: 1.224, crecimientoEps: 1.68 },
  { ticker: "MU", nombre: "Micron Technology (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 316400, variacionDia: 1.44, pe: 14, pb: 3.5, evEbitda: 9, roe: 0.22, margenNeto: 0.18, crecimientoRevenue: 0.62, crecimientoEps: 1.1 },
  { ticker: "META", nombre: "Meta Platforms (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 38700, variacionDia: -0.46, pe: 24, pb: 8, evEbitda: 17, roe: 0.34, margenNeto: 0.29, crecimientoRevenue: 0.16, crecimientoEps: 0.2 },
  { ticker: "GLOB", nombre: "Globant (Cedear)", tipo: "cedear", sector: "Tecnología/Semiconductores", precio: 45000, variacionDia: 0.8, pe: 28, pb: 8, evEbitda: 18, roe: 0.22, margenNeto: 0.184, crecimientoRevenue: 0.228, crecimientoEps: 0.25 },

  // Consumo
  { ticker: "PEP", nombre: "PepsiCo (Cedear)", tipo: "cedear", sector: "Consumo", precio: 12380, variacionDia: -2.83, pe: 21, pb: 11, evEbitda: 15, roe: 0.5, margenNeto: 0.105, crecimientoRevenue: 0.03, crecimientoEps: 0.05 },
  { ticker: "MO", nombre: "Altria (Cedear)", tipo: "cedear", sector: "Consumo", precio: 28100, variacionDia: -4.1, pe: 9, pb: null, evEbitda: 8, roe: null, margenNeto: 0.4, crecimientoRevenue: 0.02, crecimientoEps: 0.03 },
  { ticker: "AMZN", nombre: "Amazon (Cedear)", tipo: "cedear", sector: "Consumo", precio: 2680, variacionDia: -0.65, pe: 42, pb: 9, evEbitda: 18, roe: 0.22, margenNeto: 0.084, crecimientoRevenue: 0.121, crecimientoEps: 0.95 },

  // Fintech/LatAm
  { ticker: "NU", nombre: "Nu Holdings (Cedear)", tipo: "cedear", sector: "Fintech/LatAm", precio: 10710, variacionDia: -0.56, pe: 26, pb: 6, evEbitda: 20, roe: 0.24, margenNeto: 0.18, crecimientoRevenue: 0.35, crecimientoEps: 0.4 },
  { ticker: "BABA", nombre: "Alibaba (Cedear)", tipo: "cedear", sector: "Fintech/LatAm", precio: 16980, variacionDia: -0.93, pe: 16, pb: 2.2, evEbitda: 10, roe: 0.1, margenNeto: 0.13, crecimientoRevenue: 0.08, crecimientoEps: 0.15 },
  { ticker: "MELI", nombre: "Mercado Libre (Cedear)", tipo: "cedear", sector: "Fintech/LatAm", precio: 23430, variacionDia: 1.3, pe: 58, pb: 22, evEbitda: 42, roe: 0.28, margenNeto: 0.108, crecimientoRevenue: 0.384, crecimientoEps: 0.42 },

  // Cripto
  { ticker: "IBIT", nombre: "iShares Bitcoin Trust (Cedear)", tipo: "cedear", sector: "Cripto", precio: 5590, variacionDia: -0.8, ...SIN_FUNDAMENTALES },

  // Otros/emergentes
  { ticker: "NIO", nombre: "NIO Inc. (Cedear)", tipo: "cedear", sector: "Otros/emergentes", precio: 1954, variacionDia: 3.17, pe: null, pb: 3, evEbitda: null, roe: null, margenNeto: null, crecimientoRevenue: 0.25, crecimientoEps: null },
  { ticker: "SATL", nombre: "Satellogic (Cedear)", tipo: "cedear", sector: "Otros/emergentes", precio: 8350, variacionDia: -1.36, ...SIN_FUNDAMENTALES },
  { ticker: "SPCX", nombre: "SPCX (Cedear)", tipo: "cedear", sector: "Otros/emergentes", precio: 5045, variacionDia: -1.94, ...SIN_FUNDAMENTALES },

  // Commodities/sectoriales
  { ticker: "XLE", nombre: "Energy Select Sector SPDR (Cedear)", tipo: "etf", sector: "Commodities/sectoriales", precio: 41760, variacionDia: -0.38, ...SIN_FUNDAMENTALES },
  { ticker: "USO", nombre: "United States Oil Fund (Cedear)", tipo: "etf", sector: "Commodities/sectoriales", precio: 10910, variacionDia: -0.82, ...SIN_FUNDAMENTALES },
  { ticker: "URA", nombre: "Global X Uranium ETF (Cedear)", tipo: "etf", sector: "Commodities/sectoriales", precio: 13870, variacionDia: 0.8, ...SIN_FUNDAMENTALES },
  { ticker: "SLV", nombre: "iShares Silver Trust (Cedear)", tipo: "etf", sector: "Commodities/sectoriales", precio: 14590, variacionDia: -2.01, ...SIN_FUNDAMENTALES },
  { ticker: "GLD", nombre: "SPDR Gold Shares (Cedear)", tipo: "etf", sector: "Commodities/sectoriales", precio: 11940, variacionDia: -1.89, ...SIN_FUNDAMENTALES },

  // ETFs generales
  { ticker: "SPY", nombre: "SPDR S&P 500 ETF (Cedear)", tipo: "etf", sector: "ETFs generales", precio: 19650, variacionDia: -1.45, ...SIN_FUNDAMENTALES },
  { ticker: "QQQ", nombre: "Invesco QQQ Trust (Cedear)", tipo: "etf", sector: "ETFs generales", precio: 56950, variacionDia: 0.22, ...SIN_FUNDAMENTALES },
  { ticker: "EWZ", nombre: "iShares MSCI Brazil ETF (Cedear)", tipo: "etf", sector: "ETFs generales", precio: 27200, variacionDia: -1.23, ...SIN_FUNDAMENTALES },
];

export interface ActivoRV {
  ticker: string;
  nombre: string;
  tipo: TipoActivoRV;
  sector: SectorRV;
  precio: number;
  variacionDia: number;
  fuentePrecio: FuentePrecioRV;
  historico: { fecha: string; precio: number }[];
  sma20: (number | null)[];
  sma50: (number | null)[];
  rsiSerie: (number | null)[];
  rsi: number;
  macd: MACDResultado;
  pct52: number; // 0-100
  volatilidadDiariaPct: number;
  ma50: number;
  ma200: number;
  scoreTecnico: number;
  scoreFundamental: number;
  score: number;
  señal: Señal;
  pe: number | null;
  pb: number | null;
  evEbitda: number | null;
  roe: number | null;
  margenNeto: number | null;
  crecimientoRevenue: number | null;
  crecimientoEps: number | null;
  benchmarkPE: number;
}

function calcularActivo(seed: SeedActivoRV, enVivo?: CotizacionRV, fuenteEnVivo?: FuentePrecioRV): ActivoRV {
  const precio = enVivo?.precio ?? seed.precio;
  const variacionDia = enVivo?.variacionDia ?? seed.variacionDia;
  const fuentePrecio: FuentePrecioRV = enVivo ? (fuenteEnVivo ?? "data912") : "demo";

  const historico = generarHistoricoSintetico(seed.ticker, precio);
  const cierres = historico.map((h) => h.precio);
  const sma20 = mediaMovil(cierres, 20);
  const sma50 = mediaMovil(cierres, 50);
  const sma200Serie = mediaMovil(cierres, Math.min(200, cierres.length - 1));
  const rsiSerie = calcularRSI(cierres, 14);
  const macd = calcularMACD(cierres);

  const ma50 = sma50[sma50.length - 1] ?? precio;
  const ma200 = sma200Serie[sma200Serie.length - 1] ?? precio * 0.94;
  const rsi = rsiSerie[rsiSerie.length - 1] ?? 50;
  const hi52 = Math.max(...cierres);
  const lo52 = Math.min(...cierres);
  const pct52raw = hi52 > lo52 ? (precio - lo52) / (hi52 - lo52) : 0.5;

  const retornos = cierres.slice(1).map((c, i) => c / cierres[i] - 1);
  const mediaRet = retornos.reduce((a, b) => a + b, 0) / retornos.length;
  const varianza = retornos.reduce((a, b) => a + (b - mediaRet) ** 2, 0) / retornos.length;
  const volatilidadDiariaPct = Math.sqrt(varianza) * 100;

  const st = scoreTecnico({ precio, ma50, ma200, variacionDia, pct52: pct52raw });
  const benchmarkPE = BENCHMARK_PE_SECTOR[seed.sector] ?? 18;
  const sf = scoreFundamental({
    pe: seed.pe,
    roe: seed.roe,
    margenNeto: seed.margenNeto,
    crecimientoRevenue: seed.crecimientoRevenue,
    crecimientoEps: seed.crecimientoEps,
    evEbitda: seed.evEbitda,
    benchmarkPE,
  });
  // Peso reservado (25%) para un futuro factor de contexto de mercado/liquidez, hoy neutro (5/10).
  const score = Math.round((st * 0.4 + sf * 0.35 + 5 * 0.25) * 10) / 10;

  return {
    ticker: seed.ticker,
    nombre: seed.nombre,
    tipo: seed.tipo,
    sector: seed.sector,
    precio,
    variacionDia,
    fuentePrecio,
    historico,
    sma20,
    sma50,
    rsiSerie,
    rsi,
    macd,
    pct52: Math.round(pct52raw * 100),
    volatilidadDiariaPct: Math.round(volatilidadDiariaPct * 100) / 100,
    ma50,
    ma200,
    scoreTecnico: st,
    scoreFundamental: sf,
    score,
    señal: señalDeScore(score),
    pe: seed.pe,
    pb: seed.pb,
    evEbitda: seed.evEbitda,
    roe: seed.roe,
    margenNeto: seed.margenNeto,
    crecimientoRevenue: seed.crecimientoRevenue,
    crecimientoEps: seed.crecimientoEps,
    benchmarkPE,
  };
}

/** Universo completo, con precio/variación en vivo en dos capas:
 * 1. Data912 (locales vía `arg_stocks`, CEDEARs/ETFs vía `arg_cedears`).
 * 2. Twelve Data, solo para lo que Data912 no resolvió (típicamente ETFs de EE.UU. y algún
 *    nombre poco frecuente) — nunca pisa un ticker que ya vino de Data912.
 * Lo que ninguna de las dos cubra queda con el precio/variación semilla (badge "Demo").
 * Se resuelve por request (no es un valor estático), porque depende de llamadas de red. */
export async function obtenerUniversoRentaVariable(): Promise<ActivoRV[]> {
  const tickersParaVivo: TickerRV[] = SEED.map((s) => ({
    ticker: s.ticker,
    claseActivo: s.tipo === "local" ? "Accion" : "Cedear",
    moneda: "ARS",
  }));
  const deData912 = await obtenerCotizacionesEnVivo(tickersParaVivo);

  const faltantes = SEED.filter((s) => !deData912.has(s.ticker)).map((s) => ({
    ticker: s.ticker,
    simboloExterno: s.simboloExterno,
  }));
  const deTwelveData = await obtenerCotizacionesTwelveData(faltantes);

  return SEED.map((seed) => {
    if (deData912.has(seed.ticker)) return calcularActivo(seed, deData912.get(seed.ticker), "data912");
    if (deTwelveData.has(seed.ticker)) return calcularActivo(seed, deTwelveData.get(seed.ticker), "twelvedata");
    return calcularActivo(seed);
  }).sort((a, b) => b.score - a.score);
}
