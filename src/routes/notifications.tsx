import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CalendarClock, FileText, ShieldCheck, Check } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { useCarePath } from "@/lib/carepath/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications Centre — CarePath" },
      {
        name: "description",
        content:
          "Inbox of patient and caregiver alerts: appointment reminders, missing requirements, new documents and access events.",
      },
      { property: "og:title", content: "Notifications Centre — CarePath" },
      {
        property: "og:description",
        content: "Appointment reminders and missing requirements, separated by patient and caregiver.",
      },
    ],
  }),
  component: Notifications,
});

const ICONS = {
  requirement: AlertTriangle,
  appointment: CalendarClock,
  document: FileText,
  security: ShieldCheck,
};

const CAT_LABEL = {
  requirement: "Requirement Gap",
  appointment: "Appointment",
  document: "Document",
  security: "Security",
};

function Notifications() {
  const { t, notifications, markRead, markAllRead, unreadCount } = useCarePath();
  const [tab, setTab] = useState<"all" | "patient" | "caregiver">("all");
  const list = notifications.filter((n) => tab === "all" || n.audience === tab);

  return (
    <AppShell title={t.nav_notifications}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {(["all", "patient", "caregiver"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === k
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "all" ? t.all : k === "patient" ? t.role_patient : t.role_caregiver}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {unreadCount} {t.unread}
          </span>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            {t.markAllRead}
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {list.map((n) => {
          const Icon = ICONS[n.category];
          return (
            <li
              key={n.id}
              className={`card-soft flex items-start gap-3 p-4 ${n.read ? "opacity-70" : ""}`}
            >
              <span
                className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  n.severity === "important"
                    ? "bg-destructive/10 text-destructive"
                    : n.severity === "warning"
                      ? "bg-warning/20 text-warning-foreground"
                      : "bg-info/10 text-info"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag>{CAT_LABEL[n.category]}</Tag>
                  <Tag tone={n.audience === "patient" ? "primary" : "info"}>
                    {n.audience === "patient" ? t.role_patient : t.role_caregiver}
                  </Tag>
                  {!n.read && <Tag tone="warning">{t.unread}</Tag>}
                </div>
                <p className="mt-1.5 font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>
                  <Check className="size-4" /> <span className="hidden sm:inline">{t.markRead}</span>
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}