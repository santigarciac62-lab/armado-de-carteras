import { Indicador } from "@/lib/types";
import { fetchConTimeout, parseStooqCsv, variacionPct } from "../fetchHelpers";

async function obtenerSerieAnual(simbolo: string): Promise<{ fecha: string; close: number }[] | null> {
  const anio = new Date().getFullYear();
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(simbolo)}&d1=${anio}0101&d2=${anio}1231&i=d`;
  try {
    const res = await fetchConTimeout(url);
    if (!res.ok) return null;
    const csv = await res.text();
    if (csv.startsWith("<") || csv.toLowerCase().includes("exceeded")) return null;
    const filas = parseStooqCsv(csv);
    return filas.length > 0 ? filas : null;
  } catch {
    return null;
  }
}

/** Actualiza, contra Stooq, los indicadores cuyo id figure en `simboloPorId`. Deja el resto (y cualquiera que falle) tal cual venía. */
export async function actualizarConStooq(seed: Indicador[], simboloPorId: Record<string, string>): Promise<Indicador[]> {
  const actualizaciones = await Promise.all(
    Object.entries(simboloPorId).map(async ([id, simbolo]) => {
      const serie = await obtenerSerieAnual(simbolo);
      if (!serie || serie.length === 0) return null;
      const ultimo = serie[serie.length - 1];
      const anterior = serie.length > 1 ? serie[serie.length - 2] : null;
      const primero = serie[0];
      return {
        id,
        valor: ultimo.close,
        fecha: ultimo.fecha,
        var1d: anterior ? variacionPct(ultimo.close, anterior.close) : null,
        varYtd: variacionPct(ultimo.close, primero.close),
      };
    })
  );

  const porId = new Map(actualizaciones.filter((a): a is NonNullable<typeof a> => a !== null).map((a) => [a.id, a]));

  return seed.map((ind) => {
    const act = porId.get(ind.id);
    if (!act) return ind;
    return { ...ind, valor: act.valor, fecha: act.fecha, var1d: act.var1d ?? ind.var1d, varYtd: act.varYtd ?? ind.varYtd };
  });
}
