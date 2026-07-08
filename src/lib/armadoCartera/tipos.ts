import { InstrumentoRentaFija, Moneda } from "@/lib/types";
import { ActivoRV } from "@/data/rentaVariable";

export type ClaseCarteraCombinada = "rentaFija" | "rentaVariable";

/** Fila normalizada para el selector combinado — une el universo de Renta Fija y Renta
 * Variable en una forma común de visualización/búsqueda, sin perder la referencia al
 * objeto original (necesaria para los cálculos y el análisis por instrumento). */
export interface FilaSelector {
  ticker: string;
  nombre: string;
  clase: ClaseCarteraCombinada;
  categoriaLabel: string; // ej. "Soberanos ARS" o "Tecnología/Semiconductores"
  moneda: Moneda;
  precio: number | null;
  original: InstrumentoRentaFija | ActivoRV;
}

/** Línea de la cartera en armado — solo ticker/clase/peso, igual de liviana que
 * `LineaCartera` en la pantalla de Visión de Portafolio. */
export interface LineaCarteraCombinada {
  ticker: string;
  clase: ClaseCarteraCombinada;
  pct: number; // 0-100
}

/** Línea con todos los datos ya resueltos para mostrar en el panel y calcular el
 * calendario/análisis. */
export interface LineaCombinadaCalculada extends LineaCarteraCombinada {
  nombre: string;
  categoriaLabel: string;
  moneda: Moneda;
  precio: number | null;
  monto: number;
  /** Nominal aproximado a comprar (RF: nominal a valor par; RV: cantidad de acciones/CEDEARs). */
  nominalAprox: number | null;
  instrumentoRentaFija?: InstrumentoRentaFija;
  activoRentaVariable?: ActivoRV;
}
