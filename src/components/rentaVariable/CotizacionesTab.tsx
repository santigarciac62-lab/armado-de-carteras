"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ActivoRV, SECTORES_RV, SectorRV } from "@/data/rentaVariable";

const FAVORITOS_KEY = "rv_favoritos";
const FAVORITOS_EVENTO = "rv-favoritos-changed";

// localStorage es un store externo mutable: se lee con useSyncExternalStore (no con
// efecto + setState) para que el snapshot del servidor (sin favoritos) y el del cliente
// puedan diferir sin generar un mismatch de hidratación.
function suscribirse(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITOS_EVENTO, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITOS_EVENTO, callback);
  };
}
function leerSnapshot() {
  try {
    return window.localStorage.getItem(FAVORITOS_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
function leerSnapshotServidor() {
  return "[]";
}

function useFavoritos() {
  const raw = useSyncExternalStore(suscribirse, leerSnapshot, leerSnapshotServidor);
  const favoritos = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(raw));
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  function toggle(ticker: string) {
    const next = new Set(favoritos);
    if (next.has(ticker)) next.delete(ticker);
    else next.add(ticker);
    try {
      window.localStorage.setItem(FAVORITOS_KEY, JSON.stringify([...next]));
      window.dispatchEvent(new Event(FAVORITOS_EVENTO));
    } catch {
      // sin persistencia disponible, la sesión igual funciona
    }
  }

  return { favoritos, toggle };
}

type Campo = "ticker" | "precio" | "variacionDia";
type Orden = { campo: Campo; dir: 1 | -1 };

function ordenar(activos: ActivoRV[], orden: Orden): ActivoRV[] {
  return [...activos].sort((a, b) => {
    if (orden.campo === "ticker") return a.ticker.localeCompare(b.ticker) * orden.dir;
    return (a[orden.campo] - b[orden.campo]) * orden.dir;
  });
}

function FilaActivo({
  activo,
  esFavorito,
  onToggleFavorito,
  onVerTecnico,
}: {
  activo: ActivoRV;
  esFavorito: boolean;
  onToggleFavorito: () => void;
  onVerTecnico: () => void;
}) {
  return (
    <tr style={{ borderBottom: "1px solid #EEF0F2" }}>
      <td className="px-3 py-2.5 w-8">
        <button
          onClick={onToggleFavorito}
          aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="text-[16px] leading-none"
          style={{ color: esFavorito ? "var(--amber)" : "var(--border-strong)" }}
        >
          {esFavorito ? "★" : "☆"}
        </button>
      </td>
      <td className="px-3 py-2.5">
        <button onClick={onVerTecnico} className="text-left">
          <span className="font-mono-brand text-[13px] font-medium" style={{ color: activo.tipo === "local" ? "var(--slate)" : "var(--navy-deep)" }}>
            {activo.ticker}
          </span>
          <div className="text-[11px] truncate max-w-[220px]" style={{ color: "var(--text-mute)" }}>
            {activo.nombre}
          </div>
        </button>
      </td>
      <td className="px-3 py-2.5 text-right font-mono-brand text-[13px]">
        ${activo.precio.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
      </td>
      <td className="px-3 py-2.5 text-right font-mono-brand text-[13px]" style={{ color: activo.variacionDia >= 0 ? "var(--green)" : "var(--red)" }}>
        {activo.variacionDia >= 0 ? "+" : ""}
        {activo.variacionDia.toFixed(2)}%
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className="pill" style={activo.fuentePrecio === "data912" ? { background: "var(--teal-soft)", color: "var(--teal)" } : { background: "#EEF0F2", color: "var(--text-mute)" }}>
          {activo.fuentePrecio === "data912" ? "Data912" : "Demo"}
        </span>
      </td>
    </tr>
  );
}

function EncabezadoOrdenable({ label, campo, orden, onOrdenar, align = "left" }: { label: string; campo: Campo; orden: Orden; onOrdenar: (c: Campo) => void; align?: "left" | "right" }) {
  const activo = orden.campo === campo;
  return (
    <th
      onClick={() => onOrdenar(campo)}
      className={`text-[10px] font-medium uppercase tracking-wide px-3 py-2 cursor-pointer select-none ${align === "right" ? "text-right" : "text-left"}`}
      style={{ color: activo ? "var(--navy)" : "var(--text-mute)" }}
    >
      {label}
      {activo ? (orden.dir === 1 ? " ▲" : " ▼") : ""}
    </th>
  );
}

export function CotizacionesTab({ activos, onVerTecnico }: { activos: ActivoRV[]; onVerTecnico: (ticker: string) => void }) {
  const { favoritos, toggle } = useFavoritos();
  const [busqueda, setBusqueda] = useState("");
  const [sector, setSector] = useState<SectorRV | "Todos">("Todos");
  const [orden, setOrden] = useState<Orden>({ campo: "ticker", dir: 1 });

  function onOrdenar(campo: Campo) {
    setOrden((prev) => (prev.campo === campo ? { campo, dir: prev.dir === 1 ? -1 : 1 } : { campo, dir: 1 }));
  }

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return activos.filter((a) => {
      if (sector !== "Todos" && a.sector !== sector) return false;
      if (q && !a.ticker.toLowerCase().includes(q) && !a.nombre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activos, busqueda, sector]);

  const favoritosFiltrados = ordenar(
    filtrados.filter((a) => favoritos.has(a.ticker)),
    orden
  );

  const porSector = SECTORES_RV.map((s) => ({
    sector: s,
    activos: ordenar(
      filtrados.filter((a) => a.sector === s),
      orden
    ),
  })).filter((g) => g.activos.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[10px] p-4 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <input
          type="text"
          placeholder="Buscar ticker o nombre…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="text-base sm:text-[13px] px-3 py-2.5 sm:py-2 rounded-md sm:flex-1"
          style={{ border: "1px solid var(--border-strong)" }}
        />
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value as SectorRV | "Todos")}
          className="text-[13px] px-3 py-2.5 sm:py-2 rounded-md"
          style={{ border: "1px solid var(--border-strong)" }}
        >
          <option value="Todos">Todos los sectores</option>
          {SECTORES_RV.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {favoritosFiltrados.length > 0 && (
        <div className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[14px] font-medium" style={{ color: "var(--navy)" }}>
              ★ Favoritos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 420 }}>
              <thead>
                <tr>
                  <th className="w-8" />
                  <EncabezadoOrdenable label="Ticker" campo="ticker" orden={orden} onOrdenar={onOrdenar} />
                  <EncabezadoOrdenable label="Precio" campo="precio" orden={orden} onOrdenar={onOrdenar} align="right" />
                  <EncabezadoOrdenable label="Var. %" campo="variacionDia" orden={orden} onOrdenar={onOrdenar} align="right" />
                  <th className="text-[10px] font-medium uppercase tracking-wide px-3 py-2 text-right" style={{ color: "var(--text-mute)" }}>
                    Fuente
                  </th>
                </tr>
              </thead>
              <tbody>
                {favoritosFiltrados.map((a) => (
                  <FilaActivo key={a.ticker} activo={a} esFavorito onToggleFavorito={() => toggle(a.ticker)} onVerTecnico={() => onVerTecnico(a.ticker)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {porSector.map(({ sector: s, activos: activosSector }) => (
        <div key={s} className="rounded-[10px]" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-serif-brand text-[14px] font-medium" style={{ color: "var(--navy)" }}>
              {s}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse", minWidth: 420 }}>
              <thead>
                <tr>
                  <th className="w-8" />
                  <EncabezadoOrdenable label="Ticker" campo="ticker" orden={orden} onOrdenar={onOrdenar} />
                  <EncabezadoOrdenable label="Precio" campo="precio" orden={orden} onOrdenar={onOrdenar} align="right" />
                  <EncabezadoOrdenable label="Var. %" campo="variacionDia" orden={orden} onOrdenar={onOrdenar} align="right" />
                  <th className="text-[10px] font-medium uppercase tracking-wide px-3 py-2 text-right" style={{ color: "var(--text-mute)" }}>
                    Fuente
                  </th>
                </tr>
              </thead>
              <tbody>
                {activosSector.map((a) => (
                  <FilaActivo
                    key={a.ticker}
                    activo={a}
                    esFavorito={favoritos.has(a.ticker)}
                    onToggleFavorito={() => toggle(a.ticker)}
                    onVerTecnico={() => onVerTecnico(a.ticker)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {porSector.length === 0 && (
        <div className="rounded-[10px] p-8 text-center text-[13px]" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-mute)" }}>
          No hay instrumentos que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
