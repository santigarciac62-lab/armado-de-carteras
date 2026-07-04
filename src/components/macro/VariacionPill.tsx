import { formatVariacion } from "@/lib/macro/formato";

export function VariacionPill({ label, valor }: { label: string; valor: number | null | undefined }) {
  const texto = formatVariacion(valor);
  if (texto === null) return null;
  const positivo = (valor as number) > 0;
  const neutro = valor === 0;
  return (
    <span
      className="pill"
      style={
        neutro
          ? { background: "#F1F4F8", color: "var(--text-mute)" }
          : positivo
            ? { background: "var(--green-bg)", color: "var(--green)" }
            : { background: "var(--red-bg)", color: "var(--red)" }
      }
      title={label}
    >
      {label} {texto}
    </span>
  );
}
