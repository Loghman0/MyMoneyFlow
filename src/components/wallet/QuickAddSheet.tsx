import { useEffect, useState } from "react";
import { X, ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import {
  CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/data/mock";
import type { CategoryId, TransactionType } from "@/types/wallet";
import { useWallet } from "@/context/WalletContext";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QuickAddSheet({ open, onClose }: Props) {
  const { addTransaction } = useWallet();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  // reset when opening
  useEffect(() => {
    if (open) {
      setType("expense");
      setAmount("");
      setCategory("food");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [open]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const cats = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (next: TransactionType) => {
    setType(next);
    const fallback = next === "income" ? "salary" : "food";
    if (CATEGORIES[category].type !== next) setCategory(fallback);
  };

  const parsedAmount = parseFloat(amount || "0");
  const isValid = !isNaN(parsedAmount) && parsedAmount > 0;

  const submit = () => {
    if (!isValid) return;
    addTransaction({
      type,
      amount: parsedAmount,
      category,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Bağla"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 animate-fade-in"
      />
      <div
        className="relative animate-sheet-in rounded-t-[28px] border-t border-border bg-surface text-surface-foreground shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex flex-col gap-5 px-5 pb-5 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sürətli Əlavə Et</h2>
            <button
              onClick={onClose}
              aria-label="Bağla"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background/40 p-1">
            <ToggleButton
              active={type === "expense"}
              onClick={() => handleTypeChange("expense")}
              tone="expense"
              icon={<ArrowUpRight className="h-4 w-4" />}
              label="Xərc"
            />
            <ToggleButton
              active={type === "income"}
              onClick={() => handleTypeChange("income")}
              tone="income"
              icon={<ArrowDownLeft className="h-4 w-4" />}
              label="Gəlir"
            />
          </div>

          {/* amount */}
          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Məbləğ
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-light text-muted-foreground">₼</span>
              <input
                value={amount}
                onChange={(e) => {
                  let val = e.target.value.replace(/,/g, ".");
                  const parts = val.split(".");
                  if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
                  val = val.replace(/[^0-9.]/g, "");
                  if (val.startsWith(".")) val = "0" + val;
                  setAmount(val);
                }}
                inputMode="decimal"
                placeholder="0,00"
                className="tabular w-full bg-transparent text-4xl font-semibold tracking-tight placeholder:text-muted-foreground/40 focus:outline-none"
              />
            </div>
          </div>

          {/* category */}
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Kateqoriya
            </p>
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
              {cats.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background/40 text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* date + note */}
          <div className="grid grid-cols-1 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Tarix
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-2xl border border-border bg-background/40 px-3 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Qeyd (opsional)
              </span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="məs. Market bazarlığı"
                className="h-11 rounded-2xl border border-border bg-background/40 px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <button
            onClick={submit}
            disabled={!isValid}
            className={cn(
              "mt-1 flex min-h-[52px] items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all active:scale-[0.98]",
              isValid
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Check className="h-5 w-5" />
            {type === "income" ? "Gəlir Əlavə Et" : "Xərc Əlavə Et"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  tone,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  tone: "income" | "expense";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all",
        active
          ? tone === "income"
            ? "bg-success/20 text-success"
            : "bg-destructive/20 text-destructive"
          : "text-muted-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
