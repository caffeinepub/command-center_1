import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useGetUserProfile } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/investments", label: "Investments", icon: TrendingUp },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const { data: profile } = useGetUserProfile();

  const name = profile?.name ?? "Sarah Jenkins";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200 relative shrink-0",
          collapsed ? "w-[60px]" : "w-[260px]",
        )}
      >
        {/* Branding */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm shrink-0">
            C
          </div>
          {!collapsed && (
            <span className="font-display font-semibold text-sidebar-foreground text-sm tracking-tight truncate">
              Command Center
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(href);
            return collapsed ? (
              <Tooltip key={href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={href}
                    data-ocid={`nav.${label.toLowerCase()}.link`}
                    className={cn(
                      "flex items-center justify-center w-full h-9 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon size={18} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={href}
                to={href}
                data-ocid={`nav.${label.toLowerCase()}.link`}
                className={cn(
                  "flex items-center gap-3 px-3 h-9 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield size={10} />
                  <span>Secured</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={clear}
                data-ocid="nav.logout.button"
              >
                <LogOut size={14} />
              </Button>
            </div>
          )}

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-7 text-muted-foreground hover:text-sidebar-foreground"
            onClick={() => setCollapsed((p) => !p)}
            data-ocid="nav.collapse.button"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
