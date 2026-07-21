import { Home, ArrowLeftRight, PieChart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "home" | "transactions" | "analytics" | "settings";

interface Props {
  active: TabId;
  onChange: (t: TabId) => void;
  onAdd: () => void;
}

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "home", label: "Ana Səhifə", icon: Home },
  { id: "transactions", label: "Əməliyyatlar", icon: ArrowLeftRight },
  { id: "analytics", label: "Qrafiklər", icon: PieChart },
  { id: "settings", label: "Tənzimləmələr", icon: Settings },
];

export function BottomNav({ active, onChange, onAdd }: Props) {
  // split tabs so FAB sits centered
  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="pointer-events-auto mx-auto mb-3 flex max-w-md items-end justify-between gap-2 px-4">
        <NavCluster tabs={left} active={active} onChange={onChange} />

        <button
          onClick={onAdd}
          aria-label="Sürətli Əlavə Et"
          className="-mt-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] ring-4 ring-background transition-transform active:scale-95"
        >
          <Plus className="h-7 w-7" strokeWidth={2.5} />
        </button>

        <NavCluster tabs={right} active={active} onChange={onChange} />
      </div>
    </div>
  );
}

function NavCluster({
  tabs,
  active,
  onChange,
}: {
  tabs: typeof TABS;
  active: TabId;
  onChange: (t: TabId) => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-around rounded-3xl border border-border bg-surface/90 px-2 py-2 backdrop-blur-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
