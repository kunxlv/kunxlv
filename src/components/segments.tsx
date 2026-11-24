import type { Segment } from "@/content/projects";

export function Segments({ parts, hlStyle }: { parts: Segment[]; hlStyle?: React.CSSProperties }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? <span key={i}>{p}</span> : <strong key={i} className="kv-hl" style={hlStyle}>{p.hl}</strong>,
      )}
    </>
  );
}
