import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useWallet } from "@/context/WalletContext";
import { CATEGORIES } from "@/data/mock";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types/wallet";

interface Slice {
  id: CategoryId;
  label: string;
  value: number;
  color: string;
  hue: number;
}

export function CategoryChart() {
  const { transactions, totals, privacy } = useWallet();
  const [active, setActive] = useState<CategoryId | null>(null);

  const slices: Slice[] = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const map = new Map<CategoryId, number>();
    for (const tx of transactions) {
      if (tx.type !== "expense") continue;
      const d = new Date(tx.date);
      if (d.getMonth() !== month || d.getFullYear() !== year) continue;
      map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
    }
    return Array.from(map.entries())
      .map(([id, value]) => {
        const meta = CATEGORIES[id];
        return {
          id,
          label: meta.label,
          value,
          hue: meta.hue,
          color: `var(--chart-${meta.hue})`,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = slices.reduce((s, x) => s + x.value, 0);
  const activeSlice = slices.find((s) => s.id === active) ?? null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          label="Bu Ay Gəlir"
          value={totals.monthIncome}
          tone="income"
          blurred={privacy}
        />
        <SummaryCard
          label="Bu Ay Xərc"
          value={totals.monthExpense}
          tone="expense"
          blurred={privacy}
        />
      </div>

      <div className="rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Kateqoriya Bölgüsü</h3>
          <span className="text-xs text-muted-foreground">Bu ay</span>
        </div>

        {slices.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            Bu ay xərc yoxdur
          </div>
        ) : (
          <>
            <div className="relative mx-auto mt-4 h-64 w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    stroke="none"
                    onClick={(d: unknown) => {
                      const id = (d as { id?: CategoryId } | undefined)?.id ?? null;
                      setActive((prev) => (prev === id ? null : id));
                    }}
                  >
                    {slices.map((s) => (
                      <Cell
                        key={s.id}
                        fill={s.color}
                        opacity={!active || active === s.id ? 1 : 0.35}
                        style={{
                          cursor: "pointer",
                          transition: "opacity 0.25s",
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {activeSlice ? activeSlice.label : "Ümumi"}
                </span>
                <span
                  className={cn(
                    "tabular mt-1 text-xl font-semibold",
                    privacy && "blur-amount",
                  )}
                >
                  {currency(activeSlice ? activeSlice.value : total)}
                </span>
                {activeSlice && (
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    %{total > 0 ? ((activeSlice.value / total) * 100).toFixed(1) : "0.0"}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {slices.map((s) => {
                const pct = ((s.value / total) * 100).toFixed(1);
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive((p) => (p === s.id ? null : s.id))}
                    className={cn(
                      "flex min-h-[44px] items-center gap-3 rounded-2xl px-3 py-2 transition-colors",
                      isActive ? "bg-accent" : "active:bg-accent",
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="flex-1 text-left text-sm font-medium">
                      {s.label}
                    </span>
                    <span className="text-xs text-muted-foreground">%{pct}</span>
                    <span
                      className={cn(
                        "tabular w-24 text-right text-sm font-semibold",
                        privacy && "blur-amount",
                      )}
                    >
                      {currency(s.value)}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
  blurred,
}: {
  label: string;
  value: number;
  tone: "income" | "expense";
  blurred: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "tabular mt-2 text-xl font-semibold",
          tone === "income" ? "text-success" : "text-foreground",
          blurred && "blur-amount",
        )}
      >
        {currency(value)}
      </p>
    </div>
  );
}
