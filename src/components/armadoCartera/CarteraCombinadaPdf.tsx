import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Moneda, FlujoPago } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { fmtFecha, fmtNum, fmtPct } from "@/lib/formato";
import { PDF_COLOR } from "@/lib/pdfTheme";
import { LogoIsologoClaro, PdfDonutChart, PdfDonutDatum, PDF_FONT } from "./pdfBrand";
import { CobroMensualPorTicker, PdfCobrosPorMesChart } from "./pdfCobrosChart";

// Tipografías y colores del Manual de Identidad Visual D.A Valores (ver pdfBrand.tsx):
// Montserrat Bold para títulos, Lato para cuerpo. Colores de PDF_COLOR ya coinciden con
// la paleta del manual (navy #12375F, teal #0097B2, blue #1362AD, slate #616161).
const styles = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 62, paddingHorizontal: 0, fontFamily: PDF_FONT.body, fontSize: 9.5, color: PDF_COLOR.text },
  content: { paddingHorizontal: 36 },

  header: {
    backgroundColor: PDF_COLOR.navy,
    paddingHorizontal: 36,
    paddingVertical: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brand: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 16, color: "#FFFFFF" },
  brandTeal: { color: PDF_COLOR.teal },
  subtitle: { fontFamily: PDF_FONT.body, fontSize: 9, color: "#C7D2E0", marginTop: 3 },
  fecha: { fontFamily: PDF_FONT.body, fontSize: 8.5, color: "#C7D2E0", textAlign: "right" },

  kpiRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  kpiBox: { flex: 1, backgroundColor: PDF_COLOR.bg, borderRadius: 5, padding: 10, borderLeft: `3px solid ${PDF_COLOR.teal}` },
  kpiLabel: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7, textTransform: "uppercase", letterSpacing: 0.5, color: PDF_COLOR.textMute, marginBottom: 4 },
  kpiValue: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 15, color: PDF_COLOR.navy },

  sectionTitle: {
    fontFamily: PDF_FONT.heading,
    fontWeight: 700,
    fontSize: 12,
    color: PDF_COLOR.navy,
    marginBottom: 10,
    marginTop: 6,
    paddingLeft: 8,
    borderLeft: `3px solid ${PDF_COLOR.teal}`,
  },
  subsectionTitle: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 8.5, color: PDF_COLOR.textSoft, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.4 },

  table: { marginBottom: 18, borderRadius: 4, overflow: "hidden" },
  tHeadRow: { flexDirection: "row", backgroundColor: PDF_COLOR.navy, paddingVertical: 6, paddingHorizontal: 6 },
  tHeadCell: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.3, color: "#FFFFFF" },
  tRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottom: `1px solid ${PDF_COLOR.border}` },
  tRowAlt: { backgroundColor: PDF_COLOR.bg },
  tCell: { fontFamily: PDF_FONT.body, fontSize: 8.5, color: PDF_COLOR.text },

  instrumentoBox: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: PDF_COLOR.bg,
  },
  instrumentoAccentRF: { borderLeft: `3px solid ${PDF_COLOR.teal}` },
  instrumentoAccentRV: { borderLeft: `3px solid ${PDF_COLOR.blue}` },
  instrumentoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  instrumentoNombre: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 10, color: PDF_COLOR.navy },
  instrumentoSub: { fontFamily: PDF_FONT.body, fontSize: 8, color: PDF_COLOR.textMute },
  metricasRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${PDF_COLOR.border}` },
  metrica: { fontFamily: PDF_FONT.body, fontSize: 8.5, color: PDF_COLOR.textSoft },
  metricaLabel: { fontWeight: 700, color: PDF_COLOR.textMute },
  justificacionLabel: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.3, color: PDF_COLOR.textMute, marginBottom: 3 },
  justificacion: { fontFamily: PDF_FONT.body, fontSize: 8.5, color: PDF_COLOR.text, lineHeight: 1.4 },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    fontFamily: PDF_FONT.body,
    fontSize: 6.5,
    color: PDF_COLOR.textMute,
    borderTop: `1px solid ${PDF_COLOR.border}`,
    paddingTop: 6,
  },
});

function fmtMonto(n: number, moneda: Moneda) {
  return `${moneda === "USD" ? "USD " : "$"}${Math.round(n).toLocaleString("es-AR")}`;
}

export function CarteraCombinadaPdf({
  lineas,
  totalPct,
  montoTotal,
  moneda,
  justificaciones,
  flujos,
  donutClases,
  donutSectores,
  cobrosArs,
  cobrosUsd,
  tickersRentaFija,
  colorPorTicker,
  generadoEn,
}: {
  lineas: LineaCombinadaCalculada[];
  totalPct: number;
  montoTotal: number;
  moneda: Moneda;
  justificaciones: Record<string, string>;
  flujos: FlujoPago[];
  donutClases: PdfDonutDatum[];
  donutSectores: PdfDonutDatum[];
  cobrosArs: CobroMensualPorTicker[];
  cobrosUsd: CobroMensualPorTicker[];
  tickersRentaFija: string[];
  colorPorTicker: Record<string, string>;
  generadoEn: Date;
}) {
  const pctRentaFija = lineas.filter((l) => l.clase === "rentaFija").reduce((a, l) => a + l.pct, 0);
  const pctRentaVariable = lineas.filter((l) => l.clase === "rentaVariable").reduce((a, l) => a + l.pct, 0);
  const totalArs = flujos.filter((f) => f.moneda === "ARS").reduce((a, f) => a + f.monto, 0);
  const totalUsd = flujos.filter((f) => f.moneda === "USD").reduce((a, f) => a + f.monto, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.brandRow}>
            <LogoIsologoClaro size={24} />
            <View>
              <Text style={styles.brand}>
                D.A <Text style={styles.brandTeal}>VALORES</Text>
              </Text>
              <Text style={styles.subtitle}>Armado de Cartera — Informe de cartera combinada</Text>
            </View>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")}{"\n"}
            {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Monto total armado</Text>
              <Text style={styles.kpiValue}>{fmtMonto(montoTotal, moneda)}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>% asignado</Text>
              <Text style={styles.kpiValue}>{totalPct.toFixed(1)}%</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Composición</Text>
              <Text style={styles.kpiValue}>
                {pctRentaFija.toFixed(0)}% RF / {pctRentaVariable.toFixed(0)}% RV
              </Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Instrumentos</Text>
              <Text style={styles.kpiValue}>{lineas.length}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Composición de la cartera</Text>
          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={[styles.tHeadCell, { width: "28%" }]}>Instrumento</Text>
              <Text style={[styles.tHeadCell, { width: "14%" }]}>Clase</Text>
              <Text style={[styles.tHeadCell, { width: "30%" }]}>Categoría</Text>
              <Text style={[styles.tHeadCell, { width: "14%", textAlign: "right" }]}>% Cartera</Text>
              <Text style={[styles.tHeadCell, { width: "14%", textAlign: "right" }]}>Monto</Text>
            </View>
            {lineas.map((l, i) => (
              <View key={l.ticker} style={i % 2 === 1 ? [styles.tRow, styles.tRowAlt] : styles.tRow}>
                <Text style={[styles.tCell, { width: "28%" }]}>
                  {l.ticker} — {l.nombre}
                </Text>
                <Text style={[styles.tCell, { width: "14%" }]}>{l.clase === "rentaFija" ? "Renta Fija" : "Renta Variable"}</Text>
                <Text style={[styles.tCell, { width: "30%" }]}>{l.categoriaLabel}</Text>
                <Text style={[styles.tCell, { width: "14%", textAlign: "right" }]}>{l.pct.toFixed(1)}%</Text>
                <Text style={[styles.tCell, { width: "14%", textAlign: "right" }]}>{fmtMonto(l.monto, moneda)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Composición por clase y sector</Text>
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 18, backgroundColor: PDF_COLOR.bg, borderRadius: 5, padding: 12 }}>
            <PdfDonutChart titulo="Clases" data={donutClases} centerLabel="Clases" centerValue={String(lineas.length)} />
            <PdfDonutChart titulo="Sectores" data={donutSectores} centerLabel="Sectores" centerValue={String(donutSectores.length)} />
          </View>

          <Text style={styles.sectionTitle}>Calendario de Renta Fija de la cartera</Text>
          {flujos.length === 0 ? (
            <Text style={{ fontFamily: PDF_FONT.body, color: PDF_COLOR.textSoft, marginBottom: 16 }}>
              Sin instrumentos de renta fija en la cartera — no hay pagos proyectados.
            </Text>
          ) : (
            <>
              <View style={styles.kpiRow}>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>Total proyectado ARS</Text>
                  <Text style={styles.kpiValue}>${fmtNum(totalArs, 0)}</Text>
                </View>
                <View style={styles.kpiBox}>
                  <Text style={styles.kpiLabel}>Total proyectado USD</Text>
                  <Text style={styles.kpiValue}>USD {fmtNum(totalUsd, 0)}</Text>
                </View>
              </View>

              {cobrosArs.length > 0 && (
                <PdfCobrosPorMesChart moneda="ARS" datos={cobrosArs} tickers={tickersRentaFija} colorPorTicker={colorPorTicker} />
              )}
              {cobrosUsd.length > 0 && (
                <PdfCobrosPorMesChart moneda="USD" datos={cobrosUsd} tickers={tickersRentaFija} colorPorTicker={colorPorTicker} />
              )}
            </>
          )}

          <Text style={styles.sectionTitle} break>
            Análisis y justificación por instrumento
          </Text>
          {lineas.map((l) => (
            <View
              key={l.ticker}
              style={[styles.instrumentoBox, l.clase === "rentaFija" ? styles.instrumentoAccentRF : styles.instrumentoAccentRV]}
              wrap={false}
            >
              <View style={styles.instrumentoHeader}>
                <Text style={styles.instrumentoNombre}>
                  {l.ticker} — {l.nombre}
                </Text>
                <Text style={styles.instrumentoSub}>{l.categoriaLabel}</Text>
              </View>

              <View style={styles.metricasRow}>
                {l.clase === "rentaFija" && l.instrumentoRentaFija ? (
                  <>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>TNA: </Text>
                      {fmtPct(l.instrumentoRentaFija.tna, 1)}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>TEA: </Text>
                      {fmtPct(l.instrumentoRentaFija.tea, 1)}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Duración mod.: </Text>
                      {l.instrumentoRentaFija.duracionModificada != null ? `${l.instrumentoRentaFija.duracionModificada.toFixed(1)} años` : "—"}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Paridad: </Text>
                      {fmtPct(l.instrumentoRentaFija.paridad, 1)}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Vencimiento: </Text>
                      {fmtFecha(l.instrumentoRentaFija.vencimiento)}
                    </Text>
                  </>
                ) : l.clase === "rentaVariable" && l.activoRentaVariable ? (
                  <>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Score: </Text>
                      {l.activoRentaVariable.score}/10
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Señal: </Text>
                      {l.activoRentaVariable.señal}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>RSI: </Text>
                      {l.activoRentaVariable.rsi}
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>Tendencia: </Text>
                      {l.activoRentaVariable.precio > l.activoRentaVariable.ma200 ? "Alcista" : "Bajista"} vs. MA200
                    </Text>
                    <Text style={styles.metrica}>
                      <Text style={styles.metricaLabel}>ROE: </Text>
                      {l.activoRentaVariable.roe != null ? `${(l.activoRentaVariable.roe * 100).toFixed(1)}%` : "—"}
                    </Text>
                  </>
                ) : null}
              </View>

              <Text style={styles.justificacionLabel}>Justificación de la selección</Text>
              <Text style={styles.justificacion}>{justificaciones[l.ticker] || "Sin justificación cargada."}</Text>
            </View>
          ))}

        </View>

        <Text style={styles.footer} fixed>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores, generado a partir de la
          pantalla &quot;Armado de Cartera&quot;. No constituye una recomendación de inversión para uso externo
          sin revisión previa. Proyección de renta fija simplificada — verificar contra el prospecto de cada
          especie antes de usar con clientes.
        </Text>
      </Page>
    </Document>
  );
}
