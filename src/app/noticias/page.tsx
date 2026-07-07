import { Topbar } from "@/components/Topbar";
import { NoticiasWorkspace } from "@/components/noticias/NoticiasWorkspace";
import { obtenerNoticias } from "@/lib/news/aggregator";

export const dynamic = "force-dynamic";

export default async function NoticiasPage() {
  const resultado = await obtenerNoticias();

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/noticias" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[24px] sm:text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Noticias
        </h1>
        <p className="text-[14px] sm:text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Coyuntura global, economía y política argentina, y una curaduría cruzada de lo más
          relevante para decisiones de inversión — actualizado cada 15-20 minutos.
        </p>
      </div>

      <NoticiasWorkspace resultadoInicial={resultado} />
    </div>
  );
}
