import { Indicador } from "@/lib/types";
import { fetchConTimeout } from "../fetchHelpers";

/**
 * DolarApi.com — gratuita, sin key, https://dolarapi.com/docs/argentina/
 * Devuelve un array de casas de cambio. No verificado en vivo desde este
 * entorno (red bloqueada); el mapeo de "casa" está tomado de la doc pública,
 * confirmar contra una respuesta real antes de confiar 100%.
 */
interface CasaDolar {
  casa: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const CASA_A_ID: Record<string, string> = {
  mayorista: "dolar-oficial",
  bolsa: "dolar-mep",
  contadoconliqui: "dolar-ccl",
  blue: "dolar-blue",
};

export async function obtenerDolares(seed: Indicador[]): Promise<Indicador[]> {
  try {
    const res = await fetchConTimeout("https://dolarapi.com/v1/dolares");
    if (!res.ok) return seed;
    const data = (await res.json()) as CasaDolar[];
    const porCasa = new Map(data.map((d) => [d.casa, d]));

    const resultado = seed.map((ind) => {
      const casa = Object.entries(CASA_A_ID).find(([, id]) => id === ind.id)?.[0];
      const fila = casa ? porCasa.get(casa) : undefined;
      if (!fila) return ind;
      const valor = (fila.compra + fila.venta) / 2;
      return { ...ind, valor, fecha: fila.fechaActualizacion?.slice(0, 10) ?? ind.fecha };
    });

    // Canje y brecha son calculados, no vienen directo de la API.
    const oficial = resultado.find((i) => i.id === "dolar-oficial")?.valor;
    const mep = resultado.find((i) => i.id === "dolar-mep")?.valor;
    const ccl = resultado.find((i) => i.id === "dolar-ccl")?.valor;
    return resultado.map((ind) => {
      if (ind.id === "dolar-canje" && mep && ccl) {
        return { ...ind, valor: ((ccl - mep) / mep) * 100 };
      }
      if (ind.id === "dolar-brecha" && oficial && mep) {
        return { ...ind, valor: ((mep - oficial) / oficial) * 100 };
      }
      return ind;
    });
  } catch {
    return seed;
  }
}
