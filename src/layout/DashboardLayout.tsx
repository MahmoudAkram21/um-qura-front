import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { open } = useSidebar();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main
          className={cn(
            "flex-1 overflow-auto p-4 md:p-6",
            !open && "md:pl-6"
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
