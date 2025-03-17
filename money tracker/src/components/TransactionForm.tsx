import React, { useState } from "react";

import CategorySelector from "./CategorySelector";

import { toast } from "sonner";
import { CATEGORIES, useTransactions } from "../context/TransactionContext";

interface TransactionFormProps {
  onClose: () => void;
  className?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose,
  className,
}) => {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    type === "income" ? CATEGORIES.INCOME : CATEGORIES.FOOD
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType);
    // Update category when switching between income and expense
    if (newType === "income") {
      setCategory(CATEGORIES.INCOME);
    } else if (category === CATEGORIES.INCOME) {
      setCategory(CATEGORIES.FOOD);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      addTransaction({
        description: description.trim(),
        amount: Number(amount),
        category,
        date: new Date().toISOString(),
        type,
      });

      toast.success("Transaction added successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to add transaction");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded shadow-medium border ${className}`}>
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <h5 className="m-0">Add Transaction</h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <form onSubmit={handleSubmit} className="p-3">
        <ul className="nav nav-pills nav-fill mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${
                type === "expense" ? "active bg-danger" : ""
              }`}
              onClick={() => handleTypeChange("expense")}
            >
              Expense
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${
                type === "income" ? "active bg-primary" : ""
              }`}
              onClick={() => handleTypeChange("income")}
            >
              Income
            </button>
          </li>
        </ul>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            id="description"
            className="form-control"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn ${
              type === "income" ? "btn-primary" : "btn-danger"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
