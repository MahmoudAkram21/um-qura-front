import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOccasionsSections } from "@/services/api";
import type { Occasion, OccasionsSections as OccasionsSectionsType } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

function OccasionCard({ occasion, onSelect }: { occasion: Occasion; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-xl border border-border/80 bg-card p-4 text-right transition-colors hover:bg-muted/40"
    >
      <div className="font-medium" dir="rtl" lang="ar">
        {occasion.title}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {occasion.hijriDisplay ?? `${occasion.hijriDay} ${occasion.hijriMonth}`}
      </div>
    </button>
  );
}

function SectionList({
  title,
  occasions,
  onSelect,
}: {
  title: string;
  occasions: Occasion[];
  onSelect: (o: Occasion) => void;
}) {
  if (occasions.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Calendar className="size-5 text-muted-foreground" />
        {title}
      </h2>
      <div className="space-y-2">
        {occasions.map((o) => (
          <OccasionCard key={o.id} occasion={o} onSelect={() => onSelect(o)} />
        ))}
      </div>
    </section>
  );
}

export function OccasionsPage() {
  const [sections, setSections] = useState<OccasionsSectionsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Occasion | null>(null);

  useEffect(() => {
    getOccasionsSections()
      .then(setSections)
      .catch(() => setError("فشل تحميل المناسبات"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8" dir="rtl">
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-destructive">{error}</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-background page-gradient" dir="rtl" lang="ar">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <Button variant="ghost" className="mb-4" onClick={() => setSelected(null)}>
            ← العودة
          </Button>
          <Card className="rounded-2xl border-border/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold">{selected.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.hijriDisplay ?? `${selected.hijriDay} ${selected.hijriMonth}`}
              </p>
              <h3 className="mt-4 font-medium text-foreground">{selected.prayerTitle}</h3>
              {selected.prayerText && (
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{selected.prayerText}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-gradient" dir="rtl" lang="ar">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            المناسبات
          </h1>
          <div className="flex gap-2">
            <Link to="/calendar">
              <Button variant="outline" className="rounded-xl">
                التقويم
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" className="rounded-xl">
                Admin
              </Button>
            </Link>
          </div>
        </header>

        <div className="space-y-8">
          {sections && (
            <>
              <SectionList
                title="مناسبات اليوم"
                occasions={sections.today}
                onSelect={setSelected}
              />
              <SectionList
                title="مناسبات الشهر الحالي"
                occasions={sections.currentMonth}
                onSelect={setSelected}
              />
              <SectionList
                title="مناسبات الشهر القادم"
                occasions={sections.nextMonth}
                onSelect={setSelected}
              />
              <SectionList
                title="أهم مناسبات في السنة"
                occasions={sections.year}
                onSelect={setSelected}
              />
            </>
          )}
          {sections &&
            sections.today.length === 0 &&
            sections.currentMonth.length === 0 &&
            sections.nextMonth.length === 0 &&
            sections.year.length === 0 && (
              <p className="text-center text-muted-foreground">لا توجد مناسبات لعرضها.</p>
            )}
        </div>
      </div>
    </div>
  );
}
