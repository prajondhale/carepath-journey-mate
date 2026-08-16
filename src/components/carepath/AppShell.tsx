import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Route as RouteIcon,
  Users,
  Bell,
  ShieldCheck,
  LifeBuoy,
  Languages,
  User,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", key: "nav_dashboard", icon: LayoutDashboard },
  { to: "/documents", key: "nav_documents", icon: FileText },
  { to: "/journey", key: "nav_journey", icon: RouteIcon },
  { to: "/caregiver", key: "nav_caregiver", icon: Users },
  { to: "/notifications", key: "nav_notifications", icon: Bell },
  { to: "/security", key: "nav_security", icon: ShieldCheck },
  { to: "/tickets", key: "nav_tickets", icon: LifeBuoy },
  { to: "/language", key: "nav_language", icon: Languages },
  { to: "/profile", key: "nav_profile", icon: User },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { t, role, setRole, unreadCount } = useCarePath();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const navItems = NAV.map((n) => ({
    ...n,
    label: t[n.key as keyof typeof t] as string,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-sidebar lg:flex">
        <Brand />
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <SideLink
              key={item.to}
              to={item.to}
              label={item.label}
              Icon={item.icon}
              active={pathname === item.to}
              count={item.to === "/notifications" ? unreadCount : 0}
            />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          {t.demoNote}
        </div>
      </aside>

      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Link to="/dashboard" className="hover:text-foreground">
                  {t.appName}
                </Link>
                <ChevronRight className="size-3" />
                <span className="truncate text-foreground">{title}</span>
              </div>
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
            </div>
            <Link
              to="/notifications"
              aria-label={t.nav_notifications}
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setRole(role === "patient" ? "caregiver" : "patient")}
              title={t.switchRole}
              className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 text-left transition-colors hover:bg-accent"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {(role === "patient" ? PATIENT.name : CAREGIVER.name).charAt(0)}
              </span>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-medium">
                  {role === "patient" ? PATIENT.name : CAREGIVER.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {role === "patient" ? t.role_patient : t.role_caregiver}
                </span>
              </span>
            </button>
          </div>
          {open && (
            <nav className="grid gap-1 border-t border-border p-3 lg:hidden">
              {navItems.map((item) => (
                <SideLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  Icon={item.icon}
                  active={pathname === item.to}
                  count={item.to === "/notifications" ? unreadCount : 0}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          )}
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          {subtitle && <p className="mb-5 text-sm text-muted-foreground">{subtitle}</p>}
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card lg:hidden">
        {NAV.slice(0, 5).map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-2 text-[10px] ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="max-w-full truncate px-1">
                {(t[item.key as keyof typeof t] as string).split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Brand() {
  const { t } = useCarePath();
  return (
    <Link to="/dashboard" className="flex items-center gap-3 border-b border-sidebar-border p-5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <ShieldCheck className="size-5" />
      </span>
      <span>
        <span className="block text-lg font-semibold tracking-tight">{t.appName}</span>
        <span className="block text-xs text-muted-foreground">{t.tagline}</span>
      </span>
    </Link>
  );
}

function SideLink({
  to,
  label,
  Icon,
  active,
  count,
  onClick,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  count?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
      }`}
    >
      <Icon className="size-5 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {count ? <Badge variant="destructive">{count}</Badge> : null}
    </Link>
  );
}