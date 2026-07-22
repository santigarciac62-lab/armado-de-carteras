import { Circle, Path, Rect, Svg, Text, View } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { PDF_COLOR } from "@/lib/pdfTheme";

/**
 * Tipografías de marca (Manual de Identidad Visual D.A Valores): Montserrat Bold para
 * títulos/acentos, Lato para cuerpo de texto. Se registran acá (no en FichaClientePdf.tsx,
 * que sigue en Helvetica) para no tocar ese documento existente sin necesidad. Los archivos
 * están en /public/fonts — variante .woff (no .woff2: fontkit no pudo re-empaquetar los
 * .woff2 de @fontsource al generar el PDF, ver commit).
 */
Font.register({
  family: "Montserrat",
  fonts: [{ src: "/fonts/Montserrat-Bold.woff", fontWeight: 700 }],
});
Font.register({
  family: "Lato",
  fonts: [
    { src: "/fonts/Lato-Regular.woff", fontWeight: 400 },
    { src: "/fonts/Lato-Bold.woff", fontWeight: 700 },
  ],
});

export const PDF_FONT = {
  heading: "Montserrat",
  body: "Lato",
};

/** Isologo D.A Valores recreado como vectores react-pdf (mismos paths que
 * public/logo-isologo.svg) — variante clara para fondo navy, según el manual de marca
 * (círculo + barras + flecha, "Usos de color" permite la versión blanca sobre oscuro). */
export function LogoIsologoClaro({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={22} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
      <Rect x={14} y={26} width={4} height={8} rx={0.5} fill="#FFFFFF" />
      <Rect x={20.5} y={21} width={4} height={13} rx={0.5} fill="#FFFFFF" />
      <Rect x={27} y={16} width={4} height={18} rx={0.5} fill={PDF_COLOR.teal} />
      <Path
        d="M14 21.5 L22.5 15 L29 18.5 L34.5 12"
        fill="none"
        stroke={PDF_COLOR.teal}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M29.5 12 L34.5 12 L34.5 17" fill="none" stroke={PDF_COLOR.teal} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Paleta para series por instrumento (gráfico de cobros por mes) — se asigna por orden
 * de aparición, no por categoría, así que acá sí se cicla si hace falta: cada serie ya
 * queda identificada por su propia fila en la leyenda debajo del gráfico. */
const PDF_SERIES_COLORS = ["#0097B2", "#1362AD", "#6D28D9", "#C0447E", "#7A8C00", "#B45309", "#616161", "#00012B"];

export function colorPorIndice(i: number): string {
  return PDF_SERIES_COLORS[i % PDF_SERIES_COLORS.length];
}

function puntoPolar(cx: number, cy: number, r: number, anguloDeg: number) {
  const rad = ((anguloDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pathSegmentoDonut(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number): string {
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  const oStart = puntoPolar(cx, cy, rOuter, startDeg);
  const oEnd = puntoPolar(cx, cy, rOuter, endDeg);
  const iEnd = puntoPolar(cx, cy, rInner, endDeg);
  const iStart = puntoPolar(cx, cy, rInner, startDeg);
  return `M ${oStart.x} ${oStart.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y} L ${iEnd.x} ${iEnd.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${iStart.x} ${iStart.y} Z`;
}

export interface PdfDonutDatum {
  categoria: string;
  pct: number;
  color: string;
}

/** Gráfico de torta (donut) — misma info que CategoriaDonut.tsx en la web, recreado a
 * mano porque react-pdf no soporta Recharts (no corre en un canvas/DOM de navegador). */
export function PdfDonutChart({
  titulo,
  data,
  centerLabel,
  centerValue,
}: {
  titulo: string;
  data: PdfDonutDatum[];
  centerLabel: string;
  centerValue: string;
}) {
  const segmentos = data.filter((d) => d.pct > 0);
  const size = 72;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 34;
  const rInner = 20;
  const gap = segmentos.length > 1 ? 1.5 : 0;

  const cortes = segmentos.reduce<number[]>((acc, d) => [...acc, (acc[acc.length - 1] ?? 0) + d.pct], []);
  const arcos = segmentos.map((d, i) => {
    const acumuladoPrevio = i > 0 ? cortes[i - 1] : 0;
    const start = (acumuladoPrevio / 100) * 360 + gap;
    const end = (cortes[i] / 100) * 360 - gap;
    return { ...d, start, end: Math.max(end, start) };
  });

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 8, color: PDF_COLOR.textSoft, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>
        {titulo}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ width: size, height: size, position: "relative" }}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {arcos.map((a) => (
              <Path key={a.categoria} d={pathSegmentoDonut(cx, cy, rOuter, rInner, a.start, a.end)} fill={a.color} />
            ))}
          </Svg>
          <View style={{ position: "absolute", top: 0, left: 0, width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 11, color: PDF_COLOR.navy }}>{centerValue}</Text>
            <Text style={{ fontFamily: PDF_FONT.body, fontSize: 5.5, color: PDF_COLOR.textMute, textTransform: "uppercase" }}>{centerLabel}</Text>
          </View>
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          {data.map((d) => (
            <View key={d.categoria} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: d.color }} />
              <Text style={{ fontFamily: PDF_FONT.body, fontSize: 7, color: PDF_COLOR.textSoft, flex: 1 }}>{d.categoria}</Text>
              <Text style={{ fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7, color: PDF_COLOR.text }}>{d.pct.toFixed(1)}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
