"use client";

import { useMemo, useState } from "react";
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
  const [abierto, setAbierto] = useState(false);
  const { flujos, porMes } = useMemo(() => {
    const lineasNominal = lineasRentaFijaComoNominal(lineas);
    const flujosCalculados = consolidarCalendario(lineasNominal, universoRentaFija);
    return { flujos: flujosCalculados, porMes: agruparPorMes(flujosCalculados) };
  }, [lineas, universoRentaFija]);

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        style={abierto ? { borderBottom: "1px solid var(--border)" } : undefined}
      >
        <div>
          <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
            Calendario de Renta Fija de la cartera
          </h3>
          <p className="text-[12px] mt-1" style={{ color: "var(--text-soft)" }}>
            Vencimientos, cupones y amortizaciones proyectados solo para los instrumentos de renta fija
            incluidos en la cartera de arriba.
          </p>
        </div>
        <span className="text-[13px] shrink-0" style={{ color: "var(--text-mute)" }}>
          {abierto ? "▲ Ocultar" : "▼ Ver calendario"}
        </span>
      </button>
      {abierto && (
        <div className="p-4 sm:p-5">
          <CalendarioPagosView flujos={flujos} porMes={porMes} detalleDesplegable />
        </div>
      )}
    </div>
  );
}
