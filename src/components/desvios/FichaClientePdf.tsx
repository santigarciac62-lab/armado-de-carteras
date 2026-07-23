import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClienteEnriquecido } from "@/lib/types";
import { PERFIL_LABEL, STATUS_LABEL, BUCKET_LABEL } from "@/lib/bucket";
import { composicionPorBucket } from "@/lib/desvio";
import { PDF_COLOR, PDF_BUCKET_COLOR } from "@/lib/pdfTheme";
import { LogoIsologoClaro, PDF_FONT } from "@/components/pdf/pdfBrand";

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

  clienteNombre: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 15, color: PDF_COLOR.navy, marginBottom: 2 },
  clienteSub: { fontFamily: PDF_FONT.body, fontSize: 9, color: PDF_COLOR.textSoft, marginBottom: 16 },

  kpiRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  kpiBox: { flex: 1, backgroundColor: PDF_COLOR.bg, borderRadius: 5, padding: 9, borderLeft: `3px solid ${PDF_COLOR.teal}` },
  kpiLabel: { fontFamily: PDF_FONT.body, fontWeight: 700, fontSize: 6.5, textTransform: "uppercase", letterSpacing: 0.4, color: PDF_COLOR.textMute, marginBottom: 4 },
  kpiValue: { fontFamily: PDF_FONT.heading, fontWeight: 700, fontSize: 13, color: PDF_COLOR.navy },
  kpiSub: { fontFamily: PDF_FONT.body, fontSize: 7.5, color: PDF_COLOR.textMute, marginTop: 2 },

  sectionTitle: {
    fontFamily: PDF_FONT.heading,
    fontWeight: 700,
    fontSize: 11,
    color: PDF_COLOR.navy,
    marginBottom: 10,
    marginTop: 6,
    paddingLeft: 8,
    borderLeft: `3px solid ${PDF_COLOR.teal}`,
  },

  bucketRow: { marginBottom: 8 },
  bucketLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  bucketTrack: { height: 5, borderRadius: 3, backgroundColor: PDF_COLOR.border, position: "relative" },
  bucketFill: { height: 5, borderRadius: 3, position: "absolute", left: 0, top: 0 },

  recoItem: { backgroundColor: PDF_COLOR.bg, borderRadius: 4, padding: 7, marginBottom: 6 },
  recoVender: { borderLeft: `3px solid ${PDF_COLOR.red}` },
  recoComprar: { borderLeft: `3px solid ${PDF_COLOR.green}` },
  pillVender: { color: PDF_COLOR.red, fontWeight: 700 },
  pillComprar: { color: PDF_COLOR.green, fontWeight: 700 },

  alertaItem: { flexDirection: "row", gap: 4, marginBottom: 4 },

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

const ESTADO_PERFIL_COLOR: Record<string, string> = {
  Vigente: PDF_COLOR.green,
  "Por vencer": PDF_COLOR.amber,
  VENCIDO: PDF_COLOR.red,
  "NO TIENE": PDF_COLOR.textMute,
};

function fmtDiasVencidos(dias: number | null): string {
  if (dias === null) return "—";
  return dias >= 0 ? `+${dias}` : String(dias);
}

function fmtUsd(n: number) {
  return `USD ${Math.round(n).toLocaleString("es-AR")}`;
}

function fmtArs(n: number) {
  return `$${Math.round(n).toLocaleString("es-AR")}`;
}

export function FichaClientePdf({ cliente, generadoEn }: { cliente: ClienteEnriquecido; generadoEn: Date }) {
  const composicion = composicionPorBucket(cliente);
  const statusColor =
    cliente.statusSemaforo === "optimo"
      ? PDF_COLOR.green
      : cliente.statusSemaforo === "aceptable"
        ? PDF_COLOR.amber
        : PDF_COLOR.red;
  const estadoPerfilColor = ESTADO_PERFIL_COLOR[cliente.estadoPerfil] ?? PDF_COLOR.textMute;

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
              <Text style={styles.subtitle}>Seguimiento de Carteras — Ficha de cliente</Text>
            </View>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")}{"\n"}
            {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.clienteNombre}>{cliente.denominacion}</Text>
          <Text style={styles.clienteSub}>
            Comitente #{cliente.numero} · Oficial: {cliente.oficial}
          </Text>

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>AUM</Text>
              <Text style={styles.kpiValue}>{fmtUsd(cliente.aumUsd)}</Text>
              <Text style={styles.kpiSub}>{fmtArs(cliente.aumArs)}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Perfil</Text>
              <Text style={styles.kpiValue}>{PERFIL_LABEL[cliente.perfilGrupo]}</Text>
              <Text style={styles.kpiSub}>{cliente.perfilAsignadoPorDefault ? "Asignado por defecto" : "Test del Inversor"}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Desvío vs. perfil</Text>
              <Text style={[styles.kpiValue, { color: statusColor }]}>{(cliente.desvio * 100).toFixed(1)}%</Text>
              <Text style={styles.kpiSub}>{STATUS_LABEL[cliente.statusSemaforo]}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Estado del perfil</Text>
              <Text style={[styles.kpiValue, { color: estadoPerfilColor, fontSize: 11 }]}>{cliente.estadoPerfil}</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Días vencidos</Text>
              <Text style={styles.kpiValue}>{fmtDiasVencidos(cliente.diasVencidos)}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Composición actual vs. cartera modelo</Text>
          <View style={{ marginBottom: 14 }}>
            {composicion.map(({ bucket, actual, objetivo, desvioPP }) => (
              <View key={bucket} style={styles.bucketRow}>
                <View style={styles.bucketLabelRow}>
                  <Text>{BUCKET_LABEL[bucket]}</Text>
                  <Text style={{ color: PDF_COLOR.textMute }}>
                    {actual.toFixed(1)}% vs {objetivo.toFixed(1)}% ({desvioPP > 0 ? "+" : ""}
                    {desvioPP.toFixed(1)}pp)
                  </Text>
                </View>
                <View style={styles.bucketTrack}>
                  <View
                    style={[
                      styles.bucketFill,
                      { width: `${Math.min(100, actual)}%`, backgroundColor: PDF_BUCKET_COLOR[bucket] },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Cambio recomendado</Text>
          {cliente.recomendaciones.length === 0 ? (
            <Text style={{ fontFamily: PDF_FONT.body, color: PDF_COLOR.textSoft, marginBottom: 14 }}>
              Sin desvíos relevantes por categoría (todas dentro de ±5pp del modelo).
            </Text>
          ) : (
            <View style={{ marginBottom: 14 }}>
              {cliente.recomendaciones.map((r) => (
                <View key={r.bucket} style={[styles.recoItem, r.accion === "vender" ? styles.recoVender : styles.recoComprar]}>
                  <Text>
                    <Text style={r.accion === "vender" ? styles.pillVender : styles.pillComprar}>
                      {r.accion === "vender" ? "VENDER" : "COMPRAR"}
                    </Text>{" "}
                    {BUCKET_LABEL[r.bucket]} — {r.actualPct.toFixed(1)}% actual vs {r.modeloPct.toFixed(1)}% modelo (
                    {r.desvioPP > 0 ? "+" : ""}
                    {r.desvioPP.toFixed(1)}pp)
                  </Text>
                  {r.accion === "comprar" && r.tickersSugeridos.length > 0 && (
                    <Text style={{ color: PDF_COLOR.navy, marginTop: 2 }}>
                      Sugerido del modelo: {r.tickersSugeridos.join(", ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {cliente.alertasConcentracion.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Alertas de concentración</Text>
              <View>
                {cliente.alertasConcentracion.map((a) => (
                  <View key={a.categoria} style={styles.alertaItem}>
                    <Text style={{ color: PDF_COLOR.amber, fontWeight: 700 }}>
                      {(a.pctCliente * 100).toFixed(0)}%
                    </Text>
                    <Text>
                      {a.categoria} supera el límite de {(a.limite * 100).toFixed(0)}%
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <Text style={styles.footer}>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores, generado a partir de la Visión de
          Portafolio vigente. No constituye una recomendación de inversión para uso externo sin revisión previa.
        </Text>
      </Page>
    </Document>
  );
}
