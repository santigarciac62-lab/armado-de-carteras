import { CarteraModelo } from "@/lib/types";

/**
 * Carteras modelo tal como figuran en la "Visión de Portafolio" (23/07/2026).
 * Fuente de verdad para armado de carteras y cálculo de desvío por perfil.
 * Se reemplaza mes a mes subiendo la próxima Visión (ver /admin/vision).
 */
export const FECHA_VISION_VIGENTE = "2026-07-23";

export const CARTERAS_MODELO: CarteraModelo[] = [
  {
    id: "conservador_ars",
    perfil: "conservador",
    perfilLabel: "Conservador",
    moneda: "ARS",
    riesgo: "Bajo",
    liquidez: "Alta",
    horizonte: "30 días",
    estrategia:
      "Pensada para un cliente que prioriza no perder capital y poder disponer de él en cualquier momento, sin resignar por eso un rendimiento superior al de un plazo fijo tradicional. Por eso la cartera se divide en dos mitades iguales: el 50% queda en un Fondo Común de Inversión Money Market (IAM Ahorro Pesos B), que devenga interés día a día y permite rescatar el dinero prácticamente sin demora; el otro 50% se posiciona en una Letra a tasa fija del tramo medio de la curva en pesos (S13N6), que ofrece una tasa más atractiva a cambio de comprometer el capital por un plazo algo mayor, pero siempre acotado. El horizonte de inversión recomendado de 30 días refleja justamente ese perfil de corto plazo: es tiempo suficiente para capturar el devengamiento de la letra sin exponer al cliente a los vaivenes de instrumentos más largos o volátiles. El resultado es un flujo de caja predecible y una cartera de riesgo bajo y liquidez alta, ideal como resguardo de capital de trabajo o excedentes que el cliente podría necesitar usar pronto.",
    composicion: { "FCI MM": 0.5, "Tasa Fija ARS": 0.5 },
    activos: [
      { ticker: "IAM Ahorro Pesos B", categoria: "FCI MM", pct: 0.5 },
      { ticker: "S13N6", categoria: "Tasa Fija ARS", pct: 0.5 },
    ],
    buckets: { FCI: 0.5, Soberanos: 0.5, ON: 0, Acciones: 0, Cedears: 0, Otros: 0 },
  },
  {
    id: "conservador_usd",
    perfil: "conservador",
    perfilLabel: "Conservador",
    moneda: "USD",
    riesgo: "Bajo",
    liquidez: "Alta",
    horizonte: "180 días",
    estrategia:
      "Diseñada para un cliente conservador que quiere que sus dólares generen un rendimiento superior al de una simple caución, sin exponerse a la volatilidad de instrumentos de renta variable. La mitad de la cartera (50%) se ubica en un Fondo Común de Inversión Money Market en dólares (Allaria Dólar Ahorro B), que aporta liquidez inmediata y estabilidad de capital. Otro 29% se coloca en un FCI de renta mixta Latam (SBS Renta Mixta - Clase B), que suma algo más de rendimiento potencial diversificando en instrumentos de la región. El 21% restante se reparte en partes iguales entre tres obligaciones negociables del mercado argentino de calificación AAA (VSCXO, TTC9O y YM42O), que agregan una prima de tasa por sobre los fondos money market a cambio de un plazo de repago algo más largo, pero siempre de la más alta calidad crediticia disponible localmente. Con un horizonte recomendado de 180 días, la cartera está pensada para que ese componente de obligaciones negociables tenga tiempo de devengar sus cupones sin necesidad de vender antes de tiempo, manteniendo en conjunto un perfil de riesgo bajo y liquidez alta.",
    composicion: { "FCI MM USD": 0.5, "FCI Latam": 0.29, "ON HD": 0.21 },
    activos: [
      { ticker: "Allaria Dólar Ahorro B", categoria: "FCI MM USD", pct: 0.5 },
      { ticker: "SBS Renta Mixta - Clase B", categoria: "FCI Latam", pct: 0.29 },
      { ticker: "VSCXO", categoria: "ON HD", pct: 0.07 },
      { ticker: "TTC9O", categoria: "ON HD", pct: 0.07 },
      { ticker: "YM42O", categoria: "ON HD", pct: 0.07 },
    ],
    buckets: { FCI: 0.79, Soberanos: 0, ON: 0.21, Acciones: 0, Cedears: 0, Otros: 0 },
  },
  {
    id: "moderado_ars",
    perfil: "moderado",
    perfilLabel: "Moderado",
    moneda: "ARS",
    riesgo: "Medio",
    liquidez: "Alta",
    horizonte: "3 meses",
    estrategia:
      "Pensada para un cliente que busca ganarle a la inflación y al rendimiento de los fondos de corto plazo en el mediano plazo, aceptando a cambio algo más de riesgo y menos liquidez inmediata que en un perfil conservador. El grueso de la cartera, un 40%, se posiciona en un bono ajustado por CER del tramo medio de la curva (TX26), que protege el poder adquisitivo del cliente indexando el capital a la inflación; a esto se suma un 30% en una Letra a tasa fija del tramo largo (T30A7), que apuesta a capturar una tasa nominal atractiva si la inflación desacelera más rápido de lo que el mercado espera. Ambas posiciones combinadas explican el 70% de renta fija en pesos que le da a la cartera su liquidez alta y un flujo de caja relativamente previsible. El 10% restante en Fondo Común de Inversión Money Market (IAM Ahorro Pesos B) funciona como colchón de liquidez inmediata, mientras que un 10% adicional en Bonos HD (AO29) y otro 10% en Cedears (EWZ y META) suman diversificación en dólares y exposición a renta variable internacional, buscando un extra de rendimiento que la porción 100% en pesos no podría ofrecer por sí sola. El horizonte recomendado de 3 meses da tiempo suficiente para que la porción CER y de tasa fija maduren su devengamiento sin quedar atado a un plazo excesivamente largo.",
    composicion: {
      "FCI MM": 0.1,
      "Bonos HD": 0.1,
      "Tasa Fija ARS": 0.3,
      CER: 0.4,
      Cedears: 0.1,
    },
    activos: [
      { ticker: "IAM Ahorro Pesos B", categoria: "FCI MM", pct: 0.1 },
      { ticker: "AO29", categoria: "Bonos HD", pct: 0.1 },
      { ticker: "EWZ", categoria: "Cedears", pct: 0.05 },
      { ticker: "T30A7", categoria: "Tasa Fija ARS", pct: 0.3 },
      { ticker: "META", categoria: "Cedears", pct: 0.05 },
      { ticker: "TX26", categoria: "CER", pct: 0.4 },
    ],
    buckets: { FCI: 0.1, Soberanos: 0.8, ON: 0, Acciones: 0, Cedears: 0.1, Otros: 0 },
  },
  {
    id: "moderado_usd",
    perfil: "moderado",
    perfilLabel: "Moderado",
    moneda: "USD",
    riesgo: "Medio",
    liquidez: "Media",
    horizonte: "6 meses",
    estrategia:
      "Pensada para un cliente que quiere que sus dólares le rindan por encima de la inflación estadounidense, manteniendo una exposición moderada a instrumentos de riesgo como bonos corporativos y acciones, sin llegar a la volatilidad de una cartera agresiva. El componente más grande, un 45%, se reparte en partes iguales entre tres obligaciones negociables de calificación AAA (VSCXO, TTC9O y YM42O), que aportan el grueso del devengamiento de renta fija en dólares. Un 24% se destina a Cedears (PEP, EWZ y MSFT), sumando exposición a renta variable internacional diversificada por sector, que es lo que le da a esta cartera su potencial de retorno por encima de la inflación. El 18% en un FCI de renta dólar Latam (SBS Renta Dólar Latam) suma otra fuente de rendimiento regional con menor volatilidad que las acciones, y el 13% restante en un Bono HD (AO29) redondea la porción de renta fija corporativa. Esta combinación de obligaciones negociables, un fondo Latam y cedears explica por qué la liquidez de la cartera es media (algunas posiciones no se rescatan tan rápido como un fondo money market) y por qué se recomienda un horizonte de 6 meses: el tiempo necesario para que la porción de renta fija devengue y para que la exposición a acciones absorba parte de su volatilidad de corto plazo.",
    composicion: {
      "FCI Latam": 0.18,
      "Bonos HD": 0.13,
      "ON HD": 0.45,
      Cedears: 0.24,
    },
    activos: [
      { ticker: "SBS Renta Dólar Latam", categoria: "FCI Latam", pct: 0.18 },
      { ticker: "AO29", categoria: "Bonos HD", pct: 0.13 },
      { ticker: "VSCXO", categoria: "ON HD", pct: 0.15 },
      { ticker: "TTC9O", categoria: "ON HD", pct: 0.15 },
      { ticker: "YM42O", categoria: "ON HD", pct: 0.15 },
      { ticker: "PEP", categoria: "Cedears", pct: 0.07 },
      { ticker: "EWZ", categoria: "Cedears", pct: 0.05 },
      { ticker: "MSFT", categoria: "Cedears", pct: 0.12 },
    ],
    buckets: { FCI: 0.18, Soberanos: 0.13, ON: 0.45, Acciones: 0, Cedears: 0.24, Otros: 0 },
  },
  {
    id: "agresivo_ars",
    perfil: "agresivo",
    perfilLabel: "Agresivo",
    moneda: "ARS",
    riesgo: "Medio-Alto",
    liquidez: "Media",
    horizonte: "1 año",
    estrategia:
      "Pensada para un cliente que busca un retorno más alto en pesos que el del Merval en el largo plazo, y que está dispuesto a aceptar una volatilidad medio-alta y una liquidez algo más acotada a cambio de ese objetivo. El componente dominante, un 55%, se posiciona en una Letra a tasa fija del tramo largo de la curva (T30A7), apostando a capturar una tasa nominal elevada sostenida en el tiempo. Un 35% se destina a Cedears (META, EWZ y MU), que le dan a la cartera su exposición a renta variable internacional y son la principal fuente de potencial de suba por encima del Merval, aunque también la principal fuente de volatilidad. El 10% restante en un Bono HD (AO29) suma una porción de renta fija en dólares que diversifica la cartera fuera del riesgo puramente en pesos. Por el peso combinado de tasa fija de tramo largo y cedears, la liquidez de la cartera es media y el horizonte recomendado es de 1 año: un plazo pensado para que la posición de tasa fija devengue por completo y para darle tiempo a la porción de acciones de atravesar ciclos de volatilidad de corto plazo sin verse forzada a vender en un mal momento.",
    composicion: { "Bonos HD": 0.1, "Tasa Fija ARS": 0.55, Cedears: 0.35 },
    activos: [
      { ticker: "AO29", categoria: "Bonos HD", pct: 0.1 },
      { ticker: "T30A7", categoria: "Tasa Fija ARS", pct: 0.55 },
      { ticker: "META", categoria: "Cedears", pct: 0.08 },
      { ticker: "EWZ", categoria: "Cedears", pct: 0.22 },
      { ticker: "MU", categoria: "Cedears", pct: 0.05 },
    ],
    buckets: { FCI: 0, Soberanos: 0.65, ON: 0, Acciones: 0, Cedears: 0.35, Otros: 0 },
  },
  {
    id: "agresivo_usd",
    perfil: "agresivo",
    perfilLabel: "Agresivo",
    moneda: "USD",
    riesgo: "Medio-Alto",
    liquidez: "Media",
    horizonte: "1 año",
    estrategia:
      "Pensada para un cliente que busca superar el rendimiento de largo plazo del S&P 500 en dólares, y que está dispuesto a aceptar una volatilidad medio-alta y una liquidez media a cambio de ese objetivo. El componente dominante, un 65%, se reparte entre cinco Cedears (EWZ, NU, PEP, META y MSFT), diversificando la exposición a renta variable internacional entre distintos sectores y geografías en vez de concentrarse en un solo nombre o mercado. Un 20% se destina a un FCI de renta dólar Latam (SBS Renta Dólar Latam), que suma rendimiento regional con menor volatilidad que las acciones puras, y el 15% restante en un Bono HD (AO29) aporta una porción de renta fija en dólares que amortigua parcialmente las caídas de la porción accionaria. Por el peso mayoritario de cedears, esta es la cartera con mayor potencial de retorno —y de volatilidad— de las tres, con liquidez media y un horizonte recomendado de 1 año: el tiempo que históricamente hace falta para que una cartera con esta composición atraviese ciclos de mercado adversos y capture la prima de largo plazo de la renta variable internacional.",
    composicion: { "FCI Latam": 0.2, "Bonos HD": 0.15, Cedears: 0.65 },
    activos: [
      { ticker: "SBS Renta Dólar Latam", categoria: "FCI Latam", pct: 0.2 },
      { ticker: "AO29", categoria: "Bonos HD", pct: 0.15 },
      { ticker: "EWZ", categoria: "Cedears", pct: 0.22 },
      { ticker: "NU", categoria: "Cedears", pct: 0.1 },
      { ticker: "PEP", categoria: "Cedears", pct: 0.08 },
      { ticker: "META", categoria: "Cedears", pct: 0.1 },
      { ticker: "MSFT", categoria: "Cedears", pct: 0.15 },
    ],
    buckets: { FCI: 0.2, Soberanos: 0.15, ON: 0, Acciones: 0, Cedears: 0.65, Otros: 0 },
  },
];

export function getCarteraModelo(perfil: string, moneda: string) {
  return CARTERAS_MODELO.find(
    (c) => c.perfil === perfil && c.moneda === moneda.toUpperCase()
  );
}
