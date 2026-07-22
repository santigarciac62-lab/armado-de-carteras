import { Circle, Path, Rect, Svg } from "@react-pdf/renderer";
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
