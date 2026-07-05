"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OficialEnriquecido } from "@/data/oficiales";

const PALETA = ["#12375F", "#0097B2", "#1362AD", "#616161", "#00012B", "#4FB8C9", "#4A6E9B", "#9A9A9A"];

export function GraficoAumPorOficial({ oficiales }: { oficiales: OficialEnriquecido[] }) {
  const data = [...oficiales]
    .sort((a, b) => b.aumUsd - a.aumUsd)
    .map((o) => ({ oficial: o.oficial.split(",")[0], aumUsd: Math.round(o.aumUsd) }));

  return (
    <div className="rounded-[10px] p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 className="font-serif-brand text-[15px] sm:text-[16px] font-medium mb-4" style={{ color: "var(--navy)" }}>
        AUM por oficial (USD)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E9EBEE" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
            tick={{ fontSize: 11, fill: "var(--text-mute)" }}
          />
          <YAxis
            type="category"
            dataKey="oficial"
            width={90}
            tick={{ fontSize: 11, fill: "var(--text)" }}
          />
          <Tooltip
            formatter={(value) => [`USD ${Number(value).toLocaleString("es-AR")}`, "AUM"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
          />
          <Bar dataKey="aumUsd" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={PALETA[i % PALETA.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
