import { CarteraModelo } from "@/lib/types";

/**
 * Carteras modelo tal como figuran en la "Visión de Portafolio" (03/06/2026).
 * Fuente de verdad para armado de carteras y cálculo de desvío por perfil.
 * Se reemplaza mes a mes subiendo la próxima Visión (ver /admin/vision).
 */
export const FECHA_VISION_VIGENTE = "2026-06-03";

export const CARTERAS_MODELO: CarteraModelo[] = [
  {
    id: "conservador_ars",
    perfil: "conservador",
    perfilLabel: "Conservador",
    moneda: "ARS",
    riesgo: "Bajo",
    liquidez: "Alta",
    horizonte: "30 días",
    estrategia:
      "Mantener invertido capital con horizonte de corto plazo, buscando rendimientos superiores al plazo fijo. Posicionada en FCI Money Market y tasa fija del tramo corto de la curva, buscando devengamiento de interés y un flujo de caja constante.",
    composicion: { "FCI MM": 0.5, "Tasa Fija ARS": 0.5 },
    activos: [
      { ticker: "IAM Ahorro Pesos B", categoria: "FCI MM", pct: 0.5 },
      { ticker: "S30S6", categoria: "Tasa Fija ARS", pct: 0.5 },
    ],
    buckets: { FCI: 0.5, Soberanos: 0.5, ON: 0, Acciones: 0, Cedears: 0, Otros: 0 },
  },
  {
    id: "conservador_usd",
    perfil: "conservador",
    perfilLabel: "Conservador",
    moneda: "USD",
    riesgo: "Bajo",
    liquidez: "Alta",
    horizonte: "180 días",
    estrategia:
      "Invierte en FCI Money Market y FCI Latam, con el resto en obligaciones negociables del mercado argentino de calificación AAA. Objetivo: rendimiento superior a la caución en dólares con baja volatilidad.",
    composicion: { "FCI MM USD": 0.5, "FCI Latam": 0.29, "ON HD": 0.21 },
    activos: [
      { ticker: "Allaria Dólar Ahorro B", categoria: "FCI MM USD", pct: 0.5 },
      { ticker: "SBS Renta Mixta - Clase B", categoria: "FCI Latam", pct: 0.29 },
      { ticker: "VSCXO", categoria: "ON HD", pct: 0.07 },
      { ticker: "TTC9O", categoria: "ON HD", pct: 0.07 },
      { ticker: "YM42O", categoria: "ON HD", pct: 0.07 },
    ],
    buckets: { FCI: 0.79, Soberanos: 0, ON: 0.21, Acciones: 0, Cedears: 0, Otros: 0 },
  },
  {
    id: "moderado_ars",
    perfil: "moderado",
    perfilLabel: "Moderado",
    moneda: "ARS",
    riesgo: "Medio",
    liquidez: "Alta",
    horizonte: "3 meses",
    estrategia:
      "Retornos moderados sobre pesos, buscando ganancias en el mediano plazo y rendimientos reales que superen la inflación. Gestión equilibrada entre renta fija y variable en pesos, posicionada principalmente en el tramo medio y largo de la curva de tasa fija.",
    composicion: {
      "FCI MM": 0.1,
      "Bonos HD": 0.1,
      Acciones: 0.05,
      "Tasa Fija ARS": 0.7,
      Cedears: 0.05,
    },
    activos: [
      { ticker: "IAM Ahorro Pesos B", categoria: "FCI MM", pct: 0.1 },
      { ticker: "GD35", categoria: "Bonos HD", pct: 0.1 },
      { ticker: "GGAL", categoria: "Acciones", pct: 0.05 },
      { ticker: "T30A7", categoria: "Tasa Fija ARS", pct: 0.3 },
      { ticker: "META", categoria: "Cedears", pct: 0.05 },
      { ticker: "S30S6", categoria: "Tasa Fija ARS", pct: 0.4 },
    ],
    buckets: { FCI: 0.1, Soberanos: 0.8, ON: 0, Acciones: 0.05, Cedears: 0.05, Otros: 0 },
  },
  {
    id: "moderado_usd",
    perfil: "moderado",
    perfilLabel: "Moderado",
    moneda: "USD",
    riesgo: "Medio",
    liquidez: "Media",
    horizonte: "6 meses",
    estrategia:
      "Retornos moderados en dólares sin perder exposición a instrumentos de riesgo (acciones y bonos). Estrategia mixta combinando obligaciones negociables, soberanos, acciones locales y cedears.",
    composicion: {
      "FCI Latam": 0.18,
      "Bonos HD": 0.13,
      "ON HD": 0.45,
      Acciones: 0.05,
      Cedears: 0.19,
    },
    activos: [
      { ticker: "SBS Renta Mixta - Clase B", categoria: "FCI Latam", pct: 0.18 },
      { ticker: "GD35", categoria: "Bonos HD", pct: 0.13 },
      { ticker: "VSCXO", categoria: "ON HD", pct: 0.15 },
      { ticker: "TTC9O", categoria: "ON HD", pct: 0.15 },
      { ticker: "YM42O", categoria: "ON HD", pct: 0.15 },
      { ticker: "PEP", categoria: "Cedears", pct: 0.07 },
      { ticker: "GGAL", categoria: "Acciones", pct: 0.05 },
      { ticker: "MSFT", categoria: "Cedears", pct: 0.12 },
    ],
    buckets: { FCI: 0.18, Soberanos: 0.13, ON: 0.45, Acciones: 0.05, Cedears: 0.19, Otros: 0 },
  },
  {
    id: "agresivo_ars",
    perfil: "agresivo",
    perfilLabel: "Agresivo",
    moneda: "ARS",
    riesgo: "Medio-Alto",
    liquidez: "Media",
    horizonte: "1 año",
    estrategia:
      "Retorno más alto a cambio de mayor volatilidad, con exposición sostenida a instrumentos de riesgo. Combina tasa fija, soberanos y acciones locales, con horizonte de largo plazo.",
    composicion: { "Bonos HD": 0.1, Acciones: 0.22, "Tasa Fija ARS": 0.55, Cedears: 0.13 },
    activos: [
      { ticker: "GD35", categoria: "Bonos HD", pct: 0.1 },
      { ticker: "T30A7", categoria: "Tasa Fija ARS", pct: 0.55 },
      { ticker: "META", categoria: "Cedears", pct: 0.08 },
      { ticker: "PAMP", categoria: "Acciones", pct: 0.05 },
      { ticker: "GGAL", categoria: "Acciones", pct: 0.17 },
      { ticker: "MELI", categoria: "Cedears", pct: 0.05 },
    ],
    buckets: { FCI: 0, Soberanos: 0.65, ON: 0, Acciones: 0.22, Cedears: 0.13, Otros: 0 },
  },
  {
    id: "agresivo_usd",
    perfil: "agresivo",
    perfilLabel: "Agresivo",
    moneda: "USD",
    riesgo: "Medio-Alto",
    liquidez: "Media",
    horizonte: "1 año",
    estrategia:
      "Retorno más alto en dólares a cambio de mayor volatilidad, buscando ganancias de largo plazo con exposición sostenida a acciones. Estrategia mixta combinando obligaciones negociables, soberanos, acciones locales y cedears.",
    composicion: { "FCI Latam": 0.2, "Bonos HD": 0.15, Acciones: 0.22, Cedears: 0.43 },
    activos: [
      { ticker: "SBS Renta Mixta - Clase B", categoria: "FCI Latam", pct: 0.2 },
      { ticker: "GD35", categoria: "Bonos HD", pct: 0.15 },
      { ticker: "GGAL", categoria: "Acciones", pct: 0.15 },
      { ticker: "PAMP", categoria: "Acciones", pct: 0.07 },
      { ticker: "NU", categoria: "Cedears", pct: 0.1 },
      { ticker: "PEP", categoria: "Cedears", pct: 0.08 },
      { ticker: "META", categoria: "Cedears", pct: 0.1 },
      { ticker: "MSFT", categoria: "Cedears", pct: 0.15 },
    ],
    buckets: { FCI: 0.2, Soberanos: 0.15, ON: 0, Acciones: 0.22, Cedears: 0.43, Otros: 0 },
  },
];

export function getCarteraModelo(perfil: string, moneda: string) {
  return CARTERAS_MODELO.find(
    (c) => c.perfil === perfil && c.moneda === moneda.toUpperCase()
  );
}
