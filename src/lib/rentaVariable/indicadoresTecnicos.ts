/** Indicadores técnicos clásicos calculados sobre una serie de precios de cierre. */

export function mediaMovil(precios: number[], n: number): (number | null)[] {
  return precios.map((_, i) => (i < n - 1 ? null : precios.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n));
}

export function calcularRSI(precios: number[], n = 14): (number | null)[] {
  const rsi: (number | null)[] = new Array(n).fill(null);
  for (let i = n; i < precios.length; i++) {
    const cambios = precios.slice(i - n, i).map((p, j, arr) => (j === 0 ? 0 : p - arr[j - 1]));
    const ganancia = cambios.filter((c) => c > 0).reduce((a, b) => a + b, 0) / n;
    const perdida = Math.abs(cambios.filter((c) => c < 0).reduce((a, b) => a + b, 0)) / n;
    rsi.push(perdida === 0 ? 100 : Math.round((100 - 100 / (1 + ganancia / perdida)) * 10) / 10);
  }
  return rsi;
}

export interface MACDResultado {
  macd: number[];
  señal: number[];
  histograma: number[];
}

function ema(precios: number[], n: number): number[] {
  const k = 2 / (n + 1);
  let e = precios[0];
  return precios.map((v) => (e = v * k + e * (1 - k)));
}

export function calcularMACD(precios: number[], rapida = 12, lenta = 26, señalN = 9): MACDResultado {
  const eRapida = ema(precios, rapida);
  const eLenta = ema(precios, lenta);
  const macd = precios.map((_, i) => Math.round((eRapida[i] - eLenta[i]) * 10000) / 10000);
  const señal = ema(macd, señalN).map((v) => Math.round(v * 10000) / 10000);
  const histograma = macd.map((v, i) => Math.round((v - señal[i]) * 10000) / 10000);
  return { macd, señal, histograma };
}
