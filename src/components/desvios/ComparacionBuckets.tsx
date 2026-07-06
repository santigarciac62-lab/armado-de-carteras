import { ClienteEnriquecido } from "@/lib/types";
import { BUCKET_COLOR } from "@/lib/colors";
import { getCarteraModelo } from "@/data/modelPortfolios";
import { composicionPorBucket } from "@/lib/desvio";

export function ComparacionBuckets({ cliente }: { cliente: ClienteEnriquecido }) {
  const modelo = getCarteraModelo(cliente.perfilGrupo, cliente.monedaComparacion)!;
  const composicion = composicionPorBucket(cliente);

  return (
    <div className="flex flex-col gap-3">
      {composicion.map(({ bucket: b, actual, objetivo, desvioPP }) => {
        const fuerte = Math.abs(desvioPP) >= 5;
        return (
          <div key={b}>
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span style={{ color: "var(--text)" }}>{b}</span>
              <span className="font-mono-brand" style={{ color: "var(--text-mute)" }}>
                {actual.toFixed(1)}% <span>vs</span> {objetivo.toFixed(1)}%{" "}
                <span
                  className="pill ml-1"
                  style={
                    fuerte
                      ? { background: "var(--red-bg)", color: "var(--red)" }
                      : { background: "#EEF0F2", color: "var(--text-mute)" }
                  }
                >
                  {desvioPP > 0 ? "+" : ""}
                  {desvioPP.toFixed(1)}pp
                </span>
              </span>
            </div>
            <div className="relative h-2 rounded-full" style={{ background: "#EEF0F2" }}>
              <div
                className="absolute h-2 rounded-full"
                style={{ width: `${Math.min(100, actual)}%`, background: BUCKET_COLOR[b] }}
              />
              <div
                className="absolute h-2 w-[2px]"
                style={{ left: `${Math.min(100, objetivo)}%`, background: "var(--navy)" }}
                title={`Objetivo: ${objetivo.toFixed(1)}%`}
              />
            </div>
          </div>
        );
      })}
      <p className="text-[11px] mt-1" style={{ color: "var(--text-mute)" }}>
        vs. Cartera {modelo.perfilLabel} {modelo.moneda} (mejor ajuste entre ARS y USD para este cliente)
      </p>
    </div>
  );
}
