# Armado de Carteras — D.A. Valores

Herramienta interna del equipo de asesoramiento para reemplazar el flujo manual de
Visión de Portafolio + Excel de seguimiento. Next.js + TypeScript.

## Desarrollo

```bash
npm install
npm run dev
```

## Estructura

- `src/data/modelPortfolios.ts` — las 6 carteras modelo (perfil × moneda) tal como
  figuran en la Visión de Portafolio vigente. Se actualiza a mano cada mes hasta que
  exista una pantalla de administración para cargarlas.
- `src/data/instrumentos.ts` — universo de instrumentos recomendados, derivado de
  las carteras modelo + metadata (clase de activo, moneda, nombre).
- `src/lib/prices/` — abstracción de proveedor de precios:
  - `mockProvider.ts`: datos demo determinísticos, sin dependencias de red. Es el
    fallback automático y lo que corre por defecto en desarrollo.
  - `data912Provider.ts`: integración con [data912.com](https://data912.com) (API
    pública, gratuita, pensada para uso hobby/educativo — no es tick-by-tick, cachea
    ~2hs). **Antes de habilitarla en producción, verificar contra una respuesta real
    los nombres de campo exactos** (están mapeados de forma defensiva pero sin
    confirmar en vivo). No cubre FCI: los fondos comunes no cotizan en mercado, hay
    que sumar una fuente de valor de cuotaparte (ej. CAFCI) aparte.
  - Activar con la variable de entorno `USE_DATA912=true`.
- `src/lib/armado.ts` — cálculos de la pantalla de armado (montos por línea,
  agregación por categoría, desvío vs. cartera modelo).

## Pantallas

1. **Armado dinámico de carteras** (`/`) — implementada.
2. **Cuentas con desvío** (`/desvios`) — pendiente.
3. **Seguimiento de oficiales** (`/oficiales`) — pendiente.
