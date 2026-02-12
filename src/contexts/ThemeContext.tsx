import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type Dir = "ltr" | "rtl";

interface ThemeContextValue {
  theme: Theme;
  dir: Dir;
  setTheme: (t: Theme) => void;
  setDir: (d: Dir) => void;
  toggleTheme: () => void;
  toggleDir: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "app_theme";
const DIR_KEY = "app_dir";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(THEME_KEY) as Theme) || "light";
  });
  const [dir, setDirState] = useState<Dir>(() => {
    return (localStorage.getItem(DIR_KEY) as Dir) || "ltr";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
  }, [dir]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const setDir = useCallback((d: Dir) => {
    setDirState(d);
    localStorage.setItem(DIR_KEY, d);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const toggleDir = useCallback(() => {
    setDirState((prev) => {
      const next = prev === "ltr" ? "rtl" : "ltr";
      localStorage.setItem(DIR_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, dir, setTheme, setDir, toggleTheme, toggleDir }),
    [theme, dir, setTheme, setDir, toggleTheme, toggleDir]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
