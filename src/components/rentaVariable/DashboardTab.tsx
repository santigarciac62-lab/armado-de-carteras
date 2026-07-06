"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { ActivoRV } from "@/data/rentaVariable";
import { SEÑAL_PILL, colorDeScore } from "./senalUtils";

export function DashboardTab({ activos, onVerTecnico }: { activos: ActivoRV[]; onVerTecnico: (ticker: string) => void }) {
  const comprables = activos.filter((a) => a.score >= 6.2);
  const vendibles = activos.filter((a) => a.score <= 3.2);
  const promedio = activos.reduce((acc, a) => acc + a.score, 0) / (activos.length || 1);
  const mejor = activos[0];

  const rotacionesCompra = activos.filter((a) => a.score >= 7).slice(0, 3);
  const rotacionesVenta = [...activos].filter((a) => a.score <= 4).slice(-2);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { l: "Universo cubierto", v: String(activos.length), s: "acciones + cedears" },
          { l: "Señal de compra", v: String(comprables.length), s: "score ≥ 6.2" },
          { l: "Señal de venta/reducir", v: String(vendibles.length), s: "score ≤ 3.2" },
          { l: "Mejor score hoy", v: mejor ? `${mejor.ticker} · ${mejor.score}` : "—", s: `Promedio: ${promedio.toFixed(1)}` },
        ].map((k) => (
          <div key={k.l} className="rounded-lg p-3 sm:p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--text-mute)" }}>
              {k.l}
            </div>
            <div className="font-mono-brand text-[16px] sm:text-[22px] font-semibold mt-1.5 leading-tight" style={{ color: "var(--navy)" }}>
              {k.v}
            </div>
            <div className="text-[11px] sm:text-[12px] mt-1" style={{ color: "var(--text-soft)" }}>
              {k.s}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[15px] font-medium" style={{ color: "var(--navy)" }}>
              Ranking compuesto
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {["Ticker", "Score", "Técnico", "Fundamental", "Precio", "Var. %", "Señal"].map((h) => (
                    <th
                      key={h}
                      className="text-[11px] font-medium uppercase tracking-wide px-4 py-3 text-left"
                      style={{ color: "var(--text-mute)", background: "#F6F7F8", borderBottom: "1px solid var(--border)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activos.map((a) => (
                  <tr
                    key={a.ticker}
                    onClick={() => onVerTecnico(a.ticker)}
                    className="cursor-pointer"
                    style={{ borderBottom: "1px solid #EEF0F2" }}
                  >
                    <td className="px-4 py-3 font-mono-brand text-[13px] font-medium" style={{ color: a.tipo === "cedear" ? "var(--navy-deep)" : "var(--slate)" }}>
                      {a.ticker}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative h-1.5 w-16 rounded-full" style={{ background: "#EEF0F2" }}>
                          <div className="absolute h-1.5 rounded-full" style={{ width: `${a.score * 10}%`, background: colorDeScore(a.score) }} />
                        </div>
                        <span className="font-mono-brand text-[12px]" style={{ color: colorDeScore(a.score) }}>
                          {a.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono-brand text-[12px]" style={{ color: "var(--text-mute)" }}>
                      {a.scoreTecnico}
                    </td>
                    <td className="px-4 py-3 font-mono-brand text-[12px]" style={{ color: "var(--text-mute)" }}>
                      {a.scoreFundamental}
                    </td>
                    <td className="px-4 py-3 font-mono-brand text-[13px]">${a.precio.toLocaleString("es-AR")}</td>
                    <td className="px-4 py-3 font-mono-brand text-[13px]" style={{ color: a.variacionDia >= 0 ? "var(--green)" : "var(--red)" }}>
                      {a.variacionDia >= 0 ? "+" : ""}
                      {a.variacionDia.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <span className={`pill ${SEÑAL_PILL[a.señal]}`}>{a.señal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
              Scores por activo
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activos} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EBEE" />
                <XAxis dataKey="ticker" tick={{ fontSize: 9, fill: "var(--text-mute)" }} interval={0} angle={-40} textAnchor="end" height={50} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {activos.map((a) => (
                    <Cell key={a.ticker} fill={colorDeScore(a.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
              Rotaciones sugeridas
            </h3>
            {rotacionesCompra.length === 0 && rotacionesVenta.length === 0 ? (
              <p className="text-[12px]" style={{ color: "var(--text-mute)" }}>
                Sin cambios urgentes sugeridos.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {rotacionesCompra.map((a) => (
                  <div key={a.ticker} className="flex items-start gap-2.5 text-[12px]">
                    <span className="pill pill-green shrink-0">Considerar</span>
                    <span>
                      <strong style={{ color: "var(--navy)" }}>{a.ticker}</strong>{" "}
                      <span style={{ color: "var(--text-soft)" }}>
                        score {a.score} — {a.scoreTecnico >= 7 ? "momentum técnico fuerte" : "fundamentales sólidos"}.
                      </span>
                    </span>
                  </div>
                ))}
                {rotacionesVenta.map((a) => (
                  <div key={a.ticker} className="flex items-start gap-2.5 text-[12px]">
                    <span className="pill pill-red shrink-0">Revisar</span>
                    <span>
                      <strong style={{ color: "var(--navy)" }}>{a.ticker}</strong>{" "}
                      <span style={{ color: "var(--text-soft)" }}>score {a.score} — deterioro técnico y/o fundamental.</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
