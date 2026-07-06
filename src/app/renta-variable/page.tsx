import { Topbar } from "@/components/Topbar";
import { RentaVariableWorkspace } from "@/components/rentaVariable/RentaVariableWorkspace";
import { obtenerUniversoRentaVariable } from "@/data/rentaVariable";
import { RV_PROVIDER_ACTIVO } from "@/lib/rentaVariable/liveData";

// Se resuelve en cada request (precio en vivo de Data912), no en build time.
export const dynamic = "force-dynamic";

export default async function RentaVariablePage() {
  const activos = await obtenerUniversoRentaVariable();

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
          Cotizaciones por sector, ranking y análisis técnico/fundamental de acciones locales,
          CEDEARs y ETFs.{" "}
          {RV_PROVIDER_ACTIVO === "data912"
            ? "Precio y variación en vivo (Data912) donde esté disponible; el resto queda con datos de demostración."
            : "Datos de demostración — conectá USE_DATA912 para precios en vivo."}
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <RentaVariableWorkspace activos={activos} />
      </div>
    </div>
  );
}
