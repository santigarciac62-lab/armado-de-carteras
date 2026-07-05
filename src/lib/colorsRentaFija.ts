import { CategoriaRentaFija } from "@/lib/types";

export const CATEGORIA_RF_COLOR: Record<CategoriaRentaFija, string> = {
  "Soberanos ARS": "var(--teal)",
  "Soberanos USD": "var(--navy)",
  "Corporativos USD": "var(--blue)",
};

export const CATEGORIA_RF_BG: Record<CategoriaRentaFija, string> = {
  "Soberanos ARS": "var(--teal-soft)",
  "Soberanos USD": "#E7EAEF",
  "Corporativos USD": "var(--blue-soft)",
};
