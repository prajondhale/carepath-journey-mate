import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictFor, type Dict } from "./i18n";

export type Role = "patient" | "caregiver";
export type StageState = "completed" | "pending" | "gap";

export type CareDoc = {
  id: string;
  titleKey: string;
  title: string;
  type: string;
  date: string;
  hospital: string;
  extracted: { label: string; value: string }[];
  verified: boolean;
  checksum: string;
  sharedWithCaregiver: boolean;
  caregiverAuthorized: boolean;
};

export type Stage = {
  id: string;
  key: string;
  state: StageState;
  date: string;
  hospital: string;
  actions: string[];
  documentIds: string[];
  pending: string[];
  nextAction: string;
};

export type Notification = {
  id: string;
  category: "requirement" | "appointment" | "document" | "security";
  severity: "info" | "warning" | "important";
  audience: "patient" | "caregiver";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  created: string;
  updates: { at: string; text: string }[];
};

const initialDocs: CareDoc[] = [
  {
    id: "DOC-8842",
    titleKey: "cbc",
    title: "CBC Blood Test Report",
    type: "Lab Report",
    date: "12 Aug 2026",
    hospital: "District Hospital",
    extracted: [
      { label: "Haemoglobin", value: "10.8 g/dL (low)" },
      { label: "WBC", value: "7,200 /µL" },
      { label: "Platelets", value: "2.4 lakh /µL" },
      { label: "Advice", value: "Iron supplementation, review in 2 weeks" },
    ],
    verified: true,
    checksum: "9f2c41ab77e5d0c3b81a4e6f2d95c7108ab34ef5619d70cc2fa8b41d3e0c6752",
    sharedWithCaregiver: true,
    caregiverAuthorized: true,
  },
  {
    id: "DOC-8815",
    titleKey: "presc",
    title: "Prescription",
    type: "Prescription",
    date: "10 Aug 2026",
    hospital: "CityCare Hospital",
    extracted: [
      { label: "Doctor", value: "Dr. S. Kulkarni (Medicine)" },
      { label: "Medicines", value: "Tab Amlodipine 5mg, Tab Ferrous Ascorbate" },
      { label: "Duration", value: "30 days" },
    ],
    verified: true,
    checksum: "3ab1d90f6c72e415ba8d5f3c9e70241bd6a8fe3401c95d7728be40f16c2a9d55",
    sharedWithCaregiver: true,
    caregiverAuthorized: true,
  },
  {
    id: "DOC-8790",
    titleKey: "ref",
    title: "Referral Letter",
    type: "Referral",
    date: "8 Aug 2026",
    hospital: "Primary Health Centre",
    extracted: [
      { label: "Referred to", value: "Cardiology, CityCare Hospital" },
      { label: "Reason", value: "Persistent chest discomfort, abnormal ECG" },
      { label: "Valid till", value: "30 Aug 2026" },
    ],
    verified: false,
    checksum: "c740be18a9d35e2b64c8917af03d5be29714cc6a8035d1f9b7e2481ac53d0629",
    sharedWithCaregiver: false,
    caregiverAuthorized: true,
  },
  {
    id: "DOC-8702",
    titleKey: "ecg",
    title: "ECG Report",
    type: "Diagnostic",
    date: "5 Aug 2026",
    hospital: "District Hospital",
    extracted: [
      { label: "Rhythm", value: "Sinus, occasional ectopics" },
      { label: "Impression", value: "Requires cardiology review" },
    ],
    verified: true,
    checksum: "5d81c02fa4b7e396c1d8402fbe75a913cc6d20e847bf13509a7e6c4b28d0f371",
    sharedWithCaregiver: true,
    caregiverAuthorized: true,
  },
];

const initialStages: Stage[] = [
  {
    id: "st1",
    key: "stage_registration",
    state: "completed",
    date: "2 Aug 2026",
    hospital: "Primary Health Centre",
    actions: ["ABHA number verified", "Patient profile created"],
    documentIds: [],
    pending: [],
    nextAction: "—",
  },
  {
    id: "st2",
    key: "stage_consultation",
    state: "completed",
    date: "3 Aug 2026",
    hospital: "Primary Health Centre",
    actions: ["General physician consultation", "Vitals recorded"],
    documentIds: ["DOC-8815"],
    pending: [],
    nextAction: "—",
  },
  {
    id: "st3",
    key: "stage_tests",
    state: "completed",
    date: "5–12 Aug 2026",
    hospital: "District Hospital",
    actions: ["ECG completed", "CBC blood test completed"],
    documentIds: ["DOC-8702", "DOC-8842"],
    pending: [],
    nextAction: "—",
  },
  {
    id: "st4",
    key: "stage_referral",
    state: "completed",
    date: "8 Aug 2026",
    hospital: "Primary Health Centre",
    actions: ["Referred to Cardiology, CityCare Hospital"],
    documentIds: ["DOC-8790"],
    pending: ["Referral letter not yet verified"],
    nextAction: "Verify referral letter in Document Security",
  },
  {
    id: "st5",
    key: "stage_followup",
    state: "pending",
    date: "18 Aug 2026",
    hospital: "CityCare Hospital",
    actions: ["Appointment booked with Dr. A. Deshpande (Cardiology)"],
    documentIds: ["DOC-8790", "DOC-8702", "DOC-8842"],
    pending: ["Carry referral letter", "Carry previous ECG"],
    nextAction: "Attend cardiology follow-up consultation on 18 Aug 2026",
  },
  {
    id: "st6",
    key: "stage_discharge",
    state: "gap",
    date: "Not scheduled",
    hospital: "CityCare Hospital",
    actions: [],
    documentIds: [],
    pending: ["Insurance document missing", "Discharge summary not generated"],
    nextAction: "Submit insurance document to hospital help desk",
  },
];

const initialNotifications: Notification[] = [
  {
    id: "n1",
    category: "requirement",
    severity: "important",
    audience: "patient",
    title: "Insurance document is missing",
    body: "Discharge stage cannot be completed until the insurance document is submitted.",
    time: "Today, 8:10 AM",
    read: false,
  },
  {
    id: "n2",
    category: "appointment",
    severity: "warning",
    audience: "patient",
    title: "Follow-up appointment in 2 days",
    body: "Cardiology consultation on 18 Aug 2026 at CityCare Hospital, 11:00 AM.",
    time: "Today, 7:45 AM",
    read: false,
  },
  {
    id: "n3",
    category: "requirement",
    severity: "warning",
    audience: "caregiver",
    title: "Referral document needs verification",
    body: "Referral letter (DOC-8790) is not yet verified for Meena Sharma.",
    time: "Yesterday, 6:20 PM",
    read: false,
  },
  {
    id: "n4",
    category: "document",
    severity: "info",
    audience: "patient",
    title: "New medical report added",
    body: "CBC Blood Test Report from District Hospital was added to your records.",
    time: "12 Aug 2026",
    read: true,
  },
  {
    id: "n5",
    category: "security",
    severity: "info",
    audience: "caregiver",
    title: "Document access granted to caregiver",
    body: "Rahul Sharma can now view the CBC Blood Test Report.",
    time: "12 Aug 2026",
    read: true,
  },
];

const initialTickets: Ticket[] = [
  {
    id: "CP1024",
    subject: "Document verification issue",
    category: "Documents",
    description: "Referral letter uploaded from PHC is not showing as verified.",
    priority: "Medium",
    status: "Resolved",
    created: "9 Aug 2026",
    updates: [
      { at: "9 Aug 2026", text: "Ticket received by the CarePath support desk." },
      { at: "10 Aug 2026", text: "Verification re-run completed. Issue resolved." },
    ],
  },
  {
    id: "CP1025",
    subject: "Hospital record not synchronized",
    category: "Records",
    description: "ECG report from District Hospital was delayed by two days.",
    priority: "High",
    status: "In Progress",
    created: "11 Aug 2026",
    updates: [
      { at: "11 Aug 2026", text: "Assigned to records coordination team." },
      { at: "13 Aug 2026", text: "Awaiting confirmation from hospital records desk." },
    ],
  },
  {
    id: "CP1026",
    subject: "Appointment clarification",
    category: "Appointments",
    description: "Need confirmation of cardiology follow-up timing on 18 Aug.",
    priority: "Low",
    status: "Open",
    created: "14 Aug 2026",
    updates: [{ at: "14 Aug 2026", text: "Ticket created." }],
  },
];

export const PATIENT = {
  name: "Meena Sharma",
  firstName: "Meena",
  age: 54,
  gender: "Female",
  abha: "12-3456-7890-1234",
  location: "Wardha, Maharashtra",
  phone: "+91 98xxx xx210",
  blood: "B+",
};

export const CAREGIVER = {
  name: "Rahul Sharma",
  relationship: "Son",
  phone: "+91 97xxx xx455",
  access: "Authorized — documents, journey, alerts",
};

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  lang: string;
  setLang: (l: string) => void;
  t: Dict;
  docs: CareDoc[];
  stages: Stage[];
  notifications: Notification[];
  tickets: Ticket[];
  unreadCount: number;
  completedCount: number;
  verifyDoc: (id: string) => void;
  shareDoc: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addTicket: (t: Omit<Ticket, "id" | "status" | "created" | "updates">) => string;
  addNotification: (n: Omit<Notification, "id" | "read" | "time">) => void;
};

const CarePathContext = createContext<Ctx | null>(null);

export function CarePathProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("patient");
  const [lang, setLang] = useState("en");
  const [docs, setDocs] = useState(initialDocs);
  const [stages] = useState(initialStages);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [tickets, setTickets] = useState(initialTickets);
  const [seq, setSeq] = useState(1027);

  const t = useMemo(() => dictFor(lang), [lang]);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "read" | "time">) => {
      setNotifications((prev) => [
        { ...n, id: `n${Date.now()}`, read: false, time: "Just now" },
        ...prev,
      ]);
    },
    [],
  );

  const verifyDoc = useCallback(
    (id: string) => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, verified: true } : d)));
      addNotification({
        category: "security",
        severity: "info",
        audience: "patient",
        title: "Document verified",
        body: `Integrity check passed for ${id}. Document marked as verified.`,
      });
    },
    [addNotification],
  );

  const shareDoc = useCallback(
    (id: string) => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, sharedWithCaregiver: true } : d)),
      );
      addNotification({
        category: "security",
        severity: "info",
        audience: "caregiver",
        title: "Document access granted to caregiver",
        body: `${CAREGIVER.name} can now view ${id}.`,
      });
    },
    [addNotification],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addTicket = useCallback<Ctx["addTicket"]>(
    (input) => {
      const id = `CP${seq}`;
      setSeq((s) => s + 1);
      setTickets((prev) => [
        {
          ...input,
          id,
          status: "Open",
          created: "Today",
          updates: [{ at: "Today", text: "Ticket created and queued for support." }],
        },
        ...prev,
      ]);
      addNotification({
        category: "document",
        severity: "info",
        audience: "patient",
        title: `Ticket #${id} raised`,
        body: input.subject,
      });
      return id;
    },
    [seq, addNotification],
  );

  const value: Ctx = {
    role,
    setRole,
    lang,
    setLang,
    t,
    docs,
    stages,
    notifications,
    tickets,
    unreadCount: notifications.filter((n) => !n.read).length,
    completedCount: stages.filter((s) => s.state === "completed").length,
    verifyDoc,
    shareDoc,
    markRead,
    markAllRead,
    addTicket,
    addNotification,
  };

  return <CarePathContext.Provider value={value}>{children}</CarePathContext.Provider>;
}

export function useCarePath() {
  const ctx = useContext(CarePathContext);
  if (!ctx) throw new Error("useCarePath must be used inside CarePathProvider");
  return ctx;
}