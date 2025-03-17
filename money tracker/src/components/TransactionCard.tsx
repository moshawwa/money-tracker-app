import React from "react";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import { formatCurrency, getRelativeTime } from "../utils/formatters";
import { Transaction } from "../context/TransactionContext";
import { toast } from "sonner";

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onDelete,
}) => {
  const { id, amount, description, category, date, type } = transaction;

  const handleDelete = () => {
    toast.error("Delete Transaction", {
      description: "Are you sure you want to delete this transaction?",
      action: {
        label: "Delete",
        onClick: () => {
          onDelete(id);
          toast.success("Transaction deleted successfully");
        },
      },
    });
  };

  return (
    <div className="card mb-3 shadow-soft border-0 fade-in">
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-start gap-3">
            <div
              className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${
                type === "income"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "bg-danger bg-opacity-10 text-danger"
              }`}
            >
              {type === "income" ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}
            </div>

            <div>
              <h5 className="fw-medium text-dark mb-1 text-truncate">
                {description}
              </h5>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="badge bg-light text-dark">{category}</span>
                <small className="text-secondary">
                  {getRelativeTime(date)}
                </small>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-end">
            <span
              className={`fw-semibold ${
                type === "income" ? "text-primary" : "text-danger"
              }`}
            >
              {type === "income" ? "+" : "-"}
              {formatCurrency(amount)}
            </span>

            <button
              className="btn btn-sm btn-link text-danger p-0 mt-1 delete-btn"
              onClick={handleDelete}
              style={{ opacity: 0.6 }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
