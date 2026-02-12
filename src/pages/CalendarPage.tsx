import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCalendar } from "@/services/api";
import type { CalendarSeason } from "@/types/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });
}

export function CalendarPage() {
  const [data, setData] = useState<CalendarSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCalendar()
      .then(setData)
      .catch(() => setError("Failed to load calendar"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-gradient">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            التقويم الزراعي والطوالع
          </h1>
          <div className="flex gap-2">
            <Link to="/occasions">
              <Button variant="outline" className="rounded-xl border-2 px-5 py-2 font-medium">
                المناسبات
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" className="rounded-xl border-2 px-5 py-2 font-medium">
                Admin
              </Button>
            </Link>
          </div>
        </header>

        <div className="space-y-6 sm:space-y-8">
          {data.map((season) => (
            <Card
              key={season.id}
              className="overflow-hidden rounded-2xl border-border/80"
            >
              <CardHeader
                className="border-b border-border/60 bg-muted/30 py-5"
                style={{ borderLeftWidth: "5px", borderLeftColor: season.colorHex }}
              >
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {season.name}
                </h2>
                <p className="text-sm text-muted-foreground">{season.duration}</p>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/60">
                  {season.stars.map((star) => (
                    <li
                      key={star.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 transition-colors hover:bg-muted/30"
                    >
                      <span className="font-medium">{star.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(star.startDate)} – {formatDate(star.endDate)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
