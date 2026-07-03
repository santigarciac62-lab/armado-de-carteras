import { Cotizacion } from "@/lib/types";

export function PriceTag({ cotizacion }: { cotizacion?: Cotizacion }) {
  if (!cotizacion) {
    return <span className="text-[12px]" style={{ color: "var(--text-mute)" }}>—</span>;
  }
  const positivo = cotizacion.variacionPct > 0;
  const neutro = cotizacion.variacionPct === 0;
  const color = neutro ? "var(--text-mute)" : positivo ? "var(--green)" : "var(--red)";
  const simbolo = cotizacion.moneda === "USD" ? "USD " : "$";

  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="font-mono-brand text-[13px] font-medium" style={{ color: "var(--text)" }}>
        {simbolo}
        {cotizacion.ultimo.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
      </span>
      <span className="font-mono-brand text-[11px]" style={{ color }}>
        {neutro ? "" : positivo ? "▲" : "▼"} {Math.abs(cotizacion.variacionPct).toFixed(2)}%
        {cotizacion.esEOD ? (
          <span style={{ color: "var(--text-mute)" }}> · EOD</span>
        ) : null}
      </span>
    </div>
  );
}
