import { ConfianzaFuente, ResultadoFuente } from "@/lib/news/types";
import { NoticiaCard } from "./NoticiaCard";

const CONFIANZA_DOT: Record<ConfianzaFuente, string> = {
  alta: "var(--green)",
  media: "var(--amber)",
  baja: "var(--red)",
};
const CONFIANZA_LABEL: Record<ConfianzaFuente, string> = {
  alta: "en vivo",
  media: "a verificar",
  baja: "sin fuente confiable",
};

export function ColumnaNoticias({ titulo, fuentes }: { titulo: string; fuentes: ResultadoFuente[] }) {
  const peorConfianza: ConfianzaFuente = fuentes.some((f) => f.confianza === "baja")
    ? "baja"
    : fuentes.some((f) => f.confianza === "media")
      ? "media"
      : "alta";

  const items = fuentes
    .flatMap((f) => f.items)
    .sort((a, b) => new Date(b.publicadoEn).getTime() - new Date(a.publicadoEn).getTime());

  return (
    <div className="rounded-[10px] flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="px-4 py-3 flex items-center justify-between gap-2"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--navy)" }}
      >
        <h3 className="text-[13px] font-semibold text-white">{titulo}</h3>
        {peorConfianza !== "alta" && (
          <span
            className="pill text-[9px]"
            style={{
              background: peorConfianza === "baja" ? "var(--red-bg)" : "var(--amber-bg)",
              color: peorConfianza === "baja" ? "var(--red)" : "var(--amber)",
            }}
            title="Alguna fuente de esta columna no está confirmada en vivo"
          >
            a verificar
          </span>
        )}
      </div>

      <div className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1" style={{ borderBottom: "1px solid var(--border)" }}>
        {fuentes.map((f) => (
          <span
            key={f.fuenteId}
            className="text-[10px] flex items-center gap-1"
            style={{ color: "var(--text-mute)" }}
            title={CONFIANZA_LABEL[f.confianza]}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: CONFIANZA_DOT[f.confianza] }} />
            {f.fuenteLabel}
          </span>
        ))}
      </div>

      <div className="flex-1">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12px]" style={{ color: "var(--text-mute)" }}>
            Sin noticias disponibles en este momento.
          </div>
        ) : (
          items.map((item) => <NoticiaCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
