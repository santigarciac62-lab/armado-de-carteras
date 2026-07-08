"use client";

import { Moneda } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { AnalisisInstrumento } from "./AnalisisInstrumento";

export function PanelCartera({
  lineas,
  totalPct,
  montoTotal,
  moneda,
  expandido,
  onToggleExpandir,
  onCambiarPct,
  onQuitar,
  onNormalizar,
  justificaciones,
  onJustificacionChange,
}: {
  lineas: LineaCombinadaCalculada[];
  totalPct: number;
  montoTotal: number;
  moneda: Moneda;
  expandido: string | null;
  onToggleExpandir: (ticker: string) => void;
  onCambiarPct: (ticker: string, pct: number) => void;
  onQuitar: (ticker: string) => void;
  onNormalizar: () => void;
  justificaciones: Record<string, string>;
  onJustificacionChange: (ticker: string, texto: string) => void;
}) {
  const simbolo = moneda === "USD" ? "USD " : "$";
  const desviado = Math.abs(totalPct - 100) > 0.05;
  const lineaExpandida = expandido ? lineas.find((l) => l.ticker === expandido) : undefined;

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
          Cartera en armado
        </h3>
        {desviado && lineas.length > 0 && (
          <button
            onClick={onNormalizar}
            className="text-[11px] font-medium px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-md"
            style={{ background: "var(--blue-soft)", color: "var(--blue)" }}
          >
            Normalizar a 100%
          </button>
        )}
      </div>

      {lineas.length === 0 ? (
        <div className="p-8 text-center text-[13px]" style={{ color: "var(--text-mute)" }}>
          Todavía no agregaste instrumentos. Buscalos en el universo combinado de Renta Fija y Renta
          Variable de la izquierda.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {["Instrumento", "% Cartera", "Monto", "", ""].map((h, i) => (
                    <th
                      key={`${h}-${i}`}
                      className={`text-[11px] font-medium uppercase tracking-wide px-4 py-3 ${i > 0 && i < 3 ? "text-right" : "text-left"}`}
                      style={{ color: "var(--text-mute)", background: "#F6F7F8", borderBottom: "1px solid var(--border)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lineas.map((l) => (
                  <tr key={l.ticker} style={{ borderBottom: "1px solid #EEF0F2" }}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                          style={
                            l.clase === "rentaFija"
                              ? { background: "var(--teal-soft)", color: "var(--teal)" }
                              : { background: "var(--blue-soft)", color: "var(--blue)" }
                          }
                        >
                          {l.clase === "rentaFija" ? "RF" : "RV"}
                        </span>
                        <span className="font-mono-brand text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                          {l.ticker}
                        </span>
                      </div>
                      <div className="text-[11px] mt-0.5 truncate max-w-[220px]" style={{ color: "var(--text-mute)" }}>
                        {l.categoriaLabel}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={l.pct}
                        onChange={(e) => onCambiarPct(l.ticker, parseFloat(e.target.value) || 0)}
                        className="w-[64px] sm:w-[68px] text-right font-mono-brand text-[16px] sm:text-[13px] px-2 py-1.5 rounded-md"
                        style={{ border: "1px solid var(--border-strong)" }}
                      />
                      <span className="text-[12px] ml-1" style={{ color: "var(--text-mute)" }}>%</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono-brand text-[13px]" style={{ color: "var(--text)" }}>
                      {simbolo}
                      {Math.round(l.monto).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => onToggleExpandir(l.ticker)}
                        className="text-[12px] px-2.5 py-2 rounded whitespace-nowrap"
                        style={{ color: "var(--text-mute)" }}
                      >
                        {expandido === l.ticker ? "▲ Análisis" : "▼ Análisis"}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => onQuitar(l.ticker)}
                        className="text-[15px] px-2.5 py-2 rounded"
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
                  <td className="px-4 py-3 text-[12px] font-medium" style={{ color: "var(--text-soft)" }}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`pill ${Math.abs(totalPct - 100) < 0.05 ? "pill-green" : Math.abs(totalPct - 100) < 5 ? "pill-amber" : "pill-red"}`}>
                      {totalPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono-brand text-[14px] font-semibold" style={{ color: "var(--navy)" }}>
                    {simbolo}
                    {Math.round(montoTotal).toLocaleString("es-AR")}
                  </td>
                  <td />
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Fuera del contenedor con scroll horizontal a propósito: el panel de análisis
              es contenido rico (gráfico, tiles, textarea) pensado para reflow completo,
              no para vivir adentro de una tabla angosta con scroll lateral. */}
          {lineaExpandida && (
            <div style={{ borderTop: "1px solid var(--border)" }}>
              <AnalisisInstrumento
                linea={lineaExpandida}
                justificacion={justificaciones[lineaExpandida.ticker] ?? ""}
                onJustificacionChange={(texto) => onJustificacionChange(lineaExpandida.ticker, texto)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
