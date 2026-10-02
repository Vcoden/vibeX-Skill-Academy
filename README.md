# VibeX Skills Academy

Professional skills academy and learning platform. Programs, prices, curriculum, workshops, FAQs, testimonials, mentors, community notes, and enrollments are stored in Supabase.

## Run the site

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the dev server after saving the env file.

## Database

In the Supabase SQL editor, run:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

The schema creates tables, row-level security, the profile trigger, a public `media` bucket, and a private `payment-receipts` bucket.

Enrollments, payments, and receipts are separate records:

- A profile is the student. There is no students table.
- An enrollment locks `amount_due` from the course price at that moment and gets a number such as `VXSA-2026-000123`.
- An enrollment can have several payment attempts. Each payment has its own reference, such as `VXSA-PAY-000123`, plus the student's bank reference.
- Receipt files stay in private storage. The `payment_receipts` table stores only the file metadata.
- Verifying a payment sets the enrollment to payment verified. It does not admit the student. Admission is a separate confirmation.

Auth should allow email and password. If email confirmation is on, new students confirm their email before signing in.

## First administrator

Register an account on the site, then run this in the SQL editor with your email:

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

Sign out and back in, then open `/admin`.

## Before a public launch

Testimonials, mentors, workshops, and community links stay empty until you add real records in admin. Do not publish invented student stories or mentor names.

Forex, Shopify, and token programs include risk notices. Do not add profit, sales, or token-value guarantees.

Replace `http://localhost:5173` in `public/sitemap.xml` with the public site address before launch.

## Brand files

- `public/brand/logo.png` — VibeX logo
- `public/brand/campus.jpg` — optional atrium photograph used in the hero
