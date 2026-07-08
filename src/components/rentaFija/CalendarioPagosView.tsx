"use client";

import { useState } from "react";
import { FlujoPago, PagoMensual } from "@/lib/types";
import { fmtFecha, fmtNum } from "@/lib/formato";

function MesBar({ mes }: { mes: PagoMensual }) {
  const max = Math.max(mes.porMoneda.ARS, mes.porMoneda.USD, 1);
  const [anio, mesNum] = mes.mes.split("-");
  const label = new Date(Number(anio), Number(mesNum) - 1, 1).toLocaleDateString("es-AR", {
    month: "short",
    year: "numeric",
  });
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-[12px]">
        <span className="capitalize font-medium" style={{ color: "var(--text)" }}>
          {label}
        </span>
        <span className="font-mono-brand" style={{ color: "var(--text-mute)" }}>
          {mes.porMoneda.ARS > 0 && `$${fmtNum(mes.porMoneda.ARS, 0)}`}
          {mes.porMoneda.ARS > 0 && mes.porMoneda.USD > 0 && " · "}
          {mes.porMoneda.USD > 0 && `USD ${fmtNum(mes.porMoneda.USD, 0)}`}
        </span>
      </div>
      {mes.porMoneda.ARS > 0 && (
        <div className="h-2 rounded-full" style={{ background: "#EEF0F2" }}>
          <div
            className="h-2 rounded-full"
            style={{ width: `${(mes.porMoneda.ARS / max) * 100}%`, background: "var(--teal)" }}
          />
        </div>
      )}
      {mes.porMoneda.USD > 0 && (
        <div className="h-2 rounded-full" style={{ background: "#EEF0F2" }}>
          <div
            className="h-2 rounded-full"
            style={{ width: `${(mes.porMoneda.USD / max) * 100}%`, background: "var(--navy)" }}
          />
        </div>
      )}
    </div>
  );
}

export function CalendarioPagosView({
  flujos,
  porMes,
  detalleDesplegable = false,
}: {
  flujos: FlujoPago[];
  porMes: PagoMensual[];
  /** Si es true, "Detalle de pagos" arranca colapsado con su propio toggle. Default false
   * para no cambiar el comportamiento donde ya se usa este componente (pestaña Renta Fija). */
  detalleDesplegable?: boolean;
}) {
  const [detalleAbierto, setDetalleAbierto] = useState(!detalleDesplegable);
  const totalArs = flujos.filter((f) => f.moneda === "ARS").reduce((a, f) => a + f.monto, 0);
  const totalUsd = flujos.filter((f) => f.moneda === "USD").reduce((a, f) => a + f.monto, 0);

  if (flujos.length === 0) {
    return (
      <div className="p-8 text-center text-[13px]" style={{ color: "var(--text-mute)" }}>
        Elegí uno o más instrumentos con su nominal para ver el calendario proyectado.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg p-4" style={{ background: "var(--teal-soft)" }}>
          <div className="text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--teal)" }}>
            Total proyectado ARS
          </div>
          <div className="font-mono-brand text-[20px] font-semibold mt-1" style={{ color: "var(--navy)" }}>
            ${fmtNum(totalArs, 0)}
          </div>
        </div>
        <div className="rounded-lg p-4" style={{ background: "#E7EAEF" }}>
          <div className="text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--navy)" }}>
            Total proyectado USD
          </div>
          <div className="font-mono-brand text-[20px] font-semibold mt-1" style={{ color: "var(--navy)" }}>
            USD {fmtNum(totalUsd, 0)}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[12px] font-medium uppercase tracking-wide mb-3" style={{ color: "var(--text-mute)" }}>
          Total por mes
        </h4>
        <div className="flex flex-col gap-3">
          {porMes.map((m) => (
            <MesBar key={m.mes} mes={m} />
          ))}
        </div>
      </div>

      <div>
        {detalleDesplegable ? (
          <button
            onClick={() => setDetalleAbierto((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide mb-3"
            style={{ color: "var(--text-mute)" }}
          >
            <span>{detalleAbierto ? "▲" : "▼"}</span>
            Detalle de pagos
          </button>
        ) : (
          <h4 className="text-[12px] font-medium uppercase tracking-wide mb-3" style={{ color: "var(--text-mute)" }}>
            Detalle de pagos
          </h4>
        )}
        {detalleAbierto && (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>
                  {["Fecha", "Instrumento", "Tipo", "Monto"].map((h, i) => (
                    <th
                      key={`${h}-${i}`}
                      className={`text-[11px] font-medium uppercase tracking-wide px-3 py-2 ${i === 3 ? "text-right" : "text-left"}`}
                      style={{ color: "var(--text-mute)", background: "#F6F7F8", borderBottom: "1px solid var(--border)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flujos.map((f, idx) => (
                  <tr key={`${f.ticker}-${f.fecha}-${idx}`} style={{ borderBottom: "1px solid #EEF0F2" }}>
                    <td className="px-3 py-2 text-[13px] whitespace-nowrap">{fmtFecha(f.fecha)}</td>
                    <td className="px-3 py-2 font-mono-brand text-[13px]">{f.ticker}</td>
                    <td className="px-3 py-2 text-[12px]" style={{ color: "var(--text-soft)" }}>
                      {f.tipo === "cupon" ? "Cupón" : "Cupón + capital"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono-brand text-[13px]">
                      {f.moneda === "USD" ? "USD " : "$"}
                      {fmtNum(f.monto, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px]" style={{ color: "var(--text-mute)" }}>
        Proyección simplificada: cupón periódico a tasa fija (la vigente hoy) + capital al vencimiento. No
        refleja amortizaciones parciales reales (ej. GD30, GD35, PARP, DICP) ni la variación futura de tasas
        flotantes o ajuste por CER — verificar contra el prospecto de cada especie antes de usar con clientes.
      </p>
    </div>
  );
}
