import { requireSupabase } from '@/lib/supabase'
import type {
  Category,
  CommunityPost,
  ContactMessage,
  Enrollment,
  Faq,
  JourneyStep,
  Mentor,
  ModuleProgress,
  Testimonial,
  Workshop,
} from '@/types/database'

const categorySelect =
  'id, slug, sort_order, code, name, subtitle, summary, description, icon, price, duration_days, format_label, risk_notice, outcomes, is_published, created_at, course_subcategories(id, course_category_id, title, summary, sort_order)'

const enrollmentSelect =
  'id, enrollment_number, student_id, course_category_id, learning_format, status, amount_due, currency, submitted_at, verified_at, enrolled_at, completed_at, admin_notes, created_at, course_categories(id, slug, name, code, price, duration_days, icon), payments(id, enrollment_id, internal_payment_reference, student_bank_reference, amount, currency, payment_method, bank_name, account_name, transaction_date, status, verified_by, verified_at, rejection_reason, admin_notes, created_at, payment_receipts(id, payment_id, storage_bucket, storage_path, original_filename, mime_type, file_size, uploaded_by, created_at))'

type CategoryRow = Category & {
  price?: number | string
  course_subcategories?: Array<{
    id: string
    course_category_id: string
    title: string
    summary: string | null
    sort_order: number
  }>
}

function sortModules(category: CategoryRow): Category {
  const modules = (category.course_subcategories ?? category.modules ?? []).map((item) => ({
    id: item.id,
    category_id: 'course_category_id' in item ? item.course_category_id : item.category_id,
    title: item.title,
    summary: item.summary,
    sort_order: item.sort_order,
  }))
  return {
    ...category,
    price: Number(category.price),
    outcomes: category.outcomes ?? [],
    modules: modules.sort((a, b) => a.sort_order - b.sort_order),
  }
}

export async function fetchCategories() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('course_categories')
    .select(categorySelect)
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return ((data ?? []) as Category[]).map(sortModules)
}

export async function fetchCategory(slug: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('course_categories')
    .select(categorySelect)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return sortModules(data as Category)
}

export async function fetchFaqs() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('faqs')
    .select('id, question, answer, topic, sort_order, is_published')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Faq[]
}

export async function fetchTestimonials() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('testimonials')
    .select('id, name, role, program_label, quote, rating, avatar_url, is_published, sort_order')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Testimonial[]
}

export async function fetchWorkshops() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('workshops')
    .select('id, slug, title, summary, description, starts_at, mode, location, price_ngn, seats, cover_url, is_published, created_at')
    .eq('is_published', true)
    .order('starts_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Workshop[]
}

export async function fetchJourney() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('journey_steps')
    .select('id, step_number, phase, title, description, sort_order')
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as JourneyStep[]
}

export async function fetchMentors() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('mentors')
    .select('id, name, title, focus, bio, avatar_url, is_published, sort_order')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as Mentor[]
}

export async function fetchCommunity() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('community_posts')
    .select('id, title, body, kind, author_name, is_published, sort_order, created_at')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as CommunityPost[]
}

export async function fetchMyEnrollments(userId: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('enrollments')
    .select(enrollmentSelect)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as Enrollment[]
}

export async function fetchMyEnrollment(userId: string, categoryId: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('enrollments')
    .select(enrollmentSelect)
    .eq('student_id', userId)
    .eq('course_category_id', categoryId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Enrollment | null
}

export async function createEnrollment(courseCategoryId: string, learningFormat: 'online' | 'offline') {
  const db = requireSupabase()
  const { data, error } = await db.rpc('create_enrollment', {
    p_course_category_id: courseCategoryId,
    p_learning_format: learningFormat,
  })
  if (error) throw error
  return data as string
}

export async function submitPayment(input: {
  enrollmentId: string
  amount: number
  studentBankReference: string
  transactionDate: string
  bankName: string
  accountName: string
}) {
  const db = requireSupabase()
  const { data, error } = await db.rpc('submit_payment', {
    p_enrollment_id: input.enrollmentId,
    p_amount: input.amount,
    p_student_bank_reference: input.studentBankReference,
    p_transaction_date: input.transactionDate,
    p_bank_name: input.bankName,
    p_account_name: input.accountName,
  })
  if (error) throw error
  return data as string
}

export async function savePaymentReceipt(input: {
  paymentId: string
  studentId: string
  file: File
}) {
  const db = requireSupabase()
  const safeName = input.file.name.replace(/[^\w.\-]+/g, '_')
  const path = `receipts/${input.studentId}/${input.paymentId}/${Date.now()}-${safeName}`
  const { error: uploadError } = await db.storage.from('payment-receipts').upload(path, input.file, {
    contentType: input.file.type,
    upsert: false,
  })
  if (uploadError) throw uploadError
  const { error } = await db.from('payment_receipts').insert({
    payment_id: input.paymentId,
    storage_bucket: 'payment-receipts',
    storage_path: path,
    original_filename: input.file.name,
    mime_type: input.file.type || 'application/octet-stream',
    file_size: input.file.size,
    uploaded_by: input.studentId,
  })
  if (error) throw error
}

export async function receiptSignedUrl(bucket: string, path: string) {
  const db = requireSupabase()
  const { data, error } = await db.storage.from(bucket).createSignedUrl(path, 60 * 10)
  if (error) throw error
  return data.signedUrl
}

export async function reviewPayment(paymentId: string, decision: 'under_review' | 'verified' | 'rejected', reason?: string) {
  const db = requireSupabase()
  const { error } = await db.rpc('review_payment', {
    p_payment_id: paymentId,
    p_decision: decision,
    p_reason: reason ?? null,
  })
  if (error) throw error
}

export async function confirmEnrollment(enrollmentId: string) {
  const db = requireSupabase()
  const { error } = await db.rpc('confirm_enrollment', { p_enrollment_id: enrollmentId })
  if (error) throw error
}

export async function advanceEnrollment(enrollmentId: string, status: 'active' | 'completed' | 'cancelled' | 'rejected', notes?: string) {
  const db = requireSupabase()
  const { error } = await db.rpc('advance_enrollment', {
    p_enrollment_id: enrollmentId,
    p_status: status,
    p_notes: notes ?? null,
  })
  if (error) throw error
}

export async function fetchModuleProgress(userId: string, moduleIds: string[]) {
  if (moduleIds.length === 0) return [] as ModuleProgress[]
  const db = requireSupabase()
  const { data, error } = await db
    .from('module_progress')
    .select('user_id, module_id, completed, completed_at')
    .eq('user_id', userId)
    .in('module_id', moduleIds)
  if (error) throw error
  return (data ?? []) as ModuleProgress[]
}

export async function setModuleProgress(userId: string, moduleId: string, completed: boolean) {
  const db = requireSupabase()
  if (!completed) {
    const { error } = await db
      .from('module_progress')
      .delete()
      .eq('user_id', userId)
      .eq('module_id', moduleId)
    if (error) throw error
    return
  }
  const { error } = await db.from('module_progress').upsert({
    user_id: userId,
    module_id: moduleId,
    completed: true,
    completed_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function sendContactMessage(input: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}) {
  const db = requireSupabase()
  const { error } = await db.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    subject: input.subject,
    message: input.message,
  })
  if (error) throw error
}

export async function registerForWorkshop(input: {
  workshopId: string
  userId: string | null
  name: string
  email: string
  phone: string
}) {
  const db = requireSupabase()
  const { error } = await db.from('workshop_registrations').insert({
    workshop_id: input.workshopId,
    user_id: input.userId,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
  })
  if (error) throw error
}

export async function fetchAdminCategories() {
  const db = requireSupabase()
  const { data, error } = await db.from('course_categories').select(categorySelect).order('sort_order')
  if (error) throw error
  return ((data ?? []) as Category[]).map(sortModules)
}

export async function saveCategory(
  category: Omit<Category, 'id' | 'created_at' | 'modules'> & { id?: string },
  modules: Array<{ id?: string; title: string; summary: string | null; sort_order: number }>,
) {
  const db = requireSupabase()
  const payload = {
    slug: category.slug,
    sort_order: category.sort_order,
    code: category.code,
    name: category.name,
    subtitle: category.subtitle,
    summary: category.summary,
    description: category.description,
    icon: category.icon,
    price: category.price,
    duration_days: category.duration_days,
    format_label: category.format_label,
    risk_notice: category.risk_notice,
    outcomes: category.outcomes,
    is_published: category.is_published,
  }
  const query = category.id
    ? db.from('course_categories').update(payload).eq('id', category.id).select('id').single()
    : db.from('course_categories').insert(payload).select('id').single()
  const { data, error } = await query
  if (error) throw error
  const categoryId = (data as { id: string }).id

  const keptIds = modules.flatMap((item) => (item.id ? [item.id] : []))
  const { data: existing, error: existingError } = await db.from('course_subcategories').select('id').eq('course_category_id', categoryId)
  if (existingError) throw existingError
  const remove = ((existing ?? []) as Array<{ id: string }>).map((row) => row.id).filter((id) => !keptIds.includes(id))
  if (remove.length > 0) {
    const { error: deleteError } = await db.from('course_subcategories').delete().in('id', remove)
    if (deleteError) throw deleteError
  }

  if (modules.length > 0) {
    const rows = modules.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      course_category_id: categoryId,
      title: item.title,
      summary: item.summary,
      sort_order: item.sort_order,
    }))
    const { error: moduleError } = await db.from('course_subcategories').upsert(rows)
    if (moduleError) throw moduleError
  }

  return categoryId
}

export async function deleteCategory(id: string) {
  const db = requireSupabase()
  const { error } = await db.from('course_categories').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAdminTable<T>(table: string, orderBy = 'created_at') {
  const db = requireSupabase()
  const { data, error } = await db.from(table).select('*').order(orderBy)
  if (error) throw error
  return (data ?? []) as T[]
}

export async function upsertRow(table: string, row: Record<string, unknown>) {
  const db = requireSupabase()
  const { error } = await db.from(table).upsert(row)
  if (error) throw error
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  const db = requireSupabase()
  const { error } = await db.from(table).insert(row)
  if (error) throw error
}

export async function updateRow(table: string, id: string, row: Record<string, unknown>) {
  const db = requireSupabase()
  const { error } = await db.from(table).update(row).eq('id', id)
  if (error) throw error
}

export async function deleteRow(table: string, id: string) {
  const db = requireSupabase()
  const { error } = await db.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function fetchEnrollmentsAdmin() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('enrollments')
    .select(`${enrollmentSelect}, profiles(full_name, email, phone)`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as Enrollment[]
}

export async function fetchMessages() {
  const db = requireSupabase()
  const { data, error } = await db
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, created_at, is_read')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as ContactMessage[]
}

export async function fetchAdminStats() {
  const db = requireSupabase()
  const [programs, enrollments, messages, workshops] = await Promise.all([
    db.from('course_categories').select('id', { count: 'exact', head: true }),
    db.from('enrollments').select('id', { count: 'exact', head: true }),
    db.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    db.from('workshops').select('id', { count: 'exact', head: true }),
  ])
  const failed = [programs.error, enrollments.error, messages.error, workshops.error].find(Boolean)
  if (failed) throw failed
  return {
    programs: programs.count ?? 0,
    enrollments: enrollments.count ?? 0,
    unread: messages.count ?? 0,
    workshops: workshops.count ?? 0,
  }
}

export async function uploadMedia(path: string, file: File) {
  const db = requireSupabase()
  const { error } = await db.storage.from('media').upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error
  const { data } = db.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}
