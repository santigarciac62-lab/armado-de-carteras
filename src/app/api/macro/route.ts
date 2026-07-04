import { NextResponse } from "next/server";
import { obtenerIndicadoresMacro } from "@/lib/macro/aggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  const secciones = await obtenerIndicadoresMacro();
  return NextResponse.json({ secciones, actualizadoEn: new Date().toISOString() });
}
