/**
 * Autenticación mínima para uso interno del equipo (un usuario/contraseña
 * compartidos por persona, sin altas de usuarios ni recuperación de clave).
 * Pensada para correr en Vercel (servidor real); no funciona en un export
 * estático porque depende de Middleware + rutas API.
 *
 * Credenciales: variable de entorno AUTH_USERS con formato
 * "usuario1:clave1,usuario2:clave2" — se configura en Vercel (Settings >
 * Environment Variables), nunca en el repo.
 *
 * Sesión: cookie HttpOnly con un token firmado (HMAC-SHA256) usando
 * AUTH_SECRET como clave. Se verifica en el middleware con Web Crypto, que
 * corre tanto en Node como en el runtime Edge.
 */

export const COOKIE_NAME = "da_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Falta la variable de entorno AUTH_SECRET (requerida para firmar la sesión de login)."
    );
  }
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function crearSesion(usuario: string): Promise<string> {
  const payload = JSON.stringify({ usuario, exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = toBase64Url(new TextEncoder().encode(payload));
  const key = await getSigningKey();
  const firma = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${toBase64Url(new Uint8Array(firma))}`;
}

export async function verificarSesion(token: string | undefined | null): Promise<{ usuario: string } | null> {
  if (!token) return null;
  const [payloadB64, firmaB64] = token.split(".");
  if (!payloadB64 || !firmaB64) return null;

  try {
    const key = await getSigningKey();
    const valido = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(firmaB64).buffer as ArrayBuffer,
      new TextEncoder().encode(payloadB64)
    );
    if (!valido) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    return { usuario: payload.usuario };
  } catch {
    return null;
  }
}

export function validarCredenciales(usuario: string, contrasena: string): boolean {
  const raw = process.env.AUTH_USERS ?? "";
  return raw
    .split(",")
    .map((par) => par.trim())
    .filter(Boolean)
    .some((par) => {
      const separador = par.indexOf(":");
      if (separador === -1) return false;
      return par.slice(0, separador) === usuario && par.slice(separador + 1) === contrasena;
    });
}
