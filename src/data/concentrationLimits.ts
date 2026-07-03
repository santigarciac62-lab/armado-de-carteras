import limitesRaw from "./raw/concentrationLimits.json";

/**
 * Límites de concentración máxima por categoría de instrumento, tal como
 * figuran en la hoja "Cartera Modelo" del Excel de seguimiento. A diferencia
 * de las carteras modelo de la Visión (ver modelPortfolios.ts), esto no es
 * una ponderación objetivo por perfil: es un único techo por categoría, que
 * usamos como alerta de concentración excesiva independiente del desvío por
 * perfil (ver decisión registrada en la conversación con la mesa).
 */
export const LIMITES_CONCENTRACION: Record<string, number> = limitesRaw;
