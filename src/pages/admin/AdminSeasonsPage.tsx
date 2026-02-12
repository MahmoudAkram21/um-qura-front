import { useEffect, useState } from "react";
import {
  listSeasons,
  createSeason,
  updateSeason,
  deleteSeason,
} from "@/services/api";
import type { Season } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Season | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    colorHex: "#22c55e",
    iconName: "sun",
    duration: "",
    sortOrder: 0,
  });

  const load = () => {
    setError(null);
    listSeasons()
      .then(setSeasons)
      .catch((e) => setError(e.response?.data?.message ?? e.message ?? "Failed to load seasons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    const name = form.name.trim();
    const duration = form.duration.trim();
    if (!name) {
      setError("Name is required.");
      return;
    }
    if (!duration) {
      setError("Duration is required.");
      return;
    }
    setError(null);
    try {
      if (editing) {
        await updateSeason(editing.id, { ...form, name, duration });
        setEditing(null);
      } else if (adding) {
        await createSeason({ ...form, name, duration });
        setAdding(false);
      }
      setForm({
        name: "",
        colorHex: "#22c55e",
        iconName: "sun",
        duration: "",
        sortOrder: 0,
      });
      await load();
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg ?? (e instanceof Error ? e.message : "Failed to save season"));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this season? Stars in it will also be deleted.")) return;
    setError(null);
    try {
      await deleteSeason(id);
      await load();
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "response" in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : null;
      setError(msg ?? (e instanceof Error ? e.message : "Failed to delete season"));
    }
  }

  function startEdit(s: Season) {
    setEditing(s);
    setAdding(false);
    setForm({
      name: s.name,
      colorHex: s.colorHex,
      iconName: s.iconName,
      duration: s.duration,
      sortOrder: s.sortOrder,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm({
      name: "",
      colorHex: "#22c55e",
      iconName: "sun",
      duration: "",
      sortOrder: seasons.length,
    });
  }

  const showForm = Boolean(editing || adding);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Seasons</h1>
        <Button onClick={startAdd} disabled={showForm}>
          Add Season
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Season" : "New Season"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Winter"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Color (hex)</label>
                <Input
                  type="color"
                  value={form.colorHex}
                  onChange={(e) => setForm((f) => ({ ...f, colorHex: e.target.value }))}
                  className="h-9 w-full cursor-pointer"
                />
                <Input
                  value={form.colorHex}
                  onChange={(e) => setForm((f) => ({ ...f, colorHex: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Icon name</label>
                <Input
                  value={form.iconName}
                  onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}
                  placeholder="sun"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Duration</label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="e.g. Dec - Feb"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Sort order</label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setAdding(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable<Season>
          data={seasons}
          keyExtractor={(s) => s.id}
          columns={[
            { key: "name", header: "Name" },
            {
              key: "colorHex",
              header: "Color",
              render: (s) => (
                <span
                  className="inline-block h-6 w-10 rounded border border-border/60"
                  style={{ backgroundColor: s.colorHex }}
                  title={s.colorHex}
                />
              ),
            },
            { key: "duration", header: "Duration" },
            { key: "sortOrder", header: "Order" },
            {
              key: "id",
              header: "Actions",
              render: (s) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEdit(s)}>
                      <Pencil className="me-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(s.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="me-2 size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
          emptyMessage="No seasons. Add one above."
        />
      )}
    </div>
  );
}
