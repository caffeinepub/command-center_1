import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

interface AppContextValue {
  demoMode: boolean;
  toggleDemoMode: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  maskValue: (value: string) => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoMode] = useState(false);
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("cc-theme") as Theme | null;
    const initial = saved ?? "dark";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem("cc-theme", t);
  }, []);

  const toggleDemoMode = useCallback(() => {
    setDemoMode((prev) => !prev);
  }, []);

  const maskValue = useCallback(
    (value: string) => (demoMode ? "••••" : value),
    [demoMode],
  );

  return (
    <AppContext.Provider
      value={{ demoMode, toggleDemoMode, theme, setTheme, maskValue }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
