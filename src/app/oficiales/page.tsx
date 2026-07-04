import { Topbar } from "@/components/Topbar";
import { GraficoAumPorOficial } from "@/components/oficiales/GraficoAumPorOficial";
import { GraficoRevenue } from "@/components/oficiales/GraficoRevenue";
import { TablaOficiales } from "@/components/oficiales/TablaOficiales";
import { TopClientes } from "@/components/oficiales/TopClientes";
import { OFICIALES_ENRIQUECIDOS, RESUMEN_GLOBAL, REVENUE_POR_OFICIAL } from "@/data/oficiales";
import { CLIENTES_CON_TENENCIA } from "@/data/clientes";

export default function Oficiales() {
  const { aumTotalUsd, cuentasTotales, conTenencia, pctTenencia, fees2025, feesQ1, feesQ2 } = RESUMEN_GLOBAL;

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/oficiales" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Seguimiento de oficiales
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Cuentas, AUM, fees y alineación de cartera por oficial de cuenta — réplica y ampliación del
          dashboard de seguimiento del Excel.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          {[
            { label: "AUM Total", value: `USD ${Math.round(aumTotalUsd).toLocaleString("es-AR")}` },
            { label: "Cuentas totales", value: cuentasTotales.toLocaleString("es-AR") },
            { label: "Con tenencia", value: conTenencia.toLocaleString("es-AR") },
            { label: "% Tenencia", value: `${(pctTenencia * 100).toFixed(1)}%` },
            { label: "Fees 2025 (USD)", value: Math.round(fees2025).toLocaleString("es-AR") },
            { label: "Fees Q1+Q2 2026 (USD)", value: Math.round(feesQ1 + feesQ2).toLocaleString("es-AR") },
          ].map((k) => (
            <div key={k.label} className="rounded-lg p-3 sm:p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--text-mute)" }}>
                {k.label}
              </div>
              <div className="font-mono-brand text-[14px] sm:text-[20px] font-semibold mt-1.5 break-words leading-tight" style={{ color: "var(--navy)" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GraficoAumPorOficial oficiales={OFICIALES_ENRIQUECIDOS} />
          <GraficoRevenue revenue={REVENUE_POR_OFICIAL} />
        </div>

        <div className="mb-6">
          <TablaOficiales oficiales={OFICIALES_ENRIQUECIDOS} />
        </div>

        <TopClientes clientes={CLIENTES_CON_TENENCIA} />
      </div>
    </div>
  );
}
