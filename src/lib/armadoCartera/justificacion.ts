import { fmtFecha } from "@/lib/formato";
import { LineaCombinadaCalculada } from "./tipos";

/** Borrador de justificación a partir de los datos ya calculados del instrumento — el
 * asesor lo puede editar libremente en el textarea (ver AnalisisInstrumento.tsx); esto
 * es solo el punto de partida, no un texto fijo. */
export function justificacionAutogenerada(linea: LineaCombinadaCalculada): string {
  if (linea.clase === "rentaFija" && linea.instrumentoRentaFija) {
    const i = linea.instrumentoRentaFija;
    const partes: string[] = [];
    if (i.tna != null) partes.push(`TNA de ${(i.tna * 100).toFixed(1)}%`);
    if (i.duracionModificada != null) partes.push(`duración modificada de ${i.duracionModificada.toFixed(1)} años`);
    if (i.vencimiento) partes.push(`vencimiento ${fmtFecha(i.vencimiento)}`);
    const detalle = partes.length > 0 ? partes.join(", ") : "sin datos de tasa/duración cargados";
    return `${i.emisor} (${i.subcategoria}) — ${detalle}.`;
  }

  if (linea.clase === "rentaVariable" && linea.activoRentaVariable) {
    const a = linea.activoRentaVariable;
    const tendencia = a.precio > a.ma200 ? "tendencia alcista vs. MA200" : "tendencia bajista vs. MA200";
    const rsiNota = a.rsi > 70 ? "RSI en sobrecompra" : a.rsi < 30 ? "RSI en sobreventa" : `RSI neutral (${a.rsi})`;
    return `Score compuesto ${a.score}/10 (señal: ${a.señal}) — ${tendencia}, ${rsiNota}.`;
  }

  return "";
}
