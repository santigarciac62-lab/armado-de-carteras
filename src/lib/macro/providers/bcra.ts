import { Indicador } from "@/lib/types";
import { fetchConTimeout } from "../fetchHelpers";

/**
 * API "Principales Variables" del BCRA v3.0 (gratuita, sin key):
 * https://www.bcra.gob.ar/en/central-bank-api-catalog/
 * `GET /estadisticas/v3.0/monetarias` devuelve TODAS las variables vigentes
 * en una sola respuesta, cada una con su descripción en texto libre — por
 * eso acá se matchea por palabras clave de la descripción en vez de por un
 * ID numérico (los IDs no se pudieron verificar desde este entorno, con
 * bloqueo de red; el texto de la descripción es más estable). Si el
 * catálogo cambia el texto exacto, el match simplemente no encuentra nada
 * y esa fila se queda con el valor semilla — no hay riesgo de mostrar un
 * número equivocado, en el peor caso queda desactualizado.
 */
interface VariableBcra {
  idVariable: number;
  descripcion: string;
  fecha: string;
  valor: number;
}

const KEYWORDS_POR_ID: Record<string, string[]> = {
  "tasa-call-ars": ["call en pesos"],
  "tasa-tamar": ["tamar"],
  "tasa-caucion-ars": ["caución en pesos", "caucion en pesos"],
  "bcra-base-monetaria": ["base monetaria"],
  "bcra-reservas-brutas": ["reservas internacionales"],
  "dolar-tcrm": ["tipo de cambio real multilateral", "itcrm"],
};

export async function obtenerBcra(seed: Indicador[]): Promise<Indicador[]> {
  try {
    const res = await fetchConTimeout("https://api.bcra.gob.ar/estadisticas/v3.0/monetarias");
    if (!res.ok) return seed;
    const body = (await res.json()) as { results?: VariableBcra[] };
    const variables = body.results ?? [];
    if (variables.length === 0) return seed;

    return seed.map((ind) => {
      const keywords = KEYWORDS_POR_ID[ind.id];
      if (!keywords) return ind;
      const match = variables.find((v) =>
        keywords.some((k) => v.descripcion.toLowerCase().includes(k.toLowerCase()))
      );
      return match ? { ...ind, valor: match.valor, fecha: match.fecha } : ind;
    });
  } catch {
    return seed;
  }
}
