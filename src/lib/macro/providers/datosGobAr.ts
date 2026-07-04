import { Indicador } from "@/lib/types";
import { fetchConTimeout } from "../fetchHelpers";

/**
 * API de Series de Tiempo de datos.gob.ar (INDEC), gratuita y sin key:
 * https://series-tiempo-ar-api.readthedocs.io/es/latest/
 *
 * IMPORTANTE: no pudimos verificar en vivo los IDs exactos de cada serie
 * (IPC nivel general, EMAE, PBI) desde este entorno — el catálogo cambia
 * con las bases/empalmes de INDEC y usar un ID adivinado podría mostrar
 * silenciosamente un número que no es el correcto. Por eso cada serie solo
 * se busca si su ID viene configurado por variable de entorno; si no está
 * seteada, se usa el valor semilla. Ver README para cómo encontrar el ID
 * real en https://datos.gob.ar/series/api/series/.
 */
const SERIE_ENV_POR_ID: Record<string, string | undefined> = {
  "inflacion-mensual": process.env.DATOS_GOB_AR_IPC_MENSUAL_ID,
  "inflacion-interanual": process.env.DATOS_GOB_AR_IPC_INTERANUAL_ID,
  "actividad-emae": process.env.DATOS_GOB_AR_EMAE_ID,
  "actividad-pbi-interanual": process.env.DATOS_GOB_AR_PBI_INTERANUAL_ID,
};

async function obtenerUltimoValor(serieId: string): Promise<{ valor: number; fecha: string } | null> {
  const url = `https://apis.datos.gob.ar/series/api/series/?ids=${serieId}&limit=1&sort=desc&format=json`;
  try {
    const res = await fetchConTimeout(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { data?: [string, number][] };
    const fila = data.data?.[0];
    if (!fila) return null;
    return { fecha: fila[0], valor: fila[1] };
  } catch {
    return null;
  }
}

export async function obtenerInflacionActividad(seed: Indicador[]): Promise<Indicador[]> {
  const entradas = Object.entries(SERIE_ENV_POR_ID).filter((e): e is [string, string] => Boolean(e[1]));
  if (entradas.length === 0) return seed;

  const actualizaciones = await Promise.all(
    entradas.map(async ([id, serieId]) => {
      const dato = await obtenerUltimoValor(serieId);
      return dato ? { id, ...dato } : null;
    })
  );
  const porId = new Map(actualizaciones.filter((a): a is NonNullable<typeof a> => a !== null).map((a) => [a.id, a]));

  return seed.map((ind) => {
    const act = porId.get(ind.id);
    return act ? { ...ind, valor: act.valor, fecha: act.fecha } : ind;
  });
}
