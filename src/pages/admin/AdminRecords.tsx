import { useParams } from 'react-router-dom'
import { CrudManager, type FieldDef } from '@/pages/admin/CrudManager'

const published = { name: 'is_published', label: 'Published', type: 'checkbox' } as const

const resources: Record<string, { title: string; table: string; orderBy: string; labelKey: string; fields: FieldDef[]; blank: Record<string, unknown> }> = {
  workshops: {
    title: 'Workshops',
    table: 'workshops',
    orderBy: 'starts_at',
    labelKey: 'title',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'starts_at', label: 'Starts', type: 'datetime' },
      { name: 'mode', label: 'Mode', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'cover_url', label: 'Cover image URL', type: 'text' },
      { name: 'price_ngn', label: 'Price (NGN)', type: 'number', required: true },
      { name: 'seats', label: 'Seats', type: 'number' },
      published,
    ],
    blank: { slug: '', title: '', summary: '', description: '', starts_at: '', mode: 'Online', location: '', cover_url: '', price_ngn: 0, seats: '', is_published: true },
  },
  faqs: {
    title: 'FAQs',
    table: 'faqs',
    orderBy: 'sort_order',
    labelKey: 'question',
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'topic', label: 'Topic', type: 'text', required: true },
      { name: 'sort_order', label: 'Sort order', type: 'number', required: true },
      published,
    ],
    blank: { question: '', answer: '', topic: 'General', sort_order: 0, is_published: true },
  },
  testimonials: {
    title: 'Testimonials',
    table: 'testimonials',
    orderBy: 'sort_order',
    labelKey: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'program_label', label: 'Program', type: 'text' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating', type: 'number', required: true },
      { name: 'sort_order', label: 'Sort order', type: 'number', required: true },
      published,
    ],
    blank: { name: '', role: 'Program student', program_label: '', quote: '', rating: 5, sort_order: 0, is_published: false },
  },
  mentors: {
    title: 'Mentors',
    table: 'mentors',
    orderBy: 'sort_order',
    labelKey: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'focus', label: 'Focus', type: 'text', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea', required: true },
      { name: 'sort_order', label: 'Sort order', type: 'number', required: true },
      published,
    ],
    blank: { name: '', title: '', focus: '', bio: '', sort_order: 0, is_published: false },
  },
  journey: {
    title: 'Learning journey',
    table: 'journey_steps',
    orderBy: 'sort_order',
    labelKey: 'title',
    fields: [
      { name: 'step_number', label: 'Step number', type: 'number', required: true },
      { name: 'phase', label: 'Phase', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'sort_order', label: 'Sort order', type: 'number', required: true },
    ],
    blank: { step_number: 1, phase: '', title: '', description: '', sort_order: 1 },
  },
  community: {
    title: 'Community',
    table: 'community_posts',
    orderBy: 'sort_order',
    labelKey: 'title',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'body', label: 'Body', type: 'textarea', required: true },
      { name: 'kind', label: 'Kind', type: 'text', required: true },
      { name: 'author_name', label: 'Author', type: 'text' },
      { name: 'sort_order', label: 'Sort order', type: 'number', required: true },
      published,
    ],
    blank: { title: '', body: '', kind: 'Circle', author_name: 'VibeX team', sort_order: 0, is_published: true },
  },
}

export function AdminRecords() {
  const { resource = '' } = useParams()
  const config = resources[resource]
  if (!config) return <p>That admin section does not exist.</p>
  return <CrudManager {...config} />
}
