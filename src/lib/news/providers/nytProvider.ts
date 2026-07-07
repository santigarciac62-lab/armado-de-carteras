import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * NYT publica RSS oficiales y estables (rss.nytimes.com) — esta es la única fuente de las 8
 * con feed público confirmado por documentación pública del medio (no inventado). Se toman
 * World y Business/Economy y se filtra por palabras clave para quedarnos solo con
 * economía/geopolítica/comercio/Fed/sanciones/commodities, excluyendo deportes/cultura
 * (que igual no vienen en estos dos feeds) y notas puramente políticas sin relevancia de
 * mercado.
 */

const FEEDS = [
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
];

const KEYWORDS_RELEVANTES = [
  "fed",
  "federal reserve",
  "interest rate",
  "inflation",
  "tariff",
  "trade war",
  "sanction",
  "embargo",
  "opec",
  "oil",
  "gold",
  "commodity",
  "commodities",
  "currency",
  "dollar",
  "recession",
  "gdp",
  "imf",
  "world bank",
  "central bank",
  "market",
  "stocks",
  "bond",
  "economy",
  "economic",
  "geopolit",
  "war",
  "conflict",
  "china",
  "russia",
  "ukraine",
  "middle east",
];

function esRelevante(item: NoticiaItem): boolean {
  const texto = `${item.titulo} ${item.resumen ?? ""}`.toLowerCase();
  return KEYWORDS_RELEVANTES.some((k) => texto.includes(k));
}

export async function obtenerNyt(revalidateSeg: number): Promise<NoticiaItem[]> {
  const resultados = await Promise.allSettled(
    FEEDS.map((url) => traerFeedComoNoticias(url, "nyt", "NYT International", revalidateSeg))
  );
  const todos = resultados.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  const vistos = new Set<string>();
  return todos.filter((i) => {
    if (!esRelevante(i)) return false;
    if (vistos.has(i.url)) return false;
    vistos.add(i.url);
    return true;
  });
}
