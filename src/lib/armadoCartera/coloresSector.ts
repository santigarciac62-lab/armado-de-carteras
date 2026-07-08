/** Paleta categórica para el gráfico de composición por sector/categoría de la cartera
 * combinada. Orden fijo (nunca ciclado) — validada con el validador de paletas del
 * design system (CVD-safe, banda de luminosidad/croma, contraste >= 3:1 sobre
 * fondo de tarjeta #F6F7F8). Las dos primeras reusan los colores de marca ya
 * existentes (teal, blue); las siguientes son hues nuevas agregadas solo para
 * dar identidad a más categorías sin repetir tonos.
 */
const PALETA_SECTOR = ["#0097B2", "#1362AD", "#6D28D9", "#C0447E", "#7A8C00"];

/** Gris neutro para el balde "Otros" — nunca se genera un 6to hue nuevo, las
 * categorías más chicas se agrupan ahí en vez de reciclar/inventar colores. */
const COLOR_OTROS = "#9A9A9A";

export const ETIQUETA_OTROS = "Otros";

export interface SegmentoComposicion {
  categoria: string;
  pct: number;
  color: string;
}

/** Arma los segmentos de un gráfico de composición: hasta 5 categorías con más
 * peso quedan con su propio color fijo, el resto se agrupa en "Otros". */
export function segmentosComposicion(pctPorCategoria: Map<string, number>): SegmentoComposicion[] {
  const ordenadas = [...pctPorCategoria.entries()]
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1]);

  const principales = ordenadas.slice(0, PALETA_SECTOR.length);
  const resto = ordenadas.slice(PALETA_SECTOR.length);

  const segmentos: SegmentoComposicion[] = principales.map(([categoria, pct], i) => ({
    categoria,
    pct,
    color: PALETA_SECTOR[i],
  }));

  const pctResto = resto.reduce((acc, [, pct]) => acc + pct, 0);
  if (pctResto > 0) {
    segmentos.push({ categoria: ETIQUETA_OTROS, pct: pctResto, color: COLOR_OTROS });
  }

  return segmentos;
}
