import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPrayer } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddPrayer() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);
    setSaving(true);
    try {
      await createPrayer({ text: text.trim() });
      navigate("/admin/prayers");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل إنشاء الدعاء"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إضافة دعاء</h1>
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
              placeholder="اكتب نص الدعاء هنا..."
              rows={8}
              className="min-h-[200px] resize-y"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving || !text.trim()}>
                {saving ? "جاري الحفظ..." : "إنشاء"}
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
