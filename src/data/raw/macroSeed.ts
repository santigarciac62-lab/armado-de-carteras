import { Indicador } from "@/lib/types";

/**
 * Valores semilla del Dashboard Financiero de referencia (planilla de la mesa,
 * datos al 21/07/2026). Sirven de fallback cuando una fuente en vivo falla o
 * no está disponible (ver src/lib/macro/), y de valor inicial para las
 * secciones que son 100% carga manual (no tienen API gratuita: ROFEX
 * futuros, Índice de Confianza en el Gobierno).
 */
export const MACRO_SEED: Indicador[] = [
  // --- Tasas de Interés ---
  { id: "tasa-call-ars", categoria: "Tasas de Interés", label: "Call en pesos Banc. Priv.", valor: 20.51, formato: "porcentaje", var7d: 20.46, var30d: 20.42, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-pf-ars", categoria: "Tasas de Interés", label: "Plazo fijo 30 días Pesos", valor: 20.05, formato: "porcentaje", var7d: 20.10, var30d: 19.97, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-pf-usd", categoria: "Tasas de Interés", label: "Plazo fijo 30 días Dólar", valor: 1.21, formato: "porcentaje", var7d: 1.20, var30d: 1.19, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-tamar", categoria: "Tasas de Interés", label: "Tamar", valor: 22.69, formato: "porcentaje", var7d: 22.03, var30d: 21.90, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-caucion-ars", categoria: "Tasas de Interés", label: "Tasa caución en ARS", valor: 21.50, formato: "porcentaje", var7d: 21.09, var30d: 20.51, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-caucion-usd", categoria: "Tasas de Interés", label: "Tasa caución en USD", valor: 1.30, formato: "porcentaje", var7d: 1.21, var30d: 1.45, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },

  // --- Dólares Financieros ---
  { id: "dolar-oficial", categoria: "Dólares Financieros", label: "Oficial A3500", valor: 1477.70, formato: "moneda", moneda: "ARS", fecha: "2026-07-21", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-mep", categoria: "Dólares Financieros", label: "Dólar MEP", valor: 1509.85, formato: "moneda", moneda: "ARS", fecha: "2026-07-21", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-ccl", categoria: "Dólares Financieros", label: "Dólar CCL", valor: 1572.32, formato: "moneda", moneda: "ARS", fecha: "2026-07-21", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-canje", categoria: "Dólares Financieros", label: "Canje", valor: 4.18, formato: "porcentaje", fecha: "2026-07-21", fuente: "Calculado (CCL vs MEP)", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-brecha", categoria: "Dólares Financieros", label: "Brecha Oficial vs Mep", valor: 2.18, formato: "porcentaje", fecha: "2026-07-21", fuente: "Calculado (MEP vs Oficial)", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-blue", categoria: "Dólares Financieros", label: "Dólar Blue", valor: 1545.0, formato: "moneda", moneda: "ARS", fecha: "2026-07-21", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  // --- Banco Central ---
  { id: "dolar-tcrm", categoria: "Banco Central", label: "Índice Tipo de cambio real multilateral (ITCRM)", valor: 85.20, formato: "numero", fecha: "2026-07-21", fuente: "BCRA (ITCRM)", actualizacion: "diaria", confianza: "media" },
  { id: "bcra-base-monetaria", categoria: "Banco Central", label: "Base monetaria", valor: 46019844, formato: "moneda", moneda: "ARS", varYtd: 7.13, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS" },
  { id: "bcra-m2-privado", categoria: "Banco Central", label: "M2 Privado transaccional", valor: 65553360, formato: "moneda", moneda: "ARS", varYtd: 0.36, fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS" },
  { id: "bcra-reservas-brutas", categoria: "Banco Central", label: "Reservas Brutas", valor: 48790, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-reservas-netas", categoria: "Banco Central", label: "Reservas Netas", valor: 9736, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "BCRA (estimado, sin serie oficial directa)", actualizacion: "diaria", confianza: "baja", nota: "en millones de USD" },
  { id: "bcra-compra-dolares-ytd", categoria: "Banco Central", label: "Compra de dólares YTD", valor: 12580, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-depositos-usd-publico", categoria: "Banco Central", label: "Depósitos en dólares del sector público", valor: 4216, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-depositos-ars-publico", categoria: "Banco Central", label: "Depósitos en pesos del sector público", valor: 12556966, formato: "moneda", moneda: "ARS", fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS — sin cambios respecto al snapshot anterior en la planilla de la mesa" },
  { id: "bcra-depositos-usd-privado", categoria: "Banco Central", label: "Depósitos sector privado USD", valor: 40486, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },

  // --- Merval en CCL ---
  { id: "merval-ccl", categoria: "Merval en CCL", label: "Merval en CCL", valor: 2087, formato: "moneda", moneda: "USD", var1d: 2.63, var7d: 0.82, var30d: -2.92, varYtd: 4.80, fecha: "2026-07-21", fuente: "Stooq / calculado", actualizacion: "diaria", confianza: "media", nota: "var30d es 'cambio 1 mes'; cambio 15 días (-2.71%) no tiene campo propio. 'Cambio semanal' (var7d) no se pudo leer con confianza en la captura — se dejó el valor anterior, verificar." },

  // --- Índices ---
  { id: "indice-sp500", categoria: "Índices", label: "S&P500", valor: 7509, formato: "numero", var1d: 0.9, varYtd: 9.7, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-dowjones", categoria: "Índices", label: "DowJones", valor: 52225, formato: "numero", var1d: 0.7, varYtd: 8.7, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-nasdaq", categoria: "Índices", label: "Nasdaq", valor: 29153, formato: "numero", var1d: 1.9, varYtd: 15.5, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-russell3000", categoria: "Índices", label: "Russell 3000", valor: 4271, formato: "numero", var1d: 0.9, varYtd: 10.0, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "media" },

  // --- Vencimientos en USD en 2026 (curado a mano, no hay API) ---
  { id: "venc-soberanos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos soberanos", valor: 153, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },
  { id: "venc-subsoberanos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos subsoberanos", valor: 1139, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },
  { id: "venc-corporativos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos corporativos", valor: 3604, formato: "moneda", moneda: "USD", fecha: "2026-07-21", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },

  // --- Riesgo País ---
  { id: "riesgo-pais", categoria: "Riesgo País", label: "Riesgo País (EMBI+)", valor: 410, formato: "numero", var30d: -15.98, var1y: -41.76, fecha: "2026-07-21", fuente: "CriptoYa / ArgentinaDatos", actualizacion: "tiempo-real", confianza: "media" },

  // --- Inflación ---
  { id: "inflacion-mensual", categoria: "Inflación", label: "Inflación - May26", valor: 1.90, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "inflacion-acumulada", categoria: "Inflación", label: "Inflación Acumulada", valor: 16.80, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "inflacion-interanual", categoria: "Inflación", label: "Inflación Interanual", valor: 33.50, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },

  // --- Futuros Dólar (ROFEX) — sin API gratuita real-time, carga manual ---
  { id: "futuro-dolar-jul26", categoria: "Futuros Dólar", label: "Dólar DLR/JUL26", valor: 18.3, formato: "porcentaje", fecha: "2026-07-21", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 2.014.565" },
  { id: "futuro-dolar-ago26", categoria: "Futuros Dólar", label: "Dólar DLR/AGO26", valor: 19.3, formato: "porcentaje", fecha: "2026-07-21", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 854.309" },
  { id: "futuro-dolar-sep26", categoria: "Futuros Dólar", label: "Dólar DLR/SEP26", valor: 20.5, formato: "porcentaje", fecha: "2026-07-21", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 372.158" },

  // --- Actividad ---
  { id: "actividad-emae", categoria: "Actividad", label: "EMAE Variación mensual (Abril)", valor: -1.50, formato: "porcentaje", fecha: "2026-04-30", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-pbi-interanual", categoria: "Actividad", label: "PBI 1T 2026 (Var. interanual)", valor: 2.30, formato: "porcentaje", fecha: "2026-03-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-pbi-trimestral", categoria: "Actividad", label: "PBI Var. trimestral", valor: 0.70, formato: "porcentaje", fecha: "2026-03-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-balanza", categoria: "Actividad", label: "Superávit/Déficit comercial de bienes (Abril)", valor: 2194, formato: "moneda", moneda: "USD", fecha: "2026-04-30", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "media", nota: "en millones de USD — mismo mes (Abril) que el snapshot anterior pero con valor revisado (3504 -> 2194); verificar si es una revisión de INDEC o una lectura distinta" },

  // --- Resultado fiscal ---
  { id: "fiscal-primario", categoria: "Resultado fiscal", label: "Resultado primario último mes", valor: -696843, formato: "moneda", moneda: "ARS", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja", nota: "en millones de ARS" },
  { id: "fiscal-financiero", categoria: "Resultado fiscal", label: "Resultado financiero último mes", valor: -1024891, formato: "moneda", moneda: "ARS", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja", nota: "en millones de ARS" },
  { id: "fiscal-acum-pbi", categoria: "Resultado fiscal", label: "S. Fin. Acum. 2026 como % del PBI", valor: 0.10, formato: "porcentaje", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja" },

  // --- Commodities ---
  { id: "commodity-soja", categoria: "Commodities", label: "Precio Soja / Tn", valor: 1222, formato: "moneda", moneda: "USD", var1d: -0.06, varYtd: 18.61, fecha: "2026-07-21", fuente: "Stooq (cobertura limitada en soja)", actualizacion: "diaria", confianza: "baja" },
  { id: "commodity-oro", categoria: "Commodities", label: "Precio oro", valor: 4082, formato: "moneda", moneda: "USD", var1d: 0.77, varYtd: -5.63, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "commodity-wti", categoria: "Commodities", label: "Precio Oil WTI", valor: 84.54, formato: "moneda", moneda: "USD", var1d: 2.86, varYtd: 47.23, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "commodity-cobre", categoria: "Commodities", label: "Precio cobre", valor: 6.53, formato: "moneda", moneda: "USD", var1d: 1.71, varYtd: 15.98, fecha: "2026-07-21", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },

  // --- Indicadores clima político — sin API, carga manual ---
  { id: "icg", categoria: "Indicadores clima político", label: "Índice de Confianza en el Gobierno (Junio)", valor: 3.9, formato: "numero", fecha: "2026-06-30", fuente: "Carga manual (mesa) — UTDT, sin API pública", actualizacion: "manual", confianza: "alta" },

  // --- Riesgo EEUU ---
  { id: "eeuu-fed", categoria: "Riesgo EEUU", label: "Tasa FED", valor: 3.50, formato: "porcentaje", var30d: 3.88, fecha: "2026-07-21", fuente: "FRED (DFF)", actualizacion: "diaria", confianza: "alta" },
  { id: "eeuu-5y", categoria: "Riesgo EEUU", label: "Tasa a 5 años", valor: 4.37, formato: "porcentaje", var30d: 4.25, fecha: "2026-07-21", fuente: "FRED (DGS5)", actualizacion: "diaria", confianza: "alta" },
  { id: "eeuu-10y", categoria: "Riesgo EEUU", label: "Tasa a 10 años", valor: 4.63, formato: "porcentaje", var30d: 4.51, fecha: "2026-07-21", fuente: "FRED (DGS10)", actualizacion: "diaria", confianza: "alta" },
];
