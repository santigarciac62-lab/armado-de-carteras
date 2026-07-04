# Armado de Carteras — D.A. Valores

Herramienta interna del equipo de asesoramiento para reemplazar el flujo manual de
Visión de Portafolio + Excel de seguimiento. Next.js + TypeScript.

Se despliega en Vercel (con servidor real) — es el único despliegue: no hay
export estático ni GitHub Pages, justamente porque la app protege con login
el acceso a datos reales de clientes y eso requiere backend.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar AUTH_SECRET y AUTH_USERS, ver abajo
npm run dev
```

## Autenticación

Login simple pensado para un equipo interno chico, sin altas de usuario desde
la UI ni recuperación de contraseña:

- `AUTH_USERS`: variable de entorno con `usuario1:clave1,usuario2:clave2`. Se
  edita a mano en Vercel (Project Settings → Environment Variables) para dar
  de alta/baja gente o cambiar una clave — no requiere redeploy de código,
  solo un redeploy del proyecto (Vercel lo hace solo al guardar la variable).
- `AUTH_SECRET`: clave para firmar la cookie de sesión (`openssl rand -base64 32`).
  Si se cambia, todas las sesiones activas se invalidan.
- Todo el sitio queda atrás del login (`src/proxy.ts` — en Next.js 16
  "Middleware" pasó a llamarse "Proxy"), incluida la pantalla de armado — no
  solo las que muestran datos reales de clientes.
- Sesión: cookie HttpOnly firmada con HMAC-SHA256, expira a los 7 días.

**Importante:** sin `AUTH_SECRET`/`AUTH_USERS` configuradas, nadie puede
loguearse (ni siquiera en local) — es intencional, para que no se pueda
levantar el sitio por accidente sin login activo.

## Estructura

- `src/data/modelPortfolios.ts` — las 6 carteras modelo (perfil × moneda) tal como
  figuran en la Visión de Portafolio vigente. Se actualiza a mano cada mes hasta que
  exista una pantalla de administración para cargarlas.
- `src/data/instrumentos.ts` — universo de instrumentos recomendados, derivado de
  las carteras modelo + metadata (clase de activo, moneda, nombre).
- `src/data/raw/*.json` — datos reales de clientes/oficiales extraídos una vez del
  Excel de seguimiento (hojas "Total" y "Dashboard"). Hay que reemplazarlos a mano
  cuando se actualice el padrón, hasta que exista una carga automática.
- `src/lib/desvio.ts` — mapeo de categorías del Excel a los buckets de la Visión,
  asignación de perfil de riesgo, cálculo de desvío/alertas/recomendaciones.
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
- `src/lib/auth.ts` / `src/proxy.ts` — login y protección de rutas.
- `src/data/raw/rentaFija.json` — universo de renta fija (soberanos ARS,
  soberanos USD, corporativos energía) cargado a mano, fecha de operación
  03/07/2026. Se reemplaza a mano cuando se quiera actualizar precios/tasas.
  **Los vencimientos de Globales/Bonares/BCRA no venían en la planilla
  original** (esas filas solo traían duración modificada) — se completaron
  con fechas de pago públicas conocidas, pero conviene verificarlas contra
  el prospecto antes de confiar en el simulador de calendario de pagos.
- `src/lib/rentaFija.ts` — proyección de flujo de fondos por instrumento.
  Es una aproximación simplificada (bullet + cupón a tasa fija constante);
  no reproduce amortizaciones parciales reales ni la variación futura de
  tasas flotantes/CER — el disclaimer se repite en la propia pantalla.
- `src/lib/macro/` — Dashboard Financiero (`/dashboard-macro`): un conector
  por fuente (DolarApi, CriptoYa/ArgentinaDatos, Stooq, FRED, BCRA,
  datos.gob.ar, Presupuesto Abierto), cada uno con fallback automático al
  valor semilla (`src/data/raw/macroSeed.ts`) si la fuente falla o no está
  configurada. Ningún endpoint se pudo verificar en vivo desde el entorno de
  desarrollo (red restringida) — antes de confiar en producción, revisar:
  - **Alta confianza** (debería andar tal cual): dólares, riesgo país,
    índices, commodities (menos soja), tasas EEUU (requiere `FRED_API_KEY`,
    gratis en https://fred.stlouisfed.org/docs/api/api_key.html).
  - **Media/baja confianza** ("a verificar" en la propia pantalla): BCRA
    (matchea por texto de la descripción, no por ID — revisar
    `src/lib/macro/providers/bcra.ts` si el texto real difiere), inflación
    y actividad (necesitan los IDs de series de datos.gob.ar por variable
    de entorno — buscarlos en https://datos.gob.ar/series/api/series/ y
    completar `DATOS_GOB_AR_*_ID` en `.env.example`), y resultado fiscal
    (sin implementar: no se confirmó el endpoint exacto de Presupuesto
    Abierto, queda en el valor semilla).
  - **Carga manual, sin API gratuita real**: futuros de dólar ROFEX,
    Índice de Confianza en el Gobierno (UTDT) y vencimientos USD 2026 —
    hay que actualizar `macroSeed.ts` a mano.

## Pantallas

1. **Armado dinámico de carteras** (`/`) — implementada.
2. **Renta Fija** (`/renta-fija`) — implementada.
3. **Cuentas con desvío** (`/desvios`) — implementada.
4. **Seguimiento de oficiales** (`/oficiales`) — implementada.
5. **Dashboard Financiero** (`/dashboard-macro`) — implementada.
