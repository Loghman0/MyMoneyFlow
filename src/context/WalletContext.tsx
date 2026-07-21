import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Theme, Transaction } from "@/types/wallet";
import { MOCK_TRANSACTIONS } from "@/data/mock";

interface WalletState {
  transactions: Transaction[];
  theme: Theme;
  privacy: boolean;
}

type Action =
  | { type: "ADD"; tx: Transaction }
  | { type: "DELETE"; id: string }
  | { type: "RESET" }
  | { type: "SET_THEME"; theme: Theme }
  | { type: "TOGGLE_PRIVACY" }
  | { type: "HYDRATE"; state: WalletState };

const STORAGE_KEY = "mmf:state:v1";

const initial: WalletState = {
  transactions: MOCK_TRANSACTIONS,
  theme: "dark",
  privacy: false,
};

function reducer(state: WalletState, action: Action): WalletState {
  switch (action.type) {
    case "ADD":
      return { ...state, transactions: [action.tx, ...state.transactions] };
    case "DELETE":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      };
    case "RESET":
      return { ...state, transactions: MOCK_TRANSACTIONS };
    case "SET_THEME":
      return { ...state, theme: action.theme };
    case "TOGGLE_PRIVACY":
      return { ...state, privacy: !state.privacy };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

interface WalletContextValue extends WalletState {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  reset: () => void;
  setTheme: (t: Theme) => void;
  togglePrivacy: () => void;
  totals: {
    balance: number;
    monthIncome: number;
    monthExpense: number;
  };
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WalletState;
        dispatch({ type: "HYDRATE", state: { ...initial, ...parsed } });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  // theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", state.theme === "light");
    root.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const addTransaction = useCallback((tx: Omit<Transaction, "id">) => {
    dispatch({
      type: "ADD",
      tx: { ...tx, id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: "DELETE", id });
  }, []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const setTheme = useCallback(
    (t: Theme) => dispatch({ type: "SET_THEME", theme: t }),
    [],
  );
  const togglePrivacy = useCallback(() => dispatch({ type: "TOGGLE_PRIVACY" }), []);

  const totals = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let income = 0;
    let expense = 0;
    let mIncome = 0;
    let mExpense = 0;
    for (const t of state.transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
      const d = new Date(t.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        if (t.type === "income") mIncome += t.amount;
        else mExpense += t.amount;
      }
    }
    return {
      balance: income - expense,
      monthIncome: mIncome,
      monthExpense: mExpense,
    };
  }, [state.transactions]);

  const value: WalletContextValue = {
    ...state,
    addTransaction,
    deleteTransaction,
    reset,
    setTheme,
    togglePrivacy,
    totals,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
