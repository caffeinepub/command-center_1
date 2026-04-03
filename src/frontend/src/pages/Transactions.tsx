import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/AppContext";
import { useAddTransaction, useGetTransactions } from "@/hooks/useQueries";
import type { Transaction } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, getCategoryColor } from "@/utils/format";
import { Plus, RefreshCw, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AccountType,
  RecurringTransactionFrequency,
  TransactionType,
} from "../backend.d";

const CATEGORIES = [
  "All",
  "Income",
  "Housing",
  "Groceries",
  "Dining",
  "Entertainment",
  "Transport",
  "Health",
  "Shopping",
  "Utilities",
  "Other",
];

const TX_TYPES = [
  { value: "all", label: "All Types" },
  { value: TransactionType.income, label: "Income" },
  { value: TransactionType.expense, label: "Expense" },
  { value: TransactionType.transfer, label: "Transfer" },
];

export function TransactionsPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: transactions = [], isLoading } = useGetTransactions();
  const addTx = useAddTransaction();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    note: "",
    amount: "",
    category: "Groceries",
    transactionType: TransactionType.expense,
    account: "Chase Checking",
    date: new Date().toISOString().split("T")[0],
  });

  const filtered = transactions
    .filter((t) => {
      const matchSearch =
        !search ||
        t.note.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.account.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        categoryFilter === "All" || t.category === categoryFilter;
      const matchType =
        typeFilter === "all" || t.transactionType === typeFilter;
      return matchSearch && matchCat && matchType;
    })
    .sort((a, b) => Number(b.date) - Number(a.date));

  const handleSubmit = async () => {
    if (!form.note || !form.amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    await addTx.mutateAsync({
      note: form.note,
      amount: Number.parseFloat(form.amount),
      category: form.category,
      transactionType: form.transactionType,
      account: form.account,
      date: BigInt(new Date(form.date).getTime()),
      isRecurring: false,
      isShared: true,
      split: false,
      accountType: AccountType.bank_account,
      currency: "USD",
    });
    toast.success("Transaction added");
    setOpen(false);
    setForm({
      note: "",
      amount: "",
      category: "Groceries",
      transactionType: TransactionType.expense,
      account: "Chase Checking",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Financial Records
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Transactions
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="transactions.add.open_modal_button"
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="transactions.add.dialog"
          >
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <Input
                  placeholder="e.g. Whole Foods"
                  value={form.note}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, note: e.target.value }))
                  }
                  className="mt-1 bg-secondary border-border"
                  data-ocid="transactions.note.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Amount ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-border"
                    data-ocid="transactions.amount.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-border"
                    data-ocid="transactions.date.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={form.transactionType}
                    onValueChange={(v) =>
                      setForm((p) => ({
                        ...p,
                        transactionType: v as TransactionType,
                      }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-secondary border-border"
                      data-ocid="transactions.type.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={TransactionType.expense}>
                        Expense
                      </SelectItem>
                      <SelectItem value={TransactionType.income}>
                        Income
                      </SelectItem>
                      <SelectItem value={TransactionType.transfer}>
                        Transfer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Category
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, category: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 bg-secondary border-border"
                      data-ocid="transactions.category.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="transactions.add.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={addTx.isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="transactions.add.submit_button"
              >
                {addTx.isPending ? (
                  <RefreshCw size={14} className="animate-spin mr-2" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
            data-ocid="transactions.search.input"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger
            className="w-full sm:w-40 bg-card border-border"
            data-ocid="transactions.category_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            className="w-full sm:w-40 bg-card border-border"
            data-ocid="transactions.type_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {TX_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className="card-elevated overflow-hidden"
        data-ocid="transactions.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Merchant
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Account
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                  <tr key={k}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-8 rounded" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="transactions.table.empty_state"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((tx, i) => (
                  <tr
                    key={`tx-${String(tx.date)}-${i}`}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    data-ocid={`transactions.row.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: `${getCategoryColor(tx.category)}30`,
                            color: getCategoryColor(tx.category),
                          }}
                        >
                          {(tx.note || tx.category).charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {tx.note || tx.category}
                          </p>
                          {tx.isRecurring && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1 py-0 border-primary/30 text-primary mt-0.5"
                            >
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          background: `${getCategoryColor(tx.category)}20`,
                          color: getCategoryColor(tx.category),
                        }}
                      >
                        {tx.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {tx.account}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "font-semibold text-sm tabular-nums",
                          tx.transactionType === TransactionType.income
                            ? "text-success"
                            : "text-destructive",
                          demoMode ? "demo-mask" : "",
                        )}
                      >
                        {tx.transactionType === TransactionType.income
                          ? "+"
                          : "-"}
                        {maskValue(formatCurrency(tx.amount))}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
