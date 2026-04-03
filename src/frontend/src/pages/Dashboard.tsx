import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/AppContext";
import {
  useGetAccounts,
  useGetBudgets,
  useGetStandingOrders,
  useGetTransactions,
  useGetUserProfile,
} from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  bigintBalance,
  formatCurrency,
  formatDateShort,
  getCategoryColor,
  getGreeting,
} from "@/utils/format";
import {
  Calendar,
  DollarSign,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { AccountType, TransactionType } from "../backend.d";

function CardShell({
  title,
  children,
  className,
}: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("card-elevated p-4 flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      {children}
    </div>
  );
}

export function DashboardPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: accounts = [], isLoading: loadingAccounts } = useGetAccounts();
  const { data: transactions = [], isLoading: loadingTx } =
    useGetTransactions();
  const { data: budgets = [] } = useGetBudgets();
  const { data: standingOrders = [] } = useGetStandingOrders();
  const { data: profile } = useGetUserProfile();

  const name = profile?.name ?? "Sarah Jenkins";
  const firstName = name.split(" ")[0];
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Net worth
  const netWorth = accounts.reduce(
    (sum, a) => sum + bigintBalance(a.balance),
    0,
  );
  const assets = accounts
    .filter((a) => a.balance > 0n)
    .reduce((sum, a) => sum + bigintBalance(a.balance), 0);
  const liabilities = accounts
    .filter((a) => a.balance < 0n)
    .reduce((sum, a) => sum + Math.abs(bigintBalance(a.balance)), 0);

  // Spending breakdown
  const expenses = transactions.filter(
    (t) => t.transactionType === TransactionType.expense,
  );
  const spendingByCategory = expenses.reduce<Record<string, number>>(
    (acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    },
    {},
  );
  const spendingChartData = Object.entries(spendingByCategory)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);

  // Recent transactions
  const recentTx = [...transactions]
    .sort((a, b) => Number(b.date) - Number(a.date))
    .slice(0, 8);

  // Bill calendar - upcoming recurring
  const upcomingBills = standingOrders
    .filter((so) => Number(so.nextPaymentDate) > Date.now())
    .sort((a, b) => Number(a.nextPaymentDate) - Number(b.nextPaymentDate))
    .slice(0, 6);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          Dashboard Overview
        </p>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </motion.div>

      {/* Row 1: Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {/* Net Worth */}
        {loadingAccounts ? (
          <Skeleton className="h-28 rounded-xl" />
        ) : (
          <div
            className="card-elevated p-4 flex flex-col gap-2"
            data-ocid="dashboard.net_worth.card"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Net Worth
              </span>
              <DollarSign size={14} className="text-primary" />
            </div>
            <div
              className={cn(
                "text-3xl font-display font-bold tabular-nums",
                demoMode ? "demo-mask" : "text-foreground",
              )}
            >
              {maskValue(formatCurrency(netWorth))}
            </div>
            <div className="flex gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Assets </span>
                <span
                  className={cn(
                    "font-medium text-success",
                    demoMode ? "demo-mask" : "",
                  )}
                >
                  {maskValue(formatCurrency(assets, "USD", true))}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Debts </span>
                <span
                  className={cn(
                    "font-medium text-destructive",
                    demoMode ? "demo-mask" : "",
                  )}
                >
                  {maskValue(formatCurrency(liabilities, "USD", true))}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp size={12} />
              <span>+3.2% vs last month</span>
            </div>
          </div>
        )}

        {/* Spending Breakdown donut */}
        <CardShell title="Spending Breakdown" className="sm:col-span-1">
          {spendingChartData.length === 0 ? (
            <div
              className="flex items-center justify-center h-32 text-muted-foreground text-sm"
              data-ocid="dashboard.spending.empty_state"
            >
              No data
            </div>
          ) : (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spendingChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={getCategoryColor(entry.name)}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      background: "oklch(0.14 0.005 240)",
                      border: "1px solid oklch(0.22 0.008 240)",
                      borderRadius: "8px",
                      color: "oklch(0.965 0 0)",
                      fontSize: "12px",
                    }}
                    formatter={(val: number) => [
                      demoMode ? "••••" : formatCurrency(val),
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="space-y-1.5">
            {spendingChartData.slice(0, 4).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: getCategoryColor(item.name) }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span
                  className={cn(
                    "font-medium tabular-nums text-foreground",
                    demoMode ? "demo-mask" : "",
                  )}
                >
                  {maskValue(formatCurrency(item.value))}
                </span>
              </div>
            ))}
          </div>
        </CardShell>

        {/* Categories with progress bars */}
        <CardShell title="Categories" className="hidden xl:flex">
          <div className="space-y-3 flex-1">
            {budgets.slice(0, 5).map((b) => {
              const pct = Math.min((b.actual / b.plan) * 100, 100);
              const overBudget = b.actual > b.plan;
              return (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{b.category}</span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        overBudget ? "text-destructive" : "text-foreground",
                        demoMode ? "demo-mask" : "",
                      )}
                    >
                      {maskValue(formatCurrency(b.actual))}
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: overBudget
                          ? "oklch(0.63 0.22 27)"
                          : getCategoryColor(b.category),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardShell>
      </motion.div>

      {/* Row 2 */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Recent Transactions */}
        <CardShell title="Recent Transactions" className="lg:col-span-1">
          {loadingTx ? (
            <div className="space-y-2">
              {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
                <Skeleton key={k} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2" data-ocid="dashboard.transactions.list">
              {recentTx.map((tx, i) => (
                <div
                  key={`tx-${String(tx.date)}-${i}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  data-ocid={`dashboard.transactions.item.${i + 1}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `${getCategoryColor(tx.category)}30`,
                      color: getCategoryColor(tx.category),
                    }}
                  >
                    {tx.category.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {tx.note || tx.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateShort(tx.date)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums shrink-0",
                      tx.transactionType === TransactionType.income
                        ? "text-success"
                        : "text-destructive",
                      demoMode ? "demo-mask" : "",
                    )}
                  >
                    {tx.transactionType === TransactionType.income ? "+" : "-"}
                    {maskValue(formatCurrency(tx.amount))}
                  </span>
                </div>
              ))}
              {recentTx.length === 0 && (
                <p
                  className="text-sm text-muted-foreground text-center py-4"
                  data-ocid="dashboard.transactions.empty_state"
                >
                  No transactions yet
                </p>
              )}
            </div>
          )}
        </CardShell>

        {/* Budget Progress */}
        <CardShell title="Budget Progress" className="lg:col-span-1">
          <div className="space-y-4">
            {budgets.slice(0, 5).map((b) => {
              const pct = Math.min((b.actual / b.plan) * 100, 100);
              const overBudget = b.actual > b.plan;
              return (
                <div
                  key={b.name}
                  data-ocid={`dashboard.budget.item.${budgets.indexOf(b) + 1}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">
                      {b.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        demoMode
                          ? "demo-mask"
                          : overBudget
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    >
                      {maskValue(formatCurrency(b.actual))} /{" "}
                      {maskValue(formatCurrency(b.plan))}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: overBudget
                          ? "oklch(0.63 0.22 27)"
                          : getCategoryColor(b.category),
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pct)}% used
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        demoMode
                          ? "demo-mask"
                          : overBudget
                            ? "text-destructive"
                            : "text-success",
                      )}
                    >
                      {overBudget
                        ? `-${maskValue(formatCurrency(b.actual - b.plan))} over`
                        : `${maskValue(formatCurrency(b.plan - b.actual))} left`}
                    </span>
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && (
              <p
                className="text-sm text-muted-foreground text-center py-4"
                data-ocid="dashboard.budget.empty_state"
              >
                No budgets set
              </p>
            )}
          </div>
        </CardShell>

        {/* Bill Calendar */}
        <CardShell title="Upcoming Bills" className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </span>
          </div>
          <div className="space-y-2">
            {upcomingBills.map((bill, i) => (
              <div
                key={bill.internalId}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/40"
                data-ocid={`dashboard.bills.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {new Date(Number(bill.nextPaymentDate)).getDate()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {bill.to.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {bill.frequency}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold text-destructive tabular-nums",
                    demoMode ? "demo-mask" : "",
                  )}
                >
                  -{maskValue(formatCurrency(bill.amount))}
                </span>
              </div>
            ))}
            {upcomingBills.length === 0 && (
              <div data-ocid="dashboard.bills.empty_state">
                {/* Static upcoming bills */}
                {[
                  { name: "Netflix", amount: 15.99, day: 12, freq: "monthly" },
                  {
                    name: "Electricity",
                    amount: 142.0,
                    day: 15,
                    freq: "monthly",
                  },
                  {
                    name: "Gym Membership",
                    amount: 49.0,
                    day: 20,
                    freq: "monthly",
                  },
                  { name: "Spotify", amount: 9.99, day: 22, freq: "monthly" },
                ].map((bill, i) => (
                  <div
                    key={bill.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/40"
                    data-ocid={`dashboard.bills.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {bill.day}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {bill.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {bill.freq}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold text-destructive tabular-nums",
                        demoMode ? "demo-mask" : "",
                      )}
                    >
                      -{maskValue(formatCurrency(bill.amount))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardShell>
      </motion.div>
    </div>
  );
}
