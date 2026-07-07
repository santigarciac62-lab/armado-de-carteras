import { NextResponse } from "next/server";
import { obtenerNoticias } from "@/lib/news/aggregator";

export const dynamic = "force-dynamic";

export async function GET() {
  const resultado = await obtenerNoticias();
  return NextResponse.json(resultado);
}
