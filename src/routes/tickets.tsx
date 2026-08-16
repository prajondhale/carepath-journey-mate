import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LifeBuoy } from "lucide-react";
import { AppShell } from "@/components/carepath/AppShell";
import { Section, Tag } from "@/components/carepath/bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCarePath, type Ticket } from "@/lib/carepath/store";
import { toast } from "sonner";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Support Tickets — CarePath" },
      {
        name: "description",
        content:
          "Raise and track issues about documents, hospital records and appointments with the CarePath support desk.",
      },
      { property: "og:title", content: "Support Tickets — CarePath" },
      {
        property: "og:description",
        content: "Raise an issue and follow its status until it is resolved.",
      },
    ],
  }),
  component: Tickets,
});

const STATUS_TONE = {
  Open: "warning",
  "In Progress": "info",
  Resolved: "success",
} as const;

function Tickets() {
  const { t, tickets, addTicket } = useCarePath();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Documents");
  const [priority, setPriority] = useState<Ticket["priority"]>("Medium");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState<Ticket | null>(null);

  return (
    <AppShell title={t.nav_tickets}>
      <form
        className="card-soft mb-6 space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!subject.trim()) return;
          const id = addTicket({ subject, category, priority, description });
          toast.success(`Ticket #${id} raised`);
          setSubject("");
          setDescription("");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="subject">{t.subject}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Describe the issue in a few words"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label>{t.category}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Documents", "Records", "Appointments", "Caregiver access", "Other"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t.priority}</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Ticket["priority"])}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="desc">{t.description}</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1.5"
              placeholder="Add any details that will help support understand the problem"
            />
          </div>
        </div>
        <Button type="submit">
          <LifeBuoy className="size-4" /> {t.raiseTicket}
        </Button>
      </form>

      <Section title={t.yourTickets}>
        <ul className="space-y-3">
          {tickets.map((tk) => (
            <li key={tk.id}>
              <button
                onClick={() => setOpen(tk)}
                className="card-soft flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">#{tk.id}</p>
                  <p className="font-semibold">{tk.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {tk.category} · {tk.created}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Tag>{tk.priority}</Tag>
                  <Tag tone={STATUS_TONE[tk.status]}>{tk.status}</Tag>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.subject}</DialogTitle>
            <DialogDescription>
              #{open?.id} · {open?.category} · {open?.priority}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{open?.description || "No description."}</p>
          <ul className="space-y-2 border-t border-border pt-3 text-sm">
            {open?.updates.map((u, i) => (
              <li key={i}>
                <span className="font-medium">{u.at}</span>{" "}
                <span className="text-muted-foreground">— {u.text}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}