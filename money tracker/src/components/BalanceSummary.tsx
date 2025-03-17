import React from "react";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useTransactions } from "../context/TransactionContext";

const BalanceSummary: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance } = useTransactions();

  const balance = getBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  return (
    <div className="row g-4 fade-in">
      <div className="col-12 col-md-4">
        <div className="card h-100 bg-primary text-white position-relative overflow-hidden">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-white-50 fw-medium text-uppercase small mb-1">
                  Balance
                </p>
                <h3 className="fs-4 fw-bold mt-1">{formatCurrency(balance)}</h3>
              </div>
              <div className="rounded-circle bg-white bg-opacity-25 p-2">
                <Wallet size={20} />
              </div>
            </div>

            <div className="mt-4">
              <div
                className="progress bg-white bg-opacity-10"
                style={{ height: "6px" }}
              >
                <div
                  className="progress-bar bg-white"
                  style={{
                    width: `${Math.min(
                      100,
                      income ? (expenses / income) * 100 : 0
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div
            className="position-absolute bg-white bg-opacity-10 rounded-circle"
            style={{
              width: "96px",
              height: "96px",
              bottom: "-20px",
              right: "-20px",
            }}
          ></div>
          <div
            className="position-absolute bg-opacity-5 rounded-circle"
            style={{
              width: "64px",
              height: "64px",
              top: "-20px",
              left: "-20px",
            }}
          ></div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-soft">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-secondary text-uppercase small fw-medium mb-1">
                  Income
                </p>
                <h3 className="fs-4 fw-bold text-primary mt-1">
                  {formatCurrency(income)}
                </h3>
              </div>
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-secondary small">
                {income > 0
                  ? "From salary and other sources"
                  : "No income recorded yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-soft">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-secondary text-uppercase small fw-medium mb-1">
                  Expenses
                </p>
                <h3 className="fs-4 fw-bold text-danger mt-1">
                  {formatCurrency(expenses)}
                </h3>
              </div>
              <div className="rounded-circle bg-danger bg-opacity-10 text-danger p-2">
                <ArrowDownRight size={20} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-secondary small">
                {expenses > 0
                  ? "From all your spending"
                  : "No expenses recorded yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;
