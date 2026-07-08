import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { AnalisisRentaFijaDetalle } from "./AnalisisRentaFijaDetalle";
import { AnalisisRentaVariableDetalle } from "./AnalisisRentaVariableDetalle";

export function AnalisisInstrumento({
  linea,
  justificacion,
  onJustificacionChange,
}: {
  linea: LineaCombinadaCalculada;
  justificacion: string;
  onJustificacionChange: (texto: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-5" style={{ background: "#F7F8F9" }}>
      <div>
        {linea.clase === "rentaFija" && linea.instrumentoRentaFija ? (
          <AnalisisRentaFijaDetalle instrumento={linea.instrumentoRentaFija} />
        ) : linea.activoRentaVariable ? (
          <AnalisisRentaVariableDetalle activo={linea.activoRentaVariable} />
        ) : (
          <p className="text-[13px]" style={{ color: "var(--text-mute)" }}>
            Sin datos del instrumento disponibles.
          </p>
        )}
      </div>

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
  );
}
