import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * Bloomberg Línea (sitio de Bloomberg Línea Latinoamérica, distinto de bloomberg.com) también
 * corre sobre Arc Publishing — mismo patrón de outbound feed que Infobae. No confirmado en
 * vivo desde este entorno (sin salida de red hasta el deploy). Verificar antes de confiar en
 * producción. Importante: esto NO es bloomberg.com (ver bloombergProvider.ts, sin scraping).
 */
const FEED_URL =
  "https://www.bloomberglinea.com/arc/outboundfeeds/rss/category/latinoamerica/argentina/?outputType=xml";

export async function obtenerBloombergLinea(revalidateSeg: number): Promise<NoticiaItem[]> {
  try {
    return await traerFeedComoNoticias(FEED_URL, "bloomberglinea", "Bloomberg Línea Argentina", revalidateSeg);
  } catch {
    return [];
  }
}
