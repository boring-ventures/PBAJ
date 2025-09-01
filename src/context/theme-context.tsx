"use client";

import {
  type ReactNode,
  createContext,
  useContext,
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

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Simple static light mode provider - no state, no effects
  const value = {
    theme: "light" as Theme,
    setTheme: (_theme: Theme) => {
      // Do nothing - light mode only
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