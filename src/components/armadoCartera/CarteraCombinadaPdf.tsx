import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Moneda, FlujoPago, PagoMensual } from "@/lib/types";
import { LineaCombinadaCalculada } from "@/lib/armadoCartera/tipos";
import { fmtFecha, fmtNum, fmtPct } from "@/lib/formato";
import { PDF_COLOR } from "@/lib/pdfTheme";

// Mismo criterio tipográfico/de color que FichaClientePdf.tsx: Helvetica estándar de
// @react-pdf/renderer (no Montserrat/Lato) + espejo hex de los colores de marca.
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, color: PDF_COLOR.text },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `2px solid ${PDF_COLOR.navy}`,
  },
  brand: { fontSize: 14, fontWeight: 700, color: PDF_COLOR.navy },
  brandTeal: { color: PDF_COLOR.teal },
  subtitle: { fontSize: 9, color: PDF_COLOR.textMute, marginTop: 2 },
  fecha: { fontSize: 9, color: PDF_COLOR.textMute, textAlign: "right" },
  kpiRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  kpiBox: { flex: 1, border: `1px solid ${PDF_COLOR.border}`, borderRadius: 4, padding: 8 },
  kpiLabel: { fontSize: 7, textTransform: "uppercase", color: PDF_COLOR.textMute, marginBottom: 3 },
  kpiValue: { fontSize: 13, fontWeight: 700, color: PDF_COLOR.navy },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: PDF_COLOR.navy, marginBottom: 8, marginTop: 4 },
  table: { marginBottom: 16 },
  tHeadRow: { flexDirection: "row", borderBottom: `1px solid ${PDF_COLOR.border}`, paddingBottom: 4, marginBottom: 4 },
  tRow: { flexDirection: "row", borderBottom: `1px solid ${PDF_COLOR.border}`, paddingVertical: 3 },
  tHeadCell: { fontSize: 7, textTransform: "uppercase", color: PDF_COLOR.textMute },
  tCell: { fontSize: 8, color: PDF_COLOR.text },
  instrumentoBox: {
    border: `1px solid ${PDF_COLOR.border}`,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  instrumentoHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  instrumentoNombre: { fontSize: 10, fontWeight: 700, color: PDF_COLOR.navy },
  instrumentoSub: { fontSize: 8, color: PDF_COLOR.textMute },
  metricasRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 5 },
  metrica: { fontSize: 8, color: PDF_COLOR.textSoft },
  metricaLabel: { color: PDF_COLOR.textMute },
  justificacion: { fontSize: 8, color: PDF_COLOR.text, fontStyle: "italic" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 7,
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
  porMes,
  generadoEn,
}: {
  lineas: LineaCombinadaCalculada[];
  totalPct: number;
  montoTotal: number;
  moneda: Moneda;
  justificaciones: Record<string, string>;
  flujos: FlujoPago[];
  porMes: PagoMensual[];
  generadoEn: Date;
}) {
  const pctRentaFija = lineas.filter((l) => l.clase === "rentaFija").reduce((a, l) => a + l.pct, 0);
  const pctRentaVariable = lineas.filter((l) => l.clase === "rentaVariable").reduce((a, l) => a + l.pct, 0);
  const totalArs = flujos.filter((f) => f.moneda === "ARS").reduce((a, f) => a + f.monto, 0);
  const totalUsd = flujos.filter((f) => f.moneda === "USD").reduce((a, f) => a + f.monto, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>
              D.A <Text style={styles.brandTeal}>VALORES</Text>
            </Text>
            <Text style={styles.subtitle}>Armado de Cartera — Informe de cartera combinada</Text>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")} {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

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
          {lineas.map((l) => (
            <View key={l.ticker} style={styles.tRow}>
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

        <Text style={styles.sectionTitle}>Calendario de Renta Fija de la cartera</Text>
        {flujos.length === 0 ? (
          <Text style={{ color: PDF_COLOR.textSoft, marginBottom: 16 }}>
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

            <Text style={{ fontSize: 8, fontWeight: 700, color: PDF_COLOR.textSoft, marginBottom: 4 }}>Total por mes</Text>
            <View style={styles.table}>
              <View style={styles.tHeadRow}>
                <Text style={[styles.tHeadCell, { width: "30%" }]}>Mes</Text>
                <Text style={[styles.tHeadCell, { width: "35%", textAlign: "right" }]}>ARS</Text>
                <Text style={[styles.tHeadCell, { width: "35%", textAlign: "right" }]}>USD</Text>
              </View>
              {porMes.map((m) => (
                <View key={m.mes} style={styles.tRow}>
                  <Text style={[styles.tCell, { width: "30%" }]}>{m.mes}</Text>
                  <Text style={[styles.tCell, { width: "35%", textAlign: "right" }]}>
                    {m.porMoneda.ARS > 0 ? `$${fmtNum(m.porMoneda.ARS, 0)}` : "—"}
                  </Text>
                  <Text style={[styles.tCell, { width: "35%", textAlign: "right" }]}>
                    {m.porMoneda.USD > 0 ? `USD ${fmtNum(m.porMoneda.USD, 0)}` : "—"}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 8, fontWeight: 700, color: PDF_COLOR.textSoft, marginBottom: 4 }}>Detalle de pagos</Text>
            <View style={styles.table}>
              <View style={styles.tHeadRow}>
                <Text style={[styles.tHeadCell, { width: "20%" }]}>Fecha</Text>
                <Text style={[styles.tHeadCell, { width: "25%" }]}>Instrumento</Text>
                <Text style={[styles.tHeadCell, { width: "30%" }]}>Tipo</Text>
                <Text style={[styles.tHeadCell, { width: "25%", textAlign: "right" }]}>Monto</Text>
              </View>
              {flujos.map((f, idx) => (
                <View key={`${f.ticker}-${f.fecha}-${idx}`} style={styles.tRow}>
                  <Text style={[styles.tCell, { width: "20%" }]}>{fmtFecha(f.fecha)}</Text>
                  <Text style={[styles.tCell, { width: "25%" }]}>{f.ticker}</Text>
                  <Text style={[styles.tCell, { width: "30%" }]}>{f.tipo === "cupon" ? "Cupón" : "Cupón + capital"}</Text>
                  <Text style={[styles.tCell, { width: "25%", textAlign: "right" }]}>
                    {f.moneda === "USD" ? "USD " : "$"}
                    {fmtNum(f.monto, 0)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle} break>
          Análisis y justificación por instrumento
        </Text>
        {lineas.map((l) => (
          <View key={l.ticker} style={styles.instrumentoBox} wrap={false}>
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

            <Text style={styles.justificacion}>{justificaciones[l.ticker] || "Sin justificación cargada."}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores, generado a partir de la
          pantalla &quot;Armado de Cartera&quot;. No constituye una recomendación de inversión para uso externo
          sin revisión previa. Proyección de renta fija simplificada — verificar contra el prospecto de cada
          especie antes de usar con clientes.
        </Text>
      </Page>
    </Document>
  );
}
