import * as React from "react";
declare function DropdownMenu({ children, open: controlledOpen, onOpenChange, }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuTrigger({ children, className, asChild, }: {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
declare function DropdownMenuContent({ children, className, align, }: {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "end";
}): import("react/jsx-runtime").JSX.Element | null;
declare function DropdownMenuItem({ children, className, onClick, onSelect, }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    onSelect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
