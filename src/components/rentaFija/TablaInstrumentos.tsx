"use client";

import { useMemo, useState } from "react";
import { CategoriaRentaFija, InstrumentoRentaFija, Moneda } from "@/lib/types";
import { CATEGORIA_RF_BG, CATEGORIA_RF_COLOR } from "@/lib/colorsRentaFija";
import { fmtFecha, fmtNum, fmtPct } from "@/lib/formato";
import { FECHA_SEED_RENTA_FIJA } from "@/data/rentaFija";
import { diasEntre } from "@/lib/formato";

const CATEGORIAS: (CategoriaRentaFija | "Todas")[] = [
  "Todas",
  "Soberanos ARS",
  "Soberanos USD",
  "Corporativos USD",
];

const RANGOS_VENCIMIENTO = [
  { id: "todos", label: "Todos" },
  { id: "1", label: "< 1 año" },
  { id: "3", label: "1-3 años" },
  { id: "5", label: "3-5 años" },
  { id: "10", label: "5-10 años" },
  { id: "99", label: "10+ años" },
] as const;

function enRango(instrumento: InstrumentoRentaFija, rango: string): boolean {
  if (rango === "todos") return true;
  if (!instrumento.vencimiento) return false;
  const anios = diasEntre(FECHA_SEED_RENTA_FIJA, instrumento.vencimiento) / 365;
  if (rango === "1") return anios < 1;
  if (rango === "3") return anios >= 1 && anios < 3;
  if (rango === "5") return anios >= 3 && anios < 5;
  if (rango === "10") return anios >= 5 && anios < 10;
  return anios >= 10;
}

type Orden = "vencimiento" | "tna" | "tea" | "duracion" | "paridad";

export function TablaInstrumentos({
  instrumentos,
  emisores,
  onAgregar,
  seleccionados,
}: {
  instrumentos: InstrumentoRentaFija[];
  emisores: string[];
  onAgregar?: (ticker: string) => void;
  seleccionados?: Set<string>;
}) {
  const [categoria, setCategoria] = useState<CategoriaRentaFija | "Todas">("Todas");
  const [moneda, setMoneda] = useState<Moneda | "Todas">("Todas");
  const [emisor, setEmisor] = useState("Todos");
  const [rango, setRango] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("vencimiento");

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return instrumentos
      .filter((i) => {
        if (categoria !== "Todas" && i.categoria !== categoria) return false;
        if (moneda !== "Todas" && i.moneda !== moneda) return false;
        if (emisor !== "Todos" && i.emisor !== emisor) return false;
        if (!enRango(i, rango)) return false;
        if (q && !i.ticker.toLowerCase().includes(q) && !i.emisor.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (orden === "vencimiento") return (a.vencimiento ?? "9999").localeCompare(b.vencimiento ?? "9999");
        if (orden === "tna") return (b.tna ?? -Infinity) - (a.tna ?? -Infinity);
        if (orden === "tea") return (b.tea ?? -Infinity) - (a.tea ?? -Infinity);
        if (orden === "duracion") return (a.duracionModificada ?? Infinity) - (b.duracionModificada ?? Infinity);
        return (b.paridad ?? -Infinity) - (a.paridad ?? -Infinity);
      });
  }, [instrumentos, categoria, moneda, emisor, rango, busqueda, orden]);

  const columnas: { key: Orden | "none"; label: string }[] = [
    { key: "none", label: "Instrumento" },
    { key: "none", label: "Categoría" },
    { key: "vencimiento", label: "Vencimiento" },
    { key: "none", label: "Precio" },
    { key: "tna", label: "TNA" },
    { key: "tea", label: "TEA" },
    { key: "duracion", label: "Dur. mod." },
    { key: "paridad", label: "Paridad" },
    { key: "none", label: "" },
  ];

  return (
    <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="p-4 flex flex-col gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className="text-[11px] px-2.5 py-1.5 rounded-full font-medium transition-colors"
              style={
                categoria === c
                  ? { background: "var(--navy)", color: "#fff" }
                  : { background: "#EEF0F2", color: "var(--text-soft)" }
              }
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Buscar ticker o emisor…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="col-span-2 text-base sm:text-[13px] px-3 py-2.5 sm:py-2 rounded-md sm:flex-1 sm:min-w-[180px]"
            style={{ border: "1px solid var(--border-strong)" }}
          />
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value as Moneda | "Todas")}
            className="text-[13px] px-2 py-2.5 sm:py-2 rounded-md w-full sm:w-auto"
            style={{ border: "1px solid var(--border-strong)" }}
          >
            <option value="Todas">Todas las monedas</option>
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </select>
          <select
            value={emisor}
            onChange={(e) => setEmisor(e.target.value)}
            className="text-[13px] px-2 py-2.5 sm:py-2 rounded-md w-full sm:w-auto"
            style={{ border: "1px solid var(--border-strong)" }}
          >
            <option>Todos</option>
            {emisores.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <select
            value={rango}
            onChange={(e) => setRango(e.target.value)}
            className="text-[13px] px-2 py-2.5 sm:py-2 rounded-md w-full sm:w-auto"
            style={{ border: "1px solid var(--border-strong)" }}
          >
            {RANGOS_VENCIMIENTO.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <span className="col-span-2 sm:col-span-1 sm:ml-auto text-[12px] text-center sm:text-right" style={{ color: "var(--text-mute)" }}>
            {filtrados.length} instrumento{filtrados.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 780 }}>
          <thead>
            <tr>
              {columnas.map((c) => (
                <th
                  key={c.label || "acciones"}
                  onClick={() => c.key !== "none" && setOrden(c.key)}
                  className={`text-[11px] font-medium uppercase tracking-wide px-3 py-3 text-left whitespace-nowrap ${
                    c.key !== "none" ? "cursor-pointer select-none" : ""
                  }`}
                  style={{
                    color: orden === c.key ? "var(--navy)" : "var(--text-mute)",
                    background: "#F6F7F8",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {c.label}
                  {orden === c.key ? " ▾" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((i) => {
              const yaAgregado = seleccionados?.has(i.ticker);
              return (
                <tr key={i.ticker} style={{ borderBottom: "1px solid #EEF0F2" }}>
                  <td className="px-3 py-2.5">
                    <div className="font-mono-brand text-[13px] font-medium" style={{ color: "var(--navy)" }}>
                      {i.ticker}
                    </div>
                    <div className="text-[11px] truncate max-w-[160px]" style={{ color: "var(--text-mute)" }} title={i.emisor}>
                      {i.emisor}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="pill"
                      style={{ background: CATEGORIA_RF_BG[i.categoria], color: CATEGORIA_RF_COLOR[i.categoria] }}
                    >
                      {i.subcategoria}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[13px] whitespace-nowrap">
                    {i.vencimiento ? fmtFecha(i.vencimiento) : `${i.diasAVencimientoSeed}d`}
                  </td>
                  <td className="px-3 py-2.5 font-mono-brand text-[13px] whitespace-nowrap">
                    {fmtNum(i.precioDirty ?? i.precioClean)}
                    {i.moneda === "USD" ? " USD" : ""}
                  </td>
                  <td className="px-3 py-2.5 font-mono-brand text-[13px]">{fmtPct(i.tna)}</td>
                  <td className="px-3 py-2.5 font-mono-brand text-[13px]">{fmtPct(i.tea)}</td>
                  <td className="px-3 py-2.5 font-mono-brand text-[13px]">
                    {i.duracionModificada === null ? "—" : i.duracionModificada.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 font-mono-brand text-[13px]">{fmtPct(i.paridad, 1)}</td>
                  <td className="px-3 py-2.5 text-right">
                    {onAgregar && (
                      <button
                        onClick={() => onAgregar(i.ticker)}
                        disabled={yaAgregado}
                        className="text-[11px] font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap"
                        style={
                          yaAgregado
                            ? { background: "#EEF0F2", color: "var(--text-mute)" }
                            : { background: "var(--teal-soft)", color: "var(--teal)" }
                        }
                      >
                        {yaAgregado ? "Agregado" : "+ Agregar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-8 text-[13px]" style={{ color: "var(--text-mute)" }}>
                  No hay instrumentos que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
