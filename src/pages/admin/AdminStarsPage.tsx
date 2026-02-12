import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listStars, listSeasons, deleteStar } from "@/services/api";
import type { Star as StarType, Season } from "@/types/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function AdminStarsPage() {
  const navigate = useNavigate();
  const [stars, setStars] = useState<StarType[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seasonId, setSeasonId] = useState<number | undefined>(undefined);
  const limit = 10;

  useEffect(() => {
    listSeasons().then(setSeasons).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    listStars({ page, limit, seasonId })
      .then((r) => {
        setStars(r.stars);
        setTotalPages(r.totalPages);
      })
      .catch((e: unknown) => {
        const msg = e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
        setError(msg ?? (e instanceof Error ? e.message : "فشل تحميل النجوم"));
      })
      .finally(() => setLoading(false));
  }, [page, seasonId]);

  async function handleDelete(id: number) {
    if (!confirm("حذف هذه النجمة؟")) return;
    setError(null);
    try {
      await deleteStar(id);
      const r = await listStars({ page, limit, seasonId });
      setStars(r.stars);
      setTotalPages(r.totalPages);
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل حذف النجمة"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">النجوم</h1>
        <Link to="/admin/stars/new">
          <Button>إضافة نجمة</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">الفصل</span>
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={seasonId ?? ""}
            onChange={(e) => {
              setSeasonId(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
          >
            <option value="">الكل</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : (
        <>
          <DataTable<StarType>
            data={stars}
            keyExtractor={(s) => s.id}
            columns={[
              { key: "name", header: "الاسم", render: (s) => <span dir="rtl" lang="ar">{s.name}</span> },
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
                key: "endDate",
                header: "النهاية",
                render: (s) => new Date(s.endDate).toLocaleDateString("ar-EG"),
              },
              {
                key: "id",
                header: "",
                render: (s) => (
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/stars/${s.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        تعديل
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/stars/${s.id}/edit`)}>
                          <Pencil className="me-2 size-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(s.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="me-2 size-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ),
              },
            ]}
            emptyMessage="لا توجد نجوم. أضف نجمة أو غيّر الفلتر."
          />
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
