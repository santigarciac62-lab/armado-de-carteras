"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutDatum {
  categoria: string;
  pct: number;
  color: string;
}

export function CategoriaDonut({
  data,
  centerLabel,
  centerValue,
}: {
  data: DonutDatum[];
  centerLabel: string;
  centerValue: string;
}) {
  const dataConValor = data.filter((d) => d.pct > 0);

  return (
    <div className="relative w-[150px] h-[150px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataConValor}
            dataKey="pct"
            nameKey="categoria"
            innerRadius={44}
            outerRadius={70}
            paddingAngle={dataConValor.length > 1 ? 1.5 : 0}
            stroke="none"
          >
            {dataConValor.map((d) => (
              <Cell key={d.categoria} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontFamily: "var(--font-lato)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-brand text-[15px] font-semibold" style={{ color: "var(--navy)" }}>
          {centerValue}
        </span>
        <span className="text-[9px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
