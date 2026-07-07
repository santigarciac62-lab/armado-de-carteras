"use client";

import { useState } from "react";
import { NoticiasResultado } from "@/lib/news/types";
import { ColumnaNoticias } from "./ColumnaNoticias";
import { ColumnaRelevantes } from "./ColumnaRelevantes";

export function NoticiasWorkspace({ resultadoInicial }: { resultadoInicial: NoticiasResultado }) {
  const [resultado, setResultado] = useState(resultadoInicial);
  const [cargando, setCargando] = useState(false);

  async function actualizar() {
    setCargando(true);
    try {
      const res = await fetch("/api/noticias");
      if (res.ok) setResultado(await res.json());
    } catch {
      // se mantiene el último resultado conocido
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="text-[12px] max-w-[820px]" style={{ color: "var(--text-mute)" }}>
          Actualizado {new Date(resultado.actualizadoEn).toLocaleTimeString("es-AR")} · las columnas
          marcadas &quot;a verificar&quot; incluyen fuentes cuyo RSS no se confirmó en vivo todavía; &quot;sin fuente
          confiable&quot; (ver el punto rojo) no intenta traer datos en vivo.
        </div>
        <button
          onClick={actualizar}
          disabled={cargando}
          className="text-[12px] font-medium px-3.5 py-2.5 sm:py-2 rounded-md disabled:opacity-60 whitespace-nowrap shrink-0"
          style={{ background: "var(--navy)", color: "#fff" }}
        >
          {cargando ? "Actualizando…" : "↻ Actualizar"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <ColumnaNoticias titulo="Global" fuentes={resultado.global} />
        <ColumnaNoticias titulo="Argentina" fuentes={resultado.argentina} />
        <ColumnaRelevantes items={resultado.relevantes} />
      </div>
    </div>
  );
}
