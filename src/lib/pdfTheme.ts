/** Espejo en hex de los tokens de marca de globals.css, para usar en documentos @react-pdf/renderer
 * (no soporta CSS custom properties). Si se retocan los colores de marca, actualizar ambos lugares. */
export const PDF_COLOR = {
  navy: "#12375F",
  navyDeep: "#00012B",
  teal: "#0097B2",
  blue: "#1362AD",
  slate: "#616161",
  slateLight: "#C8C8C8",
  bg: "#F4F5F7",
  border: "#E3E5E8",
  text: "#14181D",
  textSoft: "#616161",
  textMute: "#8D8D8D",
  green: "#047857",
  greenBg: "#E8F5F0",
  amber: "#B45309",
  amberBg: "#FBF0DF",
  red: "#B91C1C",
  redBg: "#FBE9E9",
};

export const PDF_BUCKET_COLOR: Record<string, string> = {
  FCI: PDF_COLOR.navy,
  Soberanos: PDF_COLOR.teal,
  ON: PDF_COLOR.blue,
  Acciones: PDF_COLOR.slate,
  Cedears: PDF_COLOR.navyDeep,
  Otros: "#9A9A9A",
};
