import { NextResponse } from "next/server";
import { getCotizaciones, PRICE_PROVIDER_ACTIVO } from "@/lib/prices";

export async function GET() {
  const cotizaciones = await getCotizaciones();
  return NextResponse.json({
    proveedor: PRICE_PROVIDER_ACTIVO,
    actualizadoEn: new Date().toISOString(),
    cotizaciones,
  });
}
