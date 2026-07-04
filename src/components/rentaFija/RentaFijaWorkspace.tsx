"use client";

import { useState } from "react";
import { InstrumentoRentaFija } from "@/lib/types";
import { EMISORES_RENTA_FIJA } from "@/data/rentaFija";
import { TablaInstrumentos } from "./TablaInstrumentos";
import { CalendarioPagosSimulador } from "./CalendarioPagosSimulador";
import { ArmarCarteraPorMonto } from "./ArmarCarteraPorMonto";

type Tab = "instrumentos" | "calendario" | "cartera";

const TABS: { id: Tab; label: string }[] = [
  { id: "instrumentos", label: "Instrumentos" },
  { id: "calendario", label: "Calendario de pagos" },
  { id: "cartera", label: "Armar cartera por monto" },
];

export function RentaFijaWorkspace({ instrumentos }: { instrumentos: InstrumentoRentaFija[] }) {
  const [tab, setTab] = useState<Tab>("instrumentos");

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
      <div className="flex gap-1.5 mb-6 overflow-x-auto">
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

      {tab === "instrumentos" && <TablaInstrumentos instrumentos={instrumentos} emisores={EMISORES_RENTA_FIJA} />}
      {tab === "calendario" && <CalendarioPagosSimulador instrumentos={instrumentos} />}
      {tab === "cartera" && <ArmarCarteraPorMonto instrumentos={instrumentos} />}
    </div>
  );
}
