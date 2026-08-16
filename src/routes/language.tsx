<<<<<<<<
import { createFileRoute } from "@tanstack/react-router";
import { Check, Languages } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { LANGUAGES } from "@/lib/carepath/i18n";
import { useCarePath } from "@/lib/carepath/store";
import { toast } from "sonner";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "Language Settings — CarePath" },
      {
        name: "description",
        content:
          "Use CarePath in your language. English, Hindi and Marathi are fully available in this demonstration.",
      },
      { property: "og:title", content: "Language Settings — CarePath" },
      {
        property: "og:description",
        content: "Switch the interface language — English, Hindi and Marathi available now.",
      },
    ],
  }),
  component: LanguagePage,
});

function LanguagePage() {
  const { t, lang, setLang } = useCarePath();

  return (
    <AppShell title={t.nav_language} subtitle={t.chooseLanguage}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <li key={l.code}>
              <button
                onClick={() => {
                  if (l.ready) {
                    setLang(l.code);
                    toast.success(`${l.native} selected`);
                  } else {
                    toast.info(t.comingSoon);
                  }
                }}
                className={`card-soft flex w-full items-center gap-3 p-4 text-left transition-colors ${
                  active ? "ring-2 ring-primary" : "hover:bg-accent/40"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Languages className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{l.native}</span>
                  <span className="block text-sm text-muted-foreground">
                    {l.ready ? l.label : t.comingSoon}
                  </span>
                </span>
                {active && <Check className="size-5 text-primary" />}
              </button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
>>>>>>>>