import { Moon, Sun, EyeOff, RotateCcw, ShieldCheck, Info } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { theme, setTheme, privacy, togglePrivacy, reset } = useWallet();

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-3xl border border-border bg-surface p-4">
        <h3 className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Görünüş
        </h3>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background/40 p-1">
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-medium",
              theme === "dark"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            <Moon className="h-4 w-4" /> Qaranlıq
          </button>
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-medium",
              theme === "light"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            <Sun className="h-4 w-4" /> Aydınlıq
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-2">
        <Row
          icon={<EyeOff className="h-5 w-5" />}
          title="Gizlilik Rejimi"
          subtitle="Balans və məbləğləri bulanıq göstər"
          right={
            <Switch checked={privacy} onChange={togglePrivacy} />
          }
        />
        <div className="mx-3 h-px bg-border/60" />
        <Row
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Məlumatlarınız cihazınızdadır"
          subtitle="Bütün əməliyyatlar yalnız yerli olaraq saxlanılır"
        />
      </section>

      <section className="rounded-3xl border border-border bg-surface p-2">
        <button
          onClick={() => {
            if (confirm("Bütün əməliyyatlar sınaq məlumatlarına sıfırlanacaq. Əminsiniz?"))
              reset();
          }}
          className="flex min-h-[56px] w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-destructive active:bg-accent"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Məlumatları Sıfırla</p>
            <p className="text-xs text-muted-foreground">
              Nümunə əməliyyat setinə geri dön
            </p>
          </div>
        </button>
      </section>

      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        My Money Flow · v1.0
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[56px] items-center gap-3 rounded-2xl px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
