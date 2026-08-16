import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, User, Lock, Bell } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { Section, StateChip, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";

export const Route = createFileRoute("/caregiver")({
  head: () => ({
    meta: [
      { title: "Caregiver View — CarePath" },
      {
        name: "description",
        content:
          "Authorized caregivers can follow the patient's treatment progress, upcoming actions, pending requirements and alerts.",
      },
      { property: "og:title", content: "Caregiver View — CarePath" },
      {
        property: "og:description",
        content: "Follow patient progress, pending requirements and alerts as an authorized caregiver.",
      },
    ],
  }),
  component: CaregiverView,
});

const REQUIREMENTS = [
  { label: "Referral letter", ok: true },
  { label: "Previous ECG", ok: true },
  { label: "Blood report", ok: true },
  { label: "Insurance document", ok: false },
];

function CaregiverView() {
  const { t, stages, notifications, completedCount, docs } = useCarePath();
  const nextStage = stages.find((s) => s.state !== "completed");
  const caregiverAlerts = notifications.filter((n) => n.audience === "caregiver").slice(0, 3);
  const shared = docs.filter((d) => d.sharedWithCaregiver);

  return (
    <AppShell title={t.nav_caregiver} subtitle={`${CAREGIVER.name} · ${t.role_caregiver}`}>
      <div className="card-soft mb-6 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">{t.linkedPatient}</p>
            <p className="text-lg font-semibold">{PATIENT.name}</p>
            <p className="text-sm text-muted-foreground">
              {t.relationship}: {CAREGIVER.relationship} · {PATIENT.location}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{t.currentStatus}</p>
          <p className="font-medium">
            {(t[nextStage?.key as keyof typeof t] as string) ?? ""} — {t.pending}
          </p>
          <Progress value={(completedCount / stages.length) * 100} className="mt-3 h-2.5" />
          <p className="mt-1.5 text-sm text-muted-foreground">
            {completedCount} {t.stagesCompleted}
          </p>
        </div>
      </div>

      <Section title={t.upcomingAction}>
        <div className="card-soft p-5">
          <p className="font-medium">Cardiology consultation</p>
          <p className="text-sm text-muted-foreground">18 Aug 2026 · CityCare Hospital</p>
          <div className="mt-3">
            <StateChip state="pending" />
          </div>
        </div>
      </Section>

      <Section title={t.requirements}>
        <ul className="card-soft divide-y divide-border">
          {REQUIREMENTS.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 p-4">
              <span className="font-medium">{r.label}</span>
              {r.ok ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                  <CheckCircle2 className="size-4" /> {t.completed}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive">
                  <AlertTriangle className="size-4" /> {t.pending}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.alerts}>
        <ul className="card-soft divide-y divide-border">
          {caregiverAlerts.map((n) => (
            <li key={n.id} className="flex items-start gap-3 p-4">
              <Bell className="mt-0.5 size-5 shrink-0 text-warning" />
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="card-soft mb-6 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lock className="size-4 text-primary" /> Authorized access only
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {CAREGIVER.name} can view {shared.length} shared documents, journey status and alerts.
          Private notes, contact details and unshared documents remain visible only to the patient.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shared.map((d) => (
            <Tag key={d.id} tone="primary">
              {d.title}
            </Tag>
          ))}
          <Tag>Private notes — hidden</Tag>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/journey">
          <Button>{t.viewJourney}</Button>
        </Link>
        <Link to="/documents">
          <Button variant="outline">{t.viewDocuments}</Button>
        </Link>
        <Link to="/tickets">
          <Button variant="ghost">{t.contactSupport}</Button>
        </Link>
      </div>
    </AppShell>
  );
}