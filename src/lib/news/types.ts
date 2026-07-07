/** Dominio de la pantalla "Noticias" — ver src/lib/news/aggregator.ts. */

export type FuenteId =
  | "bloomberg"
  | "yahoo"
  | "nyt"
  | "reuters"
  | "ambito"
  | "infobae"
  | "cronista"
  | "bloomberglinea";

export type Columna = "global" | "argentina";

export interface NoticiaItem {
  id: string;
  titulo: string;
  resumen?: string;
  url: string;
  fuenteId: FuenteId;
  fuenteLabel: string;
  publicadoEn: string; // ISO
}

/** "alta": RSS oficial confirmado (NYT). "media": RSS intentado pero sin verificar en vivo
 * desde este entorno (sin salida de red hasta el deploy). "baja": sin fuente confiable
 * disponible — no se intenta scraping (ver docstring de bloomberg/reutersProvider). */
export type ConfianzaFuente = "alta" | "media" | "baja";

export interface ResultadoFuente {
  fuenteId: FuenteId;
  fuenteLabel: string;
  columna: Columna;
  confianza: ConfianzaFuente;
  items: NoticiaItem[];
  /** true si esta corrida no pudo traer datos en vivo y se muestra vacía (no se inventan
   * titulares falsos como fallback — ver noticiasSeed.ts). */
  sinDatos: boolean;
}

export interface NoticiaRelevante extends NoticiaItem {
  score: number;
  /** Todo item de Relevantes viene del pool de Global/Argentina (no es una 9na fuente
   * aparte) — se muestra igual en su columna de origen, marcado acá para que quede claro
   * que es cross-post, no contenido exclusivo. */
  columnaOrigen: Columna;
}

export interface NoticiasResultado {
  global: ResultadoFuente[];
  argentina: ResultadoFuente[];
  relevantes: NoticiaRelevante[];
  actualizadoEn: string;
}
