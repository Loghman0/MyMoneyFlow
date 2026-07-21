import type { Transaction } from "@/types/wallet";
import { CATEGORIES } from "@/data/mock";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TransactionItem({
  tx,
  blurred,
}: {
  tx: Transaction;
  blurred?: boolean;
}) {
  const cat = CATEGORIES[tx.category];
  const Icon = cat.icon;
  const isIncome = tx.type === "income";

  return (
    <div className="flex min-h-[56px] items-center gap-3 rounded-2xl px-2 py-2 transition-colors active:bg-accent">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in oklab, var(--chart-${cat.hue}) 18%, transparent)`,
          color: `var(--chart-${cat.hue})`,
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {tx.note || cat.label}
        </p>
        <p className="truncate text-xs text-muted-foreground">{cat.label}</p>
      </div>
      <p
        className={cn(
          "tabular shrink-0 text-sm font-semibold transition-[filter] duration-300",
          isIncome ? "text-success" : "text-foreground",
          blurred && "blur-amount",
        )}
      >
        {isIncome ? "+" : "−"}
        {currency(tx.amount)}
      </p>
    </div>
  );
}
