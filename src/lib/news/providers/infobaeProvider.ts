import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * Infobae usa Arc Publishing (mismo CMS que otros medios grandes), que suele exponer feeds
 * de salida en `/arc/outboundfeeds/rss/category/...` — no confirmado en vivo desde este
 * entorno (sin salida de red hasta el deploy). Verificar antes de confiar en producción.
 */
const FEED_URL = "https://www.infobae.com/arc/outboundfeeds/rss/category/economia/?outputType=xml";

export async function obtenerInfobae(revalidateSeg: number): Promise<NoticiaItem[]> {
  try {
    return await traerFeedComoNoticias(FEED_URL, "infobae", "Infobae Economía", revalidateSeg);
  } catch {
    return [];
  }
}
