import clientesRaw from "./raw/clientes.json";
import { ClienteRaw, Perfil } from "@/lib/types";
import { enriquecerCliente } from "@/lib/desvio";
import { LIMITES_CONCENTRACION } from "./concentrationLimits";

/** Todas las cuentas del padrón (702), tengan o no tenencia actual. Fuente: hoja "Total" del Excel. */
export const CLIENTES_RAW: ClienteRaw[] = clientesRaw as ClienteRaw[];

/** Solo las cuentas con tenencia (267), con perfil/desvío/alertas/recomendaciones ya calculados. */
export const CLIENTES_CON_TENENCIA = CLIENTES_RAW.filter((c) => c.tieneTenencia).map((c) =>
  enriquecerCliente(c, LIMITES_CONCENTRACION)
);

const PERFILES: Perfil[] = ["conservador", "moderado", "agresivo"];

export const STATS_GLOBALES = (() => {
  const total = CLIENTES_CON_TENENCIA.length;
  const conPerfilReal = CLIENTES_CON_TENENCIA.filter((c) => !c.perfilAsignadoPorDefault).length;
  const aumTotal = CLIENTES_CON_TENENCIA.reduce((acc, c) => acc + c.aumUsd, 0);
  const desvioPonderado =
    aumTotal > 0 ? CLIENTES_CON_TENENCIA.reduce((acc, c) => acc + c.desvio * c.aumUsd, 0) / aumTotal : 0;
  const aumPorStatus = { optimo: 0, aceptable: 0, revisar: 0 };
  for (const c of CLIENTES_CON_TENENCIA) aumPorStatus[c.statusSemaforo] += c.aumUsd;

  return { total, conPerfilReal, aumTotal, desvioPonderado, aumPorStatus };
})();

export const STATS_POR_PERFIL = PERFILES.map((perfil) => {
  const clientes = CLIENTES_CON_TENENCIA.filter((c) => c.perfilGrupo === perfil);
  const count = clientes.length;
  const avgDesvio = count > 0 ? clientes.reduce((acc, c) => acc + c.desvio, 0) / count : 0;
  const optimo = clientes.filter((c) => c.statusSemaforo === "optimo").length;
  const aceptable = clientes.filter((c) => c.statusSemaforo === "aceptable").length;
  const revisar = clientes.filter((c) => c.statusSemaforo === "revisar").length;
  return { perfil, count, avgDesvio, optimo, aceptable, revisar };
});
