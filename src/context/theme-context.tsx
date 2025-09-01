"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Force light mode only - no dark mode support
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Always use light mode, ignore stored preferences
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("light");
    
    // Clear any stored dark mode preference
    localStorage.setItem(storageKey, "light");
  }, [storageKey]);

  const value = {
    theme: "light" as Theme,
    setTheme: (theme: Theme) => {
      // Ignore any attempts to change theme - always stay light
      console.log("Theme switching disabled - light mode only");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
