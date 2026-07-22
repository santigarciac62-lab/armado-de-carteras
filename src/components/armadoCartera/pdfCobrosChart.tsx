import { Line, Rect, Svg, Text, View } from "@react-pdf/renderer";
import { Moneda } from "@/lib/types";
import { fmtNum } from "@/lib/formato";
import { PDF_COLOR } from "@/lib/pdfTheme";
import { PDF_FONT } from "./pdfBrand";

export interface CobroMensualPorTicker {
  mes: string; // "yyyy-mm"
  porTicker: Record<string, number>;
}

const AZUL_MARINO = "#0A1E3D";
const AXIS_COLOR = "#8FA3C4";
// Nota: se usa un hex sólido en vez de rgba() — el stroke de <Line> en el renderer de
// react-pdf no interpreta bien rgba() dentro de un <Svg> (terminaba pintando las líneas
// de un verde neón en vez de blanco translúcido).
const GRID_COLOR = "#2C3E5C";

function niceMax(raw: number): number {
  if (raw <= 0) return 1;
  const magnitud = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalizado = raw / magnitud;
  const paso = normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10;
  return paso * magnitud;
}

function mesLabel(mes: string): string {
  const [anio, m] = mes.split("-");
  const nombres = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${nombres[Number(m) - 1]} ${anio.slice(2)}`;
}

/** Gráfico de barras "Cobros Proyectados por Mes" — fondo azul marino oscuro, ejes y
 * grilla claros, una barra por instrumento dentro de cada mes (no apiladas), leyenda de
 * instrumentos abajo. Reemplaza la tabla "Total por mes" a pedido del usuario; el detalle
 * de pagos individuales (antes una tabla aparte) ya no se muestra en el PDF. */
export function PdfCobrosPorMesChart({
  moneda,
  datos,
  tickers,
  colorPorTicker,
}: {
  moneda: Moneda;
  datos: CobroMensualPorTicker[];
  tickers: string[];
  colorPorTicker: Record<string, string>;
}) {
  const plotWidth = 480;
  const plotHeight = 140;
  const maxValor = niceMax(Math.max(0, ...datos.flatMap((d) => tickers.map((t) => d.porTicker[t] ?? 0))));
  const ticks = 5;
  const slotWidth = plotWidth / Math.max(datos.length, 1);
  const laneWidth = slotWidth / Math.max(tickers.length, 1);
  const labelStep = Math.max(1, Math.ceil(datos.length / 18));

  return (
    <View style={{ backgroundColor: AZUL_MARINO, borderRadius: 6, padding: 14, marginBottom: 18 }} wrap={false}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 1 }}>
          <View style={{ width: 3, height: 6, backgroundColor: PDF_COLOR.teal }} />
          <View style={{ width: 3, height: 9, backgroundColor: PDF_COLOR.teal }} />
          <View style={{ width: 3, height: 4, backgroundColor: PDF_COLOR.teal }} />
        </View>
        <Text style={{ fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 10, color: "#FFFFFF" }}>
          Cobros Proyectados por Mes ({moneda})
        </Text>
      </View>
      <Text style={{ fontFamily: PDF_FONT.body, fontSize: 7, color: "#C7D2E0", marginBottom: 10 }}>
        Cada barra representa el total cobrado por instrumento en ese mes.
      </Text>

      {datos.length === 0 ? (
        <Text style={{ fontFamily: PDF_FONT.body, fontSize: 8, color: "#C7D2E0" }}>Sin cobros proyectados en {moneda}.</Text>
      ) : (
        <>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 40, height: plotHeight, justifyContent: "space-between", paddingRight: 4 }}>
              {Array.from({ length: ticks + 1 }, (_, i) => ticks - i).map((i) => (
                <Text key={i} style={{ fontFamily: PDF_FONT.body, fontSize: 5.5, color: AXIS_COLOR, textAlign: "right" }}>
                  {moneda === "USD" ? "USD " : "$"}
                  {fmtNum((maxValor * i) / ticks, 0)}
                </Text>
              ))}
            </View>
            <Svg width={plotWidth} height={plotHeight} viewBox={`0 0 ${plotWidth} ${plotHeight}`}>
              {Array.from({ length: ticks + 1 }, (_, i) => i).map((i) => {
                const y = plotHeight - (i / ticks) * plotHeight;
                return <Line key={i} x1={0} y1={y} x2={plotWidth} y2={y} stroke={GRID_COLOR} strokeWidth={0.5} />;
              })}
              {datos.map((d, mi) =>
                tickers.map((t, ti) => {
                  const valor = d.porTicker[t] ?? 0;
                  if (valor <= 0) return null;
                  const h = Math.max((valor / maxValor) * plotHeight, 1.5);
                  const x = mi * slotWidth + ti * laneWidth + laneWidth * 0.15;
                  const w = Math.max(laneWidth * 0.7, 1.5);
                  return <Rect key={`${d.mes}-${t}`} x={x} y={plotHeight - h} width={w} height={h} fill={colorPorTicker[t]} />;
                })
              )}
            </Svg>
          </View>

          <View style={{ flexDirection: "row", marginLeft: 40 }}>
            {datos.map((d, mi) => (
              <Text
                key={d.mes}
                style={{
                  width: slotWidth,
                  fontFamily: PDF_FONT.body,
                  fontSize: 5.5,
                  color: AXIS_COLOR,
                  marginTop: 3,
                  transform: "rotate(-45deg)",
                  transformOrigin: "top left",
                }}
              >
                {mi % labelStep === 0 ? mesLabel(d.mes) : ""}
              </Text>
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            {tickers.map((t) => (
              <View key={t} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <View style={{ width: 7, height: 7, borderRadius: 1, backgroundColor: colorPorTicker[t] }} />
                <Text style={{ fontFamily: PDF_FONT.body, fontSize: 7, color: "#E7ECF5" }}>{t}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
