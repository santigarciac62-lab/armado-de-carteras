import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClienteEnriquecido } from "@/lib/types";
import { PERFIL_LABEL, STATUS_LABEL, BUCKET_LABEL } from "@/lib/bucket";
import { composicionPorBucket } from "@/lib/desvio";
import { PDF_COLOR, PDF_BUCKET_COLOR } from "@/lib/pdfTheme";

// Nota: se usa la familia tipográfica estándar de @react-pdf/renderer (Helvetica) en vez de
// Montserrat/Lato — requeriría empaquetar los archivos de fuente aparte. Los colores de marca
// sí se mantienen (ver src/lib/pdfTheme.ts, espejo en hex de las variables de globals.css).
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: PDF_COLOR.text,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: `2px solid ${PDF_COLOR.navy}`,
  },
  brand: {
    fontSize: 14,
    fontWeight: 700,
    color: PDF_COLOR.navy,
  },
  brandTeal: {
    color: PDF_COLOR.teal,
  },
  subtitle: {
    fontSize: 9,
    color: PDF_COLOR.textMute,
    marginTop: 2,
  },
  fecha: {
    fontSize: 9,
    color: PDF_COLOR.textMute,
    textAlign: "right",
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: 700,
    color: PDF_COLOR.navy,
    marginBottom: 2,
  },
  clienteSub: {
    fontSize: 9,
    color: PDF_COLOR.textSoft,
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  kpiBox: {
    flex: 1,
    border: `1px solid ${PDF_COLOR.border}`,
    borderRadius: 4,
    padding: 8,
  },
  kpiLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    color: PDF_COLOR.textMute,
    marginBottom: 3,
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: 700,
    color: PDF_COLOR.navy,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: PDF_COLOR.navy,
    marginBottom: 8,
    marginTop: 4,
  },
  bucketRow: {
    marginBottom: 8,
  },
  bucketLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  bucketTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#EEF0F2",
    position: "relative",
  },
  bucketFill: {
    height: 5,
    borderRadius: 3,
    position: "absolute",
    left: 0,
    top: 0,
  },
  recoItem: {
    border: `1px solid ${PDF_COLOR.border}`,
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  pillVender: {
    color: PDF_COLOR.red,
    fontWeight: 700,
  },
  pillComprar: {
    color: PDF_COLOR.green,
    fontWeight: 700,
  },
  alertaItem: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>
              D.A <Text style={styles.brandTeal}>VALORES</Text>
            </Text>
            <Text style={styles.subtitle}>Armado de Carteras · Ficha de cliente</Text>
          </View>
          <Text style={styles.fecha}>
            Generado el {generadoEn.toLocaleDateString("es-AR")} {generadoEn.toLocaleTimeString("es-AR")}
          </Text>
        </View>

        <Text style={styles.clienteNombre}>{cliente.denominacion}</Text>
        <Text style={styles.clienteSub}>
          Comitente #{cliente.numero} · Oficial: {cliente.oficial}
        </Text>

        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>AUM</Text>
            <Text style={styles.kpiValue}>{fmtUsd(cliente.aumUsd)}</Text>
            <Text style={styles.subtitle}>{fmtArs(cliente.aumArs)}</Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Perfil</Text>
            <Text style={styles.kpiValue}>{PERFIL_LABEL[cliente.perfilGrupo]}</Text>
            <Text style={styles.subtitle}>
              {cliente.perfilAsignadoPorDefault ? "Asignado por defecto (sin Test del Inversor)" : "Test del Inversor"}
            </Text>
          </View>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiLabel}>Desvío vs. perfil</Text>
            <Text style={[styles.kpiValue, { color: statusColor }]}>{(cliente.desvio * 100).toFixed(1)}%</Text>
            <Text style={styles.subtitle}>{STATUS_LABEL[cliente.statusSemaforo]}</Text>
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
          <Text style={{ color: PDF_COLOR.textSoft, marginBottom: 14 }}>
            Sin desvíos relevantes por categoría (todas dentro de ±5pp del modelo).
          </Text>
        ) : (
          <View style={{ marginBottom: 14 }}>
            {cliente.recomendaciones.map((r) => (
              <View key={r.bucket} style={styles.recoItem}>
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

        <Text style={styles.footer}>
          Documento de uso interno para el equipo de asesoramiento de D.A Valores, generado a partir de la Visión de
          Portafolio vigente. No constituye una recomendación de inversión para uso externo sin revisión previa.
        </Text>
      </Page>
    </Document>
  );
}
