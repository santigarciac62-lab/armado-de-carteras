"use client";

import { useMemo, useState } from "react";
import { InstrumentoRentaFija, LineaCartera, LineaRentaFija, Moneda } from "@/lib/types";
import { TablaInstrumentos } from "./TablaInstrumentos";
import { CalendarioPagosView } from "./CalendarioPagosView";
import { agruparPorMes, consolidarCalendario } from "@/lib/rentaFija";
import { TC_REFERENCIA } from "@/lib/constants";
import { fmtNum } from "@/lib/formato";
import { EMISORES_RENTA_FIJA } from "@/data/rentaFija";

function SegmentedMoneda({ valor, onChange }: { valor: Moneda; onChange: (m: Moneda) => void }) {
  return (
    <div className="grid grid-cols-2 rounded-md overflow-hidden" style={{ border: "1px solid var(--border-strong)" }}>
      {(["ARS", "USD"] as Moneda[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="text-[13px] px-3 py-2 font-medium transition-colors"
          style={valor === m ? { background: "var(--navy)", color: "#fff" } : { background: "#FAFBFC", color: "var(--text-soft)" }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

export function ArmarCarteraPorMonto({ instrumentos }: { instrumentos: InstrumentoRentaFija[] }) {
  const [montoTexto, setMontoTexto] = useState("10.000.000");
  const [monedaMonto, setMonedaMonto] = useState<Moneda>("ARS");
  const [lineas, setLineas] = useState<LineaCartera[]>([]);

  const seleccionados = useMemo(() => new Set(lineas.map((l) => l.ticker)), [lineas]);
  const totalPct = useMemo(() => Math.round(lineas.reduce((a, l) => a + l.pct, 0) * 100) / 100, [lineas]);

  const monto = useMemo(() => {
    const n = parseFloat(montoTexto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [montoTexto]);

  const agregar = (ticker: string) => {
    setLineas((prev) => {
      if (prev.some((l) => l.ticker === ticker)) return prev;
      const restante = Math.max(0, 100 - prev.reduce((a, l) => a + l.pct, 0));
      return [...prev, { ticker, pct: Math.round(Math.min(20, restante > 0 ? restante : 20) * 10) / 10 }];
    });
  };
  const quitar = (ticker: string) => setLineas((prev) => prev.filter((l) => l.ticker !== ticker));
  const cambiarPct = (ticker: string, pct: number) =>
    setLineas((prev) => prev.map((l) => (l.ticker === ticker ? { ...l, pct } : l)));
  const normalizar = () =>
    setLineas((prev) => {
      const total = prev.reduce((a, l) => a + l.pct, 0);
      if (total <= 0) return prev;
      return prev.map((l) => ({ ...l, pct: Math.round((l.pct / total) * 10000) / 100 }));
    });

  const lineasCalculadas = useMemo(() => {
    return lineas.map((l) => {
      const inst = instrumentos.find((i) => i.ticker === l.ticker);
      const montoLinea = (monto * l.pct) / 100;
      const montoEnMonedaInstrumento =
        inst && inst.moneda !== monedaMonto
          ? monedaMonto === "ARS"
            ? montoLinea / TC_REFERENCIA
            : montoLinea * TC_REFERENCIA
          : montoLinea;
      const precio = inst?.precioDirty ?? inst?.precioClean ?? null;
      const nominal = precio ? (montoEnMonedaInstrumento / precio) * 100 : null;
      return { ...l, instrumento: inst, montoLinea, montoEnMonedaInstrumento, nominal };
    });
  }, [lineas, instrumentos, monto, monedaMonto]);

  const lineasRentaFija: LineaRentaFija[] = useMemo(
    () =>
      lineasCalculadas
        .filter((l) => l.nominal !== null)
        .map((l) => ({ ticker: l.ticker, nominal: l.nominal as number })),
    [lineasCalculadas]
  );

  const flujos = useMemo(() => consolidarCalendario(lineasRentaFija, instrumentos), [lineasRentaFija, instrumentos]);
  const porMes = useMemo(() => agruparPorMes(flujos), [flujos]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-[13px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
        Ingresá un monto, elegí instrumentos con su ponderación y calculamos cuánto nominal comprar de cada
        uno — y el calendario de pagos consolidado que resulta de esa cartera.
      </p>

      <div
        className="rounded-[10px] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Monto a invertir
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={montoTexto}
            onChange={(e) => setMontoTexto(e.target.value)}
            className="w-full font-mono-brand text-base sm:text-[15px] px-3 py-2.5 sm:py-2 rounded-md"
            style={{ border: "1px solid var(--border-strong)" }}
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Moneda del monto
          </label>
          <SegmentedMoneda valor={monedaMonto} onChange={setMonedaMonto} />
        </div>
      </div>

      <TablaInstrumentos instrumentos={instrumentos} emisores={EMISORES_RENTA_FIJA} onAgregar={agregar} seleccionados={seleccionados} />

      {lineasCalculadas.length > 0 && (
        <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
              Cartera armada
            </h3>
            {Math.abs(totalPct - 100) > 0.05 && (
              <button
                onClick={normalizar}
                className="text-[11px] font-medium px-2.5 py-1.5 rounded-md"
                style={{ background: "var(--gold-soft)", color: "var(--gold)" }}
              >
                Normalizar a 100%
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {["Instrumento", "%", "Monto asignado", "Nominal a comprar", ""].map((h, i) => (
                    <th
                      key={h}
                      className={`text-[11px] font-medium uppercase tracking-wide px-3 py-2.5 ${i >= 1 && i <= 3 ? "text-right" : "text-left"}`}
                      style={{ color: "var(--text-mute)", background: "#F8FAFB", borderBottom: "1px solid var(--border)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lineasCalculadas.map((l) => (
                  <tr key={l.ticker} style={{ borderBottom: "1px solid #F1F4F8" }}>
                    <td className="px-3 py-2.5 font-mono-brand text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                      {l.ticker}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={l.pct}
                        onChange={(e) => cambiarPct(l.ticker, parseFloat(e.target.value) || 0)}
                        className="w-[64px] text-right font-mono-brand text-[13px] px-2 py-1.5 rounded-md"
                        style={{ border: "1px solid var(--border-strong)" }}
                      />
                      <span className="text-[12px] ml-1" style={{ color: "var(--text-mute)" }}>%</span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono-brand text-[13px]">
                      {monedaMonto === "USD" ? "USD " : "$"}
                      {fmtNum(l.montoLinea, 0)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono-brand text-[13px]">
                      {l.nominal === null ? (
                        <span style={{ color: "var(--text-mute)" }}>sin precio</span>
                      ) : (
                        fmtNum(l.nominal, 0)
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => quitar(l.ticker)}
                        className="text-[15px] px-2 py-1 rounded"
                        style={{ color: "var(--text-mute)" }}
                        aria-label={`Quitar ${l.ticker}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-3 py-3 text-[12px] font-medium" style={{ color: "var(--text-soft)" }}>
                    Total
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={`pill ${Math.abs(totalPct - 100) < 0.05 ? "pill-green" : Math.abs(totalPct - 100) < 5 ? "pill-amber" : "pill-red"}`}
                    >
                      {totalPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-mono-brand text-[14px] font-semibold" style={{ color: "var(--navy)" }}>
                    {monedaMonto === "USD" ? "USD " : "$"}
                    {fmtNum(monto, 0)}
                  </td>
                  <td />
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-[10px] p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium mb-4" style={{ color: "var(--navy)" }}>
          Calendario de pagos consolidado de esta cartera
        </h3>
        <CalendarioPagosView flujos={flujos} porMes={porMes} />
      </div>
    </div>
  );
}
