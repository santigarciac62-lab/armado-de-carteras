const PERFIL_LABEL: Record<string, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
};

export function AlineacionPorPerfil({
  stats,
}: {
  stats: { perfil: string; count: number; avgDesvio: number; optimo: number; aceptable: number; revisar: number }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => {
        const segG = s.count > 0 ? (s.optimo / s.count) * 100 : 0;
        const segA = s.count > 0 ? (s.aceptable / s.count) * 100 : 0;
        const segR = s.count > 0 ? (s.revisar / s.count) * 100 : 0;
        return (
          <div key={s.perfil} className="rounded-lg p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="font-serif-brand text-[16px] font-medium mb-3" style={{ color: "var(--navy)" }}>
              {PERFIL_LABEL[s.perfil] ?? s.perfil}
              <span className="text-[12px] font-sans font-normal ml-2" style={{ color: "var(--text-mute)" }}>
                · {s.count} clientes
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <div className="font-mono-brand text-[24px] font-semibold" style={{ color: "var(--navy)" }}>
                {(s.avgDesvio * 100).toFixed(1)}%
              </div>
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
                Desvío promedio
              </div>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "var(--border)" }}>
              <div style={{ width: `${segG}%`, background: "var(--green)" }} />
              <div style={{ width: `${segA}%`, background: "var(--amber)" }} />
              <div style={{ width: `${segR}%`, background: "var(--red)" }} />
            </div>
            <div className="flex justify-between text-[11px]" style={{ color: "var(--text-soft)" }}>
              <span>
                <strong style={{ color: "var(--text)" }}>{s.optimo}</strong>{" "}
                <span style={{ color: "var(--green)" }}>&lt;15%</span>
              </span>
              <span>
                <strong style={{ color: "var(--text)" }}>{s.aceptable}</strong>{" "}
                <span style={{ color: "var(--amber)" }}>15-30%</span>
              </span>
              <span>
                <strong style={{ color: "var(--text)" }}>{s.revisar}</strong>{" "}
                <span style={{ color: "var(--red)" }}>&gt;30%</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
