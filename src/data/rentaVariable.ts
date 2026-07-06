import { generarHistoricoSintetico } from "@/lib/rentaVariable/syntheticHistory";
import { mediaMovil, calcularRSI, calcularMACD, MACDResultado } from "@/lib/rentaVariable/indicadoresTecnicos";
import { scoreTecnico, scoreFundamental, señalDeScore, Señal } from "@/lib/rentaVariable/scoring";

export type TipoActivoRV = "local" | "cedear";

interface SeedActivoRV {
  ticker: string;
  nombre: string;
  tipo: TipoActivoRV;
  sector: string;
  /** Precio actual en ARS (las locales y los CEDEARs cotizan en pesos en BYMA) — dato de
   * referencia (demo), no un precio en vivo. */
  precio: number;
  variacionDia: number; // %
  pe: number | null;
  pb: number | null;
  evEbitda: number | null;
  roe: number | null;
  margenNeto: number | null;
  crecimientoRevenue: number | null;
  crecimientoEps: number | null;
}

const BENCHMARK_PE_SECTOR: Record<string, number> = {
  Tecnología: 28,
  "E-commerce": 35,
  Bancos: 10,
  Energía: 12,
  Fintech: 22,
  Consumo: 24,
};

/** Universo de Renta Variable (locales + CEDEARs). Precios y variaciones de referencia (demo);
 * fundamentales de los últimos reportes disponibles al armar esta pantalla. Sin fuente en vivo
 * todavía — ver nota en syntheticHistory.ts. */
const SEED: SeedActivoRV[] = [
  { ticker: "GGAL", nombre: "Grupo Financiero Galicia", tipo: "local", sector: "Bancos", precio: 8185, variacionDia: 2.8, pe: 8, pb: 1.5, evEbitda: 5, roe: 0.18, margenNeto: 0.24, crecimientoRevenue: 0.221, crecimientoEps: 0.18 },
  { ticker: "BMA", nombre: "Banco Macro", tipo: "local", sector: "Bancos", precio: 14710, variacionDia: 1.85, pe: 7, pb: 1.2, evEbitda: 4.8, roe: 0.16, margenNeto: 0.242, crecimientoRevenue: 0.184, crecimientoEps: 0.15 },
  { ticker: "YPFD", nombre: "YPF", tipo: "local", sector: "Energía", precio: 71975, variacionDia: 0.56, pe: 5, pb: 0.8, evEbitda: 3.9, roe: 0.13, margenNeto: 0.089, crecimientoRevenue: 0.142, crecimientoEps: 0.12 },
  { ticker: "PAMP", nombre: "Pampa Energía", tipo: "local", sector: "Energía", precio: 5085, variacionDia: -0.97, pe: 10, pb: 2, evEbitda: 6, roe: 0.14, margenNeto: 0.124, crecimientoRevenue: 0.098, crecimientoEps: 0.09 },
  { ticker: "META", nombre: "Meta Platforms (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 38700, variacionDia: -0.46, pe: 24, pb: 8, evEbitda: 17, roe: 0.34, margenNeto: 0.29, crecimientoRevenue: 0.16, crecimientoEps: 0.2 },
  { ticker: "GOOGL", nombre: "Alphabet (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 9840, variacionDia: -0.3, pe: 22, pb: 7, evEbitda: 17, roe: 0.32, margenNeto: 0.242, crecimientoRevenue: 0.128, crecimientoEps: 0.29 },
  { ticker: "MSFT", nombre: "Microsoft (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 20240, variacionDia: -2.65, pe: 35, pb: 12, evEbitda: 27, roe: 0.38, margenNeto: 0.358, crecimientoRevenue: 0.162, crecimientoEps: 0.18 },
  { ticker: "AAPL", nombre: "Apple (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 24590, variacionDia: 1.7, pe: 33, pb: 50, evEbitda: 25, roe: 1.47, margenNeto: 0.264, crecimientoRevenue: 0.051, crecimientoEps: 0.11 },
  { ticker: "NVDA", nombre: "NVIDIA (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 12830, variacionDia: -0.93, pe: 48, pb: 42, evEbitda: 38, roe: 0.91, margenNeto: 0.568, crecimientoRevenue: 1.224, crecimientoEps: 1.68 },
  { ticker: "AMZN", nombre: "Amazon (Cedear)", tipo: "cedear", sector: "E-commerce", precio: 2680, variacionDia: -0.65, pe: 42, pb: 9, evEbitda: 18, roe: 0.22, margenNeto: 0.084, crecimientoRevenue: 0.121, crecimientoEps: 0.95 },
  { ticker: "MELI", nombre: "Mercado Libre (Cedear)", tipo: "cedear", sector: "E-commerce", precio: 23430, variacionDia: 1.3, pe: 58, pb: 22, evEbitda: 42, roe: 0.28, margenNeto: 0.108, crecimientoRevenue: 0.384, crecimientoEps: 0.42 },
  { ticker: "GLOB", nombre: "Globant (Cedear)", tipo: "cedear", sector: "Tecnología", precio: 45000, variacionDia: 0.8, pe: 28, pb: 8, evEbitda: 18, roe: 0.22, margenNeto: 0.184, crecimientoRevenue: 0.228, crecimientoEps: 0.25 },
  { ticker: "VIST", nombre: "Vista Energy (Cedear)", tipo: "cedear", sector: "Energía", precio: 38000, variacionDia: 1.2, pe: 8, pb: 4, evEbitda: 6, roe: 0.43, margenNeto: 0.284, crecimientoRevenue: 0.684, crecimientoEps: 0.72 },
  { ticker: "NU", nombre: "Nu Holdings (Cedear)", tipo: "cedear", sector: "Fintech", precio: 10710, variacionDia: -0.56, pe: 26, pb: 6, evEbitda: 20, roe: 0.24, margenNeto: 0.18, crecimientoRevenue: 0.35, crecimientoEps: 0.4 },
  { ticker: "PEP", nombre: "PepsiCo (Cedear)", tipo: "cedear", sector: "Consumo", precio: 12380, variacionDia: -2.83, pe: 21, pb: 11, evEbitda: 15, roe: 0.5, margenNeto: 0.105, crecimientoRevenue: 0.03, crecimientoEps: 0.05 },
];

export interface ActivoRV {
  ticker: string;
  nombre: string;
  tipo: TipoActivoRV;
  sector: string;
  precio: number;
  variacionDia: number;
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

function calcularActivo(seed: SeedActivoRV): ActivoRV {
  const historico = generarHistoricoSintetico(seed.ticker, seed.precio);
  const cierres = historico.map((h) => h.precio);
  const sma20 = mediaMovil(cierres, 20);
  const sma50 = mediaMovil(cierres, 50);
  const sma200Serie = mediaMovil(cierres, Math.min(200, cierres.length - 1));
  const rsiSerie = calcularRSI(cierres, 14);
  const macd = calcularMACD(cierres);

  const ma50 = sma50[sma50.length - 1] ?? seed.precio;
  const ma200 = sma200Serie[sma200Serie.length - 1] ?? seed.precio * 0.94;
  const rsi = rsiSerie[rsiSerie.length - 1] ?? 50;
  const hi52 = Math.max(...cierres);
  const lo52 = Math.min(...cierres);
  const pct52raw = hi52 > lo52 ? (seed.precio - lo52) / (hi52 - lo52) : 0.5;

  const retornos = cierres.slice(1).map((c, i) => c / cierres[i] - 1);
  const mediaRet = retornos.reduce((a, b) => a + b, 0) / retornos.length;
  const varianza = retornos.reduce((a, b) => a + (b - mediaRet) ** 2, 0) / retornos.length;
  const volatilidadDiariaPct = Math.sqrt(varianza) * 100;

  const st = scoreTecnico({ precio: seed.precio, ma50, ma200, variacionDia: seed.variacionDia, pct52: pct52raw });
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
    precio: seed.precio,
    variacionDia: seed.variacionDia,
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

export const UNIVERSO_RENTA_VARIABLE: ActivoRV[] = SEED.map(calcularActivo).sort((a, b) => b.score - a.score);
