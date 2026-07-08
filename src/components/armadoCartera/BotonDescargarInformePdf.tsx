"use client";

import { useState } from "react";
import { InstrumentoRentaFija, Moneda } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { lineasRentaFijaComoNominal } from "@/lib/armadoCartera/calculos";
import { consolidarCalendario, agruparPorMes } from "@/lib/rentaFija";

function nombreArchivo(generadoEn: Date) {
  const slug = generadoEn
    .toISOString()
    .slice(0, 16)
    .replace(/[:T]/g, "-");
  return `armado-de-cartera-${slug}.pdf`;
}

/** Botón de descarga del informe PDF de la cartera combinada. Carga @react-pdf/renderer
 * de forma diferida (solo al hacer click), mismo patrón que BotonFichaPdf.tsx en
 * Cuentas con desvío, para no sumar peso al bundle de esta pantalla. */
export function BotonDescargarInformePdf({
  lineas,
  totalPct,
  montoTotal,
  moneda,
  justificaciones,
  universoRentaFija,
}: {
  lineas: LineaCombinadaCalculada[];
  totalPct: number;
  montoTotal: number;
  moneda: Moneda;
  justificaciones: Record<string, string>;
  universoRentaFija: InstrumentoRentaFija[];
}) {
  const [cargando, setCargando] = useState(false);

  async function descargar() {
    if (cargando || lineas.length === 0) return;
    setCargando(true);
    try {
      const [{ pdf }, { CarteraCombinadaPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./CarteraCombinadaPdf"),
      ]);
      const lineasNominal = lineasRentaFijaComoNominal(lineas);
      const flujos = consolidarCalendario(lineasNominal, universoRentaFija);
      const porMes = agruparPorMes(flujos);
      const generadoEn = new Date();
      const blob = await pdf(
        <CarteraCombinadaPdf
          lineas={lineas}
          totalPct={totalPct}
          montoTotal={montoTotal}
          moneda={moneda}
          justificaciones={justificaciones}
          flujos={flujos}
          porMes={porMes}
          generadoEn={generadoEn}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo(generadoEn);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setCargando(false);
    }
  }

  return (
    <button
      onClick={descargar}
      disabled={cargando || lineas.length === 0}
      className="text-[12px] font-medium px-3.5 py-2.5 sm:py-2 rounded-md whitespace-nowrap disabled:opacity-50"
      style={{ background: "var(--navy)", color: "#fff" }}
    >
      {cargando ? "Generando…" : "Descargar informe (PDF)"}
    </button>
  );
}
