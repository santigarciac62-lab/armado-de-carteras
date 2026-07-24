import { CarteraModelo } from "@/lib/types";

/** Resumen del racional de la cartera modelo cargada (perfil + moneda elegidos), tal como
 * figura en la Visión de Portafolio vigente. Se muestra automáticamente al elegir un perfil
 * de partida en ArmadoWorkspace.tsx. */
export function ResumenCarteraModelo({ modelo }: { modelo: CarteraModelo }) {
  return (
    <div className="rounded-[10px] p-4 sm:p-5 mb-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
        <h3 className="font-serif-brand text-[15px] sm:text-[16px] font-medium" style={{ color: "var(--navy)" }}>
          Por qué recomendamos la Cartera {modelo.perfilLabel} {modelo.moneda}
        </h3>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-[12px] sm:ml-auto" style={{ color: "var(--text-soft)" }}>
          <span>
            <strong style={{ color: "var(--navy)" }}>Riesgo:</strong> {modelo.riesgo}
          </span>
          <span>
            <strong style={{ color: "var(--navy)" }}>Liquidez:</strong> {modelo.liquidez}
          </span>
          <span>
            <strong style={{ color: "var(--navy)" }}>Horizonte:</strong> {modelo.horizonte}
          </span>
        </div>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>
        {modelo.estrategia}
      </p>
    </div>
  );
}
