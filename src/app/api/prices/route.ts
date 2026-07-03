import { NextResponse } from "next/server";
import { getCotizaciones, PRICE_PROVIDER_ACTIVO } from "@/lib/prices";

// Requerido por `output: export` (GitHub Pages): esta ruta se resuelve una
// vez en build time y se sirve como archivo estático, no por request. En un
// backend real (Vercel) conviene volver a "force-dynamic" para refrescar
// precios en cada request.
export const dynamic = "force-static";

export async function GET() {
  const cotizaciones = await getCotizaciones();
  return NextResponse.json({
    proveedor: PRICE_PROVIDER_ACTIVO,
    actualizadoEn: new Date().toISOString(),
    cotizaciones,
  });
}
