import Link from "next/link";
import { cookies } from "next/headers";
import { FECHA_VISION_VIGENTE } from "@/data/modelPortfolios";
import { COOKIE_NAME, verificarSesion } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/", label: "Armado de carteras", disabled: false },
  { href: "/desvios", label: "Cuentas con desvío", disabled: false },
  { href: "/oficiales", label: "Seguimiento de oficiales", disabled: false },
];

function formateaFecha(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function Topbar({ active }: { active: string }) {
  const cookieStore = await cookies();
  const sesion = await verificarSesion(cookieStore.get(COOKIE_NAME)?.value);

  return (
    <>
      <header style={{ background: "var(--navy)" }} className="text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="font-serif-brand font-semibold text-base sm:text-lg tracking-tight">
              D.A. Valores
            </span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="text-[11px] sm:text-[12px] uppercase tracking-widest text-white/70 hidden sm:inline">
              Armado de Carteras
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-[11px] sm:text-[12px] text-white/70">
            <div className="hidden sm:block">
              Visión vigente · <strong className="text-white font-medium">{formateaFecha(FECHA_VISION_VIGENTE)}</strong>
            </div>
            {sesion && (
              <div className="flex items-center gap-2">
                <span>{sesion.usuario}</span>
                <form method="POST" action="/api/logout">
                  <button
                    type="submit"
                    className="text-white/70 hover:text-white underline underline-offset-2 py-2 -my-2"
                  >
                    Salir
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
      <nav
        className="sticky top-0 z-10"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex overflow-x-auto">
          {NAV_ITEMS.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className="px-3 sm:px-5 py-3.5 sm:py-4 text-[13px] font-medium cursor-not-allowed flex items-center gap-2 whitespace-nowrap shrink-0"
                style={{ color: "var(--text-mute)" }}
              >
                {item.label}
                <span className="pill pill-mute text-[9px]">Próximamente</span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 sm:px-5 py-3.5 sm:py-4 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap shrink-0"
                style={
                  active === item.href
                    ? { color: "var(--navy)", borderBottomColor: "var(--navy)" }
                    : { color: "var(--text-soft)", borderBottomColor: "transparent" }
                }
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
}
