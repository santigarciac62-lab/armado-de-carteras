"use client";

import { useState } from "react";
import { ActivoRV } from "@/data/rentaVariable";
import { DashboardTab } from "./DashboardTab";
import { TecnicoTab } from "./TecnicoTab";
import { FundamentalTab } from "./FundamentalTab";

type Tab = "dashboard" | "tecnico" | "fundamental";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tecnico", label: "Técnico" },
  { id: "fundamental", label: "Fundamental" },
];

export function RentaVariableWorkspace({ activos }: { activos: ActivoRV[] }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [tickerActivo, setTickerActivo] = useState(activos[0]?.ticker ?? "");

  const activo = activos.find((a) => a.ticker === tickerActivo) ?? activos[0];

  function irATecnico(ticker: string) {
    setTickerActivo(ticker);
    setTab("tecnico");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="text-[13px] font-medium px-4 py-2.5 rounded-md whitespace-nowrap shrink-0"
            style={
              tab === t.id
                ? { background: "var(--navy)", color: "#fff" }
                : { background: "var(--card)", color: "var(--text-soft)", border: "1px solid var(--border)" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab activos={activos} onVerTecnico={irATecnico} />}
      {tab === "tecnico" && activo && <TecnicoTab activos={activos} activo={activo} onSeleccionar={setTickerActivo} />}
      {tab === "fundamental" && activo && (
        <FundamentalTab activos={activos} activo={activo} onSeleccionar={setTickerActivo} />
      )}
    </div>
  );
}
