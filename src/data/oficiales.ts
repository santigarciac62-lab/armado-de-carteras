import oficialesRaw from "./raw/oficiales.json";
import { OficialResumen, RevenueOficial } from "@/lib/types";
import { CLIENTES_RAW, CLIENTES_CON_TENENCIA } from "./clientes";
import { TC_REFERENCIA } from "@/lib/constants";

/** Métricas por oficial tal como están en la hoja "Dashboard" del Excel. */
export const OFICIALES: OficialResumen[] = oficialesRaw.porOficial as OficialResumen[];

/** Revenue Q1 vs Q2 2026 por oficial, misma hoja. */
export const REVENUE_POR_OFICIAL: RevenueOficial[] = oficialesRaw.revenueQ1Q2 as RevenueOficial[];

export interface OficialEnriquecido extends OficialResumen {
  desvioPromedioPonderado: number | null;
  cuentasOptimo: number;
  cuentasAceptable: number;
  cuentasRevisar: number;
}

/** El resumen global de la hoja Dashboard tiene celdas de texto formateado
 * ("46,569,175", "38.0%"); en vez de parsear ese texto lo recalculamos
 * directo del padrón, que es la misma fuente y evita esa fragilidad. */
export const RESUMEN_GLOBAL = (() => {
  const aumTotalUsd = CLIENTES_RAW.reduce((acc, c) => acc + c.aumArs, 0) / TC_REFERENCIA;
  const cuentasTotales = CLIENTES_RAW.length;
  const conTenencia = CLIENTES_RAW.filter((c) => c.tieneTenencia).length;
  const fees2025 = CLIENTES_RAW.reduce((acc, c) => acc + (c.fees2025 ?? 0), 0);
  const feesQ1 = CLIENTES_RAW.reduce((acc, c) => acc + (c.feesQ1_2026 ?? 0), 0);
  const feesQ2 = CLIENTES_RAW.reduce((acc, c) => acc + (c.feesQ2_2026 ?? 0), 0);
  return {
    aumTotalUsd,
    cuentasTotales,
    conTenencia,
    pctTenencia: conTenencia / cuentasTotales,
    fees2025,
    feesQ1,
    feesQ2,
  };
})();

export const OFICIALES_ENRIQUECIDOS: OficialEnriquecido[] = OFICIALES.map((of) => {
  const clientesDelOficial = CLIENTES_CON_TENENCIA.filter((c) => c.oficial === of.oficial);
  const aumTotal = clientesDelOficial.reduce((acc, c) => acc + c.aumUsd, 0);
  const desvioPromedioPonderado =
    aumTotal > 0
      ? clientesDelOficial.reduce((acc, c) => acc + c.desvio * c.aumUsd, 0) / aumTotal
      : null;

  return {
    ...of,
    desvioPromedioPonderado,
    cuentasOptimo: clientesDelOficial.filter((c) => c.statusSemaforo === "optimo").length,
    cuentasAceptable: clientesDelOficial.filter((c) => c.statusSemaforo === "aceptable").length,
    cuentasRevisar: clientesDelOficial.filter((c) => c.statusSemaforo === "revisar").length,
  };
});
