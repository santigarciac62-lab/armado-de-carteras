import { XMLParser } from "fast-xml-parser";

export interface ItemRSS {
  titulo: string;
  resumen?: string;
  url: string;
  publicadoEn: string; // ISO — si la fuente no trae fecha parseable, se usa la hora actual
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function limpiarTexto(v: unknown): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function aArray<T>(v: T | T[] | undefined | null): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function parsearFecha(v: unknown): string {
  if (typeof v === "string") {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

interface NodoXml {
  [clave: string]: unknown;
}

/** Parser defensivo de RSS 2.0 (<channel><item>) y Atom (<feed><entry>) — cubre los dos
 * formatos que suelen publicar los medios; si la estructura no matchea ninguno, devuelve []
 * (no revienta) para que el proveedor caiga a su fallback. Nunca extrae el cuerpo completo
 * del artículo, solo título/resumen corto/link/fecha. */
export function parsearRss(xml: string, limite = 12): ItemRSS[] {
  let doc: NodoXml;
  try {
    doc = parser.parse(xml);
  } catch {
    return [];
  }

  const canal = (doc?.rss as NodoXml | undefined)?.channel as NodoXml | undefined;
  if (canal) {
    return aArray(canal.item as NodoXml | NodoXml[])
      .slice(0, limite)
      .map((item) => ({
        titulo: limpiarTexto(item.title),
        resumen: limpiarTexto(item.description ?? item["content:encoded"]) || undefined,
        url: typeof item.link === "string" ? item.link : ((item.link as NodoXml)?.["@_href"] as string) ?? "",
        publicadoEn: parsearFecha(item.pubDate ?? item["dc:date"]),
      }))
      .filter((i) => i.titulo && i.url);
  }

  const feed = doc?.feed as NodoXml | undefined;
  if (feed) {
    return aArray(feed.entry as NodoXml | NodoXml[])
      .slice(0, limite)
      .map((entry) => {
        const linkRaw = entry.link;
        let url = "";
        if (typeof linkRaw === "string") url = linkRaw;
        else if (Array.isArray(linkRaw)) {
          const arr = linkRaw as NodoXml[];
          url = (arr.find((l) => l["@_rel"] !== "self")?.["@_href"] as string) ?? (arr[0]?.["@_href"] as string) ?? "";
        } else if (linkRaw && typeof linkRaw === "object") {
          url = ((linkRaw as NodoXml)["@_href"] as string) ?? "";
        }
        return {
          titulo: limpiarTexto(entry.title),
          resumen: limpiarTexto(entry.summary ?? entry.content) || undefined,
          url,
          publicadoEn: parsearFecha(entry.updated ?? entry.published),
        };
      })
      .filter((i) => i.titulo && i.url);
  }

  return [];
}
