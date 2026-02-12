import { type ReactNode } from "react";
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
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextValue;
export {};
