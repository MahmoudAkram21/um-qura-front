import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Languages } from "lucide-react";

export function Settings() {
  const { theme, dir, setTheme, setDir, toggleTheme, toggleDir } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <Card>
        <CardHeader>
          <CardTitle>المظهر</CardTitle>
          <CardDescription>السمة واتجاه الواجهة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">السمة</p>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                <Sun className="me-1 size-4" />
                فاتح
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                <Moon className="me-1 size-4" />
                داكن
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                تبديل
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">الاتجاه</p>
            <div className="flex gap-2">
              <Button
                variant={dir === "ltr" ? "default" : "outline"}
                size="sm"
                onClick={() => setDir("ltr")}
              >
                من اليسار لليمين
              </Button>
              <Button
                variant={dir === "rtl" ? "default" : "outline"}
                size="sm"
                onClick={() => setDir("rtl")}
              >
                من اليمين لليسار
              </Button>
              <Button variant="outline" size="sm" onClick={toggleDir}>
                <Languages className="me-1 size-4" />
                تبديل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
