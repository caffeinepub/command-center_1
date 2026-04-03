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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { useAddBudget, useGetBudgets } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { formatCurrency, getCategoryColor } from "@/utils/format";
import { AlertTriangle, Plus, RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CATEGORIES = [
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

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

export function BudgetsPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: allBudgets = [], isLoading } = useGetBudgets();
  const addBudget = useAddBudget();

  const [viewMonth, setViewMonth] = useState(currentMonth);
  const [viewYear] = useState(currentYear);
  const [open, setOpen] = useState(false);
  const [budgetView, setBudgetView] = useState<"category" | "flex">("category");

  const [form, setForm] = useState({
    name: "",
    category: "Groceries",
    plan: "",
    actual: "0",
  });

  const budgets = allBudgets.filter(
    (b) => Number(b.month) === viewMonth && Number(b.year) === viewYear,
  );

  const totalPlan = budgets.reduce((s, b) => s + b.plan, 0);
  const totalActual = budgets.reduce((s, b) => s + b.actual, 0);
  const totalPct =
    totalPlan > 0 ? Math.min((totalActual / totalPlan) * 100, 100) : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.plan) {
      toast.error("Please fill all required fields");
      return;
    }
    await addBudget.mutateAsync({
      name: form.name,
      category: form.category,
      plan: Number.parseFloat(form.plan),
      actual: Number.parseFloat(form.actual || "0"),
      month: BigInt(viewMonth),
      year: BigInt(viewYear),
      isActive: true,
      currency: "USD",
    });
    toast.success("Budget created");
    setOpen(false);
    setForm({ name: "", category: "Groceries", plan: "", actual: "0" });
  };

  const fixedCategories = ["Housing", "Utilities"];
  const variableCategories = budgets.filter(
    (b) => !fixedCategories.includes(b.category),
  );
  const fixedBudgets = budgets.filter((b) =>
    fixedCategories.includes(b.category),
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Planning
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Budgets
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={String(viewMonth)}
            onValueChange={(v) => setViewMonth(Number(v))}
          >
            <SelectTrigger
              className="w-36 bg-card border-border"
              data-ocid="budgets.month.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {MONTH_NAMES.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m} {viewYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-primary text-primary-foreground"
                data-ocid="budgets.add.open_modal_button"
              >
                <Plus size={16} />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-card border-border"
              data-ocid="budgets.add.dialog"
            >
              <DialogHeader>
                <DialogTitle>New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Budget Name
                  </Label>
                  <Input
                    placeholder="e.g. Dining Out"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-border"
                    data-ocid="budgets.name.input"
                  />
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
                      data-ocid="budgets.category.select"
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Planned ($)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={form.plan}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, plan: e.target.value }))
                      }
                      className="mt-1 bg-secondary border-border"
                      data-ocid="budgets.plan.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Current Actual ($)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={form.actual}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, actual: e.target.value }))
                      }
                      className="mt-1 bg-secondary border-border"
                      data-ocid="budgets.actual.input"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  data-ocid="budgets.add.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={addBudget.isPending}
                  className="bg-primary text-primary-foreground"
                  data-ocid="budgets.add.submit_button"
                >
                  {addBudget.isPending ? (
                    <RefreshCw size={14} className="animate-spin mr-2" />
                  ) : null}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-elevated p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {MONTH_NAMES[viewMonth - 1]} Overview
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total planned vs actual spending
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Planned</span>
              <p
                className={cn(
                  "font-display font-bold text-lg text-foreground tabular-nums",
                  demoMode ? "demo-mask" : "",
                )}
              >
                {maskValue(formatCurrency(totalPlan))}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Spent</span>
              <p
                className={cn(
                  "font-display font-bold text-lg tabular-nums",
                  totalActual > totalPlan ? "text-destructive" : "text-success",
                  demoMode ? "demo-mask" : "",
                )}
              >
                {maskValue(formatCurrency(totalActual))}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Remaining</span>
              <p
                className={cn(
                  "font-display font-bold text-lg tabular-nums",
                  totalActual > totalPlan ? "text-destructive" : "text-success",
                  demoMode ? "demo-mask" : "",
                )}
              >
                {maskValue(formatCurrency(totalPlan - totalActual))}
              </p>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${totalPct}%`,
              background:
                totalActual > totalPlan
                  ? "oklch(0.63 0.22 27)"
                  : "oklch(0.78 0.17 170)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">
            {Math.round(totalPct)}% of budget used
          </span>
          {totalActual > totalPlan && (
            <div className="flex items-center gap-1 text-destructive text-xs">
              <AlertTriangle size={12} />
              <span>Over budget</span>
            </div>
          )}
          {totalActual <= totalPlan && totalPct > 0 && (
            <div className="flex items-center gap-1 text-success text-xs">
              <TrendingUp size={12} />
              <span>On track</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Budget view toggle */}
      <Tabs
        value={budgetView}
        onValueChange={(v) => setBudgetView(v as "category" | "flex")}
      >
        <TabsList
          className="bg-card border border-border"
          data-ocid="budgets.view.tab"
        >
          <TabsTrigger value="category" data-ocid="budgets.category_view.tab">
            Category-Based
          </TabsTrigger>
          <TabsTrigger value="flex" data-ocid="budgets.flex_view.tab">
            Flex-Based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {["b1", "b2", "b3", "b4", "b5"].map((k) => (
                <Skeleton key={k} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : budgets.length === 0 ? (
            <div
              className="card-elevated p-8 text-center text-muted-foreground"
              data-ocid="budgets.list.empty_state"
            >
              No budgets for this month. Create one above!
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((b, i) => {
                const pct = Math.min((b.actual / b.plan) * 100, 100);
                const over = b.actual > b.plan;
                return (
                  <motion.div
                    key={`${b.name}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card-elevated p-4"
                    data-ocid={`budgets.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{
                            background: `${getCategoryColor(b.category)}25`,
                            color: getCategoryColor(b.category),
                          }}
                        >
                          {b.category.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            {b.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {b.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-sm font-bold tabular-nums",
                            over ? "text-destructive" : "text-foreground",
                            demoMode ? "demo-mask" : "",
                          )}
                        >
                          {maskValue(formatCurrency(b.actual))}{" "}
                          <span className="text-muted-foreground font-normal">
                            / {maskValue(formatCurrency(b.plan))}
                          </span>
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-0.5",
                            over ? "text-destructive" : "text-success",
                          )}
                        >
                          {over
                            ? `${Math.round(pct - 100)}% over`
                            : `${Math.round(100 - pct)}% remaining`}
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: over
                            ? "oklch(0.63 0.22 27)"
                            : getCategoryColor(b.category),
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flex" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-elevated p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                Fixed Expenses
              </h3>
              <div className="space-y-2">
                {fixedBudgets.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No fixed expenses found
                  </p>
                ) : (
                  fixedBudgets.map((b) => (
                    <div key={b.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{b.name}</span>
                      <span
                        className={cn(
                          "font-medium tabular-nums text-foreground",
                          demoMode ? "demo-mask" : "",
                        )}
                      >
                        {maskValue(formatCurrency(b.plan))}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm font-semibold">
                <span>Total Fixed</span>
                <span
                  className={cn("tabular-nums", demoMode ? "demo-mask" : "")}
                >
                  {maskValue(
                    formatCurrency(
                      fixedBudgets.reduce((s, b) => s + b.plan, 0),
                    ),
                  )}
                </span>
              </div>
            </div>
            <div className="card-elevated p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning inline-block" />
                Variable Expenses
              </h3>
              <div className="space-y-2">
                {variableCategories.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No variable expenses found
                  </p>
                ) : (
                  variableCategories.map((b) => (
                    <div key={b.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{b.name}</span>
                      <span
                        className={cn(
                          "font-medium tabular-nums text-foreground",
                          demoMode ? "demo-mask" : "",
                        )}
                      >
                        {maskValue(formatCurrency(b.plan))}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm font-semibold">
                <span>Total Variable</span>
                <span
                  className={cn("tabular-nums", demoMode ? "demo-mask" : "")}
                >
                  {maskValue(
                    formatCurrency(
                      variableCategories.reduce((s, b) => s + b.plan, 0),
                    ),
                  )}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
