import { type ReactNode } from "react";
import type { LoginResult } from "@/types/api";
interface AuthContextValue {
    isAuthenticated: boolean;
    admin: LoginResult["admin"] | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextValue;
export {};
