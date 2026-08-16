import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, FileText, AlertTriangle, UserCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { Section, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CarePath Health Journey" },
      {
        name: "description",
        content:
          "CarePath dashboard: treatment journey progress, next action, recent health documents and alerts for patients in Maharashtra.",
      },
      { property: "og:title", content: "Dashboard — CarePath Health Journey" },
      {
        property: "og:description",
        content: "Track treatment progress, documents and next steps in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, docs, stages, notifications, completedCount } = useCarePath();
  const nextStage = stages.find((s) => s.state !== "completed");
  const alerts = notifications.filter((n) => !n.read).slice(0, 3);

  return (
    <AppShell title={t.nav_dashboard}>
      <div className="card-soft mb-6 p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          {t.greeting}, {PATIENT.firstName}
        </p>
        <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{t.journeyStatus}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} {t.stagesCompleted}
        </p>
        <Progress value={(completedCount / stages.length) * 100} className="mt-4 h-2.5" />
        <Link to="/journey" className="mt-4 inline-flex">
          <Button variant="outline">
            {t.viewJourney} <ArrowRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>

      <Section title={t.nextAction}>
        <div className="card-soft p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-medium">{nextStage?.nextAction}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {nextStage?.date} · {nextStage?.hospital}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {nextStage?.pending.map((p) => (
                  <Tag key={p} tone="warning">
                    {p}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
          <Link to="/journey" className="mt-4 inline-flex">
            <Button>{t.viewJourney}</Button>
          </Link>
        </div>
      </Section>

      <Section
        title={t.recentDocuments}
        action={
          <Link to="/documents" className="text-sm font-medium text-primary hover:underline">
            {t.viewAll}
          </Link>
        }
      >
        <ul className="card-soft divide-y divide-border">
          {docs.slice(0, 3).map((d) => (
            <li key={d.id} className="flex items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{d.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {d.hospital} · {d.date}
                </p>
              </div>
              <Tag tone={d.verified ? "success" : "warning"}>
                {d.verified ? t.verified : t.unverified}
              </Tag>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title={t.alerts}
        action={
          <Link to="/notifications" className="text-sm font-medium text-primary hover:underline">
            {t.viewAll}
          </Link>
        }
      >
        <ul className="card-soft divide-y divide-border">
          {alerts.map((n) => (
            <li key={n.id} className="flex items-start gap-3 p-4">
              <AlertTriangle
                className={`mt-0.5 size-5 shrink-0 ${
                  n.severity === "important"
                    ? "text-destructive"
                    : n.severity === "warning"
                      ? "text-warning"
                      : "text-info"
                }`}
              />
              <div className="min-w-0">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-success/12 text-success">
            <UserCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">{t.caregiverStatus}</p>
            <p className="font-medium">
              {CAREGIVER.name} — {t.connected}
            </p>
          </div>
        </div>
        <Link to="/caregiver">
          <Button variant="outline">{t.nav_caregiver}</Button>
        </Link>
      </div>
    </AppShell>
  );
}