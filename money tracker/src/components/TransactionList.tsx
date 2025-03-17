import React, { useState } from "react";
import { Search } from "lucide-react"; // Import Trash2 icon
import TransactionCard from "./TransactionCard";
import { toast } from "sonner";
import { useTransactions } from "../context/TransactionContext";

const TransactionList: React.FC = () => {
  const { transactions, removeTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const handleDelete = (id: string) => {
    removeTransaction(id);
    toast.success("Transaction deleted successfully");
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      // Apply type filter
      if (filter !== "all" && transaction.type !== filter) {
        return false;
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mb-4 animate-slide-in">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fs-4 fw-semibold">Transactions</h2>
        <div className="d-flex gap-2">
          <div className="position-relative">
            <Search
              className="position-absolute"
              style={{
                left: "10px",
                top: "10px",
                width: "16px",
                height: "16px",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="form-control form-control-sm ps-4"
              style={{ width: "180px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "income" | "expense")
            }
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>
      <div className="d-flex flex-column gap-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={() => handleDelete(transaction.id)} // Pass delete handler
            />
          ))
        ) : (
          <div className="text-center py-4 bg-light rounded border border-dashed my-3">
            <p className="text-secondary mb-0">No transactions found</p>
            {searchTerm && (
              <p className="text-muted small mt-1">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
