import { NoticiaItem } from "../types";

/**
 * DECISIÓN DEL EQUIPO: reuters.com discontinuó sus feeds RSS públicos (~2020) y bloquea
 * agresivamente el scraping (paywall + detección de bots, Cloudflare). Para un uso comercial
 * interno, hacer scraping de HTML de este dominio es un riesgo de ToS/legal real que se
 * decidió no asumir — ver conversación del 2026-07. Esta fuente NUNCA intenta traer datos en
 * vivo; queda marcada "sin fuente confiable disponible" (confianza "baja") en la pantalla,
 * igual que las secciones de carga manual en Dashboard Financiero.
 */
export async function obtenerReuters(): Promise<NoticiaItem[]> {
  return [];
}
