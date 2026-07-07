import { Columna, ConfianzaFuente, FuenteId, NoticiaItem, NoticiasResultado, ResultadoFuente } from "./types";
import { construirRelevantes } from "./classifier";
import { obtenerNyt } from "./providers/nytProvider";
import { obtenerYahoo } from "./providers/yahooProvider";
import { obtenerBloomberg } from "./providers/bloombergProvider";
import { obtenerReuters } from "./providers/reutersProvider";
import { obtenerAmbito } from "./providers/ambitoProvider";
import { obtenerInfobae } from "./providers/infobaeProvider";
import { obtenerCronista } from "./providers/cronistaProvider";
import { obtenerBloombergLinea } from "./providers/bloomberglineaProvider";

/** 15 minutos — cachea el fetch de cada fuente de este lado (ver `next.revalidate` en
 * providerHelpers.ts) para no golpearlas en cada visita a la pantalla. */
export const REVALIDATE_SEG = 900;

interface DescriptorFuente {
  fuenteId: FuenteId;
  fuenteLabel: string;
  columna: Columna;
  confianza: ConfianzaFuente;
  fetch: () => Promise<NoticiaItem[]>;
}

const FUENTES: DescriptorFuente[] = [
  { fuenteId: "bloomberg", fuenteLabel: "Bloomberg Latinoamérica", columna: "global", confianza: "baja", fetch: obtenerBloomberg },
  { fuenteId: "yahoo", fuenteLabel: "Yahoo Finance", columna: "global", confianza: "media", fetch: () => obtenerYahoo(REVALIDATE_SEG) },
  { fuenteId: "nyt", fuenteLabel: "NYT International", columna: "global", confianza: "alta", fetch: () => obtenerNyt(REVALIDATE_SEG) },
  { fuenteId: "reuters", fuenteLabel: "Reuters Markets", columna: "global", confianza: "baja", fetch: obtenerReuters },
  { fuenteId: "ambito", fuenteLabel: "Ámbito Financiero", columna: "argentina", confianza: "media", fetch: () => obtenerAmbito(REVALIDATE_SEG) },
  { fuenteId: "infobae", fuenteLabel: "Infobae Economía", columna: "argentina", confianza: "media", fetch: () => obtenerInfobae(REVALIDATE_SEG) },
  { fuenteId: "cronista", fuenteLabel: "El Cronista", columna: "argentina", confianza: "media", fetch: () => obtenerCronista(REVALIDATE_SEG) },
  {
    fuenteId: "bloomberglinea",
    fuenteLabel: "Bloomberg Línea Argentina",
    columna: "argentina",
    confianza: "media",
    fetch: () => obtenerBloombergLinea(REVALIDATE_SEG),
  },
];

/** Corre las 8 fuentes en paralelo (cada una maneja su propio fallback — nunca revienta al
 * resto si una falla, gracias a Promise.allSettled) y arma las 3 columnas de la pantalla. */
export async function obtenerNoticias(): Promise<NoticiasResultado> {
  const resultados = await Promise.allSettled(FUENTES.map((f) => f.fetch()));

  const porFuente: ResultadoFuente[] = FUENTES.map((f, i) => {
    const r = resultados[i];
    const items = r.status === "fulfilled" ? r.value : [];
    return {
      fuenteId: f.fuenteId,
      fuenteLabel: f.fuenteLabel,
      columna: f.columna,
      confianza: f.confianza,
      items,
      sinDatos: items.length === 0,
    };
  });

  const global = porFuente.filter((f) => f.columna === "global");
  const argentina = porFuente.filter((f) => f.columna === "argentina");

  const relevantes = construirRelevantes([
    { columna: "global", items: global.flatMap((f) => f.items) },
    { columna: "argentina", items: argentina.flatMap((f) => f.items) },
  ]);

  return { global, argentina, relevantes, actualizadoEn: new Date().toISOString() };
}
