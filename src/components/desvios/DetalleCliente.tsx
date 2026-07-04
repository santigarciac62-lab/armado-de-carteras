import { ClienteEnriquecido } from "@/lib/types";
import { ComparacionBuckets } from "./ComparacionBuckets";

const BUCKET_LABEL: Record<string, string> = {
  FCI: "Fondos Comunes de Inversión",
  Soberanos: "Soberanos / tasa fija",
  ON: "Obligaciones Negociables",
  Acciones: "Acciones",
  Cedears: "Cedears",
  Otros: "Otros",
};

export function DetalleCliente({ cliente }: { cliente: ClienteEnriquecido }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-5" style={{ background: "#FAFBFC" }}>
      <div>
        <h4 className="text-[12px] font-medium uppercase tracking-wide mb-3" style={{ color: "var(--text-mute)" }}>
          Composición actual vs. cartera modelo
        </h4>
        <ComparacionBuckets cliente={cliente} />
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <h4 className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: "var(--text-mute)" }}>
            Cambio recomendado
          </h4>
          {cliente.recomendaciones.length === 0 ? (
            <p className="text-[13px]" style={{ color: "var(--text-soft)" }}>
              Sin desvíos relevantes por categoría (todas dentro de ±5pp del modelo).
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {cliente.recomendaciones.map((r) => (
                <li
                  key={r.bucket}
                  className="text-[13px] rounded-md px-3 py-2"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <span
                    className="pill mr-1.5"
                    style={
                      r.accion === "vender"
                        ? { background: "var(--red-bg)", color: "var(--red)" }
                        : { background: "var(--green-bg)", color: "var(--green)" }
                    }
                  >
                    {r.accion === "vender" ? "Vender" : "Comprar"}
                  </span>
                  <strong>{BUCKET_LABEL[r.bucket] ?? r.bucket}</strong>{" "}
                  <span style={{ color: "var(--text-soft)" }}>
                    ({r.actualPct.toFixed(1)}% actual vs {r.modeloPct.toFixed(1)}% modelo,{" "}
                    {r.desvioPP > 0 ? "+" : ""}
                    {r.desvioPP.toFixed(1)}pp)
                  </span>
                  {r.accion === "comprar" && r.tickersSugeridos.length > 0 && (
                    <div className="mt-1 font-mono-brand text-[11px]" style={{ color: "var(--navy)" }}>
                      Sugerido del modelo: {r.tickersSugeridos.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {cliente.alertasConcentracion.length > 0 && (
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: "var(--text-mute)" }}>
              Alertas de concentración
            </h4>
            <ul className="flex flex-col gap-1.5">
              {cliente.alertasConcentracion.map((a) => (
                <li key={a.categoria} className="text-[13px] flex flex-wrap items-center gap-1.5">
                  <span className="pill" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>
                    {(a.pctCliente * 100).toFixed(0)}%
                  </span>
                  <span style={{ color: "var(--text)" }}>{a.categoria}</span>
                  <span style={{ color: "var(--text-mute)" }}>
                    supera el límite de {(a.limite * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
