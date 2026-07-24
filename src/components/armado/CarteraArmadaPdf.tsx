import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CarteraModelo, Moneda, Perfil } from "@/lib/types";
import { LineaCalculada } from "@/lib/armado";
import { PDF_COLOR } from "@/lib/pdfTheme";
import { LogoIsologoClaro, PdfDonutChart, PdfDonutDatum, PDF_FONT } from "@/components/pdf/pdfBrand";
import { colorDeCategoria } from "@/lib/colors";

const PERFIL_LABEL: Record<Perfil, string> = {
  conservador: "Conservador",
  moderado: "Moderado",
  agresivo: "Agresivo",
};

// Mismo estilo de marca que CarteraCombinadaPdf.tsx (Armado de Cartera): Montserrat Bold
// para títulos, Lato para cuerpo, header navy con isologo, tarjetas y encabezados de
// sección con barra de acento de color (ver src/components/pdf/pdfBrand.tsx).
const styles = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0, fontFamily: PDF_FONT.body, fontSize: 9.5, color: PDF_COLOR.text },
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
  kpiValue: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 14, color: PDF_COLOR.navy },
  kpiSub: { fontFamily: PDF_FONT.body, fontSize: 7.5, color: PDF_COLOR.textMute, marginTop: 2 },

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

  donutCard: { flexDirection: "row", marginBottom: 20, backgroundColor: PDF_COLOR.bg, borderRadius: 5, padding: 12 },

  table: { marginBottom: 14, borderRadius: 4, overflow: "hidden" },
  tHeadRow: { flexDirection: "row", backgroundColor: PDF_COLOR.navy, paddingVertical: 6, paddingHorizontal: 6 },
  tHeadCell: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7.5, textTransform: "uppercase", letterSpacing: 0.3, color: "#FFFFFF" },
  tRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 6, borderBottom: `1px solid ${PDF_COLOR.border}` },
  tRowAlt: { backgroundColor: PDF_COLOR.bg },
  tCell: { fontFamily: PDF_FONT.body, fontSize: 8.5, color: PDF_COLOR.text },
  tCellMute: { fontFamily: PDF_FONT.body, fontSize: 7.5, color: PDF_COLOR.textMute },
  tFootRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, backgroundColor: PDF_COLOR.bg },
  tFootCell: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 9, color: PDF_COLOR.navy },

  nota: { fontFamily: PDF_FONT.body, fontSize: 8, color: PDF_COLOR.textMute, lineHeight: 1.4 },

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

/** PDF de la cartera que el asesor está armando en pantalla en "Visión de Portafolio":
 * perfil y moneda de partida, monto a invertir e instrumentos con sus % y montos tal como
 * figuran en "Tu cartera en armado" (ArmadoWorkspace.tsx) al momento de la descarga. A
 * diferencia del informe de Armado de Cartera, no incluye renta fija/calendario de pagos
 * porque esta pantalla no maneja esos datos. */
export function CarteraArmadaPdf({
  perfil,
  moneda,
  montoTotal,
  totalPct,
  lineas,
  carteraModelo,
  generadoEn,
}: {
  perfil: Perfil;
  moneda: Moneda;
  montoTotal: number;
  totalPct: number;
  lineas: LineaCalculada[];
  carteraModelo: CarteraModelo | undefined;
  generadoEn: Date;
}) {
  const porCategoria = new Map<string, number>();
  for (const l of lineas) {
    porCategoria.set(l.categoria, (porCategoria.get(l.categoria) ?? 0) + l.pct);
  }
  const donutData: PdfDonutDatum[] = Array.from(porCategoria.entries()).map(([categoria, pct]) => ({
    categoria,
    pct,
    color: colorDeCategoria(categoria),
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <LogoIsologoClaro size={24} />
            <View>
              <Text style={styles.brand}>
                D.A <Text style={styles.brandTeal}>VALORES</Text>
              </Text>
              <Text style={styles.subtitle}>Visión de Portafolio — Cartera en armado</Text>
            </View>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")}
            {"\n"}
            {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Perfil de partida</Text>
              <Text style={styles.kpiValue}>{PERFIL_LABEL[perfil]}</Text>
              <Text style={styles.kpiSub}>Moneda de la cartera: {moneda}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Monto a invertir</Text>
              <Text style={styles.kpiValue}>{fmtMonto(montoTotal, moneda)}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>% asignado</Text>
              <Text style={styles.kpiValue}>{totalPct.toFixed(1)}%</Text>
              <Text style={styles.kpiSub}>{lineas.length} instrumentos seleccionados</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Composición por categoría</Text>
          <View style={styles.donutCard}>
            <PdfDonutChart titulo="Categorías" data={donutData} centerLabel="Categorías" centerValue={String(donutData.length)} />
          </View>

          <Text style={styles.sectionTitle}>Instrumentos de la cartera</Text>
          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={[styles.tHeadCell, { flex: 2 }]}>Instrumento</Text>
              <Text style={[styles.tHeadCell, { flex: 1, textAlign: "right" }]}>% cartera</Text>
              <Text style={[styles.tHeadCell, { flex: 1.3, textAlign: "right" }]}>Monto</Text>
            </View>
            {lineas.map((l, i) => (
              <View key={l.ticker} style={[styles.tRow, i % 2 === 1 ? styles.tRowAlt : {}]}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.tCell}>{l.ticker}</Text>
                  <Text style={styles.tCellMute}>{l.categoria}</Text>
                </View>
                <Text style={[styles.tCell, { flex: 1, textAlign: "right" }]}>{l.pct.toFixed(1)}%</Text>
                <Text style={[styles.tCell, { flex: 1.3, textAlign: "right" }]}>{fmtMonto(l.monto, moneda)}</Text>
              </View>
            ))}
            <View style={styles.tFootRow}>
              <Text style={[styles.tFootCell, { flex: 2 }]}>Total</Text>
              <Text style={[styles.tFootCell, { flex: 1, textAlign: "right" }]}>{totalPct.toFixed(1)}%</Text>
              <Text style={[styles.tFootCell, { flex: 1.3, textAlign: "right" }]}>{fmtMonto(montoTotal, moneda)}</Text>
            </View>
          </View>

          {carteraModelo && (
            <Text style={styles.nota}>
              Punto de partida: Cartera {carteraModelo.perfilLabel} {carteraModelo.moneda} de la Visión de Portafolio
              vigente. Los porcentajes y montos reflejan los ajustes hechos en pantalla y pueden diferir de esa
              cartera modelo.
            </Text>
          )}
        </View>

        <Text style={styles.footer}>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores. Confeccionado a partir de la
          cartera armada en pantalla al momento de la descarga. No constituye una recomendación de inversión para
          uso externo sin revisión previa.
        </Text>
      </Page>
    </Document>
  );
}
