export type UserRole = 'student' | 'admin'
export type LearningFormat = 'online' | 'offline'
export type EnrollmentStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'enrolled'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected'
export type PaymentRecordStatus = 'submitted' | 'under_review' | 'verified' | 'rejected'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: UserRole
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface ProgramModule {
  id: string
  category_id: string
  title: string
  summary: string | null
  sort_order: number
}

export interface Category {
  id: string
  slug: string
  sort_order: number
  code: string
  name: string
  subtitle: string | null
  summary: string
  description: string
  icon: string
  price: number
  duration_days: number
  format_label: string
  risk_notice: string | null
  outcomes: string[]
  audience: string[]
  requirements: string[]
  cover_url: string | null
  is_published: boolean
  created_at: string
  modules?: ProgramModule[]
  roadmaps?: CourseRoadmap[]
  projects?: CourseProject[]
}

export interface CourseRoadmap {
  id: string
  course_category_id: string
  week_number: number
  title: string
  description: string
  sort_order: number
}

export interface CourseProject {
  id: string
  course_category_id: string
  title: string
  description: string
  difficulty: string | null
  skills: string | null
  outcome: string | null
  sort_order: number
}

export interface Workshop {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  starts_at: string | null
  mode: string
  location: string | null
  price_ngn: number
  seats: number | null
  cover_url: string | null
  instructor: string | null
  registration_status: string
  is_published: boolean
  created_at: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  topic: string
  sort_order: number
  is_published: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  program_label: string | null
  quote: string
  rating: number
  avatar_url: string | null
  is_published: boolean
  sort_order: number
}

export interface Mentor {
  id: string
  name: string
  title: string
  focus: string
  bio: string
  avatar_url: string | null
  is_published: boolean
  sort_order: number
}

export interface JourneyStep {
  id: string
  step_number: number
  phase: string
  title: string
  description: string
  sort_order: number
}

export interface CommunityPost {
  id: string
  title: string
  body: string
  kind: string
  author_name: string | null
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface PaymentReceipt {
  id: string
  payment_id: string
  storage_bucket: string
  storage_path: string
  original_filename: string
  mime_type: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface Payment {
  id: string
  enrollment_id: string
  internal_payment_reference: string
  student_bank_reference: string | null
  amount: number | string
  currency: string
  payment_method: 'bank_transfer'
  bank_name: string
  account_name: string
  transaction_date: string | null
  status: PaymentRecordStatus
  verified_by: string | null
  verified_at: string | null
  rejection_reason: string | null
  admin_notes: string | null
  created_at: string
  payment_receipts?: PaymentReceipt[]
}

export interface Enrollment {
  id: string
  enrollment_number: string
  student_id: string
  course_category_id: string
  learning_format: LearningFormat
  status: EnrollmentStatus
  amount_due: number | string
  currency: string
  submitted_at: string | null
  verified_at: string | null
  enrolled_at: string | null
  completed_at: string | null
  admin_notes: string | null
  created_at: string
  course_categories?: Pick<Category, 'id' | 'slug' | 'name' | 'code' | 'price' | 'duration_days' | 'icon'> | null
  payments?: Payment[]
  profiles?: Pick<Profile, 'full_name' | 'email' | 'phone'> | null
}

export interface Certificate {
  id: string
  enrollment_id: string | null
  student_id: string
  certificate_number: string
  student_name: string
  program_name: string
  issued_on: string
  status: 'valid' | 'revoked'
  file_url: string | null
  created_at: string
}

export interface ProfessionalProgram {
  id: string
  slug: string
  title: string
  description: string
  duration_label: string | null
  price: number | string | null
  requirements: string | null
  application_process: string | null
  status: string
  starts_on: string | null
  ends_on: string | null
  is_published: boolean
  sort_order: number
}

export interface MentorshipProgram {
  id: string
  title: string
  description: string
  availability: string | null
  application_status: string
  is_published: boolean
  sort_order: number
}

export interface CommunityLink {
  id: string
  platform: string
  label: string
  url: string
  is_published: boolean
  sort_order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  is_published: boolean
  sort_order: number
}

export interface Announcement {
  id: string
  title: string
  body: string
  is_published: boolean
  created_at: string
}

export interface LearningResource {
  id: string
  course_category_id: string | null
  title: string
  description: string | null
  link_url: string | null
  is_published: boolean
  sort_order: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  created_at: string
  is_read: boolean
}

export interface ModuleProgress {
  user_id: string
  module_id: string
  completed: boolean
  completed_at: string
}
