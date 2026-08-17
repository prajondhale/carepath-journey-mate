import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ShieldCheck,
  User,
  Users,
  Languages,
  Loader2,
  Check,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LANGUAGES } from "@/lib/carepath/i18n";
import { useCarePath, PATIENT, CAREGIVER } from "@/lib/carepath/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarePath — Link Your Health Records in Minutes" },
      {
        name: "description",
        content:
          "Pick your role and language, then link ABHA health records from connected hospitals in one short CarePath onboarding flow.",
      },
      { property: "og:title", content: "CarePath — Link Your Health Records" },
      {
        property: "og:description",
        content:
          "A one-minute onboarding: identify yourself, match records from connected systems, consent, and open your CarePath dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

type Step = "role" | "language" | "link";
type Phase = "form" | "matching" | "records" | "done";

const MATCHED = [
  { id: "DOC-8842", title: "Blood Test", hospital: "District Hospital" },
  { id: "DOC-8815", title: "Prescription", hospital: "CityCare Hospital" },
  { id: "DOC-8790", title: "Referral", hospital: "Primary Health Centre" },
  { id: "DOC-8702", title: "ECG Report", hospital: "District Hospital" },
];

function Onboarding() {
  const { t, role, setRole, lang, setLang } = useCarePath();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("role");
  const [phase, setPhase] = useState<Phase>("form");
  const [consent, setConsent] = useState(false);
  const [selected, setSelected] = useState<string[]>(MATCHED.map((m) => m.id));

  const [abha, setAbha] = useState(PATIENT.abha);
  const [name, setName] = useState(PATIENT.name);
  const [dob, setDob] = useState("1972-04-11");
  const [phone, setPhone] = useState("9812345210");
  const [aadhaar, setAadhaar] = useState("");
  const [relationship, setRelationship] = useState(CAREGIVER.relationship);

  const isCaregiver = role === "caregiver";

  const runMatch = () => {
    setPhase("matching");
    window.setTimeout(() => setPhase("records"), 1400);
  };

  const finish = () => {
    setPhase("done");
  };

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.appName}</h1>
            <p className="text-sm text-muted-foreground">{t.tagline}</p>
          </div>
        </div>

        <StepBar step={step} />

        {step === "role" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <RoleCard
              Icon={User}
              title={t.role_patient}
              name={PATIENT.name}
              detail={`${PATIENT.age} years · ${PATIENT.location}`}
              onClick={() => {
                setRole("patient");
                setStep("language");
              }}
            />
            <RoleCard
              Icon={Users}
              title={t.role_caregiver}
              name={CAREGIVER.name}
              detail={`${t.relationship}: ${CAREGIVER.relationship}`}
              onClick={() => {
                setRole("caregiver");
                setStep("language");
              }}
            />
          </div>
        )}

        {step === "language" && (
          <div className="card-soft p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Languages className="size-4 text-primary" /> {t.chooseLanguage}
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
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
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Other supported Indian languages (coming soon)
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {LANGUAGES.filter((l) => !l.ready).map((l) => (
                <span
                  key={l.code}
                  className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {l.native}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("role")}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep("link")}>
                Continue <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "link" && phase !== "done" && (
          <div className="card-soft p-5">
            <h2 className="text-lg font-semibold">
              {isCaregiver ? "Link a Patient" : "Link Your Health Records"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isCaregiver
                ? "Enter the patient's health ID to request caregiver access."
                : "We use these details to match records across connected hospitals."}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                label={isCaregiver ? "Patient ABHA Number / ABHA Address" : "ABHA Number / ABHA Address"}
                value={abha}
                onChange={setAbha}
              />
              <Field
                label={isCaregiver ? "Patient Name" : "Full Name"}
                value={name}
                onChange={setName}
                className={isCaregiver ? "" : "sm:col-span-2"}
              />
              {isCaregiver ? (
                <Field label="Relationship" value={relationship} onChange={setRelationship} />
              ) : (
                <>
                  <Field label="Date of Birth" value={dob} onChange={setDob} type="date" />
                  <Field label="Mobile Number" value={phone} onChange={setPhone} />
                  <Field
                    className="sm:col-span-2"
                    label="Aadhaar Verification (optional)"
                    value={aadhaar}
                    onChange={setAadhaar}
                    placeholder="xxxx xxxx xxxx"
                  />
                </>
              )}
            </div>

            {phase === "form" && (
              <Button className="mt-5 w-full" onClick={runMatch}>
                {isCaregiver ? "Find Patient" : "Verify & Find Records"}
              </Button>
            )}

            {phase === "matching" && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-accent p-4 text-sm">
                <Loader2 className="size-4 animate-spin text-primary" />
                {isCaregiver
                  ? "Searching connected healthcare records for this patient..."
                  : "Matching your details with connected healthcare records..."}
              </div>
            )}

            {phase === "records" && (
              <div className="mt-5 space-y-4">
                <div className="space-y-1 rounded-lg bg-accent p-4 text-sm">
                  <Ok text={isCaregiver ? "Patient found" : "Identity matched"} />
                  <Ok text={isCaregiver ? `${name} · ${PATIENT.location}` : "Records found"} />
                </div>

                {!isCaregiver && (
                  <div className="rounded-lg border border-border">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2">
                      <span className="text-sm font-semibold">Review Records</span>
                      <button
                        className="text-xs font-medium text-primary"
                        onClick={() =>
                          setSelected(
                            selected.length === MATCHED.length ? [] : MATCHED.map((m) => m.id),
                          )
                        }
                      >
                        {selected.length === MATCHED.length ? "Clear All" : "Select All"}
                      </button>
                    </div>
                    <ul>
                      {MATCHED.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0"
                        >
                          <Checkbox
                            checked={selected.includes(m.id)}
                            onCheckedChange={() => toggle(m.id)}
                          />
                          <FileText className="size-4 text-primary" />
                          <span className="text-sm">
                            <span className="font-medium">{m.title}</span>
                            <span className="text-muted-foreground"> — {m.hospital}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="flex items-start gap-3 text-sm">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                  />
                  <span>
                    {isCaregiver
                      ? "I confirm I am an authorized caregiver and request access to this patient's CarePath records."
                      : "I consent to CarePath linking my healthcare records from connected systems."}
                  </span>
                </label>

                <Button
                  className="w-full"
                  disabled={!consent || (!isCaregiver && selected.length === 0)}
                  onClick={finish}
                >
                  {isCaregiver ? "Request Access" : "Link & Continue"}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === "done" && (
          <div className="card-soft p-5">
            <h2 className="text-lg font-semibold">
              {isCaregiver ? "Access Granted" : "Setup Complete"}
            </h2>
            <div className="mt-3 space-y-1 rounded-lg bg-accent p-4 text-sm">
              {isCaregiver ? (
                <>
                  <Ok text="Caregiver identity verified" />
                  <Ok text="Access granted by patient" />
                  <Ok text={`Linked to ${name}'s CarePath`} />
                </>
              ) : (
                <>
                  <Ok text="Health identity verified" />
                  <Ok text={`Records linked (${selected.length})`} />
                  <Ok text="Treatment journey generated" />
                </>
              )}
            </div>
            <Button
              className="mt-5 w-full"
              onClick={() => navigate({ to: isCaregiver ? "/caregiver" : "/dashboard" })}
            >
              {isCaregiver ? "View Patient CarePath" : "Go to CarePath"}
            </Button>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground">{t.demoNote}</p>
      </div>
    </div>
  );
}

function StepBar({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "role", label: "Role" },
    { key: "language", label: "Language" },
    { key: "link", label: "Health Records" },
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);
  return (
    <ol className="mb-5 flex items-center gap-2 text-xs font-medium">
      {steps.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 ${
              i <= activeIndex
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {i + 1}. {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-muted-foreground">›</span>}
        </li>
      ))}
    </ol>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Ok({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2">
      <Check className="size-4 text-primary" />
      {text}
    </p>
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
