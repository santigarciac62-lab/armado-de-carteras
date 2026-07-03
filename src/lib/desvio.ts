import { CARTERAS_MODELO } from "@/data/modelPortfolios";
import { UNIVERSO_INSTRUMENTOS } from "@/data/instrumentos";
import { TC_REFERENCIA } from "@/lib/constants";
import {
  AlertaConcentracion,
  Bucket,
  ClienteEnriquecido,
  ClienteRaw,
  Perfil,
  RecomendacionRebalanceo,
} from "@/lib/types";

/** Perfil por defecto para clientes sin Test del Inversor cargado (decisión confirmada con la mesa). */
export const PERFIL_POR_DEFECTO: Perfil = "moderado";

const TEST_INVERSOR_A_PERFIL: Record<string, Perfil> = {
  "Conservador (Baja Tolerancia al Riesgo)": "conservador",
  "Especulativo (Tolerancia Media al Riesgo)": "moderado",
  "Agresivo (Alta Tolerancia al Riesgo)": "agresivo",
};

/** Las 12 categorías del export de tenencias, agregadas a los 6 buckets neutrales. */
const CATEGORIA_EXCEL_A_BUCKET: Record<string, Bucket> = {
  FCI: "FCI",
  Letras: "Soberanos",
  "Tít. Púb.": "Soberanos",
  "Tít. Púb. Int.": "Soberanos",
  ON: "ON",
  Acciones: "Acciones",
  Cedears: "Cedears",
  "Ch. Dif.": "Otros",
  "Fact. Crédito": "Otros",
  "Opc/Fut": "Otros",
  Pagaré: "Otros",
  "Tít. Prov.": "Otros",
};

/** Las 12 categorías del export de tenencias tienen nombres levemente distintos a los
 * de la hoja "Cartera Modelo" (límites de concentración) del mismo Excel. */
const CATEGORIA_EXCEL_A_LIMITE: Record<string, string> = {
  Acciones: "Acciones",
  Cedears: "Cedears",
  "Ch. Dif.": "Cheques Diferidos",
  "Fact. Crédito": "Factura de Credito Electronica",
  FCI: "FCI",
  Letras: "Letras",
  ON: "Obligaciones Negociables",
  "Opc/Fut": "Opciones/futuros",
  Pagaré: "Pagaré",
  "Tít. Prov.": "Títulos Provinciales",
  "Tít. Púb.": "Títulos Públicos",
  "Tít. Púb. Int.": "Titulos Públicos Internacionales",
};

const BUCKETS: Bucket[] = ["FCI", "Soberanos", "ON", "Acciones", "Cedears", "Otros"];

const UMBRAL_RECOMENDACION_PP = 5; // por debajo de esto no vale la pena sugerir un rebalanceo

function agregarBuckets(categorias: Record<string, number>): Record<Bucket, number> {
  const acc: Record<Bucket, number> = { FCI: 0, Soberanos: 0, ON: 0, Acciones: 0, Cedears: 0, Otros: 0 };
  for (const [categoria, pct] of Object.entries(categorias)) {
    const bucket = CATEGORIA_EXCEL_A_BUCKET[categoria];
    if (bucket) acc[bucket] += pct;
  }
  return acc;
}

function trackingError(actual: Record<Bucket, number>, modelo: Record<Bucket, number>): number {
  let suma = 0;
  for (const b of BUCKETS) {
    suma += Math.abs((actual[b] ?? 0) - (modelo[b] ?? 0));
  }
  return suma / 2;
}

function statusDesde(desvio: number): ClienteEnriquecido["statusSemaforo"] {
  if (desvio < 0.15) return "optimo";
  if (desvio < 0.3) return "aceptable";
  return "revisar";
}

function calcularAlertasConcentracion(
  categorias: Record<string, number>,
  limites: Record<string, number>
): AlertaConcentracion[] {
  const alertas: AlertaConcentracion[] = [];
  for (const [categoria, pctCliente] of Object.entries(categorias)) {
    const limiteKey = CATEGORIA_EXCEL_A_LIMITE[categoria];
    const limite = limiteKey ? limites[limiteKey] : undefined;
    if (limite !== undefined && pctCliente > limite) {
      alertas.push({ categoria, pctCliente, limite });
    }
  }
  return alertas.sort((a, b) => b.pctCliente - a.pctCliente);
}

function tickersSugeridosParaBucket(carteraId: string, bucket: Bucket): string[] {
  return UNIVERSO_INSTRUMENTOS.filter(
    (i) => i.bucket === bucket && i.presenteEn.some((p) => p.carteraId === carteraId)
  )
    .sort((a, b) => {
      const pctA = a.presenteEn.find((p) => p.carteraId === carteraId)?.pct ?? 0;
      const pctB = b.presenteEn.find((p) => p.carteraId === carteraId)?.pct ?? 0;
      return pctB - pctA;
    })
    .slice(0, 3)
    .map((i) => i.ticker);
}

function calcularRecomendaciones(
  bucketsCliente: Record<Bucket, number>,
  modeloId: string,
  modeloBuckets: Record<Bucket, number>
): RecomendacionRebalanceo[] {
  const recomendaciones: RecomendacionRebalanceo[] = [];
  for (const b of BUCKETS) {
    const actualPct = (bucketsCliente[b] ?? 0) * 100;
    const modeloPct = (modeloBuckets[b] ?? 0) * 100;
    const desvioPP = actualPct - modeloPct;
    if (Math.abs(desvioPP) < UMBRAL_RECOMENDACION_PP) continue;
    recomendaciones.push({
      bucket: b,
      actualPct,
      modeloPct,
      desvioPP,
      accion: desvioPP > 0 ? "vender" : "comprar",
      tickersSugeridos: desvioPP < 0 ? tickersSugeridosParaBucket(modeloId, b) : [],
    });
  }
  return recomendaciones.sort((a, b) => Math.abs(b.desvioPP) - Math.abs(a.desvioPP));
}

export function enriquecerCliente(
  raw: ClienteRaw,
  limitesConcentracion: Record<string, number>
): ClienteEnriquecido {
  const perfilAsignadoPorDefault = !(raw.testInversor in TEST_INVERSOR_A_PERFIL);
  const perfilGrupo = TEST_INVERSOR_A_PERFIL[raw.testInversor] ?? PERFIL_POR_DEFECTO;
  const bucketsCliente = agregarBuckets(raw.categorias);

  const candidatos = (["ARS", "USD"] as const).map((moneda) => {
    const modelo = CARTERAS_MODELO.find((c) => c.perfil === perfilGrupo && c.moneda === moneda)!;
    return { moneda, modelo, desvio: trackingError(bucketsCliente, modelo.buckets) };
  });
  const mejor = candidatos.reduce((a, b) => (b.desvio < a.desvio ? b : a));

  return {
    ...raw,
    perfilGrupo,
    perfilAsignadoPorDefault,
    bucketsCliente,
    monedaComparacion: mejor.moneda,
    desvio: mejor.desvio,
    statusSemaforo: statusDesde(mejor.desvio),
    aumUsd: raw.aumArs / TC_REFERENCIA,
    alertasConcentracion: calcularAlertasConcentracion(raw.categorias, limitesConcentracion),
    recomendaciones: calcularRecomendaciones(bucketsCliente, mejor.modelo.id, mejor.modelo.buckets),
  };
}
