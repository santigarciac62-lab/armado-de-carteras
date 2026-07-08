import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { diasEntre } from "@/lib/formato";
import { SEÑAL_PILL } from "@/components/rentaVariable/senalUtils";
import { AnalisisRentaFijaDetalle } from "./AnalisisRentaFijaDetalle";
import { AnalisisRentaVariableDetalle, GraficoPrecioRentaVariable } from "./AnalisisRentaVariableDetalle";

export function AnalisisInstrumento({
  linea,
  justificacion,
  onJustificacionChange,
}: {
  linea: LineaCombinadaCalculada;
  justificacion: string;
  onJustificacionChange: (texto: string) => void;
}) {
  const rf = linea.clase === "rentaFija" ? linea.instrumentoRentaFija : undefined;
  const rv = linea.clase === "rentaVariable" ? linea.activoRentaVariable : undefined;

  return (
    <div className="p-4 sm:p-5" style={{ background: "#F7F8F9" }}>
      {/* Fila 1, ancho completo: identidad del instrumento + un único pill de estado
          (antes se repetía la señal de RV en el header y de nuevo como tile). */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-serif-brand text-[15px] font-medium" style={{ color: "var(--navy)" }}>
            {linea.nombre}
          </h4>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--text-mute)" }}>
            {linea.ticker} · {linea.categoriaLabel}
          </p>
        </div>
        {rv && <span className={`pill ${SEÑAL_PILL[rv.señal]}`}>{rv.señal}</span>}
        {rf?.vencimiento && (
          <span className="pill" style={{ background: "var(--teal-soft)", color: "var(--teal)" }}>
            Vence en {diasEntre(new Date().toISOString().slice(0, 10), rf.vencimiento)} días
          </span>
        )}
      </div>

      {/* Fila 2, ancho completo: métricas — ahora con todo el ancho de la tarjeta en vez
          de la mitad, así las tiles no se aprietan. */}
      <div className="mb-5">
        {rf ? (
          <AnalisisRentaFijaDetalle instrumento={rf} />
        ) : rv ? (
          <AnalisisRentaVariableDetalle activo={rv} />
        ) : (
          <p className="text-[13px]" style={{ color: "var(--text-mute)" }}>
            Sin datos del instrumento disponibles.
          </p>
        )}
      </div>

      {/* Fila 3: para RV, el gráfico de precio pesa tanto como la justificación y quedan
          lado a lado; para RF (sin gráfico) la justificación pasa a ocupar todo el ancho
          en vez de dejar una columna vacía al lado. */}
      <div className={rv ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}>
        {rv && <GraficoPrecioRentaVariable activo={rv} />}

        <div>
          <h4 className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: "var(--text-mute)" }}>
            Justificación de la selección
          </h4>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-mute)" }}>
            Borrador generado a partir de los datos del instrumento — editalo libremente.
          </p>
          <textarea
            value={justificacion}
            onChange={(e) => onJustificacionChange(e.target.value)}
            rows={5}
            className="w-full text-[13px] px-3 py-2.5 rounded-md"
            style={{ border: "1px solid var(--border-strong)", background: "var(--card)" }}
          />
        </div>
      </div>
    </div>
  );
}
