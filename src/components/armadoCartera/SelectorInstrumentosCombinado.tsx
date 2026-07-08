"use client";

import { useMemo, useState } from "react";
import { ClaseCarteraCombinada, FilaSelector } from "@/lib/armadoCartera/tipos";

const FILTROS: { id: ClaseCarteraCombinada | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "rentaFija", label: "Renta Fija" },
  { id: "rentaVariable", label: "Renta Variable" },
];

export function SelectorInstrumentosCombinado({
  filas,
  seleccionados,
  onAgregar,
}: {
  filas: FilaSelector[];
  seleccionados: Set<string>;
  onAgregar: (fila: FilaSelector) => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [clase, setClase] = useState<ClaseCarteraCombinada | "todas">("todas");

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return filas.filter((f) => {
      if (clase !== "todas" && f.clase !== clase) return false;
      if (q && !f.ticker.toLowerCase().includes(q) && !f.nombre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filas, busqueda, clase]);

  return (
    <div className="rounded-[10px] flex flex-col h-full" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium mb-3" style={{ color: "var(--navy)" }}>
          Universo combinado
        </h3>
        <input
          type="text"
          placeholder="Buscar ticker o nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full text-base sm:text-[13px] px-3 py-2.5 sm:py-2 rounded-md mb-2.5"
          style={{ border: "1px solid var(--border-strong)", background: "var(--card)" }}
        />
        <div className="flex gap-1.5 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setClase(f.id)}
              className="text-[11px] px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-full font-medium transition-colors"
              style={
                clase === f.id
                  ? { background: "var(--navy)", color: "#fff" }
                  : { background: "#EEF0F2", color: "var(--text-soft)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 560 }}>
        {filtradas.map((fila) => {
          const yaAgregado = seleccionados.has(fila.ticker);
          return (
            <div
              key={fila.ticker}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3"
              style={{ borderBottom: "1px solid #EEF0F2" }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono-brand text-[13px] font-medium truncate" style={{ color: "var(--navy)" }} title={fila.ticker}>
                  {fila.ticker}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                    style={
                      fila.clase === "rentaFija"
                        ? { background: "var(--teal-soft)", color: "var(--teal)" }
                        : { background: "var(--blue-soft)", color: "var(--blue)" }
                    }
                  >
                    {fila.clase === "rentaFija" ? "RF" : "RV"}
                  </span>
                  <span className="text-[11px] truncate" style={{ color: "var(--text-mute)" }} title={`${fila.categoriaLabel} · ${fila.nombre}`}>
                    {fila.categoriaLabel} · {fila.nombre}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onAgregar(fila)}
                disabled={yaAgregado}
                className="text-[11px] font-medium px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-md shrink-0"
                style={
                  yaAgregado
                    ? { background: "#EEF0F2", color: "var(--text-mute)" }
                    : { background: "var(--teal-soft)", color: "var(--teal)" }
                }
              >
                {yaAgregado ? "Agregado" : "+ Agregar"}
              </button>
            </div>
          );
        })}
        {filtradas.length === 0 && (
          <div className="p-6 text-center text-[13px]" style={{ color: "var(--text-mute)" }}>
            No hay instrumentos que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
