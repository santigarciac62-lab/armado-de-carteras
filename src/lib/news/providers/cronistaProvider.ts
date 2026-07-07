import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * URL de RSS no confirmada en vivo desde este entorno (sin salida de red hasta el deploy) —
 * ruta convencional para este tipo de portal. Verificar antes de confiar en producción.
 */
const FEED_URL = "https://www.cronista.com/rss/economia-politica.xml";

export async function obtenerCronista(revalidateSeg: number): Promise<NoticiaItem[]> {
  try {
    return await traerFeedComoNoticias(FEED_URL, "cronista", "El Cronista", revalidateSeg);
  } catch {
    return [];
  }
}
