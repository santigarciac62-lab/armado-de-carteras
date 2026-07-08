import { InstrumentoRentaFija } from "@/lib/types";
import { fmtFecha, fmtPct } from "@/lib/formato";

export function AnalisisRentaFijaDetalle({ instrumento }: { instrumento: InstrumentoRentaFija }) {
  const tiles: { label: string; valor: string }[] = [
    { label: "TNA", valor: fmtPct(instrumento.tna, 1) },
    { label: "TEA", valor: fmtPct(instrumento.tea, 1) },
    { label: "Duración mod.", valor: instrumento.duracionModificada != null ? `${instrumento.duracionModificada.toFixed(1)} años` : "—" },
    { label: "Paridad", valor: fmtPct(instrumento.paridad, 1) },
    { label: "Rend. corriente", valor: fmtPct(instrumento.rendimientoCorriente, 1) },
    { label: "Vencimiento", valor: fmtFecha(instrumento.vencimiento) },
  ];

  return (
    <div>
      <h4 className="text-[12px] font-medium uppercase tracking-wide mb-3" style={{ color: "var(--text-mute)" }}>
        Análisis del instrumento — {instrumento.emisor} ({instrumento.subcategoria})
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-md p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
              {t.label}
            </div>
            <div className="font-mono-brand text-[14px] font-semibold mt-1" style={{ color: "var(--navy)" }}>
              {t.valor}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] mt-3" style={{ color: "var(--text-mute)" }}>
        Categoría {instrumento.categoria} · moneda {instrumento.moneda}. TNA/TEA vigentes al{" "}
        {fmtFecha(instrumento.fuenteFecha)} — verificar contra el prospecto antes de usar con clientes.
      </p>
    </div>
  );
}
