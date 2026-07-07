import { NoticiaRelevante } from "@/lib/news/types";
import { NoticiaCard } from "./NoticiaCard";

export function ColumnaRelevantes({ items }: { items: NoticiaRelevante[] }) {
  return (
    <div className="rounded-[10px] flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="px-4 py-3 flex items-center justify-between gap-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--navy)" }}
      >
        <h3 className="text-[13px] font-semibold text-white">Relevantes</h3>
        <span className="text-[10px] text-white/60">Curaduría automática</span>
      </div>

      <div className="px-4 py-2 text-[11px]" style={{ color: "var(--text-mute)", borderBottom: "1px solid var(--border)" }}>
        Cruza Global + Argentina por palabras clave de alto impacto (tasas, tipo de cambio,
        riesgo país, geopolítica, commodities, earnings, IPOs, deuda).
      </div>

      <div className="flex-1">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12px]" style={{ color: "var(--text-mute)" }}>
            Sin datos suficientes para armar el ranking todavía.
          </div>
        ) : (
          items.map((item) => (
            <NoticiaCard
              key={item.id}
              item={item}
              etiquetaExtra={`también en ${item.columnaOrigen === "global" ? "Global" : "Argentina"}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
