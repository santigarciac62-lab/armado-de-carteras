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

## Demo pública en GitHub Pages

`.github/workflows/deploy-pages.yml` publica automáticamente un **export estático**
del sitio en GitHub Pages en cada push a `main` (o manualmente desde la pestaña
Actions → "Deploy static export to GitHub Pages" → Run workflow).

Para que el primer deploy funcione, en el repo hay que habilitar una vez:
**Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
Una vez configurado, queda así para siempre; no hace falta tocarlo de nuevo.

URL resultante: `https://<usuario-u-org>.github.io/armado-de-carteras/`

### Importante — esto es una demo, no el backend de producción

Un export estático no tiene servidor: no hay API routes dinámicas ni cron jobs.
Concretamente:

- Los precios que se ven en la demo pública quedan **congelados al momento del
  último build** (cada push a `main`, o cuando se corra el workflow a mano) — no
  se actualizan solos. Localmente (`npm run dev`) siguen "moviéndose" cada 30s
  como siempre, porque ahí sí hay servidor.
- Si en el futuro conectamos la Visión/Excel a una base de datos real y a un
  proveedor de precios en vivo (el plan original: Vercel + Postgres + cron), ese
  despliegue va a necesitar volver a un build dinámico (`npm run build` normal,
  sin `STATIC_EXPORT=true`) — el export a Pages queda como una vidriera pública
  liviana, no reemplaza esa arquitectura.

### Comandos

```bash
# Export estático local, igual al que corre el workflow
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/armado-de-carteras npm run build
npx serve out   # o cualquier servidor estático, para probarlo localmente
```
