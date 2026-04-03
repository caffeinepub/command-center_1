import { useAppContext } from "@/contexts/AppContext";
import { useGetAccounts, useGetTransactions } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  bigintBalance,
  formatCurrency,
  getCategoryColor,
} from "@/utils/format";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { TransactionType } from "../backend.d";

// Mock 12-month net worth history
const NET_WORTH_DATA = [
  { month: "May", value: 118200 },
  { month: "Jun", value: 121500 },
  { month: "Jul", value: 119800 },
  { month: "Aug", value: 124300 },
  { month: "Sep", value: 127600 },
  { month: "Oct", value: 130200 },
  { month: "Nov", value: 128900 },
  { month: "Dec", value: 134500 },
  { month: "Jan", value: 138200 },
  { month: "Feb", value: 141800 },
  { month: "Mar", value: 145300 },
  { month: "Apr", value: 148250 },
];

const MONTHLY_SPENDING = [
  {
    month: "Jan",
    Housing: 2500,
    Groceries: 580,
    Dining: 230,
    Entertainment: 95,
    Transport: 180,
  },
  {
    month: "Feb",
    Housing: 2500,
    Groceries: 610,
    Dining: 195,
    Entertainment: 120,
    Transport: 145,
  },
  {
    month: "Mar",
    Housing: 2500,
    Groceries: 545,
    Dining: 280,
    Entertainment: 85,
    Transport: 215,
  },
  {
    month: "Apr",
    Housing: 2500,
    Groceries: 590,
    Dining: 89,
    Entertainment: 26,
    Transport: 34,
  },
];

const CASHFLOW = [
  { label: "Total Income", value: 6850, type: "income" },
  { label: "Housing", value: -2500, type: "expense", parent: "income" },
  { label: "Food & Dining", value: -318, type: "expense", parent: "income" },
  { label: "Transport", value: -34, type: "expense", parent: "income" },
  { label: "Entertainment", value: -26, type: "expense", parent: "income" },
  { label: "Savings", value: 3972, type: "savings", parent: "income" },
];

const CHART_STYLE = {
  background: "oklch(0.14 0.005 240)",
  border: "1px solid oklch(0.22 0.008 240)",
  borderRadius: "8px",
  color: "oklch(0.965 0 0)",
  fontSize: "12px",
};

export function ReportsPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: transactions = [] } = useGetTransactions();
  const { data: accounts = [] } = useGetAccounts();

  const totalIncome = transactions
    .filter((t) => t.transactionType === TransactionType.income)
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.transactionType === TransactionType.expense)
    .reduce((s, t) => s + t.amount, 0);
  const netCashflow = totalIncome - totalExpenses;
  const currentNetWorth = accounts.reduce(
    (s, a) => s + bigintBalance(a.balance),
    0,
  );

  const SPENDING_CATEGORIES = [
    "Housing",
    "Groceries",
    "Dining",
    "Entertainment",
    "Transport",
  ];
  const SPENDING_COLORS = [
    "#21D19B",
    "#F59E0B",
    "#A855F7",
    "#F43F5E",
    "#3B82F6",
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          Analytics
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Reports
        </h1>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Net Worth",
            value: currentNetWorth > 0 ? currentNetWorth : 148250,
            color: "text-foreground",
          },
          {
            label: "Monthly Income",
            value: totalIncome > 0 ? totalIncome : 6850,
            color: "text-success",
          },
          {
            label: "Monthly Expenses",
            value: totalExpenses > 0 ? totalExpenses : 3378,
            color: "text-destructive",
          },
          {
            label: "Net Cash Flow",
            value: netCashflow !== 0 ? netCashflow : 3472,
            color: netCashflow >= 0 ? "text-success" : "text-destructive",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card-elevated p-4"
            data-ocid={`reports.stat.item.${i + 1}`}
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p
              className={cn(
                "text-xl font-display font-bold tabular-nums mt-1",
                stat.color,
                demoMode ? "demo-mask" : "",
              )}
            >
              {maskValue(formatCurrency(stat.value, "USD", true))}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Net Worth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Net Worth — 12 Month History
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={NET_WORTH_DATA}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.008 240)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "oklch(0.68 0.01 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.68 0.01 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  demoMode ? "••••" : `$${(v / 1000).toFixed(0)}k`
                }
              />
              <RechartsTooltip
                contentStyle={CHART_STYLE}
                formatter={(val: number) => [
                  demoMode ? "••••" : formatCurrency(val),
                  "Net Worth",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#21D19B"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#21D19B" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Monthly Spending Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Monthly Spending by Category
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MONTHLY_SPENDING}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.008 240)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "oklch(0.68 0.01 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.68 0.01 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (demoMode ? "••" : `$${v}`)}
              />
              <RechartsTooltip
                contentStyle={CHART_STYLE}
                formatter={(val: number, name: string) => [
                  demoMode ? "••••" : formatCurrency(val),
                  name,
                ]}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "11px",
                  color: "oklch(0.68 0.01 240)",
                }}
              />
              {SPENDING_CATEGORIES.map((cat, i) => (
                <Bar
                  key={cat}
                  dataKey={cat}
                  stackId="a"
                  fill={SPENDING_COLORS[i]}
                  radius={
                    i === SPENDING_CATEGORIES.length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cash Flow (text-based Sankey) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated p-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Cash Flow Summary
        </h3>
        <div className="space-y-3">
          {CASHFLOW.map((item) => {
            const isIncome = item.type === "income";
            const isSavings = item.type === "savings";
            const maxVal = 6850;
            const pct = Math.abs(item.value / maxVal) * 100;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-28 text-right shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <div className="flex-1 h-7 bg-secondary/50 rounded overflow-hidden relative">
                  <div
                    className="h-full rounded transition-all duration-700 flex items-center"
                    style={{
                      width: `${pct}%`,
                      background: isIncome
                        ? "#21D19B"
                        : isSavings
                          ? "#6366F1"
                          : getCategoryColor(item.label.split(" & ")[0]),
                    }}
                  />
                </div>
                <div className="w-24 shrink-0">
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums",
                      isIncome
                        ? "text-success"
                        : isSavings
                          ? "text-chart-3"
                          : "text-destructive",
                      demoMode ? "demo-mask" : "",
                    )}
                  >
                    {isIncome ? "+" : ""}
                    {maskValue(formatCurrency(item.value))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
