import { fetchConTimeout } from "@/lib/macro/fetchHelpers";
import { parsearRss } from "./rss";
import { FuenteId, NoticiaItem } from "./types";

function idDesdeUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

/** Trae y parsea un feed RSS/Atom, devolviendo NoticiaItem[] ya con fuenteId/fuenteLabel.
 * Cachea `revalidateSeg` de este lado (además del caché propio del medio) para no golpear
 * la fuente en cada visita a la pantalla — ver REVALIDATE_SEG en aggregator.ts. */
export async function traerFeedComoNoticias(
  url: string,
  fuenteId: FuenteId,
  fuenteLabel: string,
  revalidateSeg: number,
  limite = 8
): Promise<NoticiaItem[]> {
  const res = await fetchConTimeout(url, 8000, { next: { revalidate: revalidateSeg } });
  if (!res.ok) throw new Error(`${fuenteId} respondió ${res.status}`);
  const xml = await res.text();
  const items = parsearRss(xml, limite);
  return items.map((i) => ({
    id: idDesdeUrl(i.url),
    titulo: i.titulo,
    resumen: i.resumen,
    url: i.url,
    fuenteId,
    fuenteLabel,
    publicadoEn: i.publicadoEn,
  }));
}
