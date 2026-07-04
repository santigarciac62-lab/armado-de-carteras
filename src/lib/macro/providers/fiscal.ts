import { Indicador } from "@/lib/types";

/**
 * Resultado fiscal (primario/financiero mensual, % del PBI).
 *
 * La mejor pista gratuita encontrada es la API de Presupuesto Abierto
 * (https://www.presupuestoabierto.gob.ar/api/), pero no se pudo confirmar
 * si expone el resultado primario/financiero mensual como serie lista para
 * consumir o solo ejecución presupuestaria detallada — habría que inspeccionar
 * el endpoint real antes de escribir el fetch, para no adivinar una
 * estructura de respuesta y terminar mostrando un número mal interpretado.
 *
 * Por ahora esta sección queda 100% en el valor semilla (carga manual /
 * a completar una vez confirmado el endpoint). El resto del dashboard no
 * depende de esto.
 */
export async function obtenerFiscal(seed: Indicador[]): Promise<Indicador[]> {
  return seed;
}
