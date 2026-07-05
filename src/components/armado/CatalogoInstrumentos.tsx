"use client";

import { useMemo, useState } from "react";
import { Bucket, Cotizacion, Instrumento } from "@/lib/types";
import { PriceTag } from "./PriceTag";

const BUCKETS: (Bucket | "Todas")[] = ["Todas", "FCI", "Soberanos", "ON", "Acciones", "Cedears"];

export function CatalogoInstrumentos({
  instrumentos,
  cotizaciones,
  seleccionados,
  onAgregar,
}: {
  instrumentos: Instrumento[];
  cotizaciones: Record<string, Cotizacion>;
  seleccionados: Set<string>;
  onAgregar: (ticker: string) => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [bucket, setBucket] = useState<Bucket | "Todas">("Todas");

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return instrumentos.filter((i) => {
      if (bucket !== "Todas" && i.bucket !== bucket) return false;
      if (q && !i.ticker.toLowerCase().includes(q) && !i.nombre.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [instrumentos, busqueda, bucket]);

  return (
    <div
      className="rounded-[10px] flex flex-col h-full"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium mb-3" style={{ color: "var(--navy)" }}>
          Universo recomendado
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
          {BUCKETS.map((b) => (
            <button
              key={b}
              onClick={() => setBucket(b)}
              className="text-[11px] px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-full font-medium transition-colors"
              style={
                bucket === b
                  ? { background: "var(--navy)", color: "#fff" }
                  : { background: "#EEF0F2", color: "var(--text-soft)" }
              }
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 560 }}>
        {filtrados.map((inst) => {
          const yaAgregado = seleccionados.has(inst.ticker);
          return (
            <div
              key={inst.ticker}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3"
              style={{ borderBottom: "1px solid #EEF0F2" }}
            >
              <div className="flex-1 min-w-0">
                <div
                  className="font-mono-brand text-[13px] font-medium truncate"
                  style={{ color: "var(--navy)" }}
                  title={inst.ticker}
                >
                  {inst.ticker}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[10px] shrink-0 bk-${inst.bucket}`}
                    style={{ fontWeight: 500 }}
                  >
                    {inst.categoria}
                  </span>
                  <span className="text-[11px] truncate" style={{ color: "var(--text-mute)" }} title={inst.nombre}>
                    · {inst.nombre}
                  </span>
                </div>
              </div>
              <PriceTag cotizacion={cotizaciones[inst.ticker]} />
              <button
                onClick={() => onAgregar(inst.ticker)}
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
        {filtrados.length === 0 && (
          <div className="p-6 text-center text-[13px]" style={{ color: "var(--text-mute)" }}>
            No hay instrumentos que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
}
