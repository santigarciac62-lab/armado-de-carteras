import { ClienteEnriquecido } from "@/lib/types";

export function TopClientes({ clientes, top = 20 }: { clientes: ClienteEnriquecido[]; top?: number }) {
  const ordenados = [...clientes].sort((a, b) => b.aumUsd - a.aumUsd).slice(0, top);
  const aumTotal = clientes.reduce((acc, c) => acc + c.aumUsd, 0);

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[16px] font-medium" style={{ color: "var(--navy)" }}>
          Top {top} clientes por AUM
        </h3>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 560 }}>
        <thead>
          <tr>
            {["#", "Cliente", "Oficial", "AUM (USD)", "% AUM", "Desvío"].map((h, i) => (
              <th
                key={h}
                className={`text-[11px] font-medium uppercase tracking-wide px-4 py-2.5 ${i >= 3 ? "text-right" : "text-left"}`}
                style={{ color: "var(--text-mute)", background: "#F6F7F8", borderBottom: "1px solid var(--border)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordenados.map((c, i) => (
            <tr key={c.numero} style={{ borderBottom: "1px solid #EEF0F2" }}>
              <td className="px-4 py-2.5 text-[12px]" style={{ color: "var(--text-mute)" }}>
                {i + 1}
              </td>
              <td className="px-4 py-2.5 text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                {c.denominacion}
              </td>
              <td className="px-4 py-2.5 text-[13px]" style={{ color: "var(--text-soft)" }}>
                {c.oficial}
              </td>
              <td className="px-4 py-2.5 text-right font-mono-brand text-[13px]">
                {Math.round(c.aumUsd).toLocaleString("es-AR")}
              </td>
              <td className="px-4 py-2.5 text-right font-mono-brand text-[13px]">
                {((c.aumUsd / aumTotal) * 100).toFixed(1)}%
              </td>
              <td className="px-4 py-2.5 text-right">
                <span
                  className="pill"
                  style={
                    c.statusSemaforo === "optimo"
                      ? { background: "var(--green-bg)", color: "var(--green)" }
                      : c.statusSemaforo === "aceptable"
                        ? { background: "var(--amber-bg)", color: "var(--amber)" }
                        : { background: "var(--red-bg)", color: "var(--red)" }
                  }
                >
                  {(c.desvio * 100).toFixed(0)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
