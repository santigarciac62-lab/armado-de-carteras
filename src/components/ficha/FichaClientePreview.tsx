"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ClienteEnriquecido } from "@/lib/types";
import { FichaClientePdf } from "@/components/desvios/FichaClientePdf";
import { BotonFichaPdf } from "@/components/desvios/BotonFichaPdf";

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

/** El visor de PDF embebido en iframe (PDFViewer) depende del soporte nativo del navegador para
 * renderizar blob: URLs dentro de un iframe. En desktop (Chrome/Edge/Firefox) funciona bien, pero
 * en Safari iOS y Chrome Android es conocido que falla o directamente dispara una descarga en vez
 * de previsualizar. Por eso el preview embebido solo se muestra en pantallas ≥768px (mismo corte
 * que usa el resto de la app para separar tabla/tarjetas) — en mobile se prioriza confiabilidad
 * sobre mostrar un iframe que puede no renderizar. */
function useEsDesktop() {
  // Este componente solo se monta client-side, tras elegir un cliente (no forma parte del
  // árbol renderizado por el servidor), así que leer matchMedia en el estado inicial es seguro
  // y no genera mismatch de hidratación.
  const [esDesktop, setEsDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const listener = (e: MediaQueryListEvent) => setEsDesktop(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return esDesktop;
}

function IconoDocumento() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="8" y="4" width="24" height="32" rx="2" fill="var(--teal-soft)" stroke="var(--teal)" strokeWidth="1.5" />
      <path d="M13 13h14M13 19h14M13 25h9" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function FichaClientePreview({ cliente }: { cliente: ClienteEnriquecido }) {
  const esDesktop = useEsDesktop();

  if (!esDesktop) {
    return (
      <div
        className="rounded-md p-6 flex flex-col items-center text-center gap-3"
        style={{ border: "1px solid var(--border)", background: "#F6F7F8" }}
      >
        <IconoDocumento />
        <p className="text-[13px] max-w-[280px]" style={{ color: "var(--text-soft)" }}>
          La vista previa está disponible en pantallas más grandes. Descargá la ficha para verla en tu dispositivo.
        </p>
        <BotonFichaPdf cliente={cliente} className="w-full text-[13px] font-medium px-4 py-3 rounded-md" />
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border)" }}>
      <PDFViewer width="100%" height={600} showToolbar={false} style={{ border: "none" }}>
        <FichaClientePdf cliente={cliente} generadoEn={new Date()} />
      </PDFViewer>
    </div>
  );
}
