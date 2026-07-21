import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { CATEGORIES } from "@/data/mock";
import { formatDayGroup } from "@/lib/format";
import { TransactionItem } from "./TransactionItem";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/wallet";

type Filter = "all" | "income" | "expense";

export function TransactionsList() {
  const { transactions, privacy } = useWallet();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false;
      if (!q) return true;
      const cat = CATEGORIES[tx.category].label.toLowerCase();
      return cat.includes(q) || (tx.note ?? "").toLowerCase().includes(q);
    });
  }, [transactions, filter, query]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Əməliyyat axtar..."
          className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex gap-2">
        {(
          [
            { id: "all", label: "Hamısı" },
            { id: "income", label: "Gəlirlər" },
            { id: "expense", label: "Xərclər" },
          ] as { id: Filter; label: string }[]
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "min-h-[40px] flex-1 rounded-2xl border px-3 text-sm font-medium transition-colors",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground active:bg-accent",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface/50 py-16 text-center">
          <Inbox className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Əməliyyat tapılmadı</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(([day, items]) => (
            <div key={day}>
              <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {day}
              </h3>
              <div className="rounded-3xl border border-border bg-surface p-2">
                <div className="flex flex-col">
                  {items.map((tx, i) => (
                    <div key={tx.id}>
                      {i > 0 && <div className="mx-3 h-px bg-border/60" />}
                      <TransactionItem tx={tx} blurred={privacy} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function groupByDay(list: Transaction[]): [string, Transaction[]][] {
  const sorted = [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const map = new Map<string, Transaction[]>();
  for (const tx of sorted) {
    const key = formatDayGroup(tx.date);
    const arr = map.get(key) ?? [];
    arr.push(tx);
    map.set(key, arr);
  }
  return Array.from(map.entries());
}
