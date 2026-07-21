import { useMemo, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { BottomNav, type TabId } from "./BottomNav";
import { BalanceHeader } from "./BalanceHeader";
import { TransactionsList } from "./TransactionsList";
import { TransactionItem } from "./TransactionItem";
import { CategoryChart } from "./CategoryChart";
import { QuickAddSheet } from "./QuickAddSheet";
import { SettingsPanel } from "./SettingsPanel";
import { useWallet } from "@/context/WalletContext";

export function DashboardShell() {
  const [tab, setTab] = useState<TabId>("home");
  const [addOpen, setAddOpen] = useState(false);
  const { transactions, privacy } = useWallet();

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [transactions],
  );

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div
        className="mx-auto flex min-h-dvh max-w-md flex-col"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Header tab={tab} />

        <main className="safe-bottom-nav flex-1 px-4 pb-6">
          <div key={tab} className="animate-fade-in">
            {tab === "home" && (
              <div className="flex flex-col gap-5">
                <BalanceHeader />
                <section>
                  <div className="mb-2 flex items-center justify-between px-1">
                    <h2 className="text-base font-semibold">Son Əməliyyatlar</h2>
                    <button
                      onClick={() => setTab("transactions")}
                      className="text-xs font-medium text-primary"
                    >
                      Hamısını gör
                    </button>
                  </div>
                  <div className="rounded-3xl border border-border bg-surface p-2">
                    {recent.map((tx, i) => (
                      <div key={tx.id}>
                        {i > 0 && <div className="mx-3 h-px bg-border/60" />}
                        <TransactionItem tx={tx} blurred={privacy} />
                      </div>
                    ))}
                  </div>
                </section>
                <PromoCard />
              </div>
            )}

            {tab === "transactions" && <TransactionsList />}
            {tab === "analytics" && <CategoryChart />}
            {tab === "settings" && <SettingsPanel />}
          </div>
        </main>
      </div>

      <BottomNav active={tab} onChange={setTab} onAdd={() => setAddOpen(true)} />
      <QuickAddSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function Header({ tab }: { tab: TabId }) {
  const titles: Record<TabId, string> = {
    home: "My Money Flow",
    transactions: "Əməliyyatlar",
    analytics: "Qrafiklər",
    settings: "Tənzimləmələr",
  };
  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-4">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {tab === "home" ? "Xoş gəldin" : ""}
        </p>
        <h1 className="text-xl font-semibold tracking-tight">{titles[tab]}</h1>
      </div>
      <button
        aria-label="Bildirişlər"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground/80 active:scale-95"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
      </button>
    </header>
  );
}

function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-surface to-chart-2/20 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Ağıllı Büdcələşdirmə</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Bu ay xərclərini kateqoriyalara görə izlə və qənaət
            təkliflərini gör.
          </p>
        </div>
      </div>
    </div>
  );
}
