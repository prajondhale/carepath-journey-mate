# CarePath Journey

Patients in semi-urban and rural Maharashtra often face fragmented healthcare journeys due to disconnected hospital systems, scattered medical documents, language barriers, limited digital literacy, and lack of coordination between patients, caregivers, and healthcare providers.

Important reports, prescriptions, referrals, and follow-up requirements may be stored across different hospitals or physical/digital sources. Patients and caregivers may struggle to understand what has already been completed, what is pending, which documents are required, and what action needs to be taken next.

Existing healthcare systems primarily focus on individual hospital operations or record storage rather than providing a unified, patient-centric view of the complete treatment journey.

CarePath addresses this gap by providing a secure, multilingual digital layer that organizes ABHA-linked health documents, tracks the patient's treatment journey, identifies missing requirements, coordinates caregivers, verifies documents, integrates with hospital systems, and provides clear next-step notifications.

CarePath is a secure, multilingual healthcare journey platform designed for patients and caregivers in semi-urban Maharashtra.

It creates a unified view of the patient's healthcare journey by connecting medical documents, treatment stages, hospital interactions, caregiver coordination, and required actions in one place.

Core capabilities

ABHA Document Intelligence: Automatically extracts and organizes health documents such as reports, prescriptions, and referrals.

Treatment Journey Tracker: Converts scattered medical events into a simple step-by-step journey showing completed, pending, and missing requirements.

Caregiver View: Allows authorized caregivers to monitor patient progress, upcoming actions, and important alerts.

Multilingual Interface: Supports Indian languages, with an initial demonstration in English, Hindi, and Marathi.

Document Verification & Security: Provides document verification, encryption indicators, and integrity verification through hashes/checksums.

HMS Integration: Provides an integration layer for synchronizing relevant information with connected hospital management systems.

Smart Notifications: Separates patient and caregiver alerts and highlights both appointment reminders and missing requirements.

Ticket Raising: Enables patients/caregivers to raise and track issues requiring assistance.

The key value proposition is simple:

CarePath turns a fragmented healthcare experience into one understandable, trackable, and secure treatment journey.

Build a polished, responsive demo web application called CarePath, a secure multilingual healthcare journey platform for patients and caregivers in semi-urban Maharashtra.

Product Purpose

CarePath solves the problem of fragmented healthcare journeys. Patients may have medical documents across hospitals, referrals and follow-ups may be disconnected, caregivers may not know what action is pending, and language/digital-literacy barriers can make healthcare navigation difficult.

CarePath should demonstrate how one platform can organize health documents, track treatment progress, identify missing requirements, coordinate caregivers, verify documents, integrate with hospital systems, and provide actionable notifications.

This is an SIH demonstration prototype, so prioritize a realistic, polished, interactive product experience over unnecessary complexity.

DESIGN DIRECTION

Use a calm, trustworthy healthcare interface.

Primary: soft teal/green

Secondary: blue/teal accents

Background: very light neutral

Cards: white with subtle borders/shadows

Rounded corners

Large readable typography

High contrast

Minimal visual clutter

Clear icons

Accessible for older and first-time smartphone users

Responsive on desktop, tablet, and mobile

Avoid excessive gradients, glassmorphism, or flashy animations

The interface should look like a serious healthcare/government digital platform rather than a generic SaaS dashboard.

USER ROLES

Support two demo roles:

Patient

Can view:

treatment journey

medical documents

appointments

notifications

tickets

profile/language

Caregiver

Can view:

linked patient

treatment progress

pending requirements

alerts

appointments

documents

tickets

Create a simple demo role selector/login so the prototype can demonstrate both experiences.

GLOBAL NAVIGATION

Use a left sidebar on desktop and a bottom/top navigation pattern on mobile.

Navigation:

Dashboard

My Health Documents

Treatment Journey

Caregiver View

Notifications

Document Security

Hospital Integrations

Support Tickets

Language

Profile

Every page should have:

consistent header

page title

breadcrumb

notification icon

profile/role indicator

responsive navigation

DASHBOARD

Create a patient-centric dashboard.

Show:

Welcome card

"Good morning, Meena"

Treatment status

"Treatment Journey: 4 of 6 stages completed"

Next Action

"Complete follow-up consultation"

Show:

appointment date

hospital

required documents

action button

Health Documents

Show recent documents:

Blood Test Report

Prescription

Referral Letter

Each should show:

document type

hospital

date

Verified badge

Alerts

Examples:

"Follow-up appointment in 2 days"

"Referral document required"

"New medical report added"

Caregiver status

"Your caregiver: Rahul Patil — Connected"

ABHA DOCUMENT INTELLIGENCE

Create a document-management page.

Display automatically extracted documents in cards/table form.

Example data:

CBC Blood Test — 12 Aug 2026 — District Hospital

Prescription — 10 Aug 2026 — CityCare Hospital

Referral Letter — 8 Aug 2026 — Primary Health Centre

Each document should show:

document type

date

hospital

extracted information

verification status

View

Download

Share with authorized caregiver

Include a visual indicator:

"AI Extracted"

and:

"ABHA Linked"

Do not claim that the application actually connects to ABHA APIs. Treat this as a realistic demonstration/mock integration.

TREATMENT JOURNEY TRACKER

Create the central feature of CarePath.

Show a vertical or horizontal timeline:

Registration

↓

Initial Consultation

↓

Diagnostic Tests

↓

Specialist Referral

↓

Follow-up

↓

Discharge

Each stage should have one of three states:

GREEN — Completed

YELLOW — Pending

RED — Requirement Gap

Example:

Registration — Completed

Initial Consultation — Completed

Diagnostic Tests — Completed

Specialist Referral — Completed

Follow-up — Pending

Discharge — Requirement Gap

Clicking a stage should open details:

date

hospital

completed actions

associated documents

pending requirements

next action

At the top display:

"4 / 6 stages completed"

and a progress bar.

CAREGIVER VIEW

Create a dedicated caregiver dashboard.

Show:

Linked Patient

Meena Sharma

Relationship: Daughter

Current Treatment Status

"Follow-up pending"

Upcoming Action

"Cardiology consultation — 18 Aug 2026"

Requirements

Referral letter ✓

Previous ECG ✓

Blood report ✓

Insurance document ⚠ Pending

Alerts

"Patient has a pending follow-up appointment."

Provide buttons:

View Journey

View Authorized Documents

Contact Support

Clearly distinguish authorized caregiver information from private information.

NOTIFICATIONS CENTER

Create an inbox-style notification system.

Tabs:

All

Patient

Caregiver

Categories:

Requirement Gap

"Referral document is missing."

Appointment

"Follow-up appointment tomorrow."

Document

"New report uploaded."

Security

"Document access granted to caregiver."

Use severity levels:

Informational

Warning

Important

Allow notifications to be marked as read.

DOCUMENT VERIFICATION & SECURITY

Create a security-focused page.

Display a selected medical document.

Show:

"Encrypted & Verified"

Verification information:

Document ID

SHA-256 checksum

Timestamp

Source hospital

Verification status

Include a visual verification chain:

Uploaded

→ Encrypted

→ Integrity Checked

→ Verified

→ Authorized Access

Include a "Verify Document" interaction that changes the status to verified in the demo.

Do not implement real medical encryption or claim real-world security compliance. This is a functional UI demonstration of the intended architecture.

HMS INTEGRATION LAYER

Create an integrations/settings page.

Show connected hospitals as cards:

District Hospital

Status: Connected

Last Sync: 2 minutes ago

CityCare Hospital

Status: Connected

Last Sync: 10 minutes ago

Primary Health Centre

Status: Pending

Show:

connection status

last synchronization

records synchronized

integration type

Sync Now button

Add a simple architecture visualization:

Hospital HMS

↓

Secure Integration Layer

↓

CarePath

↓

Patient / Caregiver

Clearly label these as demo integrations rather than claiming live hospital connectivity.

SUPPORT TICKETS

Create a simple ticketing system.

Form:

Subject

Category

Description

Priority

Button:

"Raise Ticket"

Below show previous tickets:

#CP1024

Document verification issue

Status: Resolved

#CP1025

Hospital record not synchronized

Status: In Progress

#CP1026

Appointment clarification

Status: Open

Allow the user to open a ticket and view its details.

LANGUAGE SYSTEM

Create a language selector supporting 22 Indian languages in the interface.

For the functional demo, fully implement:

English

Hindi

Marathi

The remaining languages can appear as available options but may display "Demo translation coming soon."

When language changes, translate:

navigation

buttons

headings

dashboard labels

notifications

treatment stages

Do not simply change the language selector visually—the demo should visibly change the interface text.

DEMO DATA

Use realistic fictional data.

Patient:

Meena Sharma

Age: 54

Location: Maharashtra

Caregiver:

Rahul Sharma

Relationship: Son

Hospitals:

District Hospital

CityCare Hospital

Primary Health Centre

Do not use real patient information.

INTERACTION REQUIREMENTS

The prototype must feel interactive.

Implement:

navigation between pages

language switching

patient/caregiver role switching

opening documents

viewing treatment-stage details

notification read/unread state

ticket creation

document verification interaction

integration sync interaction

caregiver linked-patient view

Use local/mock data only. No real medical APIs are required.

IMPORTANT PRODUCT PRINCIPLE

Do NOT make the application feel like eight unrelated dashboards.

The pages must connect through a single patient journey.

For example:

A missing referral document shown on the Treatment Journey should also appear in Notifications and should be relevant to the Caregiver View.

A new document added in Document Intelligence should appear on the Dashboard and Treatment Journey.

A ticket raised for a synchronization issue should appear in Support Tickets.

The prototype should demonstrate a coherent healthcare workflow.

FINAL QUALITY BAR

The final application should look like a credible SIH prototype that could be demonstrated to government officials, healthcare institutions, and judges.

Prioritize:

Clear patient journey

Accessibility

Multilingual support

Security and privacy

Caregiver coordination

Actionable alerts

Hospital integration concept

Clean and professional UI

Avoid:

generic AI chatbot screens

unnecessary analytics

excessive charts

fake claims of live government/hospital API connectivity

overly complex medical functionality

decorative UI that does not support the patient journey
Don't add all the information on main dashboard, keep it simple, 

Theres no page for notification page, caregiver view page, profile page is, so create those pages and add it

And remove the hospital integration page

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://carepath-journey-mate.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/763a1554-29f5-4acc-b03f-43071dfc2450).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
