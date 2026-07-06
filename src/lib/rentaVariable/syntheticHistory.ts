/** Genera una serie histórica diaria determinística (mismo resultado en cada carga, tanto en
 * el render del servidor como en el del cliente) a partir de un precio de referencia — no hay
 * fuente de históricos en vivo todavía, así que esto es data de demostración, no un precio real.
 * Se usa una PRNG sembrada por ticker (no Math.random()) para que el gráfico sea reproducible. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashTicker(ticker: string): number {
  let h = 0;
  for (let i = 0; i < ticker.length; i++) {
    h = (h * 31 + ticker.charCodeAt(i)) | 0;
  }
  return h;
}

export interface PuntoHistorico {
  fecha: string;
  precio: number;
}

/** Serie de ~252 ruedas hábiles terminando en `precioActual`, con un random walk sembrado. */
export function generarHistoricoSintetico(ticker: string, precioActual: number, dias = 252): PuntoHistorico[] {
  const rand = mulberry32(hashTicker(ticker));
  const puntos: PuntoHistorico[] = [];
  let precio = precioActual;
  const hoy = new Date();
  const dia = new Date(hoy);

  const precios: number[] = [];
  for (let i = 0; i < dias; i++) {
    precios.unshift(precio);
    precio = precio / (1 + (rand() - 0.485) * 0.022);
  }

  let cursor = 0;
  const d = new Date(dia);
  while (cursor < dias) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      puntos.push({
        fecha: d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
        precio: Math.round(precios[cursor] * 100) / 100,
      });
      cursor++;
    }
    d.setDate(d.getDate() - 1);
  }
  puntos.reverse();
  if (puntos.length > 0) puntos[puntos.length - 1].precio = precioActual;
  return puntos;
}
