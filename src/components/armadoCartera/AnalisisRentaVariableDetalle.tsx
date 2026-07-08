"use client";

import { CartesianGrid, Line, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ActivoRV } from "@/data/rentaVariable";
import { colorDeScore } from "@/components/rentaVariable/senalUtils";

/** Versión condensada del análisis técnico + fundamental de Renta Variable, pensada para
 * un panel expandible dentro de la cartera combinada (no reemplaza las pestañas completas
 * de Técnico/Fundamental de la pantalla "Renta Variable", que siguen siendo el lugar para
 * el análisis chart-por-chart en profundidad). La señal ya se muestra en el pill del
 * encabezado de AnalisisInstrumento, por eso no se repite acá como tile. */
export function AnalisisRentaVariableDetalle({ activo }: { activo: ActivoRV }) {
  const tendencia = activo.precio > activo.ma200 ? "Alcista" : "Bajista";

  const tiles = [
    { label: "Score", valor: `${activo.score}/10`, color: colorDeScore(activo.score) },
    { label: "RSI (14)", valor: String(activo.rsi), color: activo.rsi > 70 ? "var(--red)" : activo.rsi < 30 ? "var(--green)" : "var(--text)" },
    { label: "Tendencia", valor: tendencia, color: tendencia === "Alcista" ? "var(--green)" : "var(--red)" },
    { label: "P/E vs. benchmark", valor: activo.pe ? `${activo.pe.toFixed(1)}x / ${activo.benchmarkPE}x` : "—", color: "var(--text)" },
    { label: "ROE", valor: activo.roe != null ? `${(activo.roe * 100).toFixed(1)}%` : "—", color: "var(--text)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-md p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
            {t.label}
          </div>
          <div className="font-mono-brand text-[14px] font-semibold mt-1" style={{ color: t.color }}>
            {t.valor}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Gráfico de precio + SMA20, separado de las tiles para poder ubicarlo al lado de la
 * justificación en el layout del panel expandido (ver AnalisisInstrumento.tsx). */
export function GraficoPrecioRentaVariable({ activo }: { activo: ActivoRV }) {
  const dataPrecio = activo.historico.map((h, i) => ({
    fecha: h.fecha,
    precio: h.precio,
    sma20: activo.sma20[i],
  }));

  return (
    <div>
      <div className="rounded-md p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={dataPrecio} margin={{ left: 0, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E9EBEE" />
            <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: "var(--text-mute)" }} minTickGap={50} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 9, fill: "var(--text-mute)" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
            <Line type="monotone" dataKey="precio" stroke="var(--teal)" strokeWidth={1.5} dot={false} name="Precio" />
            <Line type="monotone" dataKey="sma20" stroke="var(--amber)" strokeWidth={1} dot={false} strokeDasharray="4 2" name="SMA 20" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] mt-2" style={{ color: "var(--text-mute)" }}>
        Precio {activo.fuentePrecio === "demo" ? "de demostración" : `en vivo (${activo.fuentePrecio === "data912" ? "Data912" : "Twelve Data"})`}
        {" · "}histórico técnico simulado — ver pantalla Renta Variable para el análisis completo por gráfico.
      </p>
    </div>
  );
}
