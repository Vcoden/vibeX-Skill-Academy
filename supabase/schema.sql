-- VibeX Skills Academy
-- Run this in the Supabase SQL editor before seed.sql.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.user_role as enum ('student', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.learning_format as enum ('online', 'offline');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.enrollment_status as enum (
    'pending_payment',
    'payment_submitted',
    'payment_verified',
    'enrolled',
    'active',
    'completed',
    'cancelled',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum ('bank_transfer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_record_status as enum (
    'submitted',
    'under_review',
    'verified',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  role public.user_role not null default 'student',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Current advertised price lives here. An enrollment copies it into amount_due.
create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order integer not null,
  code text not null,
  name text not null,
  subtitle text,
  summary text not null,
  description text not null,
  icon text not null,
  price numeric(12, 2) not null check (price >= 0),
  duration_days integer not null default 30,
  format_label text not null default 'Online & Offline',
  risk_notice text,
  outcomes text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_subcategories (
  id uuid primary key default gen_random_uuid(),
  course_category_id uuid not null references public.course_categories (id) on delete cascade,
  title text not null,
  summary text,
  sort_order integer not null,
  unique (course_category_id, title)
);

create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  starts_at timestamptz,
  mode text not null,
  location text,
  price_ngn integer not null default 0 check (price_ngn >= 0),
  seats integer,
  cover_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  topic text not null default 'General',
  sort_order integer not null default 0,
  is_published boolean not null default true
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  program_label text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  focus text not null,
  bio text not null,
  avatar_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.journey_steps (
  id uuid primary key default gen_random_uuid(),
  step_number integer not null,
  phase text not null,
  title text not null,
  description text not null,
  sort_order integer not null
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  kind text not null,
  author_name text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Student -> Enrollment -> Payment -> Payment receipt.
-- There is no separate students table. A student is a profile with role = student.
create sequence if not exists public.enrollment_number_seq;
create sequence if not exists public.payment_number_seq;

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  enrollment_number text not null unique,
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_category_id uuid not null references public.course_categories (id) on delete restrict,
  learning_format public.learning_format not null,
  status public.enrollment_status not null default 'pending_payment',
  amount_due numeric(12, 2) not null check (amount_due >= 0),
  currency text not null default 'NGN',
  submitted_at timestamptz,
  verified_at timestamptz,
  enrolled_at timestamptz,
  completed_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists enrollments_one_open_per_course
  on public.enrollments (student_id, course_category_id)
  where status not in ('cancelled', 'rejected', 'completed');

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  internal_payment_reference text not null unique,
  student_bank_reference text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'NGN',
  payment_method public.payment_method not null default 'bank_transfer',
  bank_name text not null,
  account_name text not null,
  transaction_date date,
  status public.payment_record_status not null default 'submitted',
  verified_by uuid references public.profiles (id),
  verified_at timestamptz,
  rejection_reason text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  file_size bigint not null check (file_size >= 0),
  uploaded_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.module_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_id uuid not null references public.course_subcategories (id) on delete cascade,
  completed boolean not null default true,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create index if not exists course_categories_sort_idx on public.course_categories (sort_order);
create index if not exists course_subcategories_category_idx on public.course_subcategories (course_category_id, sort_order);
create index if not exists enrollments_student_idx on public.enrollments (student_id);
create index if not exists payments_enrollment_idx on public.payments (enrollment_id);
create index if not exists payment_receipts_payment_idx on public.payment_receipts (payment_id);

-- ---------------------------------------------------------------------------
-- Auth profile
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.course_categories enable row level security;
alter table public.course_subcategories enable row level security;
alter table public.payments enable row level security;
alter table public.payment_receipts enable row level security;
alter table public.workshops enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.mentors enable row level security;
alter table public.journey_steps enable row level security;
alter table public.community_posts enable row level security;
alter table public.enrollments enable row level security;
alter table public.module_progress enable row level security;
alter table public.contact_messages enable row level security;
alter table public.workshop_registrations enable row level security;

grant usage on schema public to anon, authenticated;

grant select on public.course_categories, public.course_subcategories, public.workshops, public.faqs,
  public.testimonials, public.mentors, public.journey_steps, public.community_posts
  to anon, authenticated;

grant insert on public.contact_messages, public.workshop_registrations to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.course_categories, public.course_subcategories,
  public.workshops, public.faqs, public.testimonials, public.mentors, public.journey_steps,
  public.community_posts, public.enrollments, public.payments, public.payment_receipts,
  public.module_progress, public.contact_messages, public.workshop_registrations to authenticated;

-- Profiles
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Published content is public. Admins can read drafts and write.
drop policy if exists "read categories" on public.course_categories;
create policy "read categories" on public.course_categories
  for select using (is_published or public.is_admin());

drop policy if exists "admin write categories" on public.course_categories;
create policy "admin write categories" on public.course_categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read modules" on public.course_subcategories;
create policy "read modules" on public.course_subcategories
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.course_categories c
      where c.id = course_category_id and c.is_published
    )
  );

drop policy if exists "admin write modules" on public.course_subcategories;
create policy "admin write modules" on public.course_subcategories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read workshops" on public.workshops;
create policy "read workshops" on public.workshops
  for select using (is_published or public.is_admin());

drop policy if exists "admin write workshops" on public.workshops;
create policy "admin write workshops" on public.workshops
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read faqs" on public.faqs;
create policy "read faqs" on public.faqs
  for select using (is_published or public.is_admin());

drop policy if exists "admin write faqs" on public.faqs;
create policy "admin write faqs" on public.faqs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read testimonials" on public.testimonials;
create policy "read testimonials" on public.testimonials
  for select using (is_published or public.is_admin());

drop policy if exists "admin write testimonials" on public.testimonials;
create policy "admin write testimonials" on public.testimonials
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read mentors" on public.mentors;
create policy "read mentors" on public.mentors
  for select using (is_published or public.is_admin());

drop policy if exists "admin write mentors" on public.mentors;
create policy "admin write mentors" on public.mentors
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read journey" on public.journey_steps;
create policy "read journey" on public.journey_steps
  for select using (true);

drop policy if exists "admin write journey" on public.journey_steps;
create policy "admin write journey" on public.journey_steps
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read community" on public.community_posts;
create policy "read community" on public.community_posts
  for select using (is_published or public.is_admin());

drop policy if exists "admin write community" on public.community_posts;
create policy "admin write community" on public.community_posts
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read own enrollments" on public.enrollments;
create policy "read own enrollments" on public.enrollments
  for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

drop policy if exists "admin updates enrollments" on public.enrollments;
create policy "admin updates enrollments" on public.enrollments
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin deletes enrollments" on public.enrollments;
create policy "admin deletes enrollments" on public.enrollments
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "read own payments" on public.payments;
create policy "read own payments" on public.payments
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.enrollments e
      where e.id = enrollment_id and e.student_id = auth.uid()
    )
  );

drop policy if exists "admin updates payments" on public.payments;
create policy "admin updates payments" on public.payments
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "read own receipts" on public.payment_receipts;
create policy "read own receipts" on public.payment_receipts
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.payments p
      join public.enrollments e on e.id = p.enrollment_id
      where p.id = payment_id and e.student_id = auth.uid()
    )
  );

drop policy if exists "student adds receipt" on public.payment_receipts;
create policy "student adds receipt" on public.payment_receipts
  for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from public.payments p
      join public.enrollments e on e.id = p.enrollment_id
      where p.id = payment_id
        and e.student_id = auth.uid()
        and p.status = 'submitted'
    )
  );

drop policy if exists "read own progress" on public.module_progress;
create policy "read own progress" on public.module_progress
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "write own progress" on public.module_progress;
create policy "write own progress" on public.module_progress
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.course_subcategories m
      join public.enrollments e on e.course_category_id = m.course_category_id
      where m.id = module_id
        and e.student_id = auth.uid()
        and e.status in ('enrolled', 'active', 'completed')
    )
  );

drop policy if exists "update own progress" on public.module_progress;
create policy "update own progress" on public.module_progress
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "delete own progress" on public.module_progress;
create policy "delete own progress" on public.module_progress
  for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "send contact message" on public.contact_messages;
create policy "send contact message" on public.contact_messages
  for insert
  with check (
    char_length(trim(name)) between 2 and 80
    and char_length(trim(message)) between 10 and 2000
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  );

drop policy if exists "admin read messages" on public.contact_messages;
create policy "admin read messages" on public.contact_messages
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin update messages" on public.contact_messages;
create policy "admin update messages" on public.contact_messages
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "register for workshop" on public.workshop_registrations;
create policy "register for workshop" on public.workshop_registrations
  for insert
  with check (
    char_length(trim(name)) between 2 and 80
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  );

drop policy if exists "read workshop registrations" on public.workshop_registrations;
create policy "read workshop registrations" on public.workshop_registrations
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Enrollment and payment workflow
-- Students cannot insert these rows directly. The functions below lock the
-- course price onto the enrollment and keep payment attempts separate.
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.assign_enrollment_number()
returns trigger
language plpgsql
as $$
begin
  if new.enrollment_number is null or btrim(new.enrollment_number) = '' then
    new.enrollment_number := 'VXSA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.enrollment_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create or replace function public.assign_payment_reference()
returns trigger
language plpgsql
as $$
begin
  if new.internal_payment_reference is null or btrim(new.internal_payment_reference) = '' then
    new.internal_payment_reference := 'VXSA-PAY-' || lpad(nextval('public.payment_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create or replace function public.guard_enrollment_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is not distinct from new.status then
    return new;
  end if;

  if not public.is_admin() then
    if old.status = 'pending_payment' and new.status = 'payment_submitted' then
      return new;
    end if;
    raise exception 'Students cannot change enrollment status directly';
  end if;

  if new.status = 'payment_verified' and old.status <> 'payment_submitted' then
    raise exception 'Verify the submitted payment before marking it verified';
  end if;
  if new.status = 'enrolled' and old.status <> 'payment_verified' then
    raise exception 'Admit the student only after the payment is verified';
  end if;
  if new.status = 'active' and old.status <> 'enrolled' then
    raise exception 'Mark training active only after admission';
  end if;
  if new.status = 'completed' and old.status not in ('enrolled', 'active') then
    raise exception 'Complete the program only after the student has been admitted';
  end if;
  if new.status = 'pending_payment' and old.status <> 'payment_submitted' then
    raise exception 'An enrollment can return to payment required only after a submitted payment is rejected';
  end if;

  if new.status = 'payment_verified' then
    new.verified_at = coalesce(new.verified_at, now());
  elsif new.status = 'enrolled' then
    new.enrolled_at = coalesce(new.enrolled_at, now());
  elsif new.status = 'completed' then
    new.completed_at = coalesce(new.completed_at, now());
  end if;

  return new;
end;
$$;

create or replace function public.guard_payment_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is not distinct from new.status then
    return new;
  end if;
  if not public.is_admin() then
    raise exception 'Students cannot change payment status';
  end if;
  if new.status = 'under_review' and old.status <> 'submitted' then
    raise exception 'Only a submitted payment can move under review';
  end if;
  if new.status in ('verified', 'rejected') and old.status not in ('submitted', 'under_review') then
    raise exception 'Only a submitted payment can be verified or rejected';
  end if;
  if new.status = 'verified' then
    new.verified_by = auth.uid();
    new.verified_at = now();
  end if;
  if new.status = 'rejected' then
    new.verified_by = auth.uid();
    new.verified_at = now();
  end if;
  return new;
end;
$$;

create or replace function public.mark_payment_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.enrollments e
  set status = 'payment_submitted',
      submitted_at = coalesce(e.submitted_at, now())
  from public.payments p
  where p.id = new.payment_id
    and p.enrollment_id = e.id
    and p.status = 'submitted'
    and e.student_id = new.uploaded_by
    and e.status = 'pending_payment';
  return new;
end;
$$;

drop trigger if exists enrollments_set_number on public.enrollments;
create trigger enrollments_set_number
  before insert on public.enrollments
  for each row execute function public.assign_enrollment_number();

drop trigger if exists enrollments_touch on public.enrollments;
create trigger enrollments_touch
  before update on public.enrollments
  for each row execute function public.touch_updated_at();

drop trigger if exists enrollments_guard_status on public.enrollments;
create trigger enrollments_guard_status
  before update on public.enrollments
  for each row execute function public.guard_enrollment_status();

drop trigger if exists payments_set_reference on public.payments;
create trigger payments_set_reference
  before insert on public.payments
  for each row execute function public.assign_payment_reference();

drop trigger if exists payments_touch on public.payments;
create trigger payments_touch
  before update on public.payments
  for each row execute function public.touch_updated_at();

drop trigger if exists payments_guard_status on public.payments;
create trigger payments_guard_status
  before update on public.payments
  for each row execute function public.guard_payment_status();

drop trigger if exists receipts_mark_submitted on public.payment_receipts;
create trigger receipts_mark_submitted
  after insert on public.payment_receipts
  for each row execute function public.mark_payment_submitted();

create or replace function public.create_enrollment(
  p_course_category_id uuid,
  p_learning_format public.learning_format
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  locked_price numeric(12, 2);
begin
  if auth.uid() is null then
    raise exception 'Sign in to enroll';
  end if;

  if exists (
    select 1 from public.enrollments
    where student_id = auth.uid()
      and course_category_id = p_course_category_id
      and status not in ('cancelled', 'rejected', 'completed')
  ) then
    raise exception 'You already have an open enrollment for this program';
  end if;

  select price into locked_price
  from public.course_categories
  where id = p_course_category_id and is_published;

  if locked_price is null then
    raise exception 'That program is not open for enrollment';
  end if;

  insert into public.enrollments (
    enrollment_number, student_id, course_category_id, learning_format, status, amount_due, currency
  ) values (
    '', auth.uid(), p_course_category_id, p_learning_format, 'pending_payment', locked_price, 'NGN'
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.submit_payment(
  p_enrollment_id uuid,
  p_amount numeric,
  p_student_bank_reference text,
  p_transaction_date date,
  p_bank_name text,
  p_account_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  enrollment public.enrollments;
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to submit a payment';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Enter the amount you transferred';
  end if;
  if p_student_bank_reference is null or char_length(btrim(p_student_bank_reference)) < 3 then
    raise exception 'Enter the bank transaction reference';
  end if;

  select * into enrollment
  from public.enrollments
  where id = p_enrollment_id and student_id = auth.uid();

  if not found then
    raise exception 'Enrollment not found';
  end if;
  if enrollment.status <> 'pending_payment' then
    raise exception 'This enrollment is not waiting for a payment';
  end if;

  insert into public.payments (
    enrollment_id,
    internal_payment_reference,
    student_bank_reference,
    amount,
    currency,
    payment_method,
    bank_name,
    account_name,
    transaction_date,
    status
  ) values (
    enrollment.id,
    '',
    btrim(p_student_bank_reference),
    p_amount,
    enrollment.currency,
    'bank_transfer',
    btrim(p_bank_name),
    btrim(p_account_name),
    p_transaction_date,
    'submitted'
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.review_payment(
  p_payment_id uuid,
  p_decision text,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payment public.payments;
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;

  select * into payment from public.payments where id = p_payment_id;
  if not found then
    raise exception 'Payment not found';
  end if;
  if not exists (select 1 from public.payment_receipts where payment_id = payment.id) then
    raise exception 'This payment has no receipt to review';
  end if;

  if p_decision = 'under_review' then
    update public.payments set status = 'under_review' where id = payment.id;
    return;
  end if;

  if p_decision = 'verified' then
    update public.payments set status = 'verified' where id = payment.id;
    update public.enrollments
    set status = 'payment_verified'
    where id = payment.enrollment_id
      and status = 'payment_submitted';
    if not found then
      raise exception 'The enrollment is not waiting on this payment';
    end if;
    return;
  end if;

  if p_decision = 'rejected' then
    if p_reason is null or char_length(btrim(p_reason)) < 3 then
      raise exception 'Add a reason for rejecting this payment';
    end if;
    update public.payments
    set status = 'rejected', rejection_reason = btrim(p_reason)
    where id = payment.id;
    update public.enrollments
    set status = 'pending_payment'
    where id = payment.enrollment_id
      and status = 'payment_submitted'
      and not exists (
        select 1 from public.payments other
        where other.enrollment_id = payment.enrollment_id
          and other.status = 'verified'
      );
    return;
  end if;

  raise exception 'Unknown payment decision';
end;
$$;

create or replace function public.confirm_enrollment(p_enrollment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;
  update public.enrollments
  set status = 'enrolled'
  where id = p_enrollment_id and status = 'payment_verified';
  if not found then
    raise exception 'Admission can be confirmed only after the payment is verified';
  end if;
end;
$$;

create or replace function public.advance_enrollment(
  p_enrollment_id uuid,
  p_status public.enrollment_status,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin only';
  end if;
  if p_status not in ('active', 'completed', 'cancelled', 'rejected') then
    raise exception 'Use the payment and admission actions for this status';
  end if;
  update public.enrollments
  set status = p_status,
      admin_notes = coalesce(p_notes, admin_notes)
  where id = p_enrollment_id;
  if not found then
    raise exception 'Enrollment not found';
  end if;
end;
$$;

revoke all on function public.create_enrollment(uuid, public.learning_format) from public;
revoke all on function public.submit_payment(uuid, numeric, text, date, text, text) from public;
revoke all on function public.review_payment(uuid, text, text) from public;
revoke all on function public.confirm_enrollment(uuid) from public;
revoke all on function public.advance_enrollment(uuid, public.enrollment_status, text) from public;
grant execute on function public.create_enrollment(uuid, public.learning_format) to authenticated;
grant execute on function public.submit_payment(uuid, numeric, text, date, text, text) to authenticated;
grant execute on function public.review_payment(uuid, text, text) to authenticated;
grant execute on function public.confirm_enrollment(uuid) to authenticated;
grant execute on function public.advance_enrollment(uuid, public.enrollment_status, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin insert media" on storage.objects;
create policy "admin insert media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "student upload avatar" on storage.objects;
create policy "student upload avatar" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and name like 'avatars/' || auth.uid()::text || '/%'
  );

drop policy if exists "student update avatar" on storage.objects;
create policy "student update avatar" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and name like 'avatars/' || auth.uid()::text || '/%'
  );

insert into storage.buckets (id, name, public)
values ('payment-receipts', 'payment-receipts', false)
on conflict (id) do nothing;

drop policy if exists "student upload receipt file" on storage.objects;
create policy "student upload receipt file" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'payment-receipts'
    and name like 'receipts/' || auth.uid()::text || '/%'
  );

drop policy if exists "read receipt files" on storage.objects;
create policy "read receipt files" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'payment-receipts'
    and (
      public.is_admin()
      or name like 'receipts/' || auth.uid()::text || '/%'
    )
  );
