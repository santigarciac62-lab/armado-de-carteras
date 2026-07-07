import { traerFeedComoNoticias } from "../providerHelpers";
import { NoticiaItem } from "../types";

/**
 * URL de RSS no confirmada en vivo desde este entorno (sin salida de red hasta el deploy) —
 * es la ruta convencional que suelen publicar los portales argentinos de este tipo de CMS,
 * pero antes de confiar en producción conviene verificar que responda 200 con contenido XML.
 */
const FEED_URL = "https://www.ambito.com/rss/economia.xml";

export async function obtenerAmbito(revalidateSeg: number): Promise<NoticiaItem[]> {
  try {
    return await traerFeedComoNoticias(FEED_URL, "ambito", "Ámbito Financiero", revalidateSeg);
  } catch {
    return [];
  }
}
