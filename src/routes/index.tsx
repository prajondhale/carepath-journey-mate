import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, User, Users, FileText, Route as RouteIcon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/carepath/i18n";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarePath — Secure Multilingual Health Journey" },
      {
        name: "description",
        content:
          "CarePath organises ABHA-linked documents, tracks the treatment journey and coordinates caregivers for patients in semi-urban Maharashtra.",
      },
      { property: "og:title", content: "CarePath — Secure Multilingual Health Journey" },
      {
        property: "og:description",
        content: "One understandable, trackable and secure treatment journey for patients and caregivers.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, setRole, lang, setLang } = useCarePath();
  const navigate = useNavigate();

  const enter = (role: "patient" | "caregiver") => {
    setRole(role);
    navigate({ to: role === "patient" ? "/dashboard" : "/caregiver" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.appName}</h1>
            <p className="text-sm text-muted-foreground">{t.tagline}</p>
          </div>
        </div>

        <p className="mb-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          A secure, multilingual healthcare journey platform for patients and caregivers in
          semi-urban Maharashtra. Choose how you want to sign in for this demonstration.
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <RoleCard
            Icon={User}
            title={t.role_patient}
            name={PATIENT.name}
            detail={`${PATIENT.age} years · ${PATIENT.location}`}
            onClick={() => enter("patient")}
          />
          <RoleCard
            Icon={Users}
            title={t.role_caregiver}
            name={CAREGIVER.name}
            detail={`${t.relationship}: ${CAREGIVER.relationship}`}
            onClick={() => enter("caregiver")}
          />
        </div>

        <div className="card-soft mb-8 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Languages className="size-4 text-primary" /> {t.chooseLanguage}
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.filter((l) => l.ready).map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  l.code === lang
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <Feature Icon={FileText} text="ABHA document intelligence" />
          <Feature Icon={RouteIcon} text="Treatment journey tracking" />
          <Feature Icon={ShieldCheck} text="Verification & caregiver access" />
        </ul>

        <p className="mt-8 text-xs text-muted-foreground">{t.demoNote}</p>
      </div>
    </div>
  );
}

function RoleCard({
  Icon,
  title,
  name,
  detail,
  onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  name: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <div className="card-soft p-5">
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-muted-foreground">{detail}</p>
      <Button className="mt-4 w-full" onClick={onClick}>
        Continue as {title}
      </Button>
    </div>
  );
}

function Feature({
  Icon,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="size-4 shrink-0 text-primary" />
      {text}
    </li>
  );
}
