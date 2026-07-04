import { Indicador, SeccionMacro } from "@/lib/types";
import { MACRO_SEED } from "@/data/raw/macroSeed";
import { obtenerDolares } from "./providers/dolares";
import { obtenerRiesgoPais } from "./providers/riesgoPais";
import { obtenerIndices } from "./providers/indices";
import { obtenerCommodities } from "./providers/commodities";
import { obtenerTasasEeuu } from "./providers/tasasEeuu";
import { obtenerInflacionActividad } from "./providers/datosGobAr";
import { obtenerBcra } from "./providers/bcra";
import { obtenerFiscal } from "./providers/fiscal";

const ORDEN_CATEGORIAS = [
  "Tasas de Interés",
  "Dólares Financieros",
  "Banco Central",
  "Merval en CCL",
  "Índices",
  "Vencimientos en USD en 2026",
  "Riesgo País",
  "Inflación",
  "Futuros Dólar",
  "Actividad",
  "Resultado fiscal",
  "Commodities",
  "Indicadores clima político",
  "Riesgo EEUU",
];

/**
 * Corre todos los conectores en paralelo contra la semilla original (cada
 * uno maneja su propio fallback si la fuente externa falla o no está
 * configurada). Cada conector solo devuelve un objeto nuevo para los ids que
 * efectivamente actualizó — el resto los deja con la MISMA referencia que
 * recibió — así se puede fusionar por igualdad de referencia sin que se
 * pisen entre sí.
 */
export async function obtenerIndicadoresMacro(): Promise<SeccionMacro[]> {
  const resultados = await Promise.all([
    obtenerDolares(MACRO_SEED),
    obtenerRiesgoPais(MACRO_SEED),
    obtenerIndices(MACRO_SEED),
    obtenerCommodities(MACRO_SEED),
    obtenerTasasEeuu(MACRO_SEED),
    obtenerInflacionActividad(MACRO_SEED),
    obtenerBcra(MACRO_SEED),
    obtenerFiscal(MACRO_SEED),
  ]);

  const indicadores: Indicador[] = MACRO_SEED.map((base, i) => {
    for (const resultado of resultados) {
      if (resultado[i] !== base) return resultado[i];
    }
    return base;
  });

  const porCategoria = new Map<string, Indicador[]>();
  for (const ind of indicadores) {
    porCategoria.set(ind.categoria, [...(porCategoria.get(ind.categoria) ?? []), ind]);
  }

  return ORDEN_CATEGORIAS.filter((c) => porCategoria.has(c)).map((categoria) => ({
    categoria,
    indicadores: porCategoria.get(categoria)!,
  }));
}
