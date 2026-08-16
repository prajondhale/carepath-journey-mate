import { createFileRoute } from "@tanstack/react-router";
import { User, Phone, MapPin, IdCard, Users, Languages, LogOut } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { Section, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/carepath/i18n";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Access — CarePath" },
      {
        name: "description",
        content:
          "Patient profile, ABHA identity, linked caregiver access and language preference in CarePath.",
      },
      { property: "og:title", content: "Profile & Access — CarePath" },
      {
        property: "og:description",
        content: "Your identity, linked caregiver and language preference.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t, role, setRole, lang } = useCarePath();
  const language = LANGUAGES.find((l) => l.code === lang);

  return (
    <AppShell title={t.nav_profile}>
      <div className="card-soft mb-6 flex items-center gap-4 p-5">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
          {PATIENT.name.charAt(0)}
        </span>
        <div>
          <p className="text-lg font-semibold">{PATIENT.name}</p>
          <p className="text-sm text-muted-foreground">
            {PATIENT.age} years · {PATIENT.gender} · {PATIENT.blood}
          </p>
          <div className="mt-2 flex gap-1.5">
            <Tag tone="primary">{t.abhaLinked}</Tag>
            <Tag tone={role === "patient" ? "success" : "info"}>
              {role === "patient" ? t.role_patient : t.role_caregiver}
            </Tag>
          </div>
        </div>
      </div>

      <Section title="Identity & contact">
        <ul className="card-soft divide-y divide-border">
          <Item Icon={IdCard} label="ABHA number" value={PATIENT.abha} />
          <Item Icon={Phone} label="Mobile" value={PATIENT.phone} />
          <Item Icon={MapPin} label="Location" value={PATIENT.location} />
          <Item Icon={User} label="Patient ID" value="CP-PT-004821" />
        </ul>
      </Section>

      <Section title="Linked caregiver">
        <ul className="card-soft divide-y divide-border">
          <Item Icon={Users} label={CAREGIVER.name} value={CAREGIVER.relationship} />
          <Item Icon={Phone} label="Mobile" value={CAREGIVER.phone} />
          <Item Icon={User} label="Access level" value={CAREGIVER.access} />
        </ul>
      </Section>

      <Section title={t.nav_language}>
        <ul className="card-soft divide-y divide-border">
          <Item
            Icon={Languages}
            label={t.chooseLanguage}
            value={`${language?.native ?? "English"}`}
          />
        </ul>
      </Section>

      <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="font-medium">{t.switchRole}</p>
          <p className="text-sm text-muted-foreground">
            Demo only — switch between the patient and caregiver experience.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setRole(role === "patient" ? "caregiver" : "patient")}
        >
          <LogOut className="size-4" />
          {role === "patient" ? t.role_caregiver : t.role_patient}
        </Button>
      </div>
    </AppShell>
  );
}

function Item({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3 p-4">
      <Icon className="size-5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 text-sm text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </li>
  );
}