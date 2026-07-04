import { Topbar } from "@/components/Topbar";
import { RentaFijaWorkspace } from "@/components/rentaFija/RentaFijaWorkspace";
import { INSTRUMENTOS_RENTA_FIJA } from "@/data/rentaFija";

export default function RentaFija() {
  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/renta-fija" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Renta Fija
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Bonos soberanos, letras y obligaciones negociables corporativas: precios, tasas y duración, con
          simuladores de calendario de pagos y armado de cartera por monto.
        </p>
      </div>

      <RentaFijaWorkspace instrumentos={INSTRUMENTOS_RENTA_FIJA} />
    </div>
  );
}
