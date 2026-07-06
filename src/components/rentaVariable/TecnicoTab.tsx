"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivoRV } from "@/data/rentaVariable";
import { colorDeScore } from "./senalUtils";

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export function TecnicoTab({
  activos,
  activo,
  onSeleccionar,
}: {
  activos: ActivoRV[];
  activo: ActivoRV;
  onSeleccionar: (ticker: string) => void;
}) {
  const dataPrecio = activo.historico.map((h, i) => ({
    fecha: h.fecha,
    precio: h.precio,
    sma20: activo.sma20[i],
    sma50: activo.sma50[i],
  }));
  const dataRsi = dataPrecio.slice(-60).map((d, i) => ({ fecha: d.fecha, rsi: activo.rsiSerie.slice(-60)[i] }));
  const dataMacd = dataPrecio.slice(-60).map((d, i) => ({
    fecha: d.fecha,
    hist: activo.macd.histograma.slice(-60)[i],
    macd: activo.macd.macd.slice(-60)[i],
    señal: activo.macd.señal.slice(-60)[i],
  }));

  const radarData = [
    { eje: "Tendencia", valor: clamp(activo.scoreTecnico, 0, 10) },
    { eje: "Momentum (RSI)", valor: clamp(activo.rsi / 10, 0, 10) },
    { eje: "Volatilidad", valor: clamp(10 - activo.volatilidadDiariaPct * 3, 0, 10) },
    { eje: "Rango 52 sem.", valor: clamp(activo.pct52 / 10, 0, 10) },
  ];

  const tendencia = activo.precio > activo.ma200 ? "ALCISTA" : "BAJISTA";
  const maPos = activo.ma50 > activo.ma200 ? "GOLDEN CROSS" : "DEATH CROSS";

  const indicadores = [
    { n: "RSI (14)", v: String(activo.rsi), c: activo.rsi > 70 ? "var(--red)" : activo.rsi < 30 ? "var(--green)" : "var(--text)", s: activo.rsi > 70 ? "Sobrecompra" : activo.rsi < 30 ? "Sobreventa" : "Neutral" },
    { n: "Tendencia", v: tendencia, c: tendencia === "ALCISTA" ? "var(--green)" : "var(--red)", s: "vs. MA200" },
    { n: "Cruce de medias", v: maPos, c: maPos === "GOLDEN CROSS" ? "var(--green)" : "var(--red)", s: "MA50 vs. MA200" },
    { n: "Posición 52 sem.", v: `${activo.pct52}%`, c: activo.pct52 > 60 ? "var(--green)" : activo.pct52 < 20 ? "var(--red)" : "var(--text)", s: "en el rango anual" },
    { n: "Var. hoy", v: `${activo.variacionDia >= 0 ? "+" : ""}${activo.variacionDia.toFixed(2)}%`, c: activo.variacionDia >= 0 ? "var(--green)" : "var(--red)", s: "precio del día" },
    { n: "Score", v: `${activo.score}/10`, c: colorDeScore(activo.score), s: activo.señal },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {activos.map((a) => (
          <button
            key={a.ticker}
            onClick={() => onSeleccionar(a.ticker)}
            className="text-[11px] px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-full font-mono-brand font-medium transition-colors"
            style={
              a.ticker === activo.ticker
                ? { background: "var(--navy)", color: "#fff" }
                : { background: "#EEF0F2", color: "var(--text-soft)" }
            }
          >
            {a.ticker}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            Precio — {activo.ticker} (1 año, demo)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={dataPrecio} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EBEE" />
              <XAxis dataKey="fecha" tick={{ fontSize: 9, fill: "var(--text-mute)" }} minTickGap={40} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="precio" stroke="var(--teal)" strokeWidth={1.5} dot={false} name="Precio" />
              <Line type="monotone" dataKey="sma20" stroke="var(--amber)" strokeWidth={1} dot={false} strokeDasharray="4 2" name="SMA 20" />
              <Line type="monotone" dataKey="sma50" stroke="var(--blue)" strokeWidth={1} dot={false} strokeDasharray="2 2" name="SMA 50" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            Radar técnico
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E9EBEE" />
              <PolarAngleAxis dataKey="eje" tick={{ fontSize: 10, fill: "var(--text-mute)" }} />
              <Radar dataKey="valor" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            RSI (14)
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={dataRsi} margin={{ left: 0, right: 8 }}>
              <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--text-mute)" }} />
              <XAxis dataKey="fecha" hide />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Line type="monotone" dataKey="rsi" stroke="var(--green)" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
            MACD
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={dataMacd} margin={{ left: 0, right: 8 }}>
              <XAxis dataKey="fecha" hide />
              <YAxis tick={{ fontSize: 9, fill: "var(--text-mute)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Bar dataKey="hist" radius={[2, 2, 0, 0]}>
                {dataMacd.map((d, i) => (
                  <Cell key={i} fill={d.hist >= 0 ? "var(--green)" : "var(--red)"} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="macd" stroke="var(--teal)" strokeWidth={1.2} dot={false} />
              <Line type="monotone" dataKey="señal" stroke="var(--amber)" strokeWidth={1} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[10px] p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="font-serif-brand text-[15px] font-medium mb-3" style={{ color: "var(--navy)" }}>
          Indicadores actuales
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {indicadores.map((i) => (
            <div key={i.n} className="rounded-md p-3" style={{ background: "#F6F7F8", border: "1px solid var(--border)" }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--text-mute)" }}>
                {i.n}
              </div>
              <div className="font-mono-brand text-[15px] font-semibold mt-1" style={{ color: i.c }}>
                {i.v}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-mute)" }}>
                {i.s}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
