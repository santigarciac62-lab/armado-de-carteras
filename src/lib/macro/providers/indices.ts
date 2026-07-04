import { Indicador } from "@/lib/types";
import { actualizarConStooq } from "./stooqComun";

/**
 * Stooq.com — CSV gratis, sin key, sin registro. https://stooq.com/q/d/l/?s=SIMBOLO&i=d
 * No documentado oficialmente (es un servicio de terceros), pero ampliamente
 * usado y estable. Símbolos no verificados en vivo desde este entorno (red
 * bloqueada) — confirmar contra una respuesta real antes de producción.
 */
const SIMBOLO_POR_ID: Record<string, string> = {
  "indice-sp500": "^spx",
  "indice-dowjones": "^dji",
  "indice-nasdaq": "^ndq",
  "indice-russell3000": "^rua",
  "merval-ccl": "^merv",
};

export async function obtenerIndices(seed: Indicador[]): Promise<Indicador[]> {
  return actualizarConStooq(seed, SIMBOLO_POR_ID);
}
