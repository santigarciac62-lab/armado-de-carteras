"use client";

import { useEffect, useState } from "react";
import { SeccionMacro } from "@/lib/types";
import { SeccionCard } from "./SeccionCard";

const INTERVALO_MS = 60_000;

export function DashboardMacroWorkspace({
  seccionesIniciales,
  actualizadoInicial,
}: {
  seccionesIniciales: SeccionMacro[];
  actualizadoInicial: string;
}) {
  const [secciones, setSecciones] = useState(seccionesIniciales);
  const [actualizadoEn, setActualizadoEn] = useState(actualizadoInicial);

  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const res = await fetch("/api/macro");
        if (!res.ok) return;
        const data = await res.json();
        setSecciones(data.secciones);
        setActualizadoEn(data.actualizadoEn);
      } catch {
        // se mantiene el último dato conocido
      }
    }, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
      <div className="mb-4 text-[12px]" style={{ color: "var(--text-mute)" }}>
        Actualizado {new Date(actualizadoEn).toLocaleTimeString("es-AR")} · las secciones marcadas &quot;a
        verificar&quot; usan fuentes cuyo formato de respuesta no se confirmó en vivo todavía; las de
        &quot;carga manual&quot; no tienen API gratuita disponible.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {secciones.map((s) => (
          <SeccionCard key={s.categoria} seccion={s} />
        ))}
      </div>
    </div>
  );
}
