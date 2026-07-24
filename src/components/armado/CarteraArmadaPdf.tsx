import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CarteraModelo, Perfil } from "@/lib/types";
import { PDF_COLOR } from "@/lib/pdfTheme";
import { LogoIsologoClaro, PdfDonutChart, PDF_FONT } from "@/components/pdf/pdfBrand";
import { colorDeCategoria } from "@/lib/colors";

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

  perfilTitle: {
    fontFamily: PDF_FONT.heading,
    fontWeight: 700,
    fontSize: 13,
    color: PDF_COLOR.navy,
    marginBottom: 10,
    marginTop: 4,
    paddingLeft: 8,
    borderLeft: `3px solid ${PDF_COLOR.teal}`,
  },

  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  card: { flex: 1, backgroundColor: PDF_COLOR.bg, borderRadius: 6, padding: 12 },
  cardTitle: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 11, color: PDF_COLOR.navy, marginBottom: 6 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  badge: {
    fontFamily: PDF_FONT.body,
    fontSize: 6.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: PDF_COLOR.textMute,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  estrategia: { fontFamily: PDF_FONT.body, fontSize: 7.8, color: PDF_COLOR.textSoft, lineHeight: 1.4, marginBottom: 10 },

  donutWrap: { flexDirection: "row", marginBottom: 10 },

  activosTitle: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7, textTransform: "uppercase", letterSpacing: 0.3, color: PDF_COLOR.textMute, marginBottom: 4 },
  activoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5, borderBottom: `1px solid ${PDF_COLOR.border}` },
  activoTicker: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7.5, color: PDF_COLOR.text },
  activoCategoria: { fontFamily: PDF_FONT.body, fontSize: 6.8, color: PDF_COLOR.textMute },
  activoPct: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 7.5, color: PDF_COLOR.navy },

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

const PERFILES: { id: Perfil; label: string }[] = [
  { id: "conservador", label: "Conservador" },
  { id: "moderado", label: "Moderado" },
  { id: "agresivo", label: "Agresivo" },
];

function CarteraCard({ modelo }: { modelo: CarteraModelo }) {
  const donutData = Object.entries(modelo.composicion).map(([categoria, pct]) => ({
    categoria,
    pct: pct * 100,
    color: colorDeCategoria(categoria),
  }));

  return (
    <View style={styles.card} wrap={false}>
      <Text style={styles.cardTitle}>
        Cartera {modelo.perfilLabel} {modelo.moneda}
      </Text>
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>Riesgo: {modelo.riesgo}</Text>
        <Text style={styles.badge}>Liquidez: {modelo.liquidez}</Text>
        <Text style={styles.badge}>Horizonte: {modelo.horizonte}</Text>
      </View>
      <Text style={styles.estrategia}>{modelo.estrategia}</Text>

      <View style={styles.donutWrap}>
        <PdfDonutChart titulo="Composición" data={donutData} centerLabel="Categorías" centerValue={String(donutData.length)} />
      </View>

      <Text style={styles.activosTitle}>Activos recomendados</Text>
      <View>
        {modelo.activos.map((a) => (
          <View key={a.ticker} style={styles.activoRow}>
            <View>
              <Text style={styles.activoTicker}>{a.ticker}</Text>
              <Text style={styles.activoCategoria}>{a.categoria}</Text>
            </View>
            <Text style={styles.activoPct}>{(a.pct * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function VisionPortafolioPdf({
  carterasModelo,
  fechaVigente,
  generadoEn,
}: {
  carterasModelo: CarteraModelo[];
  fechaVigente: string;
  generadoEn: Date;
}) {
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
              <Text style={styles.subtitle}>
                Visión de Portafolio vigente · {new Date(fechaVigente + "T00:00:00Z").toLocaleDateString("es-AR")}
              </Text>
            </View>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")}
            {"\n"}
            {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

        <View style={styles.content}>
          {PERFILES.map((p) => {
            const carteraArs = carterasModelo.find((c) => c.perfil === p.id && c.moneda === "ARS");
            const carteraUsd = carterasModelo.find((c) => c.perfil === p.id && c.moneda === "USD");
            return (
              <View key={p.id} wrap={false}>
                <Text style={styles.perfilTitle}>Perfil {p.label}</Text>
                <View style={styles.cardsRow}>
                  {carteraArs && <CarteraCard modelo={carteraArs} />}
                  {carteraUsd && <CarteraCard modelo={carteraUsd} />}
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.footer}>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores. Confeccionado a partir de la
          Visión de Portafolio vigente. No constituye una recomendación de inversión para uso externo sin revisión
          previa.
        </Text>
      </Page>
    </Document>
  );
}
