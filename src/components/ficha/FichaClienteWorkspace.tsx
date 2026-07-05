"use client";

import { useMemo, useState } from "react";
import { ClienteEnriquecido } from "@/lib/types";
import { PERFIL_LABEL, STATUS_LABEL } from "@/lib/bucket";
import { BotonFichaPdf } from "@/components/desvios/BotonFichaPdf";
import { FichaClientePreview } from "./FichaClientePreview";

export function FichaClienteWorkspace({ clientes }: { clientes: ClienteEnriquecido[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<ClienteEnriquecido | null>(null);

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return [];
    return clientes
      .filter((c) => c.denominacion.toLowerCase().includes(q) || String(c.numero).includes(q))
      .slice(0, 8);
  }, [clientes, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <label
          className="block text-[11px] uppercase tracking-wide font-medium mb-1.5"
          style={{ color: "var(--text-mute)" }}
        >
          Buscar cliente
        </label>
        <input
          type="text"
          placeholder="Nombre o número de comitente…"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setSeleccionado(null);
          }}
          className="w-full text-base sm:text-[13px] px-3 py-2.5 sm:py-2 rounded-md"
          style={{ border: "1px solid var(--border-strong)" }}
        />

        {busqueda && !seleccionado && (
          <div className="mt-2 flex flex-col gap-1 max-h-[320px] overflow-y-auto">
            {resultados.length === 0 && (
              <p className="text-[13px] px-1 py-2" style={{ color: "var(--text-mute)" }}>
                Sin resultados.
              </p>
            )}
            {resultados.map((c) => (
              <button
                key={c.numero}
                onClick={() => {
                  setSeleccionado(c);
                  setBusqueda(c.denominacion);
                }}
                className="text-left px-3 py-2.5 rounded-md flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5"
                style={{ background: "#F6F7F8" }}
              >
                <span>
                  <span className="text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                    {c.denominacion}
                  </span>
                  <span className="text-[11px] font-mono-brand ml-2" style={{ color: "var(--text-mute)" }}>
                    #{c.numero}
                  </span>
                </span>
                <span className="text-[12px]" style={{ color: "var(--text-soft)" }}>
                  {PERFIL_LABEL[c.perfilGrupo]} · {c.oficial}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {seleccionado && (
        <div
          className="rounded-[10px] p-4 sm:p-5 flex flex-col gap-4"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-medium" style={{ color: "var(--navy)" }}>
                {seleccionado.denominacion}
              </div>
              <div className="text-[12px]" style={{ color: "var(--text-mute)" }}>
                #{seleccionado.numero} · {seleccionado.oficial} · {STATUS_LABEL[seleccionado.statusSemaforo]}
              </div>
            </div>
            <BotonFichaPdf cliente={seleccionado} />
          </div>
          <FichaClientePreview cliente={seleccionado} />
        </div>
      )}

      {!seleccionado && !busqueda && (
        <div className="rounded-[10px] p-8 text-center text-[13px]" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-mute)" }}>
          Buscá un cliente para ver el preview de su ficha.
        </div>
      )}
    </div>
  );
}
