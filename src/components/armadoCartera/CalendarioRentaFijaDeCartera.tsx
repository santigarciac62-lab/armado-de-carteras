"use client";

import { useMemo } from "react";
import { InstrumentoRentaFija } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { lineasRentaFijaComoNominal } from "@/lib/armadoCartera/calculos";
import { consolidarCalendario, agruparPorMes } from "@/lib/rentaFija";
import { CalendarioPagosView } from "@/components/rentaFija/CalendarioPagosView";

export function CalendarioRentaFijaDeCartera({
  lineas,
  universoRentaFija,
}: {
  lineas: LineaCombinadaCalculada[];
  universoRentaFija: InstrumentoRentaFija[];
}) {
  const { flujos, porMes } = useMemo(() => {
    const lineasNominal = lineasRentaFijaComoNominal(lineas);
    const flujosCalculados = consolidarCalendario(lineasNominal, universoRentaFija);
    return { flujos: flujosCalculados, porMes: agruparPorMes(flujosCalculados) };
  }, [lineas, universoRentaFija]);

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
          Calendario de Renta Fija de la cartera
        </h3>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-soft)" }}>
          Vencimientos, cupones y amortizaciones proyectados solo para los instrumentos de renta fija
          incluidos en la cartera de arriba.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <CalendarioPagosView flujos={flujos} porMes={porMes} />
      </div>
    </div>
  );
}
