"use client";

import { useCallback, useMemo, useState } from "react";
import { InstrumentoRentaFija, Moneda } from "@/lib/types";
import { ActivoRV } from "@/data/rentaVariable";
import { FilaSelector, LineaCarteraCombinada } from "@/lib/armadoCartera/tipos";
import { calcularLineasCombinadas, sumaPct } from "@/lib/armadoCartera/calculos";
import { normalizarUniverso } from "@/lib/armadoCartera/normalizar";
import { justificacionAutogenerada } from "@/lib/armadoCartera/justificacion";
import { segmentosComposicion } from "@/lib/armadoCartera/coloresSector";
import { CategoriaDonut } from "@/components/CategoriaDonut";
import { SelectorInstrumentosCombinado } from "./SelectorInstrumentosCombinado";
import { PanelCartera } from "./PanelCartera";
import { CalendarioRentaFijaDeCartera } from "./CalendarioRentaFijaDeCartera";
import { BotonDescargarInformePdf } from "./BotonDescargarInformePdf";

function SegmentedButtons<T extends string>({
  opciones,
  valor,
  onChange,
}: {
  opciones: { id: T; label: string }[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="grid rounded-md overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${opciones.length}, 1fr)`, border: "1px solid var(--border-strong)" }}
    >
      {opciones.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="text-[13px] px-3 py-2 font-medium transition-colors"
          style={valor === o.id ? { background: "var(--navy)", color: "#fff" } : { background: "#F7F8F9", color: "var(--text-soft)" }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CarteraCombinadaWorkspace({
  universoRentaFija,
  universoRentaVariable,
}: {
  universoRentaFija: InstrumentoRentaFija[];
  universoRentaVariable: ActivoRV[];
}) {
  const [monedaMonto, setMonedaMonto] = useState<Moneda>("ARS");
  const [montoTexto, setMontoTexto] = useState("10.000.000");
  const [lineas, setLineas] = useState<LineaCarteraCombinada[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [justificaciones, setJustificaciones] = useState<Record<string, string>>({});
  const [justificacionesTocadas, setJustificacionesTocadas] = useState<Set<string>>(new Set());

  const monto = useMemo(() => {
    const n = parseFloat(montoTexto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [montoTexto]);

  const rentaFijaPorTicker = useMemo(() => new Map(universoRentaFija.map((i) => [i.ticker, i])), [universoRentaFija]);
  const rentaVariablePorTicker = useMemo(() => new Map(universoRentaVariable.map((a) => [a.ticker, a])), [universoRentaVariable]);

  const filasSelector: FilaSelector[] = useMemo(
    () => normalizarUniverso(universoRentaFija, universoRentaVariable),
    [universoRentaFija, universoRentaVariable]
  );

  const lineasCalculadas = useMemo(
    () => calcularLineasCombinadas(lineas, monto, monedaMonto, rentaFijaPorTicker, rentaVariablePorTicker),
    [lineas, monto, monedaMonto, rentaFijaPorTicker, rentaVariablePorTicker]
  );

  const totalPct = useMemo(() => sumaPct(lineas), [lineas]);
  const seleccionados = useMemo(() => new Set(lineas.map((l) => l.ticker)), [lineas]);

  const pctRentaFija = lineasCalculadas.filter((l) => l.clase === "rentaFija").reduce((a, l) => a + l.pct, 0);
  const pctRentaVariable = lineasCalculadas.filter((l) => l.clase === "rentaVariable").reduce((a, l) => a + l.pct, 0);
  const donutData = [
    { categoria: "Renta Fija", pct: pctRentaFija, color: "var(--teal)" },
    { categoria: "Renta Variable", pct: pctRentaVariable, color: "var(--blue)" },
  ];

  const sectorData = useMemo(() => {
    const pctPorCategoria = new Map<string, number>();
    for (const l of lineasCalculadas) {
      pctPorCategoria.set(l.categoriaLabel, (pctPorCategoria.get(l.categoriaLabel) ?? 0) + l.pct);
    }
    return segmentosComposicion(pctPorCategoria);
  }, [lineasCalculadas]);

  const agregarInstrumento = useCallback((fila: FilaSelector) => {
    setLineas((prev) => {
      if (prev.some((l) => l.ticker === fila.ticker)) return prev;
      const totalActual = sumaPct(prev);
      const restante = Math.max(0, 100 - totalActual);
      const pctSugerido = restante > 0 ? Math.min(10, restante) : 5;
      return [...prev, { ticker: fila.ticker, clase: fila.clase, pct: Math.round(pctSugerido * 10) / 10 }];
    });
  }, []);

  const quitarInstrumento = useCallback((ticker: string) => {
    setLineas((prev) => prev.filter((l) => l.ticker !== ticker));
    setExpandido((prev) => (prev === ticker ? null : prev));
  }, []);

  const cambiarPct = useCallback((ticker: string, pct: number) => {
    setLineas((prev) => prev.map((l) => (l.ticker === ticker ? { ...l, pct } : l)));
  }, []);

  const normalizar = useCallback(() => {
    setLineas((prev) => {
      const total = sumaPct(prev);
      if (total <= 0) return prev;
      return prev.map((l) => ({ ...l, pct: Math.round((l.pct / total) * 10000) / 100 }));
    });
  }, []);

  const toggleExpandir = useCallback(
    (ticker: string) => {
      setExpandido((prev) => (prev === ticker ? null : ticker));
      // Se auto-completa el borrador de justificación la primera vez que se abre el
      // análisis de ese instrumento — si el asesor ya la editó, no se pisa.
      if (!justificacionesTocadas.has(ticker)) {
        const linea = lineasCalculadas.find((l) => l.ticker === ticker);
        if (linea) {
          setJustificaciones((prev) => ({ ...prev, [ticker]: justificacionAutogenerada(linea) }));
        }
      }
    },
    [justificacionesTocadas, lineasCalculadas]
  );

  const cambiarJustificacion = useCallback((ticker: string, texto: string) => {
    setJustificaciones((prev) => ({ ...prev, [ticker]: texto }));
    setJustificacionesTocadas((prev) => new Set(prev).add(ticker));
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
      <div
        className="rounded-[10px] p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Monto a invertir
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={montoTexto}
            onChange={(e) => setMontoTexto(e.target.value)}
            className="w-full font-mono-brand text-base sm:text-[15px] px-3 py-2.5 sm:py-2 rounded-md"
            style={{ border: "1px solid var(--border-strong)" }}
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Moneda del monto
          </label>
          <SegmentedButtons
            opciones={[
              { id: "ARS" as Moneda, label: "ARS" },
              { id: "USD" as Moneda, label: "USD" },
            ]}
            valor={monedaMonto}
            onChange={setMonedaMonto}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Monto total armado", value: `${monedaMonto === "USD" ? "USD " : "$"}${Math.round(monto).toLocaleString("es-AR")}` },
          { label: "Instrumentos seleccionados", value: String(lineas.length) },
          {
            label: "% asignado",
            value: `${totalPct.toFixed(1)}%`,
            sub: Math.abs(totalPct - 100) < 0.05 ? "Cartera completa" : "Falta ajustar a 100%",
          },
          {
            label: "Composición",
            value: `${pctRentaFija.toFixed(0)}% RF / ${pctRentaVariable.toFixed(0)}% RV`,
          },
        ].map((k) => (
          <div key={k.label} className="rounded-lg p-3 sm:p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--text-mute)" }}>
              {k.label}
            </div>
            <div className="font-mono-brand text-[16px] sm:text-[22px] font-semibold mt-1.5 break-words leading-tight" style={{ color: "var(--navy)" }}>
              {k.value}
            </div>
            {k.sub && (
              <div className="text-[11px] sm:text-[12px] mt-1" style={{ color: "var(--text-soft)" }}>
                {k.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 mb-6">
        <SelectorInstrumentosCombinado filas={filasSelector} seleccionados={seleccionados} onAgregar={agregarInstrumento} />

        <div className="flex flex-col gap-6">
          <PanelCartera
            lineas={lineasCalculadas}
            totalPct={totalPct}
            montoTotal={monto}
            moneda={monedaMonto}
            expandido={expandido}
            onToggleExpandir={toggleExpandir}
            onCambiarPct={cambiarPct}
            onQuitar={quitarInstrumento}
            onNormalizar={normalizar}
            justificaciones={justificaciones}
            onJustificacionChange={cambiarJustificacion}
          />

          <div
            className="rounded-[10px] p-4 grid grid-cols-1 md:grid-cols-2 gap-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <CategoriaDonut data={donutData} centerLabel="Clases" centerValue={String(lineas.length)} />
              <div className="flex flex-col gap-1.5 text-[12px] w-full">
                {donutData.map((d) => (
                  <div key={d.categoria} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                    <span style={{ color: "var(--text-soft)" }}>{d.categoria}</span>
                    <span className="font-mono-brand font-medium ml-auto" style={{ color: "var(--text)" }}>
                      {d.pct.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {lineas.length === 0 && <span style={{ color: "var(--text-mute)" }}>Sin composición todavía</span>}
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center gap-5 pt-5 md:pt-0 md:pl-5 border-t md:border-t-0 md:border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <CategoriaDonut data={sectorData} centerLabel="Sectores" centerValue={String(sectorData.length)} />
              <div className="flex flex-col gap-1.5 text-[12px] w-full">
                {sectorData.map((d) => (
                  <div key={d.categoria} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                    <span className="truncate" style={{ color: "var(--text-soft)" }}>
                      {d.categoria}
                    </span>
                    <span className="font-mono-brand font-medium ml-auto shrink-0" style={{ color: "var(--text)" }}>
                      {d.pct.toFixed(1)}%
                    </span>
                  </div>
                ))}
                {lineas.length === 0 && <span style={{ color: "var(--text-mute)" }}>Sin composición todavía</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex sm:justify-end mb-4">
        <BotonDescargarInformePdf
          lineas={lineasCalculadas}
          totalPct={totalPct}
          montoTotal={monto}
          moneda={monedaMonto}
          justificaciones={justificaciones}
          universoRentaFija={universoRentaFija}
        />
      </div>

      <CalendarioRentaFijaDeCartera lineas={lineasCalculadas} universoRentaFija={universoRentaFija} />
    </div>
  );
}
