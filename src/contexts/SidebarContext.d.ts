import { type ReactNode } from "react";
interface SidebarContextValue {
    open: boolean;
    setOpen: (v: boolean) => void;
    toggle: () => void;
}
export declare function SidebarProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSidebar(): SidebarContextValue;
export {};
