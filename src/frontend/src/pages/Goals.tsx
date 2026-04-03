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
import { useAddFinancialGoal, useGetFinancialGoals } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format";
import { CheckCircle2, Plus, RefreshCw, Target } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const GOAL_ICONS: Record<string, string> = {
  Home: "🏠",
  Car: "🚗",
  Vacation: "✈️",
  Education: "🎓",
  Emergency: "🛡️",
  Retirement: "🏖️",
  Wedding: "💒",
  Business: "💼",
  Other: "🎯",
};

function getGoalIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(GOAL_ICONS)) {
    if (lower.includes(key.toLowerCase())) return icon;
  }
  return GOAL_ICONS.Other;
}

export function GoalsPage() {
  const { maskValue, demoMode } = useAppContext();
  const { data: goals = [], isLoading } = useGetFinancialGoals();
  const addGoal = useAddFinancialGoal();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    current: "0",
    targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currency: "USD",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.amount) {
      toast.error("Please fill required fields");
      return;
    }
    await addGoal.mutateAsync({
      name: form.name,
      amount: Number.parseFloat(form.amount),
      current: Number.parseFloat(form.current || "0"),
      targetDate: BigInt(new Date(form.targetDate).getTime()),
      currency: form.currency,
      isActive: true,
    });
    toast.success("Goal created!");
    setOpen(false);
    setForm({
      name: "",
      amount: "",
      current: "0",
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "USD",
    });
  };

  const totalSaving = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Financial Goals
          </p>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Goals
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2 bg-primary text-primary-foreground"
              data-ocid="goals.add.open_modal_button"
            >
              <Plus size={16} />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="goals.add.dialog"
          >
            <DialogHeader>
              <DialogTitle>Create Financial Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Goal Name
                </Label>
                <Input
                  placeholder="e.g. Europe Vacation"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 bg-secondary border-border"
                  data-ocid="goals.name.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Target Amount ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-border"
                    data-ocid="goals.amount.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Current Saved ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.current}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, current: e.target.value }))
                    }
                    className="mt-1 bg-secondary border-border"
                    data-ocid="goals.current.input"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Target Date
                </Label>
                <Input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, targetDate: e.target.value }))
                  }
                  className="mt-1 bg-secondary border-border"
                  data-ocid="goals.target_date.input"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                data-ocid="goals.add.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={addGoal.isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="goals.add.submit_button"
              >
                {addGoal.isPending ? (
                  <RefreshCw size={14} className="animate-spin mr-2" />
                ) : null}
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="card-elevated p-4 col-span-1">
            <p className="text-xs text-muted-foreground">Active Goals</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {goals.filter((g) => g.isActive).length}
            </p>
          </div>
          <div className="card-elevated p-4 col-span-1">
            <p className="text-xs text-muted-foreground">Total Saved</p>
            <p
              className={cn(
                "text-2xl font-display font-bold text-success mt-1 tabular-nums",
                demoMode ? "demo-mask" : "",
              )}
            >
              {maskValue(formatCurrency(totalSaving, "USD", true))}
            </p>
          </div>
          <div className="card-elevated p-4 col-span-1">
            <p className="text-xs text-muted-foreground">Total Target</p>
            <p
              className={cn(
                "text-2xl font-display font-bold text-foreground mt-1 tabular-nums",
                demoMode ? "demo-mask" : "",
              )}
            >
              {maskValue(formatCurrency(totalTarget, "USD", true))}
            </p>
          </div>
        </motion.div>
      )}

      {/* Goals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["g1", "g2", "g3"].map((k) => (
            <Skeleton key={k} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div
          className="card-elevated p-12 text-center"
          data-ocid="goals.list.empty_state"
        >
          <Target size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No goals yet. Set your first financial goal!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal, i) => {
            const pct = Math.min((goal.current / goal.amount) * 100, 100);
            const done = pct >= 100;
            const remaining = Math.max(goal.amount - goal.current, 0);
            const daysLeft = Math.max(
              Math.round(
                (Number(goal.targetDate) - Date.now()) / (1000 * 60 * 60 * 24),
              ),
              0,
            );

            return (
              <motion.div
                key={`${goal.name}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-elevated p-5 flex flex-col gap-4 hover:shadow-card-hover transition-shadow"
                data-ocid={`goals.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getGoalIcon(goal.name)}</span>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {goal.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {done ? "Completed! 🎉" : `${daysLeft} days left`}
                      </p>
                    </div>
                  </div>
                  {done && (
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                  )}
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums text-foreground",
                        demoMode ? "demo-mask" : "",
                      )}
                    >
                      {maskValue(formatCurrency(goal.current))}
                    </span>
                    <span
                      className={cn(
                        "text-sm text-muted-foreground tabular-nums",
                        demoMode ? "demo-mask" : "",
                      )}
                    >
                      / {maskValue(formatCurrency(goal.amount))}
                    </span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: done
                          ? "oklch(0.78 0.17 170)"
                          : `oklch(${0.5 + pct * 0.003} 0.19 142)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(pct)}% complete
                    </span>
                    <span
                      className={cn(
                        "text-xs text-muted-foreground",
                        demoMode ? "demo-mask" : "",
                      )}
                    >
                      {maskValue(formatCurrency(remaining))} to go
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs pt-2 border-t border-border">
                  <span className="text-muted-foreground">
                    Target: {formatDate(goal.targetDate)}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      goal.isActive ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {goal.isActive ? "Active" : "Paused"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
