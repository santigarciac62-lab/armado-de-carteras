import { Columna, NoticiaItem, NoticiaRelevante } from "./types";

/** Palabras clave de alto impacto para decisiones de inversión — bilingüe porque el pool
 * de Relevantes cruza fuentes en español (Argentina) e inglés (NYT). Conteo de keywords
 * distintas matcheadas = score; no es un modelo, es una heurística de curaduría simple. */
const KEYWORDS_RELEVANCIA = [
  // Tasas / bancos centrales
  "bcra",
  "fed",
  "reserva federal",
  "federal reserve",
  "tasa de interés",
  "tasas de interes",
  "interest rate",
  "central bank",
  "banco central",
  // Tipo de cambio / riesgo país
  "dólar",
  "dolar",
  "riesgo país",
  "riesgo pais",
  "devaluación",
  "devaluacion",
  "cepo",
  "brecha cambiaria",
  "currency",
  // Medidas de gobierno / regulatorias
  "retenciones",
  "fmi",
  "imf",
  "tarifa",
  "tariff",
  "sanción",
  "sancion",
  "sanction",
  "embargo",
  // Geopolítica
  "geopolít",
  "geopolit",
  "conflicto",
  "war",
  "guerra",
  "china",
  "rusia",
  "russia",
  "ucrania",
  "ukraine",
  // Commodities
  "petróleo",
  "petroleo",
  "oil",
  "opec",
  "oro",
  "gold",
  "commodity",
  "commodities",
  // Earnings / IPOs / deuda
  "balance",
  "resultado trimestral",
  "earnings",
  "ganancias trimestrales",
  "ipo",
  "oferta pública inicial",
  "oferta publica inicial",
  "colocación de deuda",
  "colocacion de deuda",
  "bono soberano",
  "default",
];

function calcularScore(item: NoticiaItem): number {
  const texto = `${item.titulo} ${item.resumen ?? ""}`.toLowerCase();
  return KEYWORDS_RELEVANCIA.reduce((acc, k) => (texto.includes(k) ? acc + 1 : acc), 0);
}

/** Toma el pool ya traído de Global + Argentina y arma la columna "Relevantes": los N de
 * mayor score, sin ocultar que ya aparecen en su columna de origen (se marca, no se oculta,
 * según lo pedido). */
export function construirRelevantes(
  porColumna: { columna: Columna; items: NoticiaItem[] }[],
  n = 10
): NoticiaRelevante[] {
  const conScore: NoticiaRelevante[] = [];
  for (const { columna, items } of porColumna) {
    for (const item of items) {
      const score = calcularScore(item);
      if (score > 0) conScore.push({ ...item, score, columnaOrigen: columna });
    }
  }
  return conScore
    .sort((a, b) => b.score - a.score || new Date(b.publicadoEn).getTime() - new Date(a.publicadoEn).getTime())
    .slice(0, n);
}
