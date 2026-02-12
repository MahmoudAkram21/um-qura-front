import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listPrayers, deletePrayer } from "@/services/api";
import type { Prayer } from "@/types/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

export function AdminPrayersPage() {
  const navigate = useNavigate();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    listPrayers({ page, limit })
      .then((r) => {
        setPrayers(r.prayers);
        setTotalPages(r.totalPages);
      })
      .catch((e: unknown) => {
        const msg =
          e && typeof e === "object" && "response" in e
            ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setError(msg ?? (e instanceof Error ? e.message : "فشل تحميل الأدعية"));
      })
      .finally(() => setLoading(false));
  }, [page]);

  async function handleDelete(id: number) {
    if (!confirm("حذف هذا الدعاء؟")) return;
    setError(null);
    try {
      await deletePrayer(id);
      const r = await listPrayers({ page, limit });
      setPrayers(r.prayers);
      setTotalPages(r.totalPages);
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل حذف الدعاء"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">الأدعية</h1>
        <Link to="/admin/prayers/new">
          <Button>إضافة دعاء</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : (
        <>
          <DataTable<Prayer>
            data={prayers}
            keyExtractor={(p) => p.id}
            columns={[
              {
                key: "text",
                header: "نص الدعاء",
                className: "text-right max-w-md",
                render: (p) => (
                  <span dir="rtl" lang="ar" className="block">
                    {truncate(p.text, 120)}
                  </span>
                ),
              },
              {
                key: "id",
                header: "",
                render: (p) => (
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/prayers/${p.id}/edit`}>
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
                        <DropdownMenuItem onClick={() => navigate(`/admin/prayers/${p.id}/edit`)}>
                          <Pencil className="me-2 size-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-destructive">
                          <Trash2 className="me-2 size-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ),
              },
            ]}
            emptyMessage="لا توجد أدعية. أضف دعاء أعلاه."
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
