import { useCallback, useEffect, useState } from "react";

export type TransactionType = "deposit" | "withdraw" | "win" | "loss";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  timestamp: number;
  description?: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
}

const STORAGE_KEY = "gamewallet_state";
const INITIAL_BALANCE = 1000;

function loadState(): WalletState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WalletState;
      if (
        typeof parsed.balance === "number" &&
        Array.isArray(parsed.transactions)
      ) {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors
  }
  return { balance: INITIAL_BALANCE, transactions: [] };
}

function saveState(state: WalletState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Optimistic local deposit — caller should also call backend
  const depositLocal = useCallback((amount: number): boolean => {
    if (amount <= 0) return false;
    setState((prev) => {
      const newBalance = prev.balance + amount;
      const tx: Transaction = {
        id: makeId(),
        type: "deposit",
        amount,
        balanceAfter: newBalance,
        timestamp: Date.now(),
        description: `Deposited ${amount} credits`,
      };
      return {
        balance: newBalance,
        transactions: [tx, ...prev.transactions],
      };
    });
    return true;
  }, []);

  // Optimistic local withdraw — caller should also call backend
  const withdrawLocal = useCallback(
    (amount: number): { success: boolean; error?: string } => {
      if (amount <= 0)
        return { success: false, error: "Amount must be positive" };
      let result: { success: boolean; error?: string } = {
        success: false,
        error: "",
      };
      setState((prev) => {
        if (amount > prev.balance) {
          result = { success: false, error: "Insufficient funds" };
          return prev;
        }
        const newBalance = prev.balance - amount;
        const tx: Transaction = {
          id: makeId(),
          type: "withdraw",
          amount,
          balanceAfter: newBalance,
          timestamp: Date.now(),
          description: `Withdrew ${amount} credits`,
        };
        result = { success: true, error: undefined };
        return {
          balance: newBalance,
          transactions: [tx, ...prev.transactions],
        };
      });
      return result;
    },
    [],
  );

  // Reconcile balance after backend confirms (overwrite local)
  const reconcileBalance = useCallback((confirmedBalance: number) => {
    setState((prev) => ({ ...prev, balance: confirmedBalance }));
  }, []);

  const placeBet = useCallback(
    (
      bet: number,
      choice: "heads" | "tails",
    ): { result: "heads" | "tails"; won: boolean; newBalance: number } => {
      const flip: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
      const won = flip === choice;

      setState((prev) => {
        const change = bet;
        const newBalance = won ? prev.balance + bet : prev.balance - bet;
        const tx: Transaction = {
          id: makeId(),
          type: won ? "win" : "loss",
          amount: change,
          balanceAfter: Math.max(0, newBalance),
          timestamp: Date.now(),
          description: `Coin flip – picked ${choice}, got ${flip}. ${won ? "Won" : "Lost"} ${bet} credits`,
        };
        return {
          balance: Math.max(0, newBalance),
          transactions: [tx, ...prev.transactions],
        };
      });

      return {
        result: flip,
        won,
        newBalance: won
          ? state.balance + bet
          : Math.max(0, state.balance - bet),
      };
    },
    [state.balance],
  );

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, transactions: [] }));
  }, []);

  const resetWallet = useCallback(() => {
    setState({ balance: INITIAL_BALANCE, transactions: [] });
  }, []);

  const stats = {
    totalDeposited: state.transactions
      .filter((t) => t.type === "deposit")
      .reduce((s, t) => s + t.amount, 0),
    totalWithdrawn: state.transactions
      .filter((t) => t.type === "withdraw")
      .reduce((s, t) => s + t.amount, 0),
    totalWon: state.transactions
      .filter((t) => t.type === "win")
      .reduce((s, t) => s + t.amount, 0),
    totalLost: state.transactions
      .filter((t) => t.type === "loss")
      .reduce((s, t) => s + t.amount, 0),
    gamesPlayed: state.transactions.filter(
      (t) => t.type === "win" || t.type === "loss",
    ).length,
    wins: state.transactions.filter((t) => t.type === "win").length,
    losses: state.transactions.filter((t) => t.type === "loss").length,
  };

  return {
    balance: state.balance,
    transactions: state.transactions,
    deposit: depositLocal,
    withdraw: withdrawLocal,
    reconcileBalance,
    placeBet,
    clearHistory,
    resetWallet,
    stats,
  };
}
