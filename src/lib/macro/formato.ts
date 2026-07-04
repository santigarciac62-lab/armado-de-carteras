import { Indicador } from "@/lib/types";

/** A diferencia de src/lib/formato.ts (que trabaja con fracciones 0-1), acá
 * `valor` ya viene en la unidad de display (ej. 20.85 = "20,85%"). */
export function formatIndicadorValor(ind: Indicador): string {
  switch (ind.formato) {
    case "moneda": {
      const simbolo = ind.moneda === "USD" ? "USD " : "$";
      const decimales = Math.abs(ind.valor) >= 1000 ? 0 : 2;
      return `${simbolo}${ind.valor.toLocaleString("es-AR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
    }
    case "porcentaje":
      return `${ind.valor.toFixed(2)}%`;
    case "numero":
    case "puntos":
    default:
      return ind.valor.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
}

export function formatVariacion(v: number | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  const signo = v > 0 ? "+" : "";
  return `${signo}${v.toFixed(2)}%`;
}
