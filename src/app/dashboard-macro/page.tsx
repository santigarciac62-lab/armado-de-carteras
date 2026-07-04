import { Topbar } from "@/components/Topbar";
import { DashboardMacroWorkspace } from "@/components/macro/DashboardMacroWorkspace";
import { obtenerIndicadoresMacro } from "@/lib/macro/aggregator";

export const dynamic = "force-dynamic";

export default async function DashboardMacro() {
  const secciones = await obtenerIndicadoresMacro();
  const actualizadoInicial = new Date().toISOString();

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/dashboard-macro" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Dashboard Financiero
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Tasas, dólares, BCRA, índices, riesgo país, inflación y commodities en un solo lugar, con
          actualización automática donde hay fuente disponible.
        </p>
      </div>

      <DashboardMacroWorkspace seccionesIniciales={secciones} actualizadoInicial={actualizadoInicial} />
    </div>
  );
}
