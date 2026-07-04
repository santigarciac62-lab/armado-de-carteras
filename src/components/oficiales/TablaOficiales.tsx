"use client";

import { useMemo, useState } from "react";
import { OficialEnriquecido } from "@/data/oficiales";

type Orden = "aum" | "cuentas" | "desvio" | "fees";

export function TablaOficiales({ oficiales }: { oficiales: OficialEnriquecido[] }) {
  const [orden, setOrden] = useState<Orden>("aum");

  const ordenados = useMemo(() => {
    return [...oficiales].sort((a, b) => {
      if (orden === "aum") return b.aumUsd - a.aumUsd;
      if (orden === "cuentas") return b.cuentas - a.cuentas;
      if (orden === "fees") return b.feesQ1Q2 - a.feesQ1Q2;
      return (b.desvioPromedioPonderado ?? -1) - (a.desvioPromedioPonderado ?? -1);
    });
  }, [oficiales, orden]);

  const columnas: { key: Orden | "none"; label: string }[] = [
    { key: "none", label: "Oficial" },
    { key: "cuentas", label: "Cuentas" },
    { key: "none", label: "% Tenencia" },
    { key: "aum", label: "AUM (USD)" },
    { key: "none", label: "% AUM" },
    { key: "desvio", label: "Desvío prom." },
    { key: "none", label: "Cuentas a revisar" },
    { key: "fees", label: "Fees Q1+Q2 (USD)" },
  ];

  return (
    <div className="rounded-[10px] overflow-x-auto" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 720 }}>
        <thead>
          <tr>
            {columnas.map((c) => (
              <th
                key={c.label}
                onClick={() => c.key !== "none" && setOrden(c.key)}
                className={`text-[11px] font-medium uppercase tracking-wide px-4 py-3 text-left ${
                  c.key !== "none" ? "cursor-pointer select-none" : ""
                }`}
                style={{
                  color: orden === c.key ? "var(--navy)" : "var(--text-mute)",
                  background: "#F8FAFB",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {c.label}
                {orden === c.key ? " ▾" : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenados.map((o) => (
            <tr key={o.oficial} style={{ borderBottom: "1px solid #F1F4F8" }}>
              <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                {o.oficial}
              </td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">
                {o.conTenencia}/{o.cuentas}
              </td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">{(o.pctTenencia * 100).toFixed(0)}%</td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">
                {Math.round(o.aumUsd).toLocaleString("es-AR")}
              </td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">{(o.pctAum * 100).toFixed(1)}%</td>
              <td className="px-4 py-3">
                {o.desvioPromedioPonderado === null ? (
                  <span style={{ color: "var(--text-mute)" }}>—</span>
                ) : (
                  <span
                    className="pill"
                    style={
                      o.desvioPromedioPonderado < 0.15
                        ? { background: "var(--green-bg)", color: "var(--green)" }
                        : o.desvioPromedioPonderado < 0.3
                          ? { background: "var(--amber-bg)", color: "var(--amber)" }
                          : { background: "var(--red-bg)", color: "var(--red)" }
                    }
                  >
                    {(o.desvioPromedioPonderado * 100).toFixed(1)}%
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">
                {o.cuentasRevisar}/{o.cuentasOptimo + o.cuentasAceptable + o.cuentasRevisar}
              </td>
              <td className="px-4 py-3 text-[13px] font-mono-brand">
                {Math.round(o.feesQ1Q2).toLocaleString("es-AR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
