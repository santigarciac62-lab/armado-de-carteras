export type Perfil = "conservador" | "moderado" | "agresivo";
export type Moneda = "ARS" | "USD";

/** Bucket neutral usado para comparar categorías finas de la Visión contra
 * las categorías más gruesas que trae el export de tenencias (Excel). */
export type Bucket = "FCI" | "Soberanos" | "ON" | "Acciones" | "Cedears" | "Otros";

export interface Activo {
  ticker: string;
  categoria: string;
  pct: number;
}

export interface CarteraModelo {
  id: string; // `${perfil}_${moneda}` en minúsculas, ej "conservador_ars"
  perfil: Perfil;
  perfilLabel: string;
  moneda: Moneda;
  riesgo: string;
  liquidez: string;
  horizonte: string;
  estrategia: string;
  composicion: Record<string, number>;
  activos: Activo[];
  buckets: Record<Bucket, number>;
}

/** Instrumento del universo recomendado, con metadata para la pantalla de armado. */
export interface Instrumento {
  ticker: string;
  nombre: string;
  categoria: string;
  bucket: Bucket;
  moneda: Moneda;
  claseActivo: "FCI" | "Bono" | "ON" | "Accion" | "Cedear" | "LetraTasaFija";
  /** En qué carteras modelo aparece y con qué ponderación sugerida */
  presenteEn: { carteraId: string; pct: number }[];
}

export interface Cotizacion {
  ticker: string;
  ultimo: number;
  variacionPct: number;
  moneda: Moneda;
  fuente: "data912" | "cafci" | "manual" | "mock";
  actualizadoEn: string; // ISO timestamp
  esEOD: boolean; // true para FCI (valor de cuotaparte de cierre del día hábil anterior)
}

export interface LineaCartera {
  ticker: string;
  pct: number; // 0-100
}
