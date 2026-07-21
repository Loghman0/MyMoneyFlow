import type { LucideIcon } from "lucide-react";

export type TransactionType = "income" | "expense";

export type CategoryId =
  | "salary"
  | "freelance"
  | "gift"
  | "food"
  | "groceries"
  | "transport"
  | "shopping"
  | "subscription"
  | "bills"
  | "health"
  | "entertainment"
  | "other";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  type: TransactionType;
  icon: LucideIcon;
  /** Tailwind hue index from CSS chart vars (1-8) */
  hue: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: CategoryId;
  note?: string;
  /** ISO date string */
  date: string;
}

export type Theme = "dark" | "light";
