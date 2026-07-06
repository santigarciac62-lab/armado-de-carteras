import { Topbar } from "@/components/Topbar";
import { RentaVariableWorkspace } from "@/components/rentaVariable/RentaVariableWorkspace";
import { UNIVERSO_RENTA_VARIABLE } from "@/data/rentaVariable";

export default function RentaVariablePage() {
  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/renta-variable" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Renta Variable
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Ranking, análisis técnico y fundamental de acciones locales y CEDEARs, con un score
          compuesto de referencia. Datos de demostración — sin fuente en vivo todavía.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <RentaVariableWorkspace activos={UNIVERSO_RENTA_VARIABLE} />
      </div>
    </div>
  );
}
