import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/AppContext";
import { useGetAccounts } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  bigintBalance,
  formatCurrency,
  getAccountTypeLabel,
} from "@/utils/format";
import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { AccountType } from "../backend.d";

const MOCK_HOLDINGS = [
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: 42,
    price: 238.5,
    value: 10017.0,
    change: 1.24,
  },
  {
    symbol: "VXUS",
    name: "Vanguard Total Intl Stock ETF",
    shares: 30,
    price: 60.5,
    value: 1815.0,
    change: -0.43,
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    shares: 15,
    price: 74.8,
    value: 1122.0,
    change: 0.12,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    shares: 5,
    price: 875.25,
    value: 4376.25,
    change: 3.85,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 10,
    price: 189.9,
    value: 1899.0,
    change: -0.28,
  },
];

const ALLOCATION_COLORS = [
  "#21D19B",
  "#F59E0B",
  "#A855F7",
  "#F43F5E",
  "#3B82F6",
];

export function InvestmentsPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: accounts = [], isLoading } = useGetAccounts();

  const investmentAccounts = accounts.filter(
    (a) => a.accountType === AccountType.investment,
  );

  const totalPortfolio = investmentAccounts.reduce(
    (s, a) => s + bigintBalance(a.balance),
    0,
  );

  const allocationData = [
    { name: "US Stocks", value: 55 },
    { name: "Intl Stocks", value: 15 },
    { name: "Bonds", value: 8 },
    { name: "Tech", value: 16 },
    { name: "Other", value: 6 },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
          Portfolio
        </p>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Investments
        </h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="card-elevated p-4" data-ocid="investments.total.card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Total Portfolio
          </p>
          <p
            className={cn(
              "text-2xl font-display font-bold text-foreground tabular-nums mt-2",
              demoMode ? "demo-mask" : "",
            )}
          >
            {maskValue(
              formatCurrency(totalPortfolio > 0 ? totalPortfolio : 100030.25),
            )}
          </p>
          <div className="flex items-center gap-1 mt-1 text-success text-xs">
            <TrendingUp size={12} />
            <span>+8.4% this year</span>
          </div>
        </div>
        <div className="card-elevated p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Today's Change
          </p>
          <p
            className={cn(
              "text-2xl font-display font-bold text-success tabular-nums mt-2",
              demoMode ? "demo-mask" : "",
            )}
          >
            {maskValue("+$847.32")}
          </p>
          <p className="text-xs text-success mt-1">+0.85%</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            All-Time Return
          </p>
          <p
            className={cn(
              "text-2xl font-display font-bold text-success tabular-nums mt-2",
              demoMode ? "demo-mask" : "",
            )}
          >
            {maskValue("+$18,420")}
          </p>
          <p className="text-xs text-success mt-1">+22.6% total</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Holdings table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated lg:col-span-2 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="investments.holdings.table"
            >
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Symbol
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                    Name
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Shares
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Value
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HOLDINGS.map((h, i) => (
                  <tr
                    key={h.symbol}
                    className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    data-ocid={`investments.holdings.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {h.symbol.charAt(0)}
                        </div>
                        <span className="font-semibold text-foreground">
                          {h.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {h.name}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {h.shares}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right tabular-nums",
                        demoMode ? "demo-mask" : "text-foreground",
                      )}
                    >
                      {maskValue(formatCurrency(h.price))}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-semibold tabular-nums",
                        demoMode ? "demo-mask" : "text-foreground",
                      )}
                    >
                      {maskValue(formatCurrency(h.value))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className={cn(
                          "flex items-center justify-end gap-1 text-xs font-medium",
                          h.change >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {h.change >= 0 ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {h.change >= 0 ? "+" : ""}
                        {h.change}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-4"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Asset Allocation
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={ALLOCATION_COLORS[index]}
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
                  formatter={(val: number) => [`${val}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {allocationData.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ALLOCATION_COLORS[i] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Investment accounts */}
      {isLoading ? (
        <Skeleton className="h-24 rounded-xl" />
      ) : investmentAccounts.length > 0 ? (
        <div className="card-elevated p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Investment Accounts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {investmentAccounts.map((a, i) => (
              <div
                key={a.name}
                className="flex justify-between items-center p-3 bg-secondary/40 rounded-lg"
                data-ocid={`investments.accounts.item.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getAccountTypeLabel(a.accountType)}
                  </p>
                </div>
                <p
                  className={cn(
                    "text-sm font-bold tabular-nums text-foreground",
                    demoMode ? "demo-mask" : "",
                  )}
                >
                  {maskValue(formatCurrency(bigintBalance(a.balance)))}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
