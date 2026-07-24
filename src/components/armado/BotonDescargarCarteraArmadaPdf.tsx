"use client";

import { useState } from "react";
import { CarteraModelo } from "@/lib/types";

function nombreArchivo(generadoEn: Date) {
  const slug = generadoEn.toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return `vision-de-portafolio-${slug}.pdf`;
}

/** Botón de descarga del PDF de la Visión de Portafolio (las 6 carteras modelo). Carga
 * @react-pdf/renderer de forma diferida, mismo patrón que BotonDescargarInformePdf.tsx en
 * Armado de Cartera y BotonFichaPdf.tsx en Seguimiento de Carteras. */
export function BotonDescargarVisionPdf({
  carterasModelo,
  fechaVigente,
}: {
  carterasModelo: CarteraModelo[];
  fechaVigente: string;
}) {
  const [cargando, setCargando] = useState(false);

  async function descargar() {
    if (cargando) return;
    setCargando(true);
    try {
      const [{ pdf }, { VisionPortafolioPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./VisionPortafolioPdf"),
      ]);
      const generadoEn = new Date();
      const blob = await pdf(
        <VisionPortafolioPdf carterasModelo={carterasModelo} fechaVigente={fechaVigente} generadoEn={generadoEn} />
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
      disabled={cargando}
      className="text-[12px] font-medium px-3.5 py-2.5 sm:py-2 rounded-md whitespace-nowrap disabled:opacity-50"
      style={{ background: "var(--navy)", color: "#fff" }}
    >
      {cargando ? "Generando…" : "Descargar Visión de Portafolio (PDF)"}
    </button>
  );
}
