import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Page numbers with ellipsis for large totals */
function pageItems(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const core = new Set<number>([1, total]);
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) core.add(p);
  }

  const sorted = [...core].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i];
    if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
    out.push(n);
  }
  return out;
}

/** Squircle controls: active = solid purple + white; inactive = white + subtle border (reference UI). */
const ctrl =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const items = pageItems(page, totalPages);

  const inactiveBtn =
    "border border-border/70 bg-card text-foreground hover:bg-muted/60 hover:border-border disabled:pointer-events-none disabled:opacity-40";

  const activeBtn =
    "border border-transparent bg-primary text-primary-foreground shadow-sm cursor-default pointer-events-none";

  return (
    <div className="flex flex-col items-center gap-4 mt-10 pb-8 animate-fade-in">
      <nav
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-secondary/50 px-2 py-2 sm:px-3 sm:gap-2.5"
        aria-label="Pagination"
      >
        <button
          type="button"
          className={cn(ctrl, inactiveBtn)}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5 text-foreground/90" strokeWidth={2} />
        </button>

        {items.map((item, idx) =>
          item === "gap" ? (
            <span
              key={`gap-${idx}`}
              className={cn(
                ctrl,
                "pointer-events-none border border-transparent bg-transparent text-muted-foreground"
              )}
              aria-hidden
            >
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              className={cn(ctrl, activeBtn)}
              aria-current="page"
              aria-label={`Page ${item}`}
            >
              {item}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(ctrl, inactiveBtn)}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className={cn(ctrl, inactiveBtn)}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5 text-foreground/90" strokeWidth={2} />
        </button>
      </nav>

      <p className="text-xs text-muted-foreground font-medium">
        Page <span className="text-foreground font-semibold">{page}</span> of{" "}
        <span className="text-foreground font-semibold">{totalPages}</span>
      </p>
    </div>
  );
}
