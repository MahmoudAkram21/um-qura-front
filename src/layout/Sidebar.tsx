import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sun,
  Star,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/seasons", label: "Seasons", icon: Sun },
  { to: "/admin/stars", label: "Stars", icon: Star },
  { to: "/admin/stars/new", label: "Add Star", icon: PlusCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { open, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[var(--shadow-soft)] transition-[width] duration-200 ease-out",
        open ? "w-56" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        {open && (
          <span className="truncate text-sm font-semibold tracking-tight">
            التقويم الزراعي
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ms-auto shrink-0 rounded-xl"
          onClick={toggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {nav.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "hover:bg-sidebar-accent/60"
              )}
            >
              <Icon className="size-5 shrink-0" />
              {open && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
