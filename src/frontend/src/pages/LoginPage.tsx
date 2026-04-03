import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { DollarSign, Loader2, Shield, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: DollarSign,
    label: "Net Worth Tracking",
    desc: "See all accounts in one place",
  },
  {
    icon: TrendingUp,
    label: "Smart Budgets",
    desc: "AI-powered spending insights",
  },
  {
    icon: Target,
    label: "Financial Goals",
    desc: "Track your savings milestones",
  },
  {
    icon: Shield,
    label: "Bank-level Security",
    desc: "AES-256 encrypted, read-only",
  },
];

export function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-display font-bold text-xl text-primary-foreground">
              C
            </div>
            <div>
              <h1 className="font-display font-bold text-foreground text-lg leading-tight">
                Command Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Financial Intelligence Platform
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access your household financial dashboard.
            </p>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold gap-2"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            data-ocid="login.submit_button"
          >
            {isLoggingIn || isInitializing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Shield size={16} />
            )}
            {isLoggingIn
              ? "Connecting..."
              : isInitializing
                ? "Loading..."
                : "Sign In Securely"}
          </Button>

          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <Shield size={14} className="text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              Secured by Internet Identity. We never store passwords or access
              your funds.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border flex-col justify-center px-12">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Platform Features
          </p>
          <h3 className="text-2xl font-display font-bold text-foreground mb-2">
            Your complete financial command center
          </h3>
          <p className="text-sm text-muted-foreground mb-8">
            100% ad-free • No data selling • Household collaboration • Real-time
            sync
          </p>
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-secondary/40 border border-border"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
