"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ActivoRV } from "@/data/rentaVariable";
import { colorDeScore } from "./senalUtils";

function fmt(v: number | null, d = 1) {
  return v != null && !isNaN(v) ? v.toFixed(d) : "—";
}
function pct(v: number | null) {
  return v != null && !isNaN(v) ? `${(v * 100).toFixed(1)}%` : "—";
}

export function FundamentalTab({
  activos,
  activo,
  onSeleccionar,
}: {
  activos: ActivoRV[];
  activo: ActivoRV;
  onSeleccionar: (ticker: string) => void;
}) {
  const dataValuacion = [
    { metrica: "P/E", [activo.ticker]: activo.pe ?? 0, Benchmark: activo.benchmarkPE },
    { metrica: "EV/EBITDA", [activo.ticker]: activo.evEbitda ?? 0, Benchmark: activo.benchmarkPE * 0.55 },
    { metrica: "P/Book", [activo.ticker]: activo.pb ?? 0, Benchmark: 2.5 },
  ];

  const dataRentabilidad = [
    { metrica: "ROE %", valor: activo.roe != null ? +(activo.roe * 100).toFixed(1) : null },
    { metrica: "Mg. neto %", valor: activo.margenNeto != null ? +(activo.margenNeto * 100).toFixed(1) : null },
    { metrica: "Rev. crec. %", valor: activo.crecimientoRevenue != null ? +(activo.crecimientoRevenue * 100).toFixed(1) : null },
    { metrica: "EPS crec. %", valor: activo.crecimientoEps != null ? +(activo.crecimientoEps * 100).toFixed(1) : null },
  ];

  const partes: string[] = [];
  if (activo.pe && activo.pe > 0 && activo.pe < activo.benchmarkPE * 0.85) {
    partes.push(`P/E de ${fmt(activo.pe)}x — valuación atractiva vs. benchmark de ${activo.benchmarkPE}x.`);
  } else if (activo.pe && activo.pe > 0) {
    partes.push(`P/E de ${fmt(activo.pe)}x.`);
  }
  if (activo.roe && activo.roe > 0.2) partes.push(`ROE de ${pct(activo.roe)} — excelente generación de valor para el accionista.`);
  else if (activo.roe && activo.roe > 0) partes.push(`ROE de ${pct(activo.roe)}.`);
  if (activo.margenNeto && activo.margenNeto > 0.2) partes.push(`Margen neto de ${pct(activo.margenNeto)} — empresa muy eficiente.`);
  else if (activo.margenNeto && activo.margenNeto > 0) partes.push(`Margen neto: ${pct(activo.margenNeto)}.`);
  if (activo.crecimientoRevenue && activo.crecimientoRevenue > 0.2) {
    partes.push(`Crecimiento de revenue +${pct(activo.crecimientoRevenue)} interanual — por encima del promedio.`);
  } else if (activo.crecimientoRevenue && activo.crecimientoRevenue > 0) {
    partes.push(`Revenue interanual: +${pct(activo.crecimientoRevenue)}.`);
  }

  const cards: [string, string][] = [
    ["P/E", activo.pe ? `${fmt(activo.pe)}x` : "—"],
    ["EV/EBITDA", activo.evEbitda ? `${fmt(activo.evEbitda)}x` : "—"],
    ["P/Book", activo.pb ? `${fmt(activo.pb, 2)}x` : "—"],
    ["ROE", pct(activo.roe)],
    ["Mg. neto", pct(activo.margenNeto)],
    ["Rev. YoY", activo.crecimientoRevenue ? `+${pct(activo.crecimientoRevenue)}` : "—"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {activos.map((a) => (
          <button
            key={a.ticker}
            onClick={() => onSeleccionar(a.ticker)}
            className="text-[11px] px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-full font-mono-brand font-medium transition-colors"
            style={
              a.ticker === activo.ticker
                ? { background: "var(--navy)", color: "#fff" }
                : { background: "#EEF0F2", color: "var(--text-soft)" }
            }
          >
            {a.ticker}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            Valuación vs. benchmark sectorial
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataValuacion} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EBEE" />
              <XAxis dataKey="metrica" tick={{ fontSize: 11, fill: "var(--text-mute)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey={activo.ticker} fill="var(--teal)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Benchmark" fill="#C8C8C8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            Rentabilidad
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataRentabilidad} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EBEE" />
              <XAxis dataKey="metrica" tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Bar dataKey="valor" fill="var(--blue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[10px] p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex flex-wrap items-baseline gap-3 mb-3">
          <span className="font-mono-brand text-[22px] font-semibold" style={{ color: activo.tipo === "cedear" ? "var(--navy-deep)" : "var(--slate)" }}>
            {activo.ticker}
          </span>
          <span className="text-[13px] font-medium" style={{ color: colorDeScore(activo.score) }}>
            {activo.señal}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-mute)" }}>
            {activo.sector}
          </span>
          <span className="ml-auto text-[11px]" style={{ color: "var(--text-mute)" }}>
            Fuente: demo (último reporte disponible)
          </span>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-soft)" }}>
          {partes.join(" ") || "Sin datos de análisis disponibles."}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-md px-3 py-2 min-w-[90px]" style={{ background: "#F6F7F8", border: "1px solid var(--border)" }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
                {label}
              </div>
              <div className="font-mono-brand text-[14px] font-semibold mt-0.5" style={{ color: "var(--text)" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
