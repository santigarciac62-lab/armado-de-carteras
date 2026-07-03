/** Paleta de categorías finas (las de la Visión), agrupadas visualmente por familia de bucket. */
export const CATEGORIA_COLOR: Record<string, string> = {
  "FCI MM": "#0B1F3F",
  "FCI MM USD": "#3A5686",
  "FCI Latam": "#6E8CB8",
  "Tasa Fija ARS": "#1B8E9C",
  "Bonos HD": "#59B4C0",
  "ON HD": "#C99C2E",
  Acciones: "#5B7A99",
  Cedears: "#8FB5D1",
};

export const BUCKET_COLOR: Record<string, string> = {
  FCI: "#0B1F3F",
  Soberanos: "#1B8E9C",
  ON: "#C99C2E",
  Acciones: "#5B7A99",
  Cedears: "#8FB5D1",
  Otros: "#8A95A7",
};

export function colorDeCategoria(categoria: string): string {
  return CATEGORIA_COLOR[categoria] ?? "#8A95A7";
}
