import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Lock, Upload, ScanLine, KeyRound } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { DemoBanner, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { useCarePath } from "@/lib/carepath/store";
import { toast } from "sonner";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Document Verification & Security — CarePath" },
      {
        name: "description",
        content:
          "Check document integrity with checksums, encryption indicators and an end-to-end verification chain.",
      },
      { property: "og:title", content: "Document Verification & Security — CarePath" },
      {
        property: "og:description",
        content: "Document integrity, encryption indicators and authorized access, explained simply.",
      },
    ],
  }),
  component: Security,
});

const CHAIN = [
  { label: "Uploaded", Icon: Upload },
  { label: "Encrypted", Icon: Lock },
  { label: "Integrity Checked", Icon: ScanLine },
  { label: "Verified", Icon: ShieldCheck },
  { label: "Authorized Access", Icon: KeyRound },
];

function Security() {
  const { t, docs, verifyDoc } = useCarePath();
  const [selected, setSelected] = useState(docs.find((d) => !d.verified)?.id ?? docs[0]!.id);
  const doc = docs.find((d) => d.id === selected)!;
  const reached = doc.verified ? 5 : 3;

  return (
    <AppShell title={t.nav_security}>
      <DemoBanner text="UI demonstration of the intended security architecture — no real medical encryption or compliance claims." />

      <div className="mb-5 flex flex-wrap gap-2">
        {docs.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              d.id === selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      <div className="card-soft mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-sm text-muted-foreground">
              {doc.hospital} · {doc.date}
            </p>
          </div>
          <Tag tone={doc.verified ? "success" : "warning"}>
            <ShieldCheck className="size-3.5" />
            {doc.verified ? t.encryptedVerified : t.unverified}
          </Tag>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <Row label="Document ID" value={doc.id} />
          <Row label="Source hospital" value={doc.hospital} />
          <Row label="Timestamp" value={`${doc.date}, 09:24 IST`} />
          <Row label="Verification status" value={doc.verified ? t.verified : t.unverified} />
          <div>
            <dt className="text-muted-foreground">SHA-256 checksum</dt>
            <dd className="mt-1 break-all rounded-lg bg-muted p-2 font-mono text-xs">
              {doc.checksum}
            </dd>
          </div>
        </dl>

        {!doc.verified && (
          <Button
            className="mt-4"
            onClick={() => {
              verifyDoc(doc.id);
              toast.success("Integrity check passed — document verified");
            }}
          >
            {t.verifyDocument}
          </Button>
        )}
      </div>

      <h2 className="mb-3 text-base font-semibold">Verification chain</h2>
      <ol className="card-soft grid gap-3 p-5 sm:grid-cols-5">
        {CHAIN.map((c, i) => {
          const done = i < reached;
          const Icon = c.Icon;
          return (
            <li key={c.label} className="flex items-center gap-3 sm:flex-col sm:text-center">
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-success/30 bg-success/12 text-success"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <span className={`text-sm ${done ? "font-semibold" : "text-muted-foreground"}`}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}