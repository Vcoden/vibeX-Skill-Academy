import type { Category, CourseRoadmap, Faq, JourneyStep } from '@/types/database'

export const defaultAudience = [
  'Beginners',
  'Students',
  'Career changers',
  'Freelancers',
  'Entrepreneurs',
  'Creatives',
  'Professionals',
  'People looking to develop new digital skills',
]

export const defaultRequirements = [
  'A smartphone or computer',
  'Internet access for online learning',
  'Willingness to practice',
  'Commitment to the 30-day program',
]

export const lifeAfter = [
  { title: 'Mentorship', text: 'Continue receiving guidance as you develop your skills.' },
  { title: 'Freelancing Support', text: 'Learn how to position your skills and pursue freelance opportunities.' },
  { title: 'International Client Guidance', text: 'Receive practical guidance on preparing for and working with international clients.' },
  { title: 'Work With Experts', text: 'Continue interacting and working alongside experienced people where opportunities are available.' },
  { title: 'Community Access', text: 'Stay connected through the VibeX community or team group.' },
  { title: 'Academy Access', text: 'Continue engaging with the academy after your core training period.' },
]

export const practiceSteps = ['Learn', 'Practice', 'Build', 'Improve', 'Present']

const roadmapTitles = [
  ['Foundation', 'Understand the fundamentals.'],
  ['Skill Development', 'Learn practical techniques and professional workflows.'],
  ['Project Building', 'Apply the skills to real-world projects.'],
  ['Professional Practice', 'Complete projects, receive guidance, and prepare for real opportunities.'],
] as const

export const fallbackJourney: JourneyStep[] = [
  { id: 'j1', step_number: 1, phase: '01', title: 'Choose a Skill', description: "Explore the academy's professional programs.", sort_order: 1 },
  { id: 'j2', step_number: 2, phase: '02', title: 'Enroll', description: 'Choose your program and learning format.', sort_order: 2 },
  { id: 'j3', step_number: 3, phase: '03', title: 'Learn for 30 Days', description: 'Follow a structured training experience.', sort_order: 3 },
  { id: 'j4', step_number: 4, phase: '04', title: 'Build Projects', description: 'Turn knowledge into practical work.', sort_order: 4 },
  { id: 'j5', step_number: 5, phase: '05', title: 'Get Certified', description: 'Complete the requirements for certification.', sort_order: 5 },
  { id: 'j6', step_number: 6, phase: '06', title: 'Receive Mentorship', description: 'Continue receiving professional guidance.', sort_order: 6 },
  { id: 'j7', step_number: 7, phase: '07', title: 'Explore Opportunities', description: 'Develop your skills for freelancing, professional work, entrepreneurship, and other opportunities.', sort_order: 7 },
]

export const fallbackFaqs: Faq[] = [
  { id: 'f1', question: 'What is VibeX Skills Academy?', answer: 'VibeX Skills Academy is a professional skills academy. Learners acquire practical skills, build projects, and continue developing after the core training period.', topic: 'General', sort_order: 1, is_published: true },
  { id: 'f2', question: 'How long are the programs?', answer: 'All core courses are structured as 30-day programs.', topic: 'Programs', sort_order: 2, is_published: true },
  { id: 'f3', question: 'Are courses online or offline?', answer: 'Programs can be offered online and offline.', topic: 'Programs', sort_order: 3, is_published: true },
  { id: 'f4', question: 'How do I enroll?', answer: 'Choose a program, make payment using the provided bank details, and submit your enrollment and payment information.', topic: 'Enrollment', sort_order: 4, is_published: true },
  { id: 'f5', question: 'How much does training cost?', answer: 'Program fees range from ₦100,000 to ₦200,000 depending on the program.', topic: 'Enrollment', sort_order: 5, is_published: true },
  { id: 'f6', question: 'Do I receive a certificate?', answer: 'Eligible learners can receive certification after completing the required program requirements.', topic: 'Certification', sort_order: 6, is_published: true },
  { id: 'f7', question: 'Can I continue with the academy after 30 days?', answer: 'Yes. The academy provides opportunities for continued learning, mentorship, community engagement, and other professional support.', topic: 'Support', sort_order: 7, is_published: true },
  { id: 'f8', question: 'Does VibeX guarantee freelancing income?', answer: 'No. The academy provides training and guidance but does not guarantee income, clients, employment, or financial results.', topic: 'Support', sort_order: 8, is_published: true },
]

export const contactDefaults = {
  email: 'DRADURNEYFRA@GMAIL.COM',
  whatsappDisplay: '07059991266',
  whatsappLink: 'https://wa.me/2347059991266',
}

type Draft = {
  code: string
  slug: string
  name: string
  subtitle?: string
  summary: string
  description: string
  icon: string
  price: number
  risk_notice?: string
  outcomes: string[]
  modules: string[]
}

const drafts: Draft[] = [
  {
    code: '01', slug: 'forex-trading', name: 'Forex Trading', icon: 'TrendingUp', price: 180000,
    summary: 'Learn how currency markets move, how to read structure, and how to manage risk with discipline.',
    description: 'A 30-day educational program covering market structure, analysis, psychology, and planning. You practice on a demo account and leave with a written trading plan and journal. This is skills training, not a signal service.',
    risk_notice: 'Trading involves financial risk, including the possible loss of money. This program is educational. VibeX Skills Academy does not guarantee profits, income, or trading results. Practice on a demo account and only risk capital you can afford to lose.',
    outcomes: ['Read market structure with more confidence', 'Keep a trading journal', 'Write a personal trading plan', 'Practice on a demo account before live capital'],
    modules: ['Forex Trading Fundamentals', 'Understanding Currency Pairs', 'Forex Charts & Market Structure', 'Technical Analysis', 'Fundamental Analysis', 'Risk Management', 'Trading Psychology', 'Trading Strategies', 'Entry & Exit Planning', 'Demo Trading Practice', 'Trading Journal'],
  },
  {
    code: '02', slug: 'digital-marketing', name: 'Digital Marketing', icon: 'Megaphone', price: 150000,
    summary: 'Plan, publish, and measure campaigns that help a brand attract the right audience.',
    description: 'Build practical marketing skills across content, search, email, and paid distribution. You leave with a campaign plan and sample assets you can show to an employer or client.',
    outcomes: ['Write a simple marketing strategy', 'Create a content and campaign sample', 'Understand how leads are generated and tracked'],
    modules: ['Digital Marketing Fundamentals', 'Content Marketing', 'Social Media Marketing', 'Email Marketing', 'Search Marketing', 'Paid Advertising Basics', 'Campaign Planning', 'Analytics'],
  },
  {
    code: '03', slug: 'creative-writing-music', name: 'Creative Writing & Music', icon: 'Music2', price: 110000,
    summary: 'Develop lyrics, stories, and inspirational writing with a clear creative process.',
    description: 'Practice songwriting, story development, and purpose-driven writing. You finish with original pieces and a repeatable workflow.',
    outcomes: ['Complete original lyrics or a short story', 'Use a repeatable drafting process', 'Prepare work for feedback and revision'],
    modules: ['Songwriting', 'Story Development', 'Lyrics', 'Creative Process', 'Revision'],
  },
  {
    code: '04', slug: 'creative-visual', name: 'Creative & Visual', icon: 'Palette', price: 130000,
    summary: 'Design clear, modern visuals for brands, social platforms, and presentations.',
    description: 'Learn practical design through layout principles. You produce a small brand kit and a set of promotional graphics.',
    outcomes: ['Build a mini brand kit', 'Design social and presentation graphics', 'Present visual work with a clear rationale'],
    modules: ['Visual Design Basics', 'Brand Kits', 'Social Graphics', 'Presentation Design'],
  },
  {
    code: '05', slug: 'audio-transcription', name: 'Audio & Transcription', icon: 'AudioLines', price: 100000,
    summary: 'Turn speech into accurate text and support audio production workflows.',
    description: 'Train accuracy, listening, and delivery for transcription, interviews, podcasts, and narration support.',
    outcomes: ['Deliver a timed transcription sample', 'Use a quality checklist', 'Understand narration and audiobook support tasks'],
    modules: ['Transcription Accuracy', 'Listening Practice', 'Interviews and Podcasts', 'Quality Checklist'],
  },
  {
    code: '06', slug: 'research-information', name: 'Research & Information', icon: 'Search', price: 120000,
    summary: 'Find, verify, and organize information for families, writers, and content teams.',
    description: 'Practice genealogy, historical, and online research, including source tracking. You deliver a documented research brief.',
    outcomes: ['Produce a sourced research brief', 'Track where each fact came from', 'Organize findings for writers or families'],
    modules: ['Source Tracking', 'Online Research', 'Genealogy Research', 'Research Briefs'],
  },
  {
    code: '07', slug: 'writing-publishing', name: 'Writing & Publishing', icon: 'BookOpen', price: 150000,
    summary: 'Write, refine, and format books and long-form content for publication.',
    description: 'Covers ghostwriting, manuscripts, editing, and formatting for digital and print. You develop a sample chapter and a publishing-ready file.',
    outcomes: ['Draft a sample chapter', 'Edit for clarity and structure', 'Prepare an ebook or paperback file'],
    modules: ['Ghostwriting', 'Manuscript Development', 'Editing', 'eBook Formatting', 'Paperback Formatting'],
  },
  {
    code: '08', slug: 'vibe-coding', name: 'VIBE CODING', subtitle: 'Digital Design & Development', icon: 'Code2', price: 200000,
    summary: 'Design, build, and deploy modern websites and web applications.',
    description: 'A hands-on program covering responsive design, dashboards, Supabase, and AI-assisted development. You ship a deployed project you can walk a client through.',
    outcomes: ['Ship a deployed website or web app', 'Build with a real database', 'Explain how the project is maintained'],
    modules: ['Website Design', 'Website Development', 'Responsive Web Design', 'Web Applications', 'AI-Powered Web Applications', 'Landing Pages', 'Dashboard Design', 'Supabase Development', 'AI-Assisted Development', 'Website Deployment & Maintenance'],
  },
  {
    code: '09', slug: 'ui-ux-design', name: 'UI/UX Design', icon: 'LayoutTemplate', price: 170000,
    summary: 'Design interfaces that are clear, usable, and ready for development.',
    description: 'Research users, structure digital experiences, design interfaces, create prototypes, build design systems, and prepare professional UI/UX work.',
    outcomes: ['Present a UI/UX case study', 'Prototype a user flow', 'Document a small design system'],
    modules: ['UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Mobile App Design', 'Web App Design', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Figma Workflow'],
  },
  {
    code: '10', slug: 'shopify-dropshipping', name: 'SHOPIFY DROPSHIPPING', subtitle: 'Store Development & E-Commerce', icon: 'ShoppingBag', price: 180000,
    summary: 'Plan, build, customize, and manage a professional Shopify store.',
    description: 'Learn Shopify setup, product pages, branding, payments, shipping, and the fundamentals of dropshipping operations.',
    risk_notice: 'This program teaches store building and e-commerce operations. VibeX Skills Academy does not guarantee sales, orders, or income.',
    outcomes: ['Set up a Shopify store structure', 'Publish product pages', 'Configure payments and shipping'],
    modules: ['Shopify Fundamentals', 'Shopify Store Setup', 'Store Structure & Navigation', 'Product Research', 'Product Listing', 'Product Page Optimization', 'Shopify Theme Customization', 'Store Branding', 'Collections & Categories', 'Payment Configuration', 'Shipping Configuration', 'E-Commerce Marketing', 'Conversion Optimization', 'Dropshipping Fundamentals', 'Supplier Research', 'Order Management', 'Customer Service', 'Store Analytics', 'E-Commerce Growth Strategy'],
  },
  {
    code: '11', slug: 'token-creation', name: 'TOKEN CREATION & TOKEN LAUNCHING', icon: 'Coins', price: 200000,
    summary: 'Learn the technical foundations of creating, testing, and preparing a token launch.',
    description: 'Cover token concepts, smart-contract basics, testnet deployment, documentation, and a careful launch workflow.',
    risk_notice: 'This program is technical education. VibeX Skills Academy does not guarantee token value, investment returns, fundraising, or financial performance. Testing, security, transparency, and legitimate project creation come first.',
    outcomes: ['Explain token standards', 'Deploy and test on a testnet', 'Prepare project documentation'],
    modules: ['Blockchain Fundamentals', 'Token Concepts', 'Token Standards', 'Tokenomics Fundamentals', 'Smart Contract Fundamentals', 'Token Contract Development', 'Testnet Deployment', 'Wallet Integration', 'Contract Testing', 'Token Deployment Workflow', 'Basic Smart Contract Security', 'Token Verification', 'Launch Preparation', 'Community & Project Documentation', 'Token Project Website', 'Launch Workflow', 'Post-Launch Fundamentals'],
  },
]

function roadmaps(slug: string): CourseRoadmap[] {
  return roadmapTitles.map(([title, description], index) => ({
    id: `${slug}-week-${index + 1}`,
    course_category_id: slug,
    week_number: index + 1,
    title,
    description,
    sort_order: index + 1,
  }))
}

export const fallbackCategories: Category[] = drafts.map((draft, index) => ({
  id: draft.slug,
  slug: draft.slug,
  sort_order: index + 1,
  code: draft.code,
  name: draft.name,
  subtitle: draft.subtitle ?? null,
  summary: draft.summary,
  description: draft.description,
  icon: draft.icon,
  price: draft.price,
  duration_days: 30,
  format_label: 'Online & Offline',
  risk_notice: draft.risk_notice ?? null,
  outcomes: draft.outcomes,
  audience: defaultAudience,
  requirements: defaultRequirements,
  cover_url: null,
  is_published: true,
  created_at: '',
  roadmaps: roadmaps(draft.slug),
  projects: [],
  modules: draft.modules.map((title, moduleIndex) => ({
    id: `${draft.slug}-module-${moduleIndex + 1}`,
    category_id: draft.slug,
    title,
    summary: `Practice ${title} as part of this 30-day program.`,
    sort_order: moduleIndex + 1,
  })),
}))

export function fallbackCategory(slug: string) {
  return fallbackCategories.find((program) => program.slug === slug) ?? null
}
