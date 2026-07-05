"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CarteraModelo, Cotizacion, Instrumento, LineaCartera, Moneda, Perfil } from "@/lib/types";
import {
  agregarPorCategoria,
  calcularLineas,
  desvioPorCategoria,
  desvioTotal,
  lineasDesdeModelo,
  sumaPct,
} from "@/lib/armado";
import { statusDesvio } from "@/lib/bucket";
import { getCarteraModelo } from "@/data/modelPortfolios";
import { colorDeCategoria } from "@/lib/colors";
import { TC_REFERENCIA } from "@/lib/constants";
import { CatalogoInstrumentos } from "./CatalogoInstrumentos";
import { CarteraEnArmado } from "./CarteraEnArmado";
import { ComparacionModelo } from "./ComparacionModelo";
import { CategoriaDonut } from "@/components/CategoriaDonut";

const PERFILES: { id: Perfil; label: string }[] = [
  { id: "conservador", label: "Conservador" },
  { id: "moderado", label: "Moderado" },
  { id: "agresivo", label: "Agresivo" },
];

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
      style={{
        gridTemplateColumns: `repeat(${opciones.length}, 1fr)`,
        border: "1px solid var(--border-strong)",
      }}
    >
      {opciones.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className="text-[13px] px-3 py-2 font-medium transition-colors"
          style={
            valor === o.id
              ? { background: "var(--navy)", color: "#fff" }
              : { background: "#F7F8F9", color: "var(--text-soft)" }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ArmadoWorkspace({
  carterasModelo,
  universoInstrumentos,
  cotizacionesIniciales,
  proveedorInicial,
  actualizadoInicial,
}: {
  carterasModelo: CarteraModelo[];
  universoInstrumentos: Instrumento[];
  cotizacionesIniciales: Record<string, Cotizacion>;
  proveedorInicial: string;
  actualizadoInicial: string;
}) {
  const [perfil, setPerfil] = useState<Perfil>("moderado");
  const [monedaCartera, setMonedaCartera] = useState<Moneda>("ARS");
  const [monedaMonto, setMonedaMonto] = useState<Moneda>("ARS");
  const [montoTexto, setMontoTexto] = useState("5.000.000");
  const [lineas, setLineas] = useState<LineaCartera[]>(() => {
    const inicial = getCarteraModelo("moderado", "ARS");
    return inicial ? lineasDesdeModelo(inicial) : [];
  });
  const [carteraCargadaId, setCarteraCargadaId] = useState<string | null>("moderado_ars");
  const [cotizaciones, setCotizaciones] = useState(cotizacionesIniciales);
  const [proveedor, setProveedor] = useState(proveedorInicial);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>(actualizadoInicial);

  // Poll de precios cada 30s para simular actualización "en vivo".
  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const data = await res.json();
        setCotizaciones(data.cotizaciones);
        setProveedor(data.proveedor);
        setUltimaActualizacion(data.actualizadoEn);
      } catch {
        // se mantiene la última cotización conocida
      }
    }, 30_000);
    return () => clearInterval(intervalo);
  }, []);

  const monto = useMemo(() => {
    const n = parseFloat(montoTexto.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [montoTexto]);

  const montoEnCartera = useMemo(() => {
    if (monedaMonto === monedaCartera) return monto;
    if (monedaMonto === "ARS" && monedaCartera === "USD") return monto / TC_REFERENCIA;
    return monto * TC_REFERENCIA;
  }, [monto, monedaMonto, monedaCartera]);

  const lineasCalculadas = useMemo(
    () => calcularLineas(lineas, montoEnCartera, cotizaciones),
    [lineas, montoEnCartera, cotizaciones]
  );

  const totalPct = useMemo(() => sumaPct(lineas), [lineas]);

  const categoriasAgregadas = useMemo(() => agregarPorCategoria(lineasCalculadas), [lineasCalculadas]);

  const carteraCargada = carteraCargadaId
    ? carterasModelo.find((c) => c.id === carteraCargadaId)
    : undefined;

  const comparacion = useMemo(
    () => (carteraCargada ? desvioPorCategoria(lineasCalculadas, carteraCargada) : []),
    [lineasCalculadas, carteraCargada]
  );

  const desvio = useMemo(
    () => (carteraCargada ? desvioTotal(lineasCalculadas, carteraCargada) : null),
    [lineasCalculadas, carteraCargada]
  );

  const seleccionados = useMemo(() => new Set(lineas.map((l) => l.ticker)), [lineas]);

  const cargarModelo = useCallback(
    (nuevoPerfil: Perfil, nuevaMoneda: Moneda) => {
      const modelo = getCarteraModelo(nuevoPerfil, nuevaMoneda);
      if (!modelo) return;
      setPerfil(nuevoPerfil);
      setMonedaCartera(nuevaMoneda);
      setLineas(lineasDesdeModelo(modelo));
      setCarteraCargadaId(modelo.id);
    },
    []
  );

  const agregarInstrumento = useCallback((ticker: string) => {
    setLineas((prev) => {
      if (prev.some((l) => l.ticker === ticker)) return prev;
      const totalActual = sumaPct(prev);
      const restante = Math.max(0, 100 - totalActual);
      const pctSugerido = restante > 0 ? Math.min(10, restante) : 5;
      return [...prev, { ticker, pct: Math.round(pctSugerido * 10) / 10 }];
    });
    // Se mantiene la referencia al modelo cargado: así el asesor ve cómo se
    // va alejando del punto de partida a medida que personaliza la cartera.
  }, []);

  const quitarInstrumento = useCallback((ticker: string) => {
    setLineas((prev) => prev.filter((l) => l.ticker !== ticker));
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

  const donutData = categoriasAgregadas.map((c) => ({
    categoria: c.categoria,
    pct: c.pct,
    color: colorDeCategoria(c.categoria),
  }));

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
      {/* Control bar */}
      <div
        className="rounded-[10px] p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Perfil de partida
          </label>
          <SegmentedButtons opciones={PERFILES} valor={perfil} onChange={(p) => cargarModelo(p, monedaCartera)} />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Moneda de la cartera modelo
          </label>
          <SegmentedButtons
            opciones={[
              { id: "ARS" as Moneda, label: "ARS" },
              { id: "USD" as Moneda, label: "USD" },
            ]}
            valor={monedaCartera}
            onChange={(m) => cargarModelo(perfil, m)}
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium mb-1.5" style={{ color: "var(--text-mute)" }}>
            Monto a invertir
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={montoTexto}
              onChange={(e) => setMontoTexto(e.target.value)}
              className="flex-1 min-w-0 font-mono-brand text-base sm:text-[15px] px-3 py-2.5 sm:py-2 rounded-md"
              style={{ border: "1px solid var(--border-strong)" }}
            />
            <div className="w-full sm:w-[140px] shrink-0">
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
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Monto total armado", value: `${monedaCartera === "USD" ? "USD " : "$"}${Math.round(montoEnCartera).toLocaleString("es-AR")}` },
          { label: "Instrumentos seleccionados", value: String(lineas.length) },
          {
            label: "% asignado",
            value: `${totalPct.toFixed(1)}%`,
            sub: Math.abs(totalPct - 100) < 0.05 ? "Cartera completa" : "Falta ajustar a 100%",
          },
          {
            label: "Fuente de precios",
            value: proveedor === "data912" ? "Data912" : "Demo",
            sub: `Actualizado ${new Date(ultimaActualizacion).toLocaleTimeString("es-AR")}`,
          },
          {
            label: "Desvío vs. perfil",
            value: desvio === null ? "—" : `${(desvio * 100).toFixed(0)}%`,
            sub: carteraCargada ? `vs. ${carteraCargada.perfilLabel} ${carteraCargada.moneda}` : "Elegí un perfil de partida",
            color:
              desvio === null
                ? "var(--navy)"
                : statusDesvio(desvio) === "optimo"
                  ? "var(--green)"
                  : statusDesvio(desvio) === "aceptable"
                    ? "var(--amber)"
                    : "var(--red)",
          },
        ].map((k) => (
          <div key={k.label} className="rounded-lg p-3 sm:p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--text-mute)" }}>
              {k.label}
            </div>
            <div
              className="font-mono-brand text-[16px] sm:text-[24px] font-semibold mt-1.5 break-words leading-tight"
              style={{ color: k.color ?? "var(--navy)" }}
            >
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

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <CatalogoInstrumentos
          instrumentos={universoInstrumentos}
          cotizaciones={cotizaciones}
          seleccionados={seleccionados}
          onAgregar={agregarInstrumento}
        />

        <div className="flex flex-col gap-6">
          <CarteraEnArmado
            lineas={lineasCalculadas}
            totalPct={totalPct}
            montoTotal={montoEnCartera}
            monedaCartera={monedaCartera}
            onCambiarPct={cambiarPct}
            onQuitar={quitarInstrumento}
            onNormalizar={normalizar}
          />

          <div className={`grid grid-cols-1 gap-6 ${carteraCargada ? "md:grid-cols-2" : ""}`}>
            <div
              className="rounded-[10px] p-4 flex flex-col sm:flex-row items-center gap-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <CategoriaDonut data={donutData} centerLabel="Categorías" centerValue={`${categoriasAgregadas.length}`} />
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
                {donutData.length === 0 && (
                  <span style={{ color: "var(--text-mute)" }}>Sin composición todavía</span>
                )}
              </div>
            </div>

            {carteraCargada && <ComparacionModelo filas={comparacion} modelo={carteraCargada} />}
          </div>
        </div>
      </div>
    </div>
  );
}
