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

export type StatusDesvio = "optimo" | "aceptable" | "revisar";

/** Fila tal como viene de la hoja "Total" del Excel de seguimiento, una por comitente. */
export interface ClienteRaw {
  numero: number;
  denominacion: string;
  oficial: string;
  referente: string;
  manejo: string;
  aranceles: string;
  testInversor: string;
  tieneTenencia: boolean;
  fees2025: number | null;
  feesQ1_2026: number | null;
  feesQ2_2026: number | null;
  feesQ3_2026: number | null;
  feesQ4_2026: number | null;
  fees2026: number | null;
  /** % (0-1) por cada una de las 12 categorías de instrumento del Excel. */
  categorias: Record<string, number>;
  aumArs: number;
  aumPromUsd: number;
}

export interface AlertaConcentracion {
  categoria: string;
  pctCliente: number;
  limite: number;
}

export interface RecomendacionRebalanceo {
  bucket: Bucket;
  actualPct: number;
  modeloPct: number;
  desvioPP: number;
  accion: "vender" | "comprar";
  tickersSugeridos: string[];
}

export interface ClienteEnriquecido extends ClienteRaw {
  perfilGrupo: Perfil;
  /** true si no tenía Test del Inversor cargado y se le asignó un perfil por defecto. */
  perfilAsignadoPorDefault: boolean;
  bucketsCliente: Record<Bucket, number>;
  monedaComparacion: Moneda;
  desvio: number; // 0-1, tracking error normalizado vs. la cartera de su perfil
  statusSemaforo: StatusDesvio;
  aumUsd: number;
  alertasConcentracion: AlertaConcentracion[];
  recomendaciones: RecomendacionRebalanceo[];
}

export interface OficialResumen {
  oficial: string;
  cuentas: number;
  conTenencia: number;
  pctTenencia: number;
  aumUsd: number;
  pctAum: number;
  fees2025: number;
  feesQ1Q2: number;
}

export interface RevenueOficial {
  oficial: string;
  q1Usd: number;
  q2Usd: number;
  totalUsd: number;
  varQ2VsQ1: number | string;
}

export type CategoriaRentaFija = "Soberanos ARS" | "Soberanos USD" | "Corporativos USD";

/**
 * Instrumento de renta fija (seed manual, ver src/data/raw/rentaFija.json).
 * No todos los campos aplican a todas las subcategorías (ver src/lib/rentaFija.ts):
 * los campos ausentes en la fuente quedan en null en vez de omitirse, para que el
 * tipo sea uniforme en toda la tabla.
 */
export interface InstrumentoRentaFija {
  ticker: string;
  emisor: string;
  categoria: CategoriaRentaFija;
  subcategoria: string;
  moneda: Moneda;
  /** ISO yyyy-mm-dd. Null solo en Lecap/Boncap, que en el seed vienen con días a vencimiento en vez de fecha. */
  vencimiento: string | null;
  diasAVencimientoSeed: number | null;
  precioClean: number | null;
  precioDirty: number | null;
  tna: number | null;
  tea: number | null;
  duracionModificada: number | null;
  paridad: number | null;
  rendimientoCorriente: number | null;
  margen: number | null;
  tasaInteres: number | null;
  fuenteFecha: string;
}

export interface LineaRentaFija {
  ticker: string;
  nominal: number;
}

export interface FlujoPago {
  fecha: string; // ISO yyyy-mm-dd
  ticker: string;
  moneda: Moneda;
  tipo: "cupon" | "amortizacion";
  monto: number;
}

export interface PagoMensual {
  mes: string; // "yyyy-mm"
  porMoneda: Record<Moneda, number>;
}

export type Actualizacion = "tiempo-real" | "diaria" | "mensual" | "manual";
export type Confianza = "alta" | "media" | "baja";
export type FormatoIndicador = "moneda" | "porcentaje" | "numero" | "puntos";

/** Una fila del dashboard macro (ver src/lib/macro/). */
export interface Indicador {
  id: string;
  categoria: string; // agrupa en la misma "caja" que en el dashboard de referencia
  label: string;
  valor: number;
  formato: FormatoIndicador;
  moneda?: Moneda;
  /** Variaciones opcionales, cada sección usa las que correspondan (no todas aplican siempre). */
  var1d?: number | null;
  var7d?: number | null;
  var30d?: number | null;
  varYtd?: number | null;
  var1y?: number | null;
  fecha: string; // ISO yyyy-mm-dd del dato
  fuente: string;
  actualizacion: Actualizacion;
  confianza: Confianza;
  nota?: string;
}

export interface SeccionMacro {
  categoria: string;
  indicadores: Indicador[];
}
