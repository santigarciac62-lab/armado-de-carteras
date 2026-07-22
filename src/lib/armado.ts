import { Bucket, Cotizacion, LineaCartera } from "@/lib/types";
import { UNIVERSO_INSTRUMENTOS } from "@/data/instrumentos";
import { CarteraModelo } from "@/lib/types";
import { trackingError } from "@/lib/bucket";

export interface LineaCalculada extends LineaCartera {
  categoria: string;
  bucket: Bucket;
  monto: number;
  cotizacion?: Cotizacion;
  nominalesAprox?: number;
}

export function calcularLineas(
  lineas: LineaCartera[],
  montoTotal: number,
  cotizaciones: Record<string, Cotizacion>
): LineaCalculada[] {
  return lineas.map((linea) => {
    const inst = UNIVERSO_INSTRUMENTOS.find((i) => i.ticker === linea.ticker);
    const cotizacion = cotizaciones[linea.ticker];
    const monto = (montoTotal * linea.pct) / 100;
    return {
      ...linea,
      categoria: inst?.categoria ?? "—",
      bucket: inst?.bucket ?? "Otros",
      monto,
      cotizacion,
      nominalesAprox: cotizacion?.ultimo ? monto / cotizacion.ultimo : undefined,
    };
  });
}

export function agregarPorCategoria(lineas: LineaCalculada[]): { categoria: string; pct: number }[] {
  const totales = new Map<string, number>();
  for (const l of lineas) {
    totales.set(l.categoria, (totales.get(l.categoria) ?? 0) + l.pct);
  }
  return Array.from(totales.entries()).map(([categoria, pct]) => ({ categoria, pct }));
}

export function sumaPct(lineas: LineaCartera[]): number {
  return Math.round(lineas.reduce((acc, l) => acc + l.pct, 0) * 100) / 100;
}

/** Líneas de la cartera modelo, expresadas en formato editable (pct en base 100). */
export function lineasDesdeModelo(cartera: CarteraModelo): LineaCartera[] {
  return cartera.activos.map((a) => ({ ticker: a.ticker, pct: Math.round(a.pct * 10000) / 100 }));
}

/** Desvío total (0-1) de la cartera en armado contra el perfil de partida elegido,
 * agregado por bucket — mismo criterio y semáforo que "Seguimiento de Carteras", para que
 * el asesor vea de entrada si lo que está armando se sigue pareciendo al perfil del
 * cliente o ya se corrió hacia otro (ej. armar una agresiva partiendo de conservador). */
export function desvioTotal(lineas: LineaCalculada[], modelo: CarteraModelo): number {
  const actualPorBucket: Record<Bucket, number> = { FCI: 0, Soberanos: 0, ON: 0, Acciones: 0, Cedears: 0, Otros: 0 };
  for (const l of lineas) {
    actualPorBucket[l.bucket] += l.pct / 100;
  }
  return trackingError(actualPorBucket, modelo.buckets);
}

/** Desvío simple por categoría entre la cartera en armado y la cartera modelo elegida (en pp). */
export function desvioPorCategoria(
  lineas: LineaCalculada[],
  modelo: CarteraModelo
): { categoria: string; actual: number; modelo: number; desvioPP: number }[] {
  const actualPorCategoria = new Map<string, number>();
  for (const l of lineas) {
    actualPorCategoria.set(l.categoria, (actualPorCategoria.get(l.categoria) ?? 0) + l.pct);
  }
  const categorias = new Set([
    ...Object.keys(modelo.composicion),
    ...actualPorCategoria.keys(),
  ]);
  return Array.from(categorias).map((categoria) => {
    const actual = actualPorCategoria.get(categoria) ?? 0;
    const modeloPct = (modelo.composicion[categoria] ?? 0) * 100;
    return { categoria, actual, modelo: modeloPct, desvioPP: actual - modeloPct };
  });
}
