import { Indicador } from "@/lib/types";
import { fetchConTimeout } from "../fetchHelpers";

/**
 * FRED (Federal Reserve Economic Data) — API REST gratuita, requiere API key
 * gratuita instantánea: https://fred.stlouisfed.org/docs/api/fred/
 * Series: DFF (Fed Funds Effective Rate, diaria), DGS5 / DGS10 (Treasury 5/10 años).
 * Se activa solo si está seteado FRED_API_KEY (env var); si no, se usa la semilla.
 */
const SERIE_POR_ID: Record<string, string> = {
  "eeuu-fed": "DFF",
  "eeuu-5y": "DGS5",
  "eeuu-10y": "DGS10",
};

interface ObservacionFred {
  date: string;
  value: string; // FRED devuelve "." para días sin dato
}

async function obtenerSerie(serieId: string, apiKey: string): Promise<ObservacionFred[] | null> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${serieId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=30`;
  try {
    const res = await fetchConTimeout(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { observations?: ObservacionFred[] };
    return data.observations ?? null;
  } catch {
    return null;
  }
}

export async function obtenerTasasEeuu(seed: Indicador[]): Promise<Indicador[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return seed;

  const actualizaciones = await Promise.all(
    Object.entries(SERIE_POR_ID).map(async ([id, serieId]) => {
      const obs = await obtenerSerie(serieId, apiKey);
      if (!obs) return null;
      const validas = obs.filter((o) => o.value !== ".");
      if (validas.length === 0) return null;
      const ultimo = parseFloat(validas[0].value);
      const promedioMensual = validas.slice(0, 30).reduce((a, o) => a + parseFloat(o.value), 0) / Math.min(30, validas.length);
      return { id, valor: ultimo, fecha: validas[0].date, var30d: promedioMensual };
    })
  );

  const porId = new Map(actualizaciones.filter((a): a is NonNullable<typeof a> => a !== null).map((a) => [a.id, a]));

  return seed.map((ind) => {
    const act = porId.get(ind.id);
    return act ? { ...ind, valor: act.valor, fecha: act.fecha, var30d: act.var30d } : ind;
  });
}
