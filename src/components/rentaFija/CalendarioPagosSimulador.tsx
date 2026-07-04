"use client";

import { useMemo, useState } from "react";
import { InstrumentoRentaFija, LineaRentaFija } from "@/lib/types";
import { TablaInstrumentos } from "./TablaInstrumentos";
import { CalendarioPagosView } from "./CalendarioPagosView";
import { agruparPorMes, consolidarCalendario } from "@/lib/rentaFija";
import { fmtFecha } from "@/lib/formato";
import { EMISORES_RENTA_FIJA } from "@/data/rentaFija";

const NOMINAL_INICIAL = 1000;

export function CalendarioPagosSimulador({ instrumentos }: { instrumentos: InstrumentoRentaFija[] }) {
  const [lineas, setLineas] = useState<LineaRentaFija[]>([]);

  const seleccionados = useMemo(() => new Set(lineas.map((l) => l.ticker)), [lineas]);

  const agregar = (ticker: string) => {
    setLineas((prev) => (prev.some((l) => l.ticker === ticker) ? prev : [...prev, { ticker, nominal: NOMINAL_INICIAL }]));
  };
  const quitar = (ticker: string) => setLineas((prev) => prev.filter((l) => l.ticker !== ticker));
  const cambiarNominal = (ticker: string, nominal: number) =>
    setLineas((prev) => prev.map((l) => (l.ticker === ticker ? { ...l, nominal } : l)));

  const flujos = useMemo(() => consolidarCalendario(lineas, instrumentos), [lineas, instrumentos]);
  const porMes = useMemo(() => agruparPorMes(flujos), [flujos]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[13px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
        Elegí instrumentos del universo de renta fija e indicá el nominal de cada uno para ver el calendario
        de pagos proyectado (cupones y capital) consolidado por mes.
      </p>

      <TablaInstrumentos instrumentos={instrumentos} emisores={EMISORES_RENTA_FIJA} onAgregar={agregar} seleccionados={seleccionados} />

      {lineas.length > 0 && (
        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[16px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            Instrumentos seleccionados
          </h3>
          <div className="flex flex-col gap-2">
            {lineas.map((l) => {
              const inst = instrumentos.find((i) => i.ticker === l.ticker);
              return (
                <div key={l.ticker} className="flex flex-wrap items-center gap-3 text-[13px]">
                  <span className="font-mono-brand font-medium w-[80px]" style={{ color: "var(--navy)" }}>
                    {l.ticker}
                  </span>
                  <span className="text-[12px] flex-1 min-w-[120px]" style={{ color: "var(--text-mute)" }}>
                    {inst?.vencimiento ? `vto. ${fmtFecha(inst.vencimiento)}` : ""}
                  </span>
                  <label className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
                    Nominal
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={l.nominal}
                    onChange={(e) => cambiarNominal(l.ticker, parseFloat(e.target.value) || 0)}
                    className="w-[110px] text-right font-mono-brand text-[13px] px-2 py-1.5 rounded-md"
                    style={{ border: "1px solid var(--border-strong)" }}
                  />
                  <button
                    onClick={() => quitar(l.ticker)}
                    className="text-[15px] px-2 py-1 rounded"
                    style={{ color: "var(--text-mute)" }}
                    aria-label={`Quitar ${l.ticker}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-[10px] p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium mb-4" style={{ color: "var(--navy)" }}>
          Calendario de pagos proyectado
        </h3>
        <CalendarioPagosView flujos={flujos} porMes={porMes} />
      </div>
    </div>
  );
}
