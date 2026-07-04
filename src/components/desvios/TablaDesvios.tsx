"use client";

import { Fragment, useMemo, useState } from "react";
import { ClienteEnriquecido, Perfil, StatusDesvio } from "@/lib/types";
import { BucketBar } from "./BucketBar";
import { DetalleCliente } from "./DetalleCliente";

const PERFIL_LABEL: Record<Perfil, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
};

const STATUS_LABEL: Record<StatusDesvio, string> = {
  optimo: "Óptimo",
  aceptable: "Aceptable",
  revisar: "Revisar",
};

const STATUS_PILL: Record<StatusDesvio, string> = {
  optimo: "pill-green",
  aceptable: "pill-amber",
  revisar: "pill-red",
};

type Orden = "aum" | "desvio";

const SELECT_CLASS = "text-[13px] px-2 py-2.5 sm:py-2 rounded-md w-full sm:w-auto";
const SELECT_STYLE = { border: "1px solid var(--border-strong)" };

export function TablaDesvios({ clientes }: { clientes: ClienteEnriquecido[] }) {
  const oficiales = useMemo(
    () => Array.from(new Set(clientes.map((c) => c.oficial))).sort(),
    [clientes]
  );

  const [busqueda, setBusqueda] = useState("");
  const [oficial, setOficial] = useState<string>("Todos");
  const [perfil, setPerfil] = useState<string>("Todos");
  const [status, setStatus] = useState<string>("Todos");
  const [orden, setOrden] = useState<Orden>("desvio");
  const [expandido, setExpandido] = useState<number | null>(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return clientes
      .filter((c) => {
        if (oficial !== "Todos" && c.oficial !== oficial) return false;
        if (perfil !== "Todos" && c.perfilGrupo !== perfil) return false;
        if (status !== "Todos" && c.statusSemaforo !== status) return false;
        if (q && !c.denominacion.toLowerCase().includes(q) && !String(c.numero).includes(q)) return false;
        return true;
      })
      .sort((a, b) => (orden === "aum" ? b.aumUsd - a.aumUsd : b.desvio - a.desvio));
  }, [clientes, busqueda, oficial, perfil, status, orden]);

  const toggle = (numero: number) => setExpandido((prev) => (prev === numero ? null : numero));

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div
        className="p-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 sm:items-center"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <input
          type="text"
          placeholder="Buscar cliente o comitente…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="col-span-2 text-base sm:text-[13px] px-3 py-2.5 sm:py-2 rounded-md sm:flex-1 sm:min-w-[200px]"
          style={{ border: "1px solid var(--border-strong)" }}
        />
        <select value={oficial} onChange={(e) => setOficial(e.target.value)} className={SELECT_CLASS} style={SELECT_STYLE}>
          <option>Todos</option>
          {oficiales.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className={SELECT_CLASS} style={SELECT_STYLE}>
          <option>Todos</option>
          <option value="conservador">Conservador</option>
          <option value="moderado">Moderado</option>
          <option value="agresivo">Agresivo</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT_CLASS} style={SELECT_STYLE}>
          <option>Todos</option>
          <option value="optimo">Óptimo</option>
          <option value="aceptable">Aceptable</option>
          <option value="revisar">Revisar</option>
        </select>
        <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className={SELECT_CLASS} style={SELECT_STYLE}>
          <option value="desvio">Ordenar por desvío</option>
          <option value="aum">Ordenar por AUM</option>
        </select>
        <span className="col-span-2 sm:col-span-1 sm:ml-auto text-[12px] text-center sm:text-right" style={{ color: "var(--text-mute)" }}>
          {filtrados.length} cuenta{filtrados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop / tablet: tabla completa */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Cliente", "Oficial", "Perfil", "Composición", "AUM (USD)", "Desvío", "Estado", ""].map((h, i) => (
                <th
                  key={h}
                  className={`text-[11px] font-medium uppercase tracking-wide px-4 py-3 ${
                    i >= 4 && i <= 5 ? "text-right" : "text-left"
                  }`}
                  style={{ color: "var(--text-mute)", background: "#F8FAFB", borderBottom: "1px solid var(--border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => (
              <Fragment key={c.numero}>
                <tr onClick={() => toggle(c.numero)} className="cursor-pointer" style={{ borderBottom: "1px solid #F1F4F8" }}>
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                      {c.denominacion}
                    </div>
                    <div className="text-[11px] font-mono-brand" style={{ color: "var(--text-mute)" }}>
                      #{c.numero}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-soft)" }}>
                    {c.oficial}
                  </td>
                  <td className="px-4 py-3 text-[13px]">
                    {PERFIL_LABEL[c.perfilGrupo]}
                    {c.perfilAsignadoPorDefault && (
                      <span className="pill pill-mute ml-1.5" title="Sin Test del Inversor: perfil asignado por defecto">
                        auto
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 w-[160px]">
                    <BucketBar buckets={c.bucketsCliente} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono-brand text-[13px]">
                    {Math.round(c.aumUsd).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`pill ${STATUS_PILL[c.statusSemaforo]}`}>{(c.desvio * 100).toFixed(1)}%</span>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: "var(--text-soft)" }}>
                    {STATUS_LABEL[c.statusSemaforo]}
                  </td>
                  <td className="px-4 py-3 text-right text-[12px]" style={{ color: "var(--text-mute)" }}>
                    {expandido === c.numero ? "▲" : "▼"}
                  </td>
                </tr>
                {expandido === c.numero && (
                  <tr>
                    <td colSpan={8} style={{ padding: 0, borderBottom: "1px solid var(--border)" }}>
                      <DetalleCliente cliente={c} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-8 text-[13px]" style={{ color: "var(--text-mute)" }}>
                  No hay cuentas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: tarjetas apiladas */}
      <div className="md:hidden">
        {filtrados.map((c) => (
          <div key={c.numero} style={{ borderBottom: "1px solid #F1F4F8" }}>
            <button
              onClick={() => toggle(c.numero)}
              className="w-full text-left px-4 py-3.5 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[14px] font-medium truncate" style={{ color: "var(--navy)" }}>
                    {c.denominacion}
                  </div>
                  <div className="text-[11px] font-mono-brand" style={{ color: "var(--text-mute)" }}>
                    #{c.numero} · {c.oficial}
                  </div>
                </div>
                <span className={`pill shrink-0 ${STATUS_PILL[c.statusSemaforo]}`}>
                  {(c.desvio * 100).toFixed(0)}%
                </span>
              </div>
              <BucketBar buckets={c.bucketsCliente} />
              <div className="flex items-center justify-between text-[12px]" style={{ color: "var(--text-soft)" }}>
                <span>
                  {PERFIL_LABEL[c.perfilGrupo]}
                  {c.perfilAsignadoPorDefault && <span className="pill pill-mute ml-1.5">auto</span>}
                  {" · "}
                  {STATUS_LABEL[c.statusSemaforo]}
                </span>
                <span className="font-mono-brand shrink-0 ml-2">
                  USD {Math.round(c.aumUsd).toLocaleString("es-AR")}
                </span>
              </div>
              <div className="text-[11px] text-center" style={{ color: "var(--text-mute)" }}>
                {expandido === c.numero ? "▲ Ocultar detalle" : "▼ Ver detalle"}
              </div>
            </button>
            {expandido === c.numero && <DetalleCliente cliente={c} />}
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="text-center p-8 text-[13px]" style={{ color: "var(--text-mute)" }}>
            No hay cuentas que coincidan con los filtros.
          </div>
        )}
      </div>
    </div>
  );
}
