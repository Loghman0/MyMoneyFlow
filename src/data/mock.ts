import {
  Briefcase,
  Laptop,
  Gift,
  UtensilsCrossed,
  ShoppingBasket,
  Car,
  ShoppingBag,
  Repeat,
  ReceiptText,
  HeartPulse,
  Clapperboard,
  Wallet,
} from "lucide-react";
import type { CategoryMeta, Transaction } from "@/types/wallet";

export const CATEGORIES: Record<string, CategoryMeta> = {
  salary: { id: "salary", label: "Maaş", type: "income", icon: Briefcase, hue: 1 },
  freelance: { id: "freelance", label: "Freelance", type: "income", icon: Laptop, hue: 2 },
  gift: { id: "gift", label: "Hədiyyə", type: "income", icon: Gift, hue: 5 },
  food: { id: "food", label: "Qida", type: "expense", icon: UtensilsCrossed, hue: 4 },
  groceries: { id: "groceries", label: "Market", type: "expense", icon: ShoppingBasket, hue: 3 },
  transport: { id: "transport", label: "Nəqliyyat", type: "expense", icon: Car, hue: 6 },
  shopping: { id: "shopping", label: "Alış-veriş", type: "expense", icon: ShoppingBag, hue: 5 },
  subscription: { id: "subscription", label: "Abunəlik", type: "expense", icon: Repeat, hue: 2 },
  bills: { id: "bills", label: "Kommunal", type: "expense", icon: ReceiptText, hue: 7 },
  health: { id: "health", label: "Sağlamlıq", type: "expense", icon: HeartPulse, hue: 8 },
  entertainment: { id: "entertainment", label: "Əyləncə", type: "expense", icon: Clapperboard, hue: 5 },
  other: { id: "other", label: "Digər", type: "expense", icon: Wallet, hue: 6 },
};

export const INCOME_CATEGORIES = Object.values(CATEGORIES).filter(
  (c) => c.type === "income",
);
export const EXPENSE_CATEGORIES = Object.values(CATEGORIES).filter(
  (c) => c.type === "expense",
);

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

let _id = 0;
const t = (
  type: Transaction["type"],
  amount: number,
  category: Transaction["category"],
  daysBack: number,
  note?: string,
): Transaction => ({
  id: `seed-${++_id}`,
  type,
  amount,
  category,
  note,
  date: daysAgo(daysBack),
});

export const MOCK_TRANSACTIONS: Transaction[] = [
  t("income", 48500, "salary", 2, "Noyabr maaşı"),
  t("income", 7200, "freelance", 5, "Loqo dizaynı"),
  t("income", 1500, "gift", 12, "Ad günü"),
  t("expense", 412.5, "groceries", 0, "Bazarstore"),
  t("expense", 185, "food", 1, "Şam yeməyi"),
  t("expense", 64.75, "transport", 1, "Taksi"),
  t("expense", 59.99, "subscription", 3, "Spotify"),
  t("expense", 229, "subscription", 4, "Netflix Premium"),
  t("expense", 1240, "shopping", 6, "Yeni ayaqqabı"),
  t("expense", 320, "food", 7, "Brunch"),
  t("expense", 28.5, "transport", 8, "BakıKart"),
  t("expense", 1875, "bills", 9, "İşıq + Qaz"),
  t("expense", 540, "health", 11, "Aptek"),
  t("expense", 760, "entertainment", 14, "Konsert bileti"),
  t("expense", 92, "food", 15, "Qəhvə"),
  t("expense", 2150, "groceries", 18, "Həftəlik market"),
  t("expense", 145, "transport", 22, "Bolt"),
];
