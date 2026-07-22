"use client";

import { useState } from "react";
import { FlujoPago, InstrumentoRentaFija, Moneda } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { lineasRentaFijaComoNominal } from "@/lib/armadoCartera/calculos";
import { consolidarCalendario } from "@/lib/rentaFija";
import { segmentosComposicion } from "@/lib/armadoCartera/coloresSector";
import { colorPorIndice, PdfDonutDatum } from "./pdfBrand";
import { CobroMensualPorTicker } from "./pdfCobrosChart";
import { PDF_COLOR } from "@/lib/pdfTheme";

function nombreArchivo(generadoEn: Date) {
  const slug = generadoEn
    .toISOString()
    .slice(0, 16)
    .replace(/[:T]/g, "-");
  return `armado-de-cartera-${slug}.pdf`;
}

/** Agrupa el flujo consolidado por mes y ticker, para el gráfico de barras "Cobros
 * Proyectados por Mes" — una barra por instrumento dentro de cada mes, nunca mezclando ARS
 * con USD (mismo criterio que el resto de la pantalla). */
function agruparPorMesYTicker(flujos: FlujoPago[], moneda: Moneda): CobroMensualPorTicker[] {
  const porMes = new Map<string, Record<string, number>>();
  for (const f of flujos) {
    if (f.moneda !== moneda) continue;
    const mes = f.fecha.slice(0, 7);
    const registro = porMes.get(mes) ?? {};
    registro[f.ticker] = (registro[f.ticker] ?? 0) + f.monto;
    porMes.set(mes, registro);
  }
  return Array.from(porMes.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([mes, porTicker]) => ({ mes, porTicker }));
}

/** Botón de descarga del informe PDF de la cartera combinada. Carga @react-pdf/renderer
 * de forma diferida (solo al hacer click), mismo patrón que BotonFichaPdf.tsx en
 * Seguimiento de Carteras, para no sumar peso al bundle de esta pantalla. */
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
      const generadoEn = new Date();

      const pctRentaFija = lineas.filter((l) => l.clase === "rentaFija").reduce((a, l) => a + l.pct, 0);
      const pctRentaVariable = lineas.filter((l) => l.clase === "rentaVariable").reduce((a, l) => a + l.pct, 0);
      const donutClases: PdfDonutDatum[] = [
        { categoria: "Renta Fija", pct: pctRentaFija, color: PDF_COLOR.teal },
        { categoria: "Renta Variable", pct: pctRentaVariable, color: PDF_COLOR.blue },
      ];

      const pctPorCategoria = new Map<string, number>();
      for (const l of lineas) {
        pctPorCategoria.set(l.categoriaLabel, (pctPorCategoria.get(l.categoriaLabel) ?? 0) + l.pct);
      }
      const donutSectores = segmentosComposicion(pctPorCategoria);

      const tickersRentaFija = lineas.filter((l) => l.clase === "rentaFija").map((l) => l.ticker);
      const colorPorTicker = Object.fromEntries(tickersRentaFija.map((t, i) => [t, colorPorIndice(i)]));

      const cobrosArs = agruparPorMesYTicker(flujos, "ARS");
      const cobrosUsd = agruparPorMesYTicker(flujos, "USD");

      const blob = await pdf(
        <CarteraCombinadaPdf
          lineas={lineas}
          totalPct={totalPct}
          montoTotal={montoTotal}
          moneda={moneda}
          justificaciones={justificaciones}
          flujos={flujos}
          donutClases={donutClases}
          donutSectores={donutSectores}
          cobrosArs={cobrosArs}
          cobrosUsd={cobrosUsd}
          tickersRentaFija={tickersRentaFija}
          colorPorTicker={colorPorTicker}
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
      className="w-full sm:w-auto text-[12px] font-medium px-3.5 py-2.5 sm:py-2 rounded-md whitespace-nowrap disabled:opacity-50"
      style={{ background: "var(--navy)", color: "#fff" }}
    >
      {cargando ? "Generando…" : "Descargar informe (PDF)"}
    </button>
  );
}
