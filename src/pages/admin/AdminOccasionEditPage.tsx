import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOccasionById, updateOccasion } from "@/services/api";
import type { Occasion } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HIJRI_MONTH_OPTIONS } from "@/lib/hijriMonths";

export function AdminOccasionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    hijriMonth: 1,
    hijriDay: 1,
    title: "",
    prayerTitle: "",
    prayerText: "",
  });

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      setLoading(false);
      return;
    }
    setError(null);
    getOccasionById(numId)
      .then((o) => {
        setOccasion(o);
        setForm({
          hijriMonth: o.hijriMonth,
          hijriDay: o.hijriDay,
          title: o.title,
          prayerTitle: o.prayerTitle,
          prayerText: o.prayerText ?? "",
        });
      })
      .catch(() => setOccasion(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!occasion) return;
    setError(null);
    setSaving(true);
    try {
      await updateOccasion(occasion.id, {
        hijriMonth: form.hijriMonth,
        hijriDay: form.hijriDay,
        title: form.title,
        prayerTitle: form.prayerTitle,
        prayerText: form.prayerText || null,
      });
      navigate("/admin/occasions");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل تحديث المناسبة"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">جاري التحميل...</p>;
  if (!occasion) return <p className="text-destructive">المناسبة غير موجودة</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تعديل المناسبة</h1>
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>البيانات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">الشهر الهجري</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.hijriMonth}
                  onChange={(e) => setForm((f) => ({ ...f, hijriMonth: Number(e.target.value) }))}
                >
                  {HIJRI_MONTH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">اليوم الهجري (1–30)</label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={form.hijriDay}
                  onChange={(e) => setForm((f) => ({ ...f, hijriDay: Number(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">عنوان المناسبة</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">عنوان الدعاء</label>
              <Input
                value={form.prayerTitle}
                onChange={(e) => setForm((f) => ({ ...f, prayerTitle: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">نص الدعاء (اختياري)</label>
              <Textarea
                value={form.prayerText}
                onChange={(e) => setForm((f) => ({ ...f, prayerText: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/occasions")}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
