import {
  FlujoPago,
  InstrumentoRentaFija,
  LineaRentaFija,
  Moneda,
  PagoMensual,
} from "@/lib/types";
import { FECHA_SEED_RENTA_FIJA } from "@/data/rentaFija";

/**
 * Proyección SIMPLIFICADA de flujo de fondos: se asume estructura bullet
 * (100% del capital al vencimiento) + cupón periódico a la tasa vigente hoy
 * (TNA/tasa de interés/rendimiento corriente, según subcategoría), constante
 * hasta el vencimiento. NO reproduce amortizaciones parciales reales de
 * instrumentos como GD30, GD35, PARP o DICP, ni la variación futura de tasas
 * flotantes (Tamar/Badlar) o el ajuste por CER. Sirve para dimensionar el
 * calendario aproximado de una cartera, no para conciliar cobros reales —
 * hay que verificar contra el prospecto de cada especie.
 */

/** Meses entre pagos por subcategoría. `null` = bullet sin cupón (Lecap/Boncap). */
const FRECUENCIA_MESES: Record<string, number | null> = {
  "Lecap/Boncap": null,
  Botes: 6,
  Tamar: 3,
  CER: 6,
  "USD Linked": 6,
  Badlar: 3,
  Globales: 6,
  Bonares: 6,
  BCRA: 3,
  Energía: 6,
};

function tasaCupon(instrumento: InstrumentoRentaFija): number | null {
  switch (instrumento.subcategoria) {
    case "Botes":
      return instrumento.tasaInteres;
    case "Energía":
      return instrumento.rendimientoCorriente ?? instrumento.tna;
    default:
      return instrumento.tna;
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Flujo de fondos proyectado para un nominal dado de un instrumento, desde una fecha en adelante. */
export function generarFlujoPagos(
  instrumento: InstrumentoRentaFija,
  nominal: number,
  desde: string = FECHA_SEED_RENTA_FIJA
): FlujoPago[] {
  if (!instrumento.vencimiento || nominal <= 0) return [];
  const fechaDesde = new Date(desde + "T00:00:00Z");
  const vencimiento = new Date(instrumento.vencimiento + "T00:00:00Z");
  if (vencimiento <= fechaDesde) return [];

  const frecuencia = FRECUENCIA_MESES[instrumento.subcategoria] ?? null;
  const tasaAnual = tasaCupon(instrumento);

  if (frecuencia === null || tasaAnual === null) {
    return [
      {
        fecha: instrumento.vencimiento,
        ticker: instrumento.ticker,
        moneda: instrumento.moneda,
        tipo: "amortizacion",
        monto: nominal,
      },
    ];
  }

  const fechas: Date[] = [];
  let fecha = vencimiento;
  while (fecha > fechaDesde) {
    fechas.unshift(fecha);
    fecha = addMonths(fecha, -frecuencia);
  }

  const pagosPorAnio = 12 / frecuencia;
  const cuponPorPeriodo = (nominal * tasaAnual) / pagosPorAnio;

  return fechas.map((f, i) => {
    const esUltimo = i === fechas.length - 1;
    return {
      fecha: toIsoDate(f),
      ticker: instrumento.ticker,
      moneda: instrumento.moneda,
      tipo: esUltimo ? "amortizacion" : "cupon",
      monto: esUltimo ? cuponPorPeriodo + nominal : cuponPorPeriodo,
    };
  });
}

/** Consolida el flujo de varias líneas (ticker + nominal) en una sola lista ordenada por fecha. */
export function consolidarCalendario(
  lineas: LineaRentaFija[],
  instrumentos: InstrumentoRentaFija[],
  desde: string = FECHA_SEED_RENTA_FIJA
): FlujoPago[] {
  const porTicker = new Map(instrumentos.map((i) => [i.ticker, i]));
  const flujos: FlujoPago[] = [];
  for (const linea of lineas) {
    const inst = porTicker.get(linea.ticker);
    if (!inst) continue;
    flujos.push(...generarFlujoPagos(inst, linea.nominal, desde));
  }
  return flujos.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** Agrupa un flujo consolidado por mes calendario, separando ARS de USD (nunca se suman). */
export function agruparPorMes(flujos: FlujoPago[]): PagoMensual[] {
  const grupos = new Map<string, PagoMensual>();
  for (const f of flujos) {
    const mes = f.fecha.slice(0, 7);
    if (!grupos.has(mes)) grupos.set(mes, { mes, porMoneda: { ARS: 0, USD: 0 } as Record<Moneda, number> });
    grupos.get(mes)!.porMoneda[f.moneda] += f.monto;
  }
  return Array.from(grupos.values()).sort((a, b) => a.mes.localeCompare(b.mes));
}
