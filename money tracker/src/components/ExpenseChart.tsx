import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTransactions } from "../context/TransactionContext";
import { formatCurrency } from "../utils/formatters";

const COLORS = [
  "#3B82F6", // primary
  "#14B8A6", // teal
  "#F97316", // orange
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#EAB308", // yellow
  "#6366F1", // indigo
  "#ef4444", // red
  "#84cc16", // lime
  "#64748b", // slate
];

const ExpenseChart: React.FC = () => {
  const { getTransactionsByCategory, getTotalExpenses } = useTransactions();

  const totalExpenses = getTotalExpenses();
  const expensesByCategory = getTransactionsByCategory();

  // Transform data for the chart
  const chartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({
      name,
      value,
      percentage:
        totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : "0",
    }))
    .sort((a, b) => b.value - a.value); // Sort by value in descending order

  const hasData = chartData.length > 0;

  return (
    <div className="card h-100 shadow-sm border-light mb-4 animate-slide-in">
      <div className="card-header bg-white border-bottom-0 pb-1">
        <h5 className="card-title fs-5 mb-0">Expense Breakdown</h5>
        <p className="card-text text-muted small">
          {hasData
            ? "Where your money is going"
            : "No expense data to display yet"}
        </p>
      </div>
      <div className="card-body pt-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: "0.5rem",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                }}
              />
              <Legend
                formatter={(value: any) => value}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="h-100 d-flex align-items-center justify-content-center bg-light rounded border border-dashed"
            style={{ height: "240px" }}
          >
            <p className="text-secondary small mb-0">
              Add some expenses to see your breakdown
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;
