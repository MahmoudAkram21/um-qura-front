import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createStar, listSeasons } from "@/services/api";
import type { Season } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddStar() {
  const navigate = useNavigate();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    seasonId: 0,
    startDate: "",
    endDate: "",
    description: "",
    weatherInfo: "",
    agriculturalInfo: [] as string[],
    tips: [] as string[],
  });

  useEffect(() => {
    listSeasons().then((list) => {
      setSeasons(list);
      if (list.length && !form.seasonId) setForm((f) => ({ ...f, seasonId: list[0].id }));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.seasonId) return;
    setError(null);
    setSaving(true);
    try {
      await createStar({
        seasonId: form.seasonId,
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description || null,
        weatherInfo: form.weatherInfo || null,
        agriculturalInfo: form.agriculturalInfo,
        tips: form.tips,
      });
      navigate("/admin/stars");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg ?? (e instanceof Error ? e.message : "فشل إنشاء النجمة"));
    } finally {
      setSaving(false);
    }
  }

  function addListItem(key: "agriculturalInfo" | "tips", value: string) {
    if (!value.trim()) return;
    setForm((f) => ({ ...f, [key]: [...f[key], value.trim()] }));
  }

  function removeListItem(key: "agriculturalInfo" | "tips", index: number) {
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));
  }

  const noSeasons = seasons.length === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إضافة نجمة</h1>
      {noSeasons && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          أنشئ فصلاً واحداً على الأقل أولاً من{" "}
          <Link to="/admin/seasons" className="font-medium underline">الفصول</Link>.
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>البيانات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">الاسم</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">الفصل</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.seasonId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seasonId: Number(e.target.value) }))
                  }
                >
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">تاريخ البداية</label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, startDate: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">تاريخ النهاية</label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, endDate: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">الوصف</label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">معلومات الطقس</label>
                <Textarea
                  value={form.weatherInfo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, weatherInfo: e.target.value }))
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>قوائم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <DynamicList
                title="معلومات زراعية"
                items={form.agriculturalInfo}
                onAdd={(v) => addListItem("agriculturalInfo", v)}
                onRemove={(i) => removeListItem("agriculturalInfo", i)}
              />
              <DynamicList
                title="نصائح"
                items={form.tips}
                onAdd={(v) => addListItem("tips", v)}
                onRemove={(i) => removeListItem("tips", i)}
              />
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex gap-2">
          <Button type="submit" disabled={saving || noSeasons}>
            {saving ? "جاري الحفظ..." : "إنشاء"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/stars")}>
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
}

function DynamicList({
  title,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{title}</label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(input);
              setInput("");
            }
          }}
          placeholder="إضافة عنصر..."
        />
        <Button type="button" variant="outline" onClick={() => { onAdd(input); setInput(""); }}>
          إضافة
        </Button>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center justify-between rounded border px-2 py-1">
            <span className="text-sm">{item}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(i)}>
              إزالة
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
