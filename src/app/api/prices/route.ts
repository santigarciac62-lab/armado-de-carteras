import { NextResponse } from "next/server";
import { getCotizaciones, PRICE_PROVIDER_ACTIVO } from "@/lib/prices";

// Se resuelve en cada request (hay servidor real en Vercel), así los precios
// se refrescan de verdad y no quedan pegados al momento del build.
export const dynamic = "force-dynamic";

export async function GET() {
  const cotizaciones = await getCotizaciones();
  return NextResponse.json({
    proveedor: PRICE_PROVIDER_ACTIVO,
    actualizadoEn: new Date().toISOString(),
    cotizaciones,
  });
}
