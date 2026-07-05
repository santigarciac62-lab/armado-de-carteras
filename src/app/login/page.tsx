import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/";

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-10" style={{ background: "var(--bg)" }}>
      <div
        className="w-full max-w-[380px] rounded-[10px] overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div style={{ background: "linear-gradient(90deg, var(--navy) 0%, var(--teal) 100%)", height: 5 }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Image src="/logo-isologo.svg" alt="" width={34} height={34} />
            <span className="font-serif-brand text-lg" style={{ color: "var(--navy)" }}>
              D.A <span style={{ color: "var(--teal)" }}>VALORES</span>
            </span>
          </div>
          <p className="text-[12px] uppercase tracking-widest mb-6" style={{ color: "var(--text-mute)" }}>
            Armado de Carteras · Acceso interno
          </p>

          <form method="POST" action="/api/login" className="flex flex-col gap-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
                Usuario
              </label>
              <input
                name="usuario"
                type="text"
                required
                autoFocus
                className="w-full text-base px-3 py-3 rounded-md"
                style={{ border: "1px solid var(--border-strong)" }}
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
                Contraseña
              </label>
              <input
                name="contrasena"
                type="password"
                required
                className="w-full text-base px-3 py-3 rounded-md"
                style={{ border: "1px solid var(--border-strong)" }}
              />
            </div>

            {params.error && (
              <p className="text-[13px] rounded-md px-3 py-2" style={{ background: "var(--red-bg)", color: "var(--red)" }}>
                Usuario o contraseña incorrectos.
              </p>
            )}

            <button
              type="submit"
              className="text-base font-medium px-4 py-3 rounded-md mt-2"
              style={{ background: "var(--navy)", color: "#fff" }}
            >
              Ingresar
            </button>
          </form>

          <p className="text-[11px] mt-6" style={{ color: "var(--text-mute)" }}>
            Acceso restringido al equipo de asesoramiento. Si no tenés usuario, pedilo al administrador de la
            herramienta.
          </p>
        </div>
      </div>
    </div>
  );
}
