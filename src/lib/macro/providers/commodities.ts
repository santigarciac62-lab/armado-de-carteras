import { Indicador } from "@/lib/types";
import { actualizarConStooq } from "./stooqComun";

/** Ver nota de confianza en indices.ts. La soja tiene cobertura floja/discontinua en Stooq. */
const SIMBOLO_POR_ID: Record<string, string> = {
  "commodity-oro": "xauusd",
  "commodity-wti": "cl.f",
  "commodity-cobre": "hg.f",
  "commodity-soja": "s.f",
};

export async function obtenerCommodities(seed: Indicador[]): Promise<Indicador[]> {
  return actualizarConStooq(seed, SIMBOLO_POR_ID);
}
