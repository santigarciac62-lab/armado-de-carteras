"use client";

import { LineaCalculada } from "@/lib/armado";
import { Moneda } from "@/lib/types";
import { PriceTag } from "./PriceTag";

export function CarteraEnArmado({
  lineas,
  totalPct,
  montoTotal,
  monedaCartera,
  onCambiarPct,
  onQuitar,
  onNormalizar,
}: {
  lineas: LineaCalculada[];
  totalPct: number;
  montoTotal: number;
  monedaCartera: Moneda;
  onCambiarPct: (ticker: string, pct: number) => void;
  onQuitar: (ticker: string) => void;
  onNormalizar: () => void;
}) {
  const simbolo = monedaCartera === "USD" ? "USD " : "$";
  const desviado = Math.abs(totalPct - 100) > 0.05;

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="flex items-center justify-between p-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
          Tu cartera en armado
        </h3>
        {desviado && lineas.length > 0 && (
          <button
            onClick={onNormalizar}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-md"
            style={{ background: "var(--gold-soft)", color: "var(--gold)" }}
          >
            Normalizar a 100%
          </button>
        )}
      </div>

      {lineas.length === 0 ? (
        <div className="p-8 text-center text-[13px]" style={{ color: "var(--text-mute)" }}>
          Todavía no agregaste instrumentos. Elegí un perfil como punto de partida o sumalos manualmente
          desde el universo recomendado.
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              {["Instrumento", "Precio / Var.", "% Cartera", "Monto", ""].map((h, i) => (
                <th
                  key={h}
                  className={`text-[11px] font-medium uppercase tracking-wide px-4 py-3 ${
                    i > 1 ? "text-right" : "text-left"
                  }`}
                  style={{ color: "var(--text-mute)", background: "#F8FAFB", borderBottom: "1px solid var(--border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lineas.map((l) => (
              <tr key={l.ticker} style={{ borderBottom: "1px solid #F1F4F8" }}>
                <td className="px-4 py-2.5">
                  <div className="font-mono-brand text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                    {l.ticker}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>
                    {l.categoria}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <PriceTag cotizacion={l.cotizacion} />
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
              <td />
              <td className="px-4 py-3 text-right">
                <span
                  className={`pill ${
                    Math.abs(totalPct - 100) < 0.05
                      ? "pill-green"
                      : Math.abs(totalPct - 100) < 5
                        ? "pill-amber"
                        : "pill-red"
                  }`}
                >
                  {totalPct.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono-brand text-[14px] font-semibold" style={{ color: "var(--navy)" }}>
                {simbolo}
                {Math.round(montoTotal).toLocaleString("es-AR")}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
        </div>
      )}
    </div>
  );
}
