import { Indicador } from "@/lib/types";

/**
 * Valores semilla del Dashboard Financiero de referencia (planilla de la mesa,
 * datos al 30/06/2026). Sirven de fallback cuando una fuente en vivo falla o
 * no está disponible (ver src/lib/macro/), y de valor inicial para las
 * secciones que son 100% carga manual (no tienen API gratuita: ROFEX
 * futuros, Índice de Confianza en el Gobierno).
 */
export const MACRO_SEED: Indicador[] = [
  // --- Tasas de Interés ---
  { id: "tasa-call-ars", categoria: "Tasas de Interés", label: "Call en pesos Banc. Priv.", valor: 20.85, formato: "porcentaje", var7d: 20.35, var30d: 20.45, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-pf-ars", categoria: "Tasas de Interés", label: "Plazo fijo 30 días Pesos", valor: 20.11, formato: "porcentaje", var7d: 20.11, var30d: 20.22, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-pf-usd", categoria: "Tasas de Interés", label: "Plazo fijo 30 días Dólar", valor: 1.14, formato: "porcentaje", var7d: 1.17, var30d: 1.12, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-tamar", categoria: "Tasas de Interés", label: "Tamar", valor: 22.94, formato: "porcentaje", var7d: 22.10, var30d: 22.11, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-caucion-ars", categoria: "Tasas de Interés", label: "Tasa caución en ARS", valor: 20.54, formato: "porcentaje", var7d: 21.30, var30d: 22.50, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },
  { id: "tasa-caucion-usd", categoria: "Tasas de Interés", label: "Tasa caución en USD", valor: 1.22, formato: "porcentaje", var7d: 1.58, var30d: 1.88, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media" },

  // --- Dólares Financieros ---
  { id: "dolar-oficial", categoria: "Dólares Financieros", label: "Oficial A3500", valor: 1483.02, formato: "moneda", moneda: "ARS", fecha: "2026-06-30", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-mep", categoria: "Dólares Financieros", label: "Dólar MEP", valor: 1521.37, formato: "moneda", moneda: "ARS", fecha: "2026-06-30", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-ccl", categoria: "Dólares Financieros", label: "Dólar CCL", valor: 1567.32, formato: "moneda", moneda: "ARS", fecha: "2026-06-30", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-canje", categoria: "Dólares Financieros", label: "Canje", valor: 3.02, formato: "porcentaje", fecha: "2026-06-30", fuente: "Calculado (CCL vs MEP)", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-brecha", categoria: "Dólares Financieros", label: "Brecha Oficial vs Mep", valor: 2.59, formato: "porcentaje", fecha: "2026-06-30", fuente: "Calculado (MEP vs Oficial)", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-blue", categoria: "Dólares Financieros", label: "Dólar Blue", valor: 1515.0, formato: "moneda", moneda: "ARS", fecha: "2026-06-30", fuente: "DolarApi", actualizacion: "tiempo-real", confianza: "alta" },
  { id: "dolar-tcrm", categoria: "Dólares Financieros", label: "Índice Tipo de cambio real multilateral", valor: 85.65, formato: "numero", fecha: "2026-06-30", fuente: "BCRA (ITCRM)", actualizacion: "diaria", confianza: "media" },

  // --- Banco Central ---
  { id: "bcra-base-monetaria", categoria: "Banco Central", label: "Base monetaria", valor: 44451195, formato: "moneda", moneda: "ARS", varYtd: 3.48, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS" },
  { id: "bcra-m2-privado", categoria: "Banco Central", label: "M2 Privado transaccional", valor: 63030583, formato: "moneda", moneda: "ARS", varYtd: -6.0, fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS" },
  { id: "bcra-reservas-brutas", categoria: "Banco Central", label: "Reservas Brutas", valor: 44873, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-reservas-netas", categoria: "Banco Central", label: "Reservas Netas", valor: 3620, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "BCRA (estimado, sin serie oficial directa)", actualizacion: "diaria", confianza: "baja", nota: "en millones de USD" },
  { id: "bcra-compra-dolares-ytd", categoria: "Banco Central", label: "Compra de dólares YTD", valor: 11175, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-depositos-usd-publico", categoria: "Banco Central", label: "Depósitos en dólares del sector público", valor: 4216, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },
  { id: "bcra-depositos-ars-publico", categoria: "Banco Central", label: "Depósitos en pesos del sector público", valor: 12556966, formato: "moneda", moneda: "ARS", fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de ARS" },
  { id: "bcra-depositos-usd-privado", categoria: "Banco Central", label: "Depósitos sector privado USD", valor: 39572, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "BCRA", actualizacion: "diaria", confianza: "media", nota: "en millones de USD" },

  // --- Merval en CCL ---
  { id: "merval-ccl", categoria: "Merval en CCL", label: "Merval en CCL", valor: 2022, formato: "moneda", moneda: "USD", var1d: -1.01, var7d: 0.82, var30d: -6.15, varYtd: 1.01, fecha: "2026-06-30", fuente: "Stooq / calculado", actualizacion: "diaria", confianza: "media", nota: "var30d es 'cambio 1 mes'; cambio 15 días (-7.52%) no tiene campo propio" },

  // --- Índices ---
  { id: "indice-sp500", categoria: "Índices", label: "S&P500", valor: 7499, formato: "numero", var1d: 0.8, varYtd: 9.6, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-dowjones", categoria: "Índices", label: "DowJones", valor: 52319, formato: "numero", var1d: 0.3, varYtd: 5.8, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-nasdaq", categoria: "Índices", label: "Nasdaq", valor: 30276, formato: "numero", var1d: 1.7, varYtd: 19.2, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "indice-russell3000", categoria: "Índices", label: "Russell 3000", valor: 4279, formato: "numero", var1d: 0.8, varYtd: 7.3, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "media" },

  // --- Vencimientos en USD en 2026 (curado a mano, no hay API) ---
  { id: "venc-soberanos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos soberanos", valor: 4494, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },
  { id: "venc-subsoberanos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos subsoberanos", valor: 1175, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },
  { id: "venc-corporativos", categoria: "Vencimientos en USD en 2026", label: "Vencimientos corporativos", valor: 3771, formato: "moneda", moneda: "USD", fecha: "2026-06-30", fuente: "Carga manual (mesa)", actualizacion: "manual", confianza: "alta", nota: "en millones de USD" },

  // --- Riesgo País ---
  { id: "riesgo-pais", categoria: "Riesgo País", label: "Riesgo País (EMBI+)", valor: 426, formato: "numero", var30d: -22.12, var1y: -40.34, fecha: "2026-06-30", fuente: "CriptoYa / ArgentinaDatos", actualizacion: "tiempo-real", confianza: "media" },

  // --- Inflación ---
  { id: "inflacion-mensual", categoria: "Inflación", label: "Inflación - May26", valor: 2.10, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "inflacion-acumulada", categoria: "Inflación", label: "Inflación Acumulada", valor: 14.70, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "inflacion-interanual", categoria: "Inflación", label: "Inflación Interanual", valor: 33.20, formato: "porcentaje", fecha: "2026-05-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },

  // --- Futuros Dólar (ROFEX) — sin API gratuita real-time, carga manual ---
  { id: "futuro-dolar-jul26", categoria: "Futuros Dólar", label: "Dólar DLR/JUL26", valor: 18.3, formato: "porcentaje", fecha: "2026-06-30", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 1.855.127" },
  { id: "futuro-dolar-ago26", categoria: "Futuros Dólar", label: "Dólar DLR/AGO26", valor: 19.7, formato: "porcentaje", fecha: "2026-06-30", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 406.032" },
  { id: "futuro-dolar-sep26", categoria: "Futuros Dólar", label: "Dólar DLR/SEP26", valor: 20.5, formato: "porcentaje", fecha: "2026-06-30", fuente: "Carga manual (mesa) — Matba Rofex", actualizacion: "manual", confianza: "alta", nota: "Interés abierto: 262.585" },

  // --- Actividad ---
  { id: "actividad-emae", categoria: "Actividad", label: "EMAE Variación mensual (Abril)", valor: -1.50, formato: "porcentaje", fecha: "2026-04-30", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-pbi-interanual", categoria: "Actividad", label: "PBI 1T 2026 (Var. interanual)", valor: 2.30, formato: "porcentaje", fecha: "2026-03-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-pbi-trimestral", categoria: "Actividad", label: "PBI Var. trimestral", valor: 0.70, formato: "porcentaje", fecha: "2026-03-31", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "alta" },
  { id: "actividad-balanza", categoria: "Actividad", label: "Superávit/Déficit comercial de bienes (Abril)", valor: 3504, formato: "moneda", moneda: "USD", fecha: "2026-04-30", fuente: "INDEC (datos.gob.ar)", actualizacion: "mensual", confianza: "media", nota: "en millones de USD" },

  // --- Resultado fiscal ---
  { id: "fiscal-primario", categoria: "Resultado fiscal", label: "Resultado primario último mes", valor: 1924367, formato: "moneda", moneda: "ARS", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja", nota: "en millones de ARS" },
  { id: "fiscal-financiero", categoria: "Resultado fiscal", label: "Resultado financiero último mes", valor: 478613, formato: "moneda", moneda: "ARS", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja", nota: "en millones de ARS" },
  { id: "fiscal-acum-pbi", categoria: "Resultado fiscal", label: "S. Fin. Acum. 2026 como % del PBI", valor: 0.20, formato: "porcentaje", fecha: "2026-05-31", fuente: "Presupuesto Abierto (a verificar)", actualizacion: "mensual", confianza: "baja" },

  // --- Commodities ---
  { id: "commodity-soja", categoria: "Commodities", label: "Precio Soja / Tn", valor: 1144, formato: "moneda", moneda: "USD", var1d: 0.40, varYtd: 9.10, fecha: "2026-06-30", fuente: "Stooq (cobertura limitada en soja)", actualizacion: "diaria", confianza: "baja" },
  { id: "commodity-oro", categoria: "Commodities", label: "Precio oro", valor: 4022, formato: "moneda", moneda: "USD", var1d: -0.42, varYtd: -4.51, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "commodity-wti", categoria: "Commodities", label: "Precio Oil WTI", valor: 70.19, formato: "moneda", moneda: "USD", var1d: -1.02, varYtd: 32.08, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },
  { id: "commodity-cobre", categoria: "Commodities", label: "Precio cobre", valor: 6.25, formato: "moneda", moneda: "USD", var1d: 1.35, varYtd: 10.85, fecha: "2026-06-30", fuente: "Stooq", actualizacion: "diaria", confianza: "alta" },

  // --- Indicadores clima político — sin API, carga manual ---
  { id: "icg", categoria: "Indicadores clima político", label: "Índice de Confianza en el Gobierno (Junio)", valor: 3.9, formato: "numero", fecha: "2026-06-30", fuente: "Carga manual (mesa) — UTDT, sin API pública", actualizacion: "manual", confianza: "alta" },

  // --- Riesgo EEUU ---
  { id: "eeuu-fed", categoria: "Riesgo EEUU", label: "Tasa FED", valor: 3.50, formato: "porcentaje", var30d: 3.88, fecha: "2026-06-30", fuente: "FRED (DFF)", actualizacion: "diaria", confianza: "alta" },
  { id: "eeuu-5y", categoria: "Riesgo EEUU", label: "Tasa a 5 años", valor: 4.22, formato: "porcentaje", var30d: 4.21, fecha: "2026-06-30", fuente: "FRED (DGS5)", actualizacion: "diaria", confianza: "alta" },
  { id: "eeuu-10y", categoria: "Riesgo EEUU", label: "Tasa a 10 años", valor: 4.47, formato: "porcentaje", var30d: 4.47, fecha: "2026-06-30", fuente: "FRED (DGS10)", actualizacion: "diaria", confianza: "alta" },
];
