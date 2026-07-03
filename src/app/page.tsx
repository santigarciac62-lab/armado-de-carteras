import { Topbar } from "@/components/Topbar";
import { ArmadoWorkspace } from "@/components/armado/ArmadoWorkspace";
import { CARTERAS_MODELO } from "@/data/modelPortfolios";
import { UNIVERSO_INSTRUMENTOS } from "@/data/instrumentos";
import { getCotizaciones, PRICE_PROVIDER_ACTIVO } from "@/lib/prices";

// Los precios deben resolverse en cada request, no congelarse en el build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const cotizacionesIniciales = await getCotizaciones();
  const actualizadoInicial = new Date().toISOString();

  return (
    <div className="flex-1" style={{ background: "var(--bg)" }}>
      <Topbar active="/" />

      <div className="max-w-[1400px] mx-auto px-8 pt-10 pb-4">
        <h1
          className="font-serif-brand font-medium text-[32px] leading-tight mb-2.5 tracking-tight"
          style={{ color: "var(--navy)" }}
        >
          Armado dinámico de carteras
        </h1>
        <p className="text-[15px] max-w-[760px]" style={{ color: "var(--text-soft)" }}>
          Combiná los instrumentos recomendados en la Visión de Portafolio vigente para armar una cartera
          a medida: elegí un perfil como punto de partida, ajustá ponderaciones y vas viendo el monto, el
          precio y la variación de cada instrumento en tiempo real.
        </p>
      </div>

      <ArmadoWorkspace
        carterasModelo={CARTERAS_MODELO}
        universoInstrumentos={UNIVERSO_INSTRUMENTOS}
        cotizacionesIniciales={cotizacionesIniciales}
        proveedorInicial={PRICE_PROVIDER_ACTIVO}
        actualizadoInicial={actualizadoInicial}
      />
    </div>
  );
}
