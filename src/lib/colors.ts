/** Paleta de categorías finas (las de la Visión), agrupadas visualmente por familia de bucket.
 * Derivada de la paleta de marca D.A Valores (navy/teal/blue/gray + variantes). */
export const CATEGORIA_COLOR: Record<string, string> = {
  "FCI MM": "#12375F",
  "FCI MM USD": "#00012B",
  "FCI Latam": "#4A6E9B",
  "Tasa Fija ARS": "#0097B2",
  "Bonos HD": "#4FB8C9",
  "ON HD": "#1362AD",
  Acciones: "#616161",
  Cedears: "#A6A6A6",
};

export const BUCKET_COLOR: Record<string, string> = {
  FCI: "#12375F",
  Soberanos: "#0097B2",
  ON: "#1362AD",
  Acciones: "#616161",
  Cedears: "#00012B",
  Otros: "#9A9A9A",
};

export function colorDeCategoria(categoria: string): string {
  return CATEGORIA_COLOR[categoria] ?? "#9A9A9A";
}
