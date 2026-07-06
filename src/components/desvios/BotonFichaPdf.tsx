"use client";

import { useState } from "react";
import { ClienteEnriquecido } from "@/lib/types";

function nombreArchivo(cliente: ClienteEnriquecido) {
  const slug = cliente.denominacion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `ficha-${cliente.numero}-${slug}.pdf`;
}

/** Botón de descarga de la ficha PDF de un cliente. Carga @react-pdf/renderer de forma
 * diferida (solo al hacer click) para no sumar peso al bundle de la pantalla de Cuentas
 * con desvío, que ya lista 267 cuentas. */
export function BotonFichaPdf({ cliente, className, style }: { cliente: ClienteEnriquecido; className?: string; style?: React.CSSProperties }) {
  const [cargando, setCargando] = useState(false);

  async function descargar(e: React.MouseEvent) {
    e.stopPropagation();
    if (cargando) return;
    setCargando(true);
    try {
      const [{ pdf }, { FichaClientePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./FichaClientePdf"),
      ]);
      const blob = await pdf(<FichaClientePdf cliente={cliente} generadoEn={new Date()} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo(cliente);
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
      className={className ?? "text-[11px] font-medium px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-md whitespace-nowrap disabled:opacity-60"}
      style={style ?? { background: "var(--teal-soft)", color: "var(--teal)" }}
    >
      {cargando ? "Generando…" : "Descargar ficha (PDF)"}
    </button>
  );
}
