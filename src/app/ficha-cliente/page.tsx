import { Topbar } from "@/components/Topbar";
import { FichaClienteWorkspace } from "@/components/ficha/FichaClienteWorkspace";
import { CLIENTES_CON_TENENCIA } from "@/data/clientes";

export default function FichaClientePage() {
  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/ficha-cliente" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Ficha de cliente
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Buscá cualquier cliente para ver un preview del informe completo (composición, recomendación de
          rebalanceo y alertas) antes de descargarlo en PDF.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <FichaClienteWorkspace clientes={CLIENTES_CON_TENENCIA} />
      </div>
    </div>
  );
}
