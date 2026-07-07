import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * Yahoo Finance dejó de mantener sus feeds RSS de sección hace varios años (los endpoints
 * históricos de "Top Stories"/"Markets" no tienen garantía de seguir activos) — no se pudo
 * confirmar en vivo desde este entorno (sin salida de red). Si el feed no responde o cambió
 * de formato, esto cae al fallback (lista vacía) sin romper el resto de la pantalla.
 */
const FEED_URL = "https://finance.yahoo.com/news/rssindex";

export async function obtenerYahoo(revalidateSeg: number): Promise<NoticiaItem[]> {
  try {
    return await traerFeedComoNoticias(FEED_URL, "yahoo", "Yahoo Finance", revalidateSeg);
  } catch {
    return [];
  }
}
