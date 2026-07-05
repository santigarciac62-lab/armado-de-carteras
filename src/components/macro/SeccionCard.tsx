import { SeccionMacro } from "@/lib/types";
import { formatIndicadorValor } from "@/lib/macro/formato";
import { fmtFecha } from "@/lib/formato";
import { VariacionPill } from "./VariacionPill";

const ACTUALIZACION_LABEL: Record<string, string> = {
  "tiempo-real": "Tiempo real",
  diaria: "Diaria",
  mensual: "Mensual",
  manual: "Carga manual",
};

export function SeccionCard({ seccion }: { seccion: SeccionMacro }) {
  const peorConfianza = seccion.indicadores.some((i) => i.confianza === "baja")
    ? "baja"
    : seccion.indicadores.some((i) => i.confianza === "media")
      ? "media"
      : "alta";
  const actualizaciones = new Set(seccion.indicadores.map((i) => i.actualizacion));
  const actualizacionLabel =
    actualizaciones.size === 1 ? ACTUALIZACION_LABEL[[...actualizaciones][0]] : "Mixta";

  return (
    <div className="rounded-[10px] flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="px-4 py-3 flex items-center justify-between gap-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--navy)" }}
      >
        <h3 className="text-[13px] font-semibold text-white">{seccion.categoria}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {peorConfianza !== "alta" && (
            <span
              className="pill text-[9px]"
              style={{ background: peorConfianza === "baja" ? "var(--red-bg)" : "var(--amber-bg)", color: peorConfianza === "baja" ? "var(--red)" : "var(--amber)" }}
              title="Alguna fila de esta sección tiene la fuente sin verificar en vivo"
            >
              a verificar
            </span>
          )}
          <span className="text-[10px] text-white/60 whitespace-nowrap">{actualizacionLabel}</span>
        </div>
      </div>

      <div className="flex-1">
        {seccion.indicadores.map((ind, idx) => (
          <div
            key={ind.id}
            className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
            style={idx > 0 ? { borderTop: "1px solid #E9EBEE" } : undefined}
          >
            <span className="text-[12px]" style={{ color: "var(--text)" }}>
              {ind.label}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="font-mono-brand text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                {formatIndicadorValor(ind)}
              </span>
              <VariacionPill label="1d" valor={ind.var1d} />
              <VariacionPill label="7d" valor={ind.var7d} />
              <VariacionPill label="30d" valor={ind.var30d} />
              <VariacionPill label="YTD" valor={ind.varYtd} />
              <VariacionPill label="1a" valor={ind.var1y} />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 text-[10px]" style={{ color: "var(--text-mute)", borderTop: "1px solid var(--border)" }}>
        Al {fmtFecha(seccion.indicadores[0]?.fecha ?? null)} · {seccion.indicadores[0]?.fuente}
      </div>
    </div>
  );
}
