import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { StateChip, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCarePath, type Stage } from "@/lib/carepath/store";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Treatment Journey Tracker — CarePath" },
      {
        name: "description",
        content:
          "Step-by-step treatment journey from registration to discharge, showing completed, pending and missing requirements.",
      },
      { property: "og:title", content: "Treatment Journey Tracker — CarePath" },
      {
        property: "og:description",
        content: "See what is done, what is pending and what is missing in your treatment.",
      },
    ],
  }),
  component: Journey,
});

function Journey() {
  const { t, stages, docs, completedCount } = useCarePath();
  const [open, setOpen] = useState<Stage | null>(null);

  return (
    <AppShell title={t.nav_journey}>
      <div className="card-soft mb-6 p-5">
        <p className="text-lg font-semibold">
          {completedCount} / {stages.length} {t.stagesCompleted.replace("of 6 ", "")}
        </p>
        <Progress value={(completedCount / stages.length) * 100} className="mt-3 h-2.5" />
      </div>

      <ol className="relative space-y-3 pl-6">
        <span className="absolute left-2 top-3 bottom-3 w-px bg-border" aria-hidden />
        {stages.map((s) => (
          <li key={s.id} className="relative">
            <span
              className={`absolute -left-[1.15rem] top-6 size-3.5 rounded-full ring-4 ring-background ${
                s.state === "completed"
                  ? "bg-success"
                  : s.state === "pending"
                    ? "bg-warning"
                    : "bg-destructive"
              }`}
              aria-hidden
            />
            <button
              onClick={() => setOpen(s)}
              className="card-soft flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-accent/40"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t[s.key as keyof typeof t] as string}</p>
                <p className="text-sm text-muted-foreground">
                  {s.date} · {s.hospital}
                </p>
                <div className="mt-2">
                  <StateChip state={s.state} />
                </div>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ol>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{open ? (t[open.key as keyof typeof t] as string) : ""}</DialogTitle>
            <DialogDescription>
              {open?.date} · {open?.hospital}
            </DialogDescription>
          </DialogHeader>
          {open && (
            <div className="space-y-4 text-sm">
              <StateChip state={open.state} />

              {open.actions.length > 0 && (
                <div>
                  <p className="mb-1 font-semibold">{t.completed}</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {open.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {open.documentIds.length > 0 && (
                <div>
                  <p className="mb-1 font-semibold">{t.documentsLabel}</p>
                  <ul className="space-y-1">
                    {open.documentIds.map((id) => {
                      const d = docs.find((x) => x.id === id);
                      return (
                        <li key={id} className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="size-4" /> {d?.title ?? id}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {open.pending.length > 0 && (
                <div>
                  <p className="mb-1 font-semibold">{t.requirements}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {open.pending.map((p) => (
                      <Tag key={p} tone="warning">
                        {p}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-muted/60 p-3">
                <p className="font-semibold">{t.nextAction}</p>
                <p className="text-muted-foreground">{open.nextAction}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/documents">
                  <Button variant="outline" size="sm">
                    {t.nav_documents}
                  </Button>
                </Link>
                <Link to="/security">
                  <Button variant="outline" size="sm">
                    {t.nav_security}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}