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

// State interface
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type TransactionAction =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "REMOVE_TRANSACTION"; payload: string }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Initial state
const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
};

// Local storage key
const STORAGE_KEY = "money_tracker_transactions";

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

// Create context
interface TransactionContextType extends TransactionState {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getTransactionsByCategory: () => Record<string, number>;
  getRecentTransactions: (limit?: number) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// Provider component
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
          // Sample data for first-time users
          const sampleTransactions: Transaction[] = [
            {
              id: "1",
              amount: 2500,
              description: "Monthly Salary",
              category: CATEGORIES.INCOME,
              date: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              type: "income",
            },
            {
              id: "2",
              amount: 45.8,
              description: "Grocery Store",
              category: CATEGORIES.FOOD,
              date: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
              type: "expense",
            },
            {
              id: "3",
              amount: 850,
              description: "Rent Payment",
              category: CATEGORIES.HOUSING,
              date: new Date().toISOString(),
              type: "expense",
            },
            {
              id: "4",
              amount: 120,
              description: "Internet Bill",
              category: CATEGORIES.HOUSING,
              date: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              type: "expense",
            },
            {
              id: "5",
              amount: 35.5,
              description: "Restaurant Dinner",
              category: CATEGORIES.FOOD,
              date: new Date(
                Date.now() - 4 * 24 * 60 * 60 * 1000
              ).toISOString(),
              type: "expense",
            },
          ];
          dispatch({ type: "SET_TRANSACTIONS", payload: sampleTransactions });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTransactions));
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
      id: crypto.randomUUID(), // Generate unique ID
    };

    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
  };

  const removeTransaction = (id: string) => {
    dispatch({ type: "REMOVE_TRANSACTION", payload: id });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const getTotalIncome = (): number => {
    return state.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getTransactionsByCategory = (): Record<string, number> => {
    return state.transactions
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
    return [...state.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        addTransaction,
        removeTransaction,
        updateTransaction,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getTransactionsByCategory,
        getRecentTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
