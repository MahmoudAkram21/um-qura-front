import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { CalendarPage } from "@/pages/CalendarPage";
import { Dashboard } from "@/pages/Dashboard";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminSeasonsPage } from "@/pages/admin/AdminSeasonsPage";
import { AdminStarsPage } from "@/pages/admin/AdminStarsPage";
import { AdminStarEditPage } from "@/pages/admin/AdminStarEditPage";
import { AddStar } from "@/pages/AddStar";
import { Settings } from "@/pages/Settings";

function HomeRedirect() {
  return <Navigate to="/calendar" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <SidebarProvider>
                    <DashboardLayout />
                  </SidebarProvider>
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="seasons" element={<AdminSeasonsPage />} />
              <Route path="stars" element={<AdminStarsPage />} />
              <Route path="stars/new" element={<AddStar />} />
              <Route path="stars/:id/edit" element={<AdminStarEditPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
