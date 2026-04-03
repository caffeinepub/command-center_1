import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Account {
    balance: bigint;
    owner: UserId;
    name: string;
    isShared: boolean;
    accountType: AccountType;
    currency: CurrencyCode;
    category: string;
}
export interface StandingOrder {
    to: Account;
    internalId: string;
    from: Account;
    test: boolean;
    currency: CurrencyCode;
    frequency: RecurringTransactionFrequency;
    amount: number;
    nextPaymentDate: Time;
}
export type Time = bigint;
export type CurrencyCode = string;
export interface Transaction {
    id?: bigint;
    transactionType: TransactionType;
    isRecurring: boolean;
    date: Time;
    note: string;
    isShared: boolean;
    split: boolean;
    accountType: AccountType;
    currency: CurrencyCode;
    account: string;
    category: string;
    recurringFrequency?: RecurringTransactionFrequency;
    budget?: bigint;
    amount: number;
    household?: HouseholdId;
}
export type UserId = Principal;
export interface FinancialGoal {
    name: string;
    isActive: boolean;
    currency: CurrencyCode;
    targetDate: Time;
    current: number;
    amount: number;
}
export type HouseholdId = bigint;
export interface UserProfile {
    name: string;
}
export interface Budget {
    id?: bigint;
    month: bigint;
    actual: number;
    name: string;
    plan: number;
    year: bigint;
    isActive: boolean;
    currency: CurrencyCode;
    category: string;
}
export enum AccountType {
    loan = "loan",
    investment = "investment",
    credit_card = "credit_card",
    bank_account = "bank_account"
}
export enum RecurringTransactionFrequency {
    quarterly = "quarterly",
    monthly = "monthly",
    yearly = "yearly",
    daily = "daily",
    biweekly = "biweekly",
    weekly = "weekly"
}
export enum TransactionType {
    expense = "expense",
    income = "income",
    transfer = "transfer"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAccount(account: Account): Promise<void>;
    addBudget(budget: Budget): Promise<void>;
    addFinancialGoal(goal: FinancialGoal): Promise<void>;
    addStandingOrder(standingOrder: StandingOrder): Promise<void>;
    addTransaction(transaction: Transaction): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAccounts(): Promise<Array<Account>>;
    getAccountsByBalance(): Promise<Array<Account>>;
    getAllStandingOrders(): Promise<Array<StandingOrder>>;
    getBudgets(): Promise<Array<Budget>>;
    getBudgetsByCategory(category: string): Promise<Array<Budget>>;
    getBudgetsByPlan(): Promise<Array<Budget>>;
    getBudgetsByYear(year: bigint): Promise<Array<Budget>>;
    getBudgetsByYearMonth(year: bigint, month: bigint): Promise<Array<Budget>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFinancialGoals(): Promise<Array<FinancialGoal>>;
    getFinancialGoalsByAmount(): Promise<Array<FinancialGoal>>;
    getFinancialGoalsByProgress(): Promise<Array<FinancialGoal>>;
    getStandingOrder(standingOrderId: string): Promise<StandingOrder>;
    getTransactions(): Promise<Array<Transaction>>;
    getTransactionsByAccount(account: string): Promise<Array<Transaction>>;
    getTransactionsByAmount(): Promise<Array<Transaction>>;
    getTransactionsByBudget(budget: bigint): Promise<Array<Transaction>>;
    getTransactionsByCategory(category: string): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
