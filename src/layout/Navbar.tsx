import { Link } from "react-router-dom";
import { Menu, Moon, Sun, Languages, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme, toggleDir } = useTheme();
  const { setOpen } = useSidebar();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/60 bg-background/95 px-4 shadow-[var(--shadow-soft)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="فتح القائمة"
      >
        <Menu className="size-5" />
      </Button>
      <Link to="/" className="font-semibold text-foreground hover:underline">
        التقويم الزراعي والطوالع
      </Link>
      <div className="ms-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="تبديل السمة">
          {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDir} aria-label="تبديل الاتجاه">
          <Languages className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {admin?.email}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              <LogOut className="me-2 size-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
