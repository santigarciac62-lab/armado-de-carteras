import type { NextConfig } from "next";

// STATIC_EXPORT=true lo activa el workflow de GitHub Pages (ver
// .github/workflows/deploy-pages.yml). Fuera de ese workflow (dev local,
// o un futuro deploy en Vercel con backend dinámico) el build se comporta
// como un Next.js normal.
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
