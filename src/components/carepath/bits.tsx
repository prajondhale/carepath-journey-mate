import type { ReactNode } from "react";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { StageState } from "@/lib/carepath/store";
import { useCarePath } from "@/lib/carepath/store";

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StateChip({ state }: { state: StageState }) {
  const { t } = useCarePath();
  const map = {
    completed: {
      cls: "bg-success/12 text-success border-success/30",
      Icon: CheckCircle2,
      label: t.completed,
    },
    pending: {
      cls: "bg-warning/18 text-warning-foreground border-warning/40",
      Icon: Clock,
      label: t.pending,
    },
    gap: {
      cls: "bg-destructive/10 text-destructive border-destructive/30",
      Icon: AlertTriangle,
      label: t.gap,
    },
  }[state];
  const Icon = map.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${map.cls}`}
    >
      <Icon className="size-3.5" />
      {map.label}
    </span>
  );
}

export function Tag({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "info" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    muted: "bg-muted text-muted-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/25",
    info: "bg-info/10 text-info border-info/25",
    success: "bg-success/12 text-success border-success/30",
    warning: "bg-warning/18 text-warning-foreground border-warning/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function DemoBanner({ text }: { text: string }) {
  return (
    <p className="mb-5 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
      {text}
    </p>
  );
}