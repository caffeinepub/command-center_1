export function formatCurrency(
  amount: number,
  currency = "USD",
  compact = false,
): string {
  if (compact && Math.abs(amount) >= 1000) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(timestamp: bigint | number): string {
  const ms = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

export function formatDateShort(timestamp: bigint | number): string {
  const ms = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Housing: "#21D19B",
    Groceries: "#F59E0B",
    Dining: "#A855F7",
    Entertainment: "#F43F5E",
    Transport: "#3B82F6",
    Health: "#10B981",
    Shopping: "#EC4899",
    Utilities: "#F97316",
    Income: "#22C55E",
    Savings: "#6366F1",
    Other: "#6B7280",
  };
  return colors[category] ?? colors.Other;
}

export function getCategoryInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    bank_account: "Bank Account",
    credit_card: "Credit Card",
    investment: "Investment",
    loan: "Loan",
  };
  return labels[type] ?? type;
}

export function bigintBalance(balance: bigint): number {
  return Number(balance) / 100;
}
