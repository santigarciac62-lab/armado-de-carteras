import { colorDeCategoria } from "@/lib/colors";
import { CarteraModelo } from "@/lib/types";

export function ComparacionModelo({
  filas,
  modelo,
}: {
  filas: { categoria: string; actual: number; modelo: number; desvioPP: number }[];
  modelo: CarteraModelo;
}) {
  const ordenadas = [...filas].sort((a, b) => b.modelo - a.modelo);

  return (
    <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 className="font-serif-brand text-[16px] font-medium mb-1" style={{ color: "var(--navy)" }}>
        vs. Cartera {modelo.perfilLabel} {modelo.moneda}
      </h3>
      <p className="text-[12px] mb-4" style={{ color: "var(--text-mute)" }}>
        Comparación de tu armado actual contra la ponderación por categoría de la Visión.
      </p>
      <div className="flex flex-col gap-3">
        {ordenadas.map((f) => {
          const color = colorDeCategoria(f.categoria);
          const desviadoFuerte = Math.abs(f.desvioPP) >= 5;
          return (
            <div key={f.categoria}>
              <div className="flex items-center justify-between text-[12px] mb-1">
                <span style={{ color: "var(--text)" }}>{f.categoria}</span>
                <span className="font-mono-brand" style={{ color: "var(--text-mute)" }}>
                  {f.actual.toFixed(1)}% <span style={{ color: "var(--text-mute)" }}>vs</span> {f.modelo.toFixed(1)}%{" "}
                  <span
                    className="pill ml-1"
                    style={
                      desviadoFuerte
                        ? { background: "var(--red-bg)", color: "var(--red)" }
                        : { background: "#F1F4F8", color: "var(--text-mute)" }
                    }
                  >
                    {f.desvioPP > 0 ? "+" : ""}
                    {f.desvioPP.toFixed(1)}pp
                  </span>
                </span>
              </div>
              <div className="relative h-2 rounded-full" style={{ background: "#F1F4F8" }}>
                <div
                  className="absolute h-2 rounded-full"
                  style={{ width: `${Math.min(100, f.actual)}%`, background: color }}
                />
                <div
                  className="absolute h-2 w-[2px]"
                  style={{ left: `${Math.min(100, f.modelo)}%`, background: "var(--navy)" }}
                  title={`Objetivo modelo: ${f.modelo.toFixed(1)}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
