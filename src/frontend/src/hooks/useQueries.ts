import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Account,
  Budget,
  FinancialGoal,
  StandingOrder,
  Transaction,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export type {
  Account,
  Transaction,
  Budget,
  FinancialGoal,
  StandingOrder,
  UserProfile,
};

// --- Accounts ---
export function useGetAccounts() {
  const { actor, isFetching } = useActor();
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAccount() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (account: Account) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAccount(account);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

// --- Transactions ---
export function useGetTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tx: Transaction) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTransaction(tx);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

// --- Budgets ---
export function useGetBudgets() {
  const { actor, isFetching } = useActor();
  return useQuery<Budget[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBudgets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBudget() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (budget: Budget) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBudget(budget);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

// --- Financial Goals ---
export function useGetFinancialGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<FinancialGoal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFinancialGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFinancialGoal() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: FinancialGoal) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFinancialGoal(goal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

// --- Standing Orders ---
export function useGetStandingOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<StandingOrder[]>({
    queryKey: ["standingOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStandingOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStandingOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (so: StandingOrder) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStandingOrder(so);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["standingOrders"] });
    },
  });
}

// --- User Profile ---
export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
