import { Bucket } from "@/lib/types";
import { BUCKET_COLOR } from "@/lib/colors";

const ORDEN: Bucket[] = ["FCI", "Soberanos", "ON", "Acciones", "Cedears", "Otros"];

export function BucketBar({ buckets }: { buckets: Record<Bucket, number> }) {
  const total = ORDEN.reduce((acc, b) => acc + (buckets[b] ?? 0), 0);
  if (total <= 0) {
    return <div className="h-3.5 rounded" style={{ background: "#EEF0F2" }} />;
  }
  return (
    <div className="flex h-3.5 rounded overflow-hidden" style={{ background: "#EEF0F2" }}>
      {ORDEN.map((b) => {
        const pct = ((buckets[b] ?? 0) / total) * 100;
        if (pct < 0.5) return null;
        return (
          <div
            key={b}
            style={{ width: `${pct}%`, background: BUCKET_COLOR[b] }}
            title={`${b}: ${pct.toFixed(1)}%`}
          />
        );
      })}
    </div>
  );
}

export function BucketLegend() {
  return (
    <div className="flex gap-4 flex-wrap text-[12px]" style={{ color: "var(--text-soft)" }}>
      {ORDEN.map((b) => (
        <div key={b} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: BUCKET_COLOR[b] }} />
          {b}
        </div>
      ))}
    </div>
  );
}
