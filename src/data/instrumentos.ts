import { Bucket, Instrumento, Moneda } from "@/lib/types";
import { CARTERAS_MODELO } from "./modelPortfolios";

const CATEGORIA_A_BUCKET: Record<string, Bucket> = {
  "FCI MM": "FCI",
  "FCI MM USD": "FCI",
  "FCI Latam": "FCI",
  "Tasa Fija ARS": "Soberanos",
  "Bonos HD": "Soberanos",
  CER: "Soberanos",
  "ON HD": "ON",
  Acciones: "Acciones",
  Cedears: "Cedears",
};

/** Metadata que no viene de la Visión (clase de activo, moneda de negociación, nombre largo). */
const METADATA: Record<
  string,
  { nombre: string; moneda: Moneda; claseActivo: Instrumento["claseActivo"] }
> = {
  "IAM Ahorro Pesos B": { nombre: "FCI Money Market en pesos", moneda: "ARS", claseActivo: "FCI" },
  S13N6: { nombre: "Letra tasa fija en pesos, tramo medio", moneda: "ARS", claseActivo: "LetraTasaFija" },
  T30A7: { nombre: "Bono tasa fija en pesos, tramo medio", moneda: "ARS", claseActivo: "LetraTasaFija" },
  TX26: { nombre: "Bono ajustado por CER (TX26)", moneda: "ARS", claseActivo: "Bono" },
  "Allaria Dólar Ahorro B": {
    nombre: "FCI Money Market en dólares",
    moneda: "USD",
    claseActivo: "FCI",
  },
  "SBS Renta Mixta - Clase B": {
    nombre: "FCI renta mixta Latam",
    moneda: "USD",
    claseActivo: "FCI",
  },
  "SBS Renta Dólar Latam": {
    nombre: "FCI renta dólar Latam",
    moneda: "USD",
    claseActivo: "FCI",
  },
  VSCXO: { nombre: "ON VSCXO", moneda: "USD", claseActivo: "ON" },
  TTC9O: { nombre: "ON TTC9O", moneda: "USD", claseActivo: "ON" },
  YM42O: { nombre: "ON YM42O", moneda: "USD", claseActivo: "ON" },
  AO29: { nombre: "Bono hard dollar (AO29)", moneda: "USD", claseActivo: "Bono" },
  META: { nombre: "Meta Platforms (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
  NU: { nombre: "Nu Holdings (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
  PEP: { nombre: "PepsiCo (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
  MSFT: { nombre: "Microsoft (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
  EWZ: { nombre: "iShares MSCI Brazil ETF (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
  MU: { nombre: "Micron Technology (Cedear)", moneda: "ARS", claseActivo: "Cedear" },
};

function construirUniverso(): Instrumento[] {
  const porTicker = new Map<string, Instrumento>();

  for (const cartera of CARTERAS_MODELO) {
    for (const activo of cartera.activos) {
      const meta = METADATA[activo.ticker];
      if (!meta) continue; // instrumento sin metadata cargada: se ignora hasta completarla
      const existente = porTicker.get(activo.ticker);
      if (existente) {
        existente.presenteEn.push({ carteraId: cartera.id, pct: activo.pct });
        continue;
      }
      porTicker.set(activo.ticker, {
        ticker: activo.ticker,
        nombre: meta.nombre,
        categoria: activo.categoria,
        bucket: CATEGORIA_A_BUCKET[activo.categoria] ?? "Otros",
        moneda: meta.moneda,
        claseActivo: meta.claseActivo,
        presenteEn: [{ carteraId: cartera.id, pct: activo.pct }],
      });
    }
  }

  return Array.from(porTicker.values()).sort((a, b) => a.ticker.localeCompare(b.ticker));
}

export const UNIVERSO_INSTRUMENTOS: Instrumento[] = construirUniverso();

export function getInstrumento(ticker: string) {
  return UNIVERSO_INSTRUMENTOS.find((i) => i.ticker === ticker);
}
