import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOccasions, deleteOccasion } from "@/services/api";
import type { Occasion } from "@/types/api";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function AdminOccasionsPage() {
  const navigate = useNavigate();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    listOccasions({ page, limit })
      .then((r) => {
        setOccasions(r.occasions);
        setTotalPages(r.totalPages);
      })
      .catch((e: unknown) => {
        const msg =
          e && typeof e === "object" && "response" in e
            ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setError(msg ?? (e instanceof Error ? e.message : "فشل تحميل المناسبات"));
      })
      .finally(() => setLoading(false));
  }, [page]);

  async function handleDelete(id: number) {
    if (!confirm("حذف هذه المناسبة؟")) return;
    setError(null);
    try {
      await deleteOccasion(id);
      const r = await listOccasions({ page, limit });
      setOccasions(r.occasions);
      setTotalPages(r.totalPages);
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل حذف المناسبة"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">المناسبات</h1>
        <Link to="/admin/occasions/new">
          <Button>إضافة مناسبة</Button>
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
          <DataTable<Occasion>
            data={occasions}
            keyExtractor={(o) => o.id}
            columns={[
              {
                key: "title",
                header: "عنوان المناسبة",
                className: "text-right",
                render: (o) => <span dir="rtl" lang="ar">{o.title}</span>,
              },
              {
                key: "hijriDisplay",
                header: "التاريخ الهجري",
                render: (o) => o.hijriDisplay ?? `${o.hijriDay} ${o.hijriMonth}`,
              },
              {
                key: "prayerTitle",
                header: "عنوان الدعاء",
                className: "text-right",
                render: (o) => <span dir="rtl" lang="ar">{o.prayerTitle}</span>,
              },
              {
                key: "id",
                header: "",
                render: (o) => (
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/occasions/${o.id}/edit`}>
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
                        <DropdownMenuItem onClick={() => navigate(`/admin/occasions/${o.id}/edit`)}>
                          <Pencil className="me-2 size-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(o.id)} className="text-destructive">
                          <Trash2 className="me-2 size-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ),
              },
            ]}
            emptyMessage="لا توجد مناسبات. أضف مناسبة أعلاه."
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
