import { Topbar } from "@/components/Topbar";
import { AlineacionPorPerfil } from "@/components/desvios/AlineacionPorPerfil";
import { TablaDesvios } from "@/components/desvios/TablaDesvios";
import { BucketLegend } from "@/components/desvios/BucketBar";
import { CLIENTES_CON_TENENCIA, STATS_GLOBALES, STATS_POR_PERFIL } from "@/data/clientes";

export default function Desvios() {
  const { total, conPerfilReal, aumTotal, desvioPonderado, aumPorStatus } = STATS_GLOBALES;

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/desvios" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Cuentas con desvío
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Comparación de la cartera real de cada cliente contra la cartera modelo de su perfil de riesgo,
          con el cambio recomendado según la Visión de Portafolio vigente.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Cuentas con tenencia", value: total.toLocaleString("es-AR") },
            {
              label: "Con perfil real (Test del Inversor)",
              value: `${((conPerfilReal / total) * 100).toFixed(0)}%`,
              sub: `${total - conPerfilReal} con perfil asignado por defecto`,
            },
            {
              label: "Desvío promedio (ponderado por AUM)",
              value: `${(desvioPonderado * 100).toFixed(1)}%`,
              sub: "vs. cartera de su perfil",
            },
            {
              label: "AUM a revisar (>30% desvío)",
              value: `USD ${Math.round(aumPorStatus.revisar).toLocaleString("es-AR")}`,
              sub: `de USD ${Math.round(aumTotal).toLocaleString("es-AR")} total`,
            },
          ].map((k) => (
            <div key={k.label} className="rounded-lg p-3 sm:p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--text-mute)" }}>
                {k.label}
              </div>
              <div className="font-mono-brand text-[16px] sm:text-[24px] font-semibold mt-1.5 break-words leading-tight" style={{ color: "var(--navy)" }}>
                {k.value}
              </div>
              {k.sub && (
                <div className="text-[11px] sm:text-[12px] mt-1" style={{ color: "var(--text-soft)" }}>
                  {k.sub}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <AlineacionPorPerfil stats={STATS_POR_PERFIL} />
        </div>

        <div className="mb-3">
          <BucketLegend />
        </div>

        <TablaDesvios clientes={CLIENTES_CON_TENENCIA} />
      </div>
    </div>
  );
}
