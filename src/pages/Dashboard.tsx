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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of seasons and stars</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard title="Seasons" value={seasonsCount} icon={Sun} />
        <StatCard title="Total Stars" value={starsCount} icon={Star} />
        <StatCard title="Calendar" value="Public" icon={Calendar} description="View at /calendar" />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Stars</h2>
        <DataTable<StarType>
          data={recentStars}
          keyExtractor={(s) => s.id}
          columns={[
            { key: "name", header: "Name" },
            {
              key: "seasonId",
              header: "Season",
              render: (s) => s.season?.name ?? s.seasonId,
            },
            {
              key: "startDate",
              header: "Start",
              render: (s) => new Date(s.startDate).toLocaleDateString(),
            },
            {
              key: "id",
              header: "",
              render: (s) => (
                <Link to={`/admin/stars/${s.id}/edit`} className="text-primary hover:underline">
                  Edit
                </Link>
              ),
            },
          ]}
          emptyMessage="No stars yet"
        />
      </div>
    </div>
  );
}
