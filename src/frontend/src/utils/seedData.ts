import type { backendInterface } from "../backend";
import {
  type Account,
  AccountType,
  type Budget,
  type FinancialGoal,
  RecurringTransactionFrequency,
  type Transaction,
  TransactionType,
} from "../backend.d";

const now = Date.now();
const ms = (daysAgo: number) => BigInt(now - daysAgo * 24 * 60 * 60 * 1000);

// ---- Fake Principal for owner (anonymous) ----
import { Principal } from "@icp-sdk/core/principal";
const ANON = Principal.anonymous();

export const SEED_ACCOUNTS: Account[] = [
  {
    name: "Chase Checking",
    balance: BigInt(Math.round(8_420.55 * 100)),
    owner: ANON,
    isShared: true,
    accountType: AccountType.bank_account,
    currency: "USD",
    category: "checking",
  },
  {
    name: "High-Yield Savings",
    balance: BigInt(Math.round(24_800.0 * 100)),
    owner: ANON,
    isShared: true,
    accountType: AccountType.bank_account,
    currency: "USD",
    category: "savings",
  },
  {
    name: "Fidelity 401k",
    balance: BigInt(Math.round(87_350.0 * 100)),
    owner: ANON,
    isShared: false,
    accountType: AccountType.investment,
    currency: "USD",
    category: "retirement",
  },
  {
    name: "Brokerage Account",
    balance: BigInt(Math.round(12_680.0 * 100)),
    owner: ANON,
    isShared: false,
    accountType: AccountType.investment,
    currency: "USD",
    category: "brokerage",
  },
  {
    name: "Chase Sapphire",
    balance: BigInt(Math.round(-2_340.0 * 100)),
    owner: ANON,
    isShared: true,
    accountType: AccountType.credit_card,
    currency: "USD",
    category: "credit",
  },
  {
    name: "Home Mortgage",
    balance: BigInt(Math.round(-285_000.0 * 100)),
    owner: ANON,
    isShared: true,
    accountType: AccountType.loan,
    currency: "USD",
    category: "mortgage",
  },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    transactionType: TransactionType.income,
    isRecurring: true,
    date: ms(2),
    note: "Monthly salary deposit",
    isShared: true,
    split: false,
    accountType: AccountType.bank_account,
    currency: "USD",
    account: "Chase Checking",
    category: "Income",
    recurringFrequency: RecurringTransactionFrequency.monthly,
    amount: 6850.0,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: false,
    date: ms(3),
    note: "Weekly groceries run",
    isShared: true,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Groceries",
    amount: 127.43,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: true,
    date: ms(5),
    note: "Netflix subscription",
    isShared: true,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Entertainment",
    recurringFrequency: RecurringTransactionFrequency.monthly,
    amount: 15.99,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: false,
    date: ms(6),
    note: "Dinner at Trattoria Roma",
    isShared: true,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Dining",
    amount: 89.5,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: true,
    date: ms(7),
    note: "Electricity bill",
    isShared: true,
    split: false,
    accountType: AccountType.bank_account,
    currency: "USD",
    account: "Chase Checking",
    category: "Utilities",
    recurringFrequency: RecurringTransactionFrequency.monthly,
    amount: 142.0,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: false,
    date: ms(8),
    note: "Lyft to airport",
    isShared: false,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Transport",
    amount: 34.2,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: true,
    date: ms(10),
    note: "Spotify Premium",
    isShared: false,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Entertainment",
    recurringFrequency: RecurringTransactionFrequency.monthly,
    amount: 9.99,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: false,
    date: ms(11),
    note: "Whole Foods Market",
    isShared: true,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Groceries",
    amount: 98.75,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: true,
    date: ms(14),
    note: "Gym membership",
    isShared: false,
    split: false,
    accountType: AccountType.bank_account,
    currency: "USD",
    account: "Chase Checking",
    category: "Health",
    recurringFrequency: RecurringTransactionFrequency.monthly,
    amount: 49.0,
  },
  {
    transactionType: TransactionType.expense,
    isRecurring: false,
    date: ms(15),
    note: "Amazon - home supplies",
    isShared: true,
    split: false,
    accountType: AccountType.credit_card,
    currency: "USD",
    account: "Chase Sapphire",
    category: "Shopping",
    amount: 67.4,
  },
];

export const SEED_BUDGETS: Budget[] = [
  {
    name: "Housing",
    category: "Housing",
    plan: 2500.0,
    actual: 2500.0,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
  {
    name: "Groceries",
    category: "Groceries",
    plan: 600.0,
    actual: 226.18,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
  {
    name: "Dining Out",
    category: "Dining",
    plan: 300.0,
    actual: 89.5,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
  {
    name: "Entertainment",
    category: "Entertainment",
    plan: 150.0,
    actual: 25.98,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
  {
    name: "Transport",
    category: "Transport",
    plan: 200.0,
    actual: 34.2,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
  {
    name: "Health & Fitness",
    category: "Health",
    plan: 100.0,
    actual: 49.0,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(new Date().getFullYear()),
    isActive: true,
    currency: "USD",
  },
];

export const SEED_GOALS: FinancialGoal[] = [
  {
    name: "Home Down Payment",
    isActive: true,
    currency: "USD",
    targetDate: BigInt(new Date("2026-12-31").getTime()),
    current: 24800.0,
    amount: 60000.0,
  },
  {
    name: "Emergency Fund (6 Months)",
    isActive: true,
    currency: "USD",
    targetDate: BigInt(new Date("2025-06-30").getTime()),
    current: 8420.55,
    amount: 20000.0,
  },
  {
    name: "Europe Vacation",
    isActive: true,
    currency: "USD",
    targetDate: BigInt(new Date("2025-08-15").getTime()),
    current: 3200.0,
    amount: 8000.0,
  },
];

export async function seedDataIfEmpty(actor: backendInterface) {
  try {
    const accounts = await actor.getAccounts();
    if (accounts.length > 0) return; // Already seeded

    // Run all seeds in parallel batches
    await Promise.all(SEED_ACCOUNTS.map((a) => actor.addAccount(a)));
    await Promise.all(SEED_TRANSACTIONS.map((t) => actor.addTransaction(t)));
    await Promise.all(SEED_BUDGETS.map((b) => actor.addBudget(b)));
    await Promise.all(SEED_GOALS.map((g) => actor.addFinancialGoal(g)));

    // Save profile
    await actor.saveCallerUserProfile({ name: "Sarah Jenkins" });
  } catch (e) {
    console.warn("Seed failed:", e);
  }
}
