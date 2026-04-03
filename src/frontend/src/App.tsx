import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/contexts/AppContext";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { BudgetsPage } from "@/pages/Budgets";
import { DashboardPage } from "@/pages/Dashboard";
import { GoalsPage } from "@/pages/Goals";
import { InvestmentsPage } from "@/pages/Investments";
import { LoginPage } from "@/pages/LoginPage";
import { ReportsPage } from "@/pages/Reports";
import { SettingsPage } from "@/pages/Settings";
import { TransactionsPage } from "@/pages/Transactions";
import { seedDataIfEmpty } from "@/utils/seedData";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";

// Seed data hook
function useSeedData() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const seeded = useRef(false);

  useEffect(() => {
    if (actor && !isFetching && identity && !seeded.current) {
      seeded.current = true;
      seedDataIfEmpty(actor);
    }
  }, [actor, isFetching, identity]);
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  useSeedData();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

// Router setup
const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
      <Toaster />
    </AppProvider>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transactions",
  component: TransactionsPage,
});

const budgetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/budgets",
  component: BudgetsPage,
});

const investmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/investments",
  component: InvestmentsPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goals",
  component: GoalsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  transactionsRoute,
  budgetsRoute,
  investmentsRoute,
  goalsRoute,
  reportsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
