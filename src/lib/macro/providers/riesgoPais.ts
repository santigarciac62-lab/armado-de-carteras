import { Indicador } from "@/lib/types";
import { fetchConTimeout } from "../fetchHelpers";

/**
 * ArgentinaDatos — gratuita, sin key.
 * https://argentinadatos.com/docs/operations/get-finanzas-indices-riesgo-pais-ultimo.html
 * Forma de respuesta asumida (no verificada en vivo): { fecha, valor }.
 */
export async function obtenerRiesgoPais(seed: Indicador[]): Promise<Indicador[]> {
  try {
    const res = await fetchConTimeout("https://argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo");
    if (!res.ok) return seed;
    const data = (await res.json()) as { fecha?: string; valor?: number };
    if (typeof data.valor !== "number") return seed;
    return seed.map((ind) =>
      ind.id === "riesgo-pais" ? { ...ind, valor: data.valor as number, fecha: data.fecha ?? ind.fecha } : ind
    );
  } catch {
    return seed;
  }
}
