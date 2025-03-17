import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';

const MonthSelector: React.FC = () => {
  const { 
    selectedMonth, 
    setSelectedMonth, 
    getAllMonthsSummary 
  } = useTransactions();

  const monthSummaries = getAllMonthsSummary();

  const formatMonthDisplay = (monthStr: string) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="card shadow-soft border-0 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Monthly Summary</h5>
          <select
            className="form-select form-select-sm w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthSummaries.map((summary) => (
              <option key={summary.month} value={summary.month}>
                {formatMonthDisplay(summary.month)}
              </option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-primary bg-opacity-10 rounded">
              <div className="text-primary mb-1">Income</div>
              <div className="h5 mb-0">
                {formatCurrency(monthSummaries.find(s => s.month === selectedMonth)?.income || 0)}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-danger bg-opacity-10 rounded">
              <div className="text-danger mb-1">Expenses</div>
              <div className="h5 mb-0">
                {formatCurrency(monthSummaries.find(s => s.month === selectedMonth)?.expenses || 0)}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-success bg-opacity-10 rounded">
              <div className="text-success mb-1">Balance</div>
              <div className="h5 mb-0">
                {formatCurrency(monthSummaries.find(s => s.month === selectedMonth)?.balance || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthSelector; 