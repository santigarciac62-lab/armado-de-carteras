import { Topbar } from "@/components/Topbar";
import { CarteraCombinadaWorkspace } from "@/components/armadoCartera/CarteraCombinadaWorkspace";
import { INSTRUMENTOS_RENTA_FIJA } from "@/data/rentaFija";
import { obtenerUniversoRentaVariable } from "@/data/rentaVariable";

// Renta Variable trae precio en vivo por request (Data912/Twelve Data), no en build time.
export const dynamic = "force-dynamic";

export default async function ArmadoCarteraPage() {
  const universoRentaVariable = await obtenerUniversoRentaVariable();

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/armado-cartera" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Armado de Cartera
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Combiná instrumentos de Renta Fija y Renta Variable en una sola cartera: elegí del universo
          conjunto, ajustá ponderaciones, revisá el calendario de pagos de la parte de renta fija y el
          análisis técnico/fundamental de cada instrumento, con una justificación editable de por qué se
          eligió.
        </p>
      </div>

      <CarteraCombinadaWorkspace universoRentaFija={INSTRUMENTOS_RENTA_FIJA} universoRentaVariable={universoRentaVariable} />
    </div>
  );
}
