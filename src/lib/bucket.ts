import { Bucket, StatusDesvio } from "@/lib/types";

export const BUCKETS: Bucket[] = ["FCI", "Soberanos", "ON", "Acciones", "Cedears", "Otros"];

/** Tracking error normalizado entre dos composiciones por bucket (0-1): ∑|actual-modelo| / 2.
 * Usado tanto para el desvío de clientes reales (Cuentas con desvío) como para la
 * cartera que se está armando en la Pantalla 1, para que el criterio sea el mismo
 * en toda la app. */
export function trackingError(actual: Record<Bucket, number>, modelo: Record<Bucket, number>): number {
  let suma = 0;
  for (const b of BUCKETS) {
    suma += Math.abs((actual[b] ?? 0) - (modelo[b] ?? 0));
  }
  return suma / 2;
}

/** Mismos cortes de semáforo que en Cuentas con desvío: <15% óptimo, 15-30% aceptable, resto revisar. */
export function statusDesvio(desvio: number): StatusDesvio {
  if (desvio < 0.15) return "optimo";
  if (desvio < 0.3) return "aceptable";
  return "revisar";
}
