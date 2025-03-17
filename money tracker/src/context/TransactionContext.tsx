import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Define transaction categories with icons
export const CATEGORIES = {
  FOOD: "Food & Dining",
  SHOPPING: "Shopping",
  HOUSING: "Housing",
  TRANSPORTATION: "Transportation",
  ENTERTAINMENT: "Entertainment",
  HEALTHCARE: "Healthcare",
  PERSONAL: "Personal Care",
  EDUCATION: "Education",
  TRAVEL: "Travel",
  GIFTS: "Gifts & Donations",
  INCOME: "Income",
  OTHER: "Other",
};

// Transaction type definition
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
}

// Monthly Summary type
export interface MonthlySummary {
  month: string; // Format: "YYYY-MM"
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
}

// State interface
interface TransactionState {
  transactions: Transaction[];
  selectedMonth: string; // Format: "YYYY-MM"
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: TransactionState = {
  transactions: [],
  selectedMonth: new Date().toISOString().slice(0, 7), // Current month in YYYY-MM format
  isLoading: false,
  error: null,
};

// Local storage key
const STORAGE_KEY = "money_tracker_transactions";

// Action types
type TransactionAction =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "REMOVE_TRANSACTION"; payload: string }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_SELECTED_MONTH"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Reducer function
const transactionReducer = (
  state: TransactionState,
  action: TransactionAction
): TransactionState => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "REMOVE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };

    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };

    case "SET_SELECTED_MONTH":
      return {
        ...state,
        selectedMonth: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Context type
interface TransactionContextType extends TransactionState {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  setSelectedMonth: (month: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getTransactionsByCategory: () => Record<string, number>;
  getRecentTransactions: (limit?: number) => Transaction[];
  getCurrentMonthTransactions: () => Transaction[];
  getMonthlySummary: (month: string) => MonthlySummary;
  getAllMonthsSummary: () => MonthlySummary[];
}

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// Provider props
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const loadTransactions = () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
          const transactions = JSON.parse(storedData);
          dispatch({ type: "SET_TRANSACTIONS", payload: transactions });
        } else {
          // Start with empty transactions list
          const emptyTransactions: Transaction[] = [];
          dispatch({ type: "SET_TRANSACTIONS", payload: emptyTransactions });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyTransactions));
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to load transactions. Please try again.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadTransactions();
  }, []);

  // Save to localStorage when transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
  }, [state.transactions]);

  // Helper functions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
  };

  const removeTransaction = (id: string) => {
    dispatch({ type: "REMOVE_TRANSACTION", payload: id });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const setSelectedMonth = (month: string) => {
    dispatch({ type: "SET_SELECTED_MONTH", payload: month });
  };

  const getCurrentMonthTransactions = (): Transaction[] => {
    return state.transactions.filter(
      (t) => t.date.slice(0, 7) === state.selectedMonth
    );
  };

  const getTotalIncome = (): number => {
    return getCurrentMonthTransactions()
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return getCurrentMonthTransactions()
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getTransactionsByCategory = (): Record<string, number> => {
    return getCurrentMonthTransactions()
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += t.amount;
        return acc;
      }, {} as Record<string, number>);
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return [...getCurrentMonthTransactions()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getMonthlySummary = (month: string): MonthlySummary => {
    const monthTransactions = state.transactions.filter(
      (t) => t.date.slice(0, 7) === month
    );
    const monthIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const monthExpenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month,
      income: monthIncome,
      expenses: monthExpenses,
      balance: monthIncome - monthExpenses,
      transactions: monthTransactions,
    };
  };

  const getAllMonthsSummary = (): MonthlySummary[] => {
    const months = new Set(
      state.transactions.map((t) => t.date.slice(0, 7))
    );
    return Array.from(months)
      .map((month) => getMonthlySummary(month))
      .sort((a, b) => b.month.localeCompare(a.month));
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        addTransaction,
        removeTransaction,
        updateTransaction,
        setSelectedMonth,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getTransactionsByCategory,
        getRecentTransactions,
        getCurrentMonthTransactions,
        getMonthlySummary,
        getAllMonthsSummary,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
