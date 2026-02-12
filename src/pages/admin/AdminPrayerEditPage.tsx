import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrayerById, updatePrayer } from "@/services/api";
import type { Prayer } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminPrayerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    if (Number.isNaN(numId)) {
      setLoading(false);
      return;
    }
    setError(null);
    getPrayerById(numId)
      .then((p) => {
        setPrayer(p);
        setText(p.text);
      })
      .catch(() => setPrayer(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prayer || !text.trim()) return;
    setError(null);
    setSaving(true);
    try {
      await updatePrayer(prayer.id, { text: text.trim() });
      navigate("/admin/prayers");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل تحديث الدعاء"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">جاري التحميل...</p>;
  if (!prayer) return <p className="text-destructive">الدعاء غير موجود</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تعديل الدعاء</h1>
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>نص الدعاء</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="min-h-[200px] resize-y"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/prayers")}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
