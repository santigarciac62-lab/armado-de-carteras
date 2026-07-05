"use client";

import dynamic from "next/dynamic";
import { ClienteEnriquecido } from "@/lib/types";
import { FichaClientePdf } from "@/components/desvios/FichaClientePdf";

// PDFViewer usa APIs de navegador (blob URLs, iframe) — se carga solo client-side, y renderiza
// el mismo <FichaClientePdf> que se descarga, así el preview y el PDF nunca se desincronizan.
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((m) => m.PDFViewer), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center text-[13px]" style={{ color: "var(--text-mute)" }}>
      Generando preview…
    </div>
  ),
});

export function FichaClientePreview({ cliente }: { cliente: ClienteEnriquecido }) {
  return (
    <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <PDFViewer width="100%" height={600} showToolbar={false} style={{ border: "none" }}>
        <FichaClientePdf cliente={cliente} generadoEn={new Date()} />
      </PDFViewer>
    </div>
  );
}
