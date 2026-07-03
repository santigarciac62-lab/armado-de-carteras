"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OficialEnriquecido } from "@/data/oficiales";

const PALETA = ["#0B1F3F", "#1B8E9C", "#C99C2E", "#5B7A99", "#8FB5D1", "#3A5686", "#59B4C0", "#8A95A7"];

export function GraficoAumPorOficial({ oficiales }: { oficiales: OficialEnriquecido[] }) {
  const data = [...oficiales]
    .sort((a, b) => b.aumUsd - a.aumUsd)
    .map((o) => ({ oficial: o.oficial.split(",")[0], aumUsd: Math.round(o.aumUsd) }));

  return (
    <div className="rounded-[10px] p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 className="font-serif-brand text-[16px] font-medium mb-4" style={{ color: "var(--navy)" }}>
        AUM por oficial (USD)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F4F8" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${Math.round(v / 1_000_000)}M`}
            tick={{ fontSize: 11, fill: "var(--text-mute)" }}
          />
          <YAxis
            type="category"
            dataKey="oficial"
            width={110}
            tick={{ fontSize: 12, fill: "var(--text)" }}
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
