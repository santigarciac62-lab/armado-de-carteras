import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, crearSesion, validarCredenciales } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const usuario = String(form.get("usuario") ?? "").trim();
  const contrasena = String(form.get("contrasena") ?? "");
  const next = String(form.get("next") ?? "/");

  if (!validarCredenciales(usuario, contrasena)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = await crearSesion(usuario);
  const response = NextResponse.redirect(new URL(next || "/", request.url), { status: 303 });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
