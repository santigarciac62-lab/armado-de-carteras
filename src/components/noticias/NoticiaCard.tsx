import { NoticiaItem } from "@/lib/news/types";
import { tiempoRelativo } from "@/lib/news/formato";

export function NoticiaCard({ item, etiquetaExtra }: { item: NoticiaItem; etiquetaExtra?: string }) {
  return (
    <div className="px-4 py-3" style={{ borderTop: "1px solid #E9EBEE" }}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] font-medium leading-snug hover:underline"
        style={{ color: "var(--navy)" }}
      >
        {item.titulo}
      </a>
      {item.resumen && (
        <p className="text-[12px] mt-1 line-clamp-2" style={{ color: "var(--text-soft)" }}>
          {item.resumen}
        </p>
      )}
      <div className="flex items-center flex-wrap gap-1.5 mt-1.5 text-[11px]" style={{ color: "var(--text-mute)" }}>
        <span>{item.fuenteLabel}</span>
        <span>·</span>
        <span>{tiempoRelativo(item.publicadoEn)}</span>
        {etiquetaExtra && <span className="pill pill-mute">{etiquetaExtra}</span>}
      </div>
    </div>
  );
}
