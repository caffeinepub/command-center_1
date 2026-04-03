import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "@tanstack/react-router";
import { Bell, Eye, EyeOff, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const { demoMode, toggleDemoMode } = useAppContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const closeSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            role="presentation"
            onClick={closeSidebar}
          />
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: sidebar container */}
          <div
            className="relative flex"
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-[-40px] text-white"
              onClick={closeSidebar}
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Demo mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 text-xs h-8",
                demoMode ? "text-warning" : "text-muted-foreground",
              )}
              onClick={toggleDemoMode}
              data-ocid="header.demo_mode.toggle"
            >
              {demoMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden sm:inline">
                {demoMode ? "Demo On" : "Demo"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              data-ocid="header.notifications.button"
            >
              <Bell size={16} />
            </Button>

            <Link to="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                data-ocid="header.settings.link"
              >
                <Settings size={16} />
              </Button>
            </Link>
          </div>
        </header>

        {/* Demo mode banner */}
        {demoMode && (
          <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 text-center">
            <p className="text-xs text-warning font-medium">
              Demo Mode Active — All monetary values are masked for privacy
            </p>
          </div>
        )}

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto scrollbar-thin"
          id="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
