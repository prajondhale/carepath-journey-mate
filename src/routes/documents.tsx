import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, Share2, Sparkles, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { DemoBanner, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCarePath, type CareDoc } from "@/lib/carepath/store";
import { toast } from "sonner";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "My Health Documents — CarePath" },
      {
        name: "description",
        content:
          "ABHA-linked health documents organised automatically: lab reports, prescriptions and referrals with verification status.",
      },
      { property: "og:title", content: "My Health Documents — CarePath" },
      {
        property: "og:description",
        content: "Reports, prescriptions and referrals organised in one secure place.",
      },
    ],
  }),
  component: Documents,
});

function Documents() {
  const { t, docs, shareDoc } = useCarePath();
  const [open, setOpen] = useState<CareDoc | null>(null);

  return (
    <AppShell title={t.nav_documents} subtitle="ABHA Document Intelligence">
      <DemoBanner text="Demonstration only — documents are mock records, not a live ABHA API connection." />

      <div className="grid gap-4 sm:grid-cols-2">
        {docs.map((d) => (
          <article key={d.id} className="card-soft flex flex-col p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug">{d.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {d.type} · {d.date}
                </p>
                <p className="text-sm text-muted-foreground">{d.hospital}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag tone="info">
                <Sparkles className="size-3" /> {t.aiExtracted}
              </Tag>
              <Tag tone="primary">{t.abhaLinked}</Tag>
              <Tag tone={d.verified ? "success" : "warning"}>
                <ShieldCheck className="size-3" /> {d.verified ? t.verified : t.unverified}
              </Tag>
            </div>

            <dl className="mt-4 space-y-1.5 rounded-lg bg-muted/60 p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.extracted}
              </p>
              {d.extracted.slice(0, 2).map((e) => (
                <div key={e.label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{e.label}</dt>
                  <dd className="text-right font-medium">{e.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setOpen(d)}>
                {t.view}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(`${d.title} — download started (demo)`)}
              >
                <Download className="size-4" /> {t.download}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={d.sharedWithCaregiver}
                onClick={() => {
                  shareDoc(d.id);
                  toast.success("Shared with authorized caregiver");
                }}
              >
                <Share2 className="size-4" />
                {d.sharedWithCaregiver ? "Shared" : t.share}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>
              {open?.id} · {open?.hospital} · {open?.date}
            </DialogDescription>
          </DialogHeader>
          <dl className="space-y-2 text-sm">
            {open?.extracted.map((e) => (
              <div key={e.label} className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">{e.label}</dt>
                <dd className="text-right font-medium">{e.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-muted-foreground">
            SHA-256: <span className="break-all font-mono">{open?.checksum}</span>
          </p>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}