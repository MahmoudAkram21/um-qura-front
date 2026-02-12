import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [open, setOpen]);

  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);
  return (
    <DropdownMenuContext.Provider value={value}>
      <div ref={wrapperRef} className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({
  children,
  className,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) return null;
  const handleClick = () => ctx.setOpen(!ctx.open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void; className?: string }>, {
      onClick: handleClick,
      className: cn(className, (children as React.ReactElement<{ className?: string }>).props?.className),
    });
  }
  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

function DropdownMenuContent({
  children,
  className,
  align = "end",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "right-0" : "left-0",
        "top-full mt-1",
        className
      )}
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({
  children,
  className,
  onClick,
  onSelect,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onSelect?: () => void;
}) {
  const ctx = React.useContext(DropdownMenuContext);
  const handle = () => {
    onSelect?.();
    onClick?.();
    ctx?.setOpen(false);
  };
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handle()}
      onClick={handle}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
