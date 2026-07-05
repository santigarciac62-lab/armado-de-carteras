"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RevenueOficial } from "@/lib/types";

export function GraficoRevenue({ revenue }: { revenue: RevenueOficial[] }) {
  const data = [...revenue]
    .sort((a, b) => b.totalUsd - a.totalUsd)
    .map((r) => ({
      oficial: r.oficial.split(",")[0],
      "Q1 2026": Math.round(r.q1Usd),
      "Q2 2026": Math.round(r.q2Usd),
    }));

  return (
    <div className="rounded-[10px] p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 className="font-serif-brand text-[15px] sm:text-[16px] font-medium mb-4" style={{ color: "var(--navy)" }}>
        Revenue Q1 vs Q2 2026 por oficial (USD)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 0, right: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EBEE" />
          <XAxis
            dataKey="oficial"
            tick={{ fontSize: 10, fill: "var(--text-mute)" }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={70}
          />
          <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "var(--text-mute)" }} />
          <Tooltip
            formatter={(value) => `USD ${Number(value).toLocaleString("es-AR")}`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Q1 2026" fill="#7FA8C9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Q2 2026" fill="#0097B2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
