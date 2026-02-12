import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSeasons, listStars } from "@/services/api";
import { StatCard } from "@/components/cards/StatCard";
import { DataTable } from "@/components/tables/DataTable";
import { Star, Sun, Calendar } from "lucide-react";
import type { Star as StarType } from "@/types/api";

export function Dashboard() {
  const [seasonsCount, setSeasonsCount] = useState(0);
  const [starsCount, setStarsCount] = useState(0);
  const [recentStars, setRecentStars] = useState<StarType[]>([]);

  useEffect(() => {
    listSeasons().then((s) => setSeasonsCount(s.length));
    listStars({ limit: 5 }).then((r) => {
      setStarsCount(r.total);
      setRecentStars(r.stars);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">لوحة التحكم</h1>
        <p className="mt-1 text-muted-foreground">نظرة عامة على الفصول والنجوم</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard title="الفصول" value={seasonsCount} icon={Sun} />
        <StatCard title="إجمالي النجوم" value={starsCount} icon={Star} />
        <StatCard title="التقويم" value="عام" icon={Calendar} description="عرض في /calendar" />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">أحدث النجوم</h2>
        <DataTable<StarType>
          data={recentStars}
          keyExtractor={(s) => s.id}
          columns={[
            {
              key: "name",
              header: "الاسم",
              className: "text-right",
              render: (s) => (
                <span className="font-medium" dir="rtl" lang="ar">
                  {s.name}
                </span>
              ),
            },
            {
              key: "seasonId",
              header: "الفصل",
              render: (s) => s.season?.name ?? s.seasonId,
            },
            {
              key: "startDate",
              header: "البداية",
              render: (s) => new Date(s.startDate).toLocaleDateString("ar-EG"),
            },
            {
              key: "id",
              header: "",
              render: (s) => (
                <Link to={`/admin/stars/${s.id}/edit`} className="text-primary hover:underline">
                  تعديل
                </Link>
              ),
            },
          ]}
          emptyMessage="لا توجد نجوم بعد"
        />
      </div>
    </div>
  );
}
