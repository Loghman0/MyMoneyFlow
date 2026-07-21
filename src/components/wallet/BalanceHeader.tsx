import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BalanceHeader() {
  const { totals, privacy, togglePrivacy } = useWallet();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-accent p-6 shadow-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-chart-2/20 blur-3xl"
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Ümumi Balans
          </p>
          <div className="mt-2 flex items-end gap-3">
            <h1
              className={cn(
                "tabular text-4xl font-semibold tracking-tight transition-[filter] duration-300",
                privacy && "blur-amount",
              )}
            >
              {currency(totals.balance)}
            </h1>
          </div>
        </div>

        <button
          onClick={togglePrivacy}
          aria-label={privacy ? "Balansı göstər" : "Balansı gizlə"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/40 text-foreground/80 backdrop-blur transition-colors hover:text-foreground active:scale-95"
        >
          {privacy ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <StatCard
          label="Bu Ay Gəlir"
          value={totals.monthIncome}
          tone="income"
          blurred={privacy}
        />
        <StatCard
          label="Bu Ay Xərc"
          value={totals.monthExpense}
          tone="expense"
          blurred={privacy}
        />
      </div>
    </section>
  );
}

function StatCard({
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
  const isIncome = tone === "income";
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            isIncome
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive",
          )}
        >
          {isIncome ? (
            <ArrowDownLeft className="h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "tabular mt-2 text-lg font-semibold transition-[filter] duration-300",
          blurred && "blur-amount",
        )}
      >
        {currency(value)}
      </p>
    </div>
  );
}
