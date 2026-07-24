"use client";

import { useState } from "react";
import { CarteraModelo, Moneda, Perfil } from "@/lib/types";
import { LineaCalculada } from "@/lib/armado";

function nombreArchivo(generadoEn: Date) {
  const slug = generadoEn.toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return `cartera-en-armado-${slug}.pdf`;
}

/** Botón de descarga del PDF de la cartera que se está armando en pantalla (perfil, moneda,
 * monto e instrumentos tal como figuran en "Tu cartera en armado"). Carga
 * @react-pdf/renderer de forma diferida, mismo patrón que BotonDescargarInformePdf.tsx en
 * Armado de Cartera y BotonFichaPdf.tsx en Seguimiento de Carteras. */
export function BotonDescargarCarteraArmadaPdf({
  perfil,
  moneda,
  montoTotal,
  totalPct,
  lineas,
  carteraModelo,
}: {
  perfil: Perfil;
  moneda: Moneda;
  montoTotal: number;
  totalPct: number;
  lineas: LineaCalculada[];
  carteraModelo: CarteraModelo | undefined;
}) {
  const [cargando, setCargando] = useState(false);

  async function descargar() {
    if (cargando || lineas.length === 0) return;
    setCargando(true);
    try {
      const [{ pdf }, { CarteraArmadaPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./CarteraArmadaPdf"),
      ]);
      const generadoEn = new Date();
      const blob = await pdf(
        <CarteraArmadaPdf
          perfil={perfil}
          moneda={moneda}
          montoTotal={montoTotal}
          totalPct={totalPct}
          lineas={lineas}
          carteraModelo={carteraModelo}
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
      {cargando ? "Generando…" : "Descargar cartera en armado (PDF)"}
    </button>
  );
}
