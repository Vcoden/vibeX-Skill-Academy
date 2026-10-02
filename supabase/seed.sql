-- VibeX Skills Academy catalog.
-- Run after schema.sql.
-- Testimonials, mentors, and workshops stay empty until the academy adds real records.

insert into public.course_categories (
  id, slug, sort_order, code, name, subtitle, summary, description, icon,
  price, duration_days, format_label, risk_notice, outcomes, is_published
) values
(
  'a0000000-0000-4000-8000-000000000001',
  'forex-trading', 1, '01', 'Forex Trading', null,
  'Learn how currency markets move, how to read structure, and how to manage risk with discipline.',
  'A 30-day educational program covering market structure, analysis, psychology, and planning. You practice on a demo account and leave with a written trading plan and journal. This is skills training, not a signal service.',
  'TrendingUp', 180000, 30, 'Online & Offline',
  'Trading involves financial risk, including the possible loss of money. This program is educational. VibeX Skills Academy does not guarantee profits, income, or trading results. Practice on a demo account and only risk capital you can afford to lose.',
  array['Read market structure with more confidence', 'Keep a trading journal', 'Write a personal trading plan', 'Practice on a demo account before live capital'],
  true
),
(
  'a0000000-0000-4000-8000-000000000002',
  'digital-marketing', 2, '02', 'Digital Marketing', null,
  'Plan, publish, and measure campaigns that help a brand attract the right audience.',
  'Build practical marketing skills across content, search, email, and paid distribution. You leave with a campaign plan and sample assets you can show to an employer or client.',
  'Megaphone', 150000, 30, 'Online & Offline', null,
  array['Write a simple marketing strategy', 'Create a content and campaign sample', 'Understand how leads are generated and tracked'],
  true
),
(
  'a0000000-0000-4000-8000-000000000003',
  'creative-writing-music', 3, '03', 'Creative Writing & Music', null,
  'Develop lyrics, stories, and inspirational writing with a clear creative process.',
  'Practice songwriting, story development, and purpose-driven writing, including Christian and children''s creative work. You finish with original pieces and a repeatable workflow.',
  'Music2', 110000, 30, 'Online & Offline', null,
  array['Complete original lyrics or a short story', 'Use a repeatable drafting process', 'Prepare work for feedback and revision'],
  true
),
(
  'a0000000-0000-4000-8000-000000000004',
  'creative-visual', 4, '04', 'Creative & Visual', null,
  'Design clear, modern visuals for brands, social platforms, and presentations.',
  'Learn practical design through Canva and professional layout principles. You produce a small brand kit and a set of promotional graphics.',
  'Palette', 130000, 30, 'Online & Offline', null,
  array['Build a mini brand kit', 'Design social and presentation graphics', 'Present visual work with a clear rationale'],
  true
),
(
  'a0000000-0000-4000-8000-000000000005',
  'audio-transcription', 5, '05', 'Audio & Transcription', null,
  'Turn speech into accurate text and support audio production workflows.',
  'Train accuracy, listening, and delivery for transcription, interviews, podcasts, and narration support. You complete timed practice projects and a quality checklist.',
  'AudioLines', 100000, 30, 'Online & Offline', null,
  array['Deliver a timed transcription sample', 'Use a quality checklist', 'Understand narration and audiobook support tasks'],
  true
),
(
  'a0000000-0000-4000-8000-000000000006',
  'research-information', 6, '06', 'Research & Information', null,
  'Find, verify, and organize information for families, writers, and content teams.',
  'Practice genealogy, historical, and online research, including source tracking. You deliver a documented research brief a client can trust.',
  'Search', 120000, 30, 'Online & Offline', null,
  array['Produce a sourced research brief', 'Track where each fact came from', 'Organize findings for writers or families'],
  true
),
(
  'a0000000-0000-4000-8000-000000000007',
  'writing-publishing', 7, '07', 'Writing & Publishing', null,
  'Write, refine, and format books and long-form content for publication.',
  'Covers ghostwriting, manuscripts, editing, and formatting for digital and print. You develop a sample chapter and a publishing-ready file.',
  'BookOpen', 150000, 30, 'Online & Offline', null,
  array['Draft a sample chapter', 'Edit for clarity and structure', 'Prepare an ebook or paperback file'],
  true
),
(
  'a0000000-0000-4000-8000-000000000008',
  'vibe-coding', 8, '08', 'VIBE CODING', 'Digital Design & Development',
  'Design, build, and deploy modern websites and web applications.',
  'A hands-on program covering responsive design, dashboards, Supabase, and AI-assisted development. You ship a deployed project you can walk a client through.',
  'Code2', 200000, 30, 'Online & Offline', null,
  array['Ship a deployed website or web app', 'Build with a real database', 'Explain how the project is maintained'],
  true
),
(
  'a0000000-0000-4000-8000-000000000009',
  'ui-ux-design', 9, '09', 'UI/UX Design', null,
  'Design interfaces that are clear, usable, and ready for development.',
  'Move from research and wireframes to prototypes and design systems for web and mobile. You present a complete interface case study.',
  'LayoutTemplate', 170000, 30, 'Online & Offline', null,
  array['Present a UI/UX case study', 'Prototype a user flow', 'Document a small design system'],
  true
),
(
  'a0000000-0000-4000-8000-000000000010',
  'shopify-dropshipping', 10, '10', 'SHOPIFY DROPSHIPPING', 'Store Development & E-Commerce',
  'Plan, build, customize, and manage a professional Shopify store.',
  'Learn Shopify setup, product pages, branding, payments, shipping, and the fundamentals of dropshipping operations. This is store-building training. It does not promise sales or income.',
  'ShoppingBag', 180000, 30, 'Online & Offline',
  'This program teaches store building and e-commerce operations. VibeX Skills Academy does not guarantee sales, orders, or income.',
  array['Set up a Shopify store structure', 'Publish product pages', 'Configure payments and shipping', 'Explain dropshipping operations without promising sales'],
  true
),
(
  'a0000000-0000-4000-8000-000000000011',
  'token-creation', 11, '11', 'TOKEN CREATION & TOKEN LAUNCHING', null,
  'Learn the technical foundations of creating, testing, and preparing a token launch.',
  'Cover token concepts, smart-contract basics, testnet deployment, documentation, and a careful launch workflow. The work emphasizes testing, security, transparency, and legitimate projects.',
  'Coins', 200000, 30, 'Online & Offline',
  'This program is technical education. VibeX Skills Academy does not guarantee token value, investment returns, fundraising, or financial performance. Testing, security, transparency, and legitimate project creation come first.',
  array['Explain token standards and tokenomics basics', 'Deploy and test a contract on a testnet', 'Prepare documentation for a legitimate project'],
  true
)
on conflict (id) do update set
  slug = excluded.slug,
  sort_order = excluded.sort_order,
  code = excluded.code,
  name = excluded.name,
  subtitle = excluded.subtitle,
  summary = excluded.summary,
  description = excluded.description,
  icon = excluded.icon,
  price = excluded.price,
  duration_days = excluded.duration_days,
  format_label = excluded.format_label,
  risk_notice = excluded.risk_notice,
  outcomes = excluded.outcomes,
  is_published = excluded.is_published;

delete from public.course_categories
where slug in ('video-production', 'virtual-assistance');

insert into public.course_subcategories (course_category_id, title, sort_order) values
('a0000000-0000-4000-8000-000000000001', 'Forex Trading Fundamentals', 1),
('a0000000-0000-4000-8000-000000000001', 'Understanding Currency Pairs', 2),
('a0000000-0000-4000-8000-000000000001', 'Forex Charts & Market Structure', 3),
('a0000000-0000-4000-8000-000000000001', 'Technical Analysis', 4),
('a0000000-0000-4000-8000-000000000001', 'Fundamental Analysis', 5),
('a0000000-0000-4000-8000-000000000001', 'Risk Management', 6),
('a0000000-0000-4000-8000-000000000001', 'Trading Psychology', 7),
('a0000000-0000-4000-8000-000000000001', 'Trading Strategies', 8),
('a0000000-0000-4000-8000-000000000001', 'Entry & Exit Planning', 9),
('a0000000-0000-4000-8000-000000000001', 'Demo Trading Practice', 10),
('a0000000-0000-4000-8000-000000000001', 'Trading Journal', 11),
('a0000000-0000-4000-8000-000000000001', 'Developing a Trading Plan', 12),
('a0000000-0000-4000-8000-000000000002', 'Social Media Marketing', 1),
('a0000000-0000-4000-8000-000000000002', 'Content Marketing', 2),
('a0000000-0000-4000-8000-000000000002', 'Search Engine Optimization', 3),
('a0000000-0000-4000-8000-000000000002', 'Email Marketing', 4),
('a0000000-0000-4000-8000-000000000002', 'Digital Advertising', 5),
('a0000000-0000-4000-8000-000000000002', 'Social Media Management', 6),
('a0000000-0000-4000-8000-000000000002', 'Marketing Strategy', 7),
('a0000000-0000-4000-8000-000000000002', 'Lead Generation', 8),
('a0000000-0000-4000-8000-000000000003', 'Song Lyrics', 1),
('a0000000-0000-4000-8000-000000000003', 'Country Music Lyrics', 2),
('a0000000-0000-4000-8000-000000000003', 'Inspirational Writing', 3),
('a0000000-0000-4000-8000-000000000003', 'Christian Creative Writing', 4),
('a0000000-0000-4000-8000-000000000003', 'Children''s Creative Content', 5),
('a0000000-0000-4000-8000-000000000003', 'Story Development', 6),
('a0000000-0000-4000-8000-000000000004', 'Canva Design', 1),
('a0000000-0000-4000-8000-000000000004', 'Social Media Graphics', 2),
('a0000000-0000-4000-8000-000000000004', 'Presentation Design', 3),
('a0000000-0000-4000-8000-000000000004', 'Digital Branding', 4),
('a0000000-0000-4000-8000-000000000004', 'Creative Direction', 5),
('a0000000-0000-4000-8000-000000000004', 'Visual Content', 6),
('a0000000-0000-4000-8000-000000000004', 'AI-Assisted Creative Work', 7),
('a0000000-0000-4000-8000-000000000004', 'Promotional Graphics', 8),
('a0000000-0000-4000-8000-000000000005', 'Audio Transcription', 1),
('a0000000-0000-4000-8000-000000000005', 'Video Transcription', 2),
('a0000000-0000-4000-8000-000000000005', 'Podcast Transcription', 3),
('a0000000-0000-4000-8000-000000000005', 'Interview Transcription', 4),
('a0000000-0000-4000-8000-000000000005', 'Audiobook Production Support', 5),
('a0000000-0000-4000-8000-000000000005', 'Narration/TTS Production Support', 6),
('a0000000-0000-4000-8000-000000000006', 'Genealogy Research', 1),
('a0000000-0000-4000-8000-000000000006', 'Ancestry Research', 2),
('a0000000-0000-4000-8000-000000000006', 'Family History Research', 3),
('a0000000-0000-4000-8000-000000000006', 'Historical Research', 4),
('a0000000-0000-4000-8000-000000000006', 'Online Research', 5),
('a0000000-0000-4000-8000-000000000006', 'Content Research', 6),
('a0000000-0000-4000-8000-000000000006', 'Data Collection', 7),
('a0000000-0000-4000-8000-000000000006', 'Research-Based Content', 8),
('a0000000-0000-4000-8000-000000000007', 'Book Ghostwriting', 1),
('a0000000-0000-4000-8000-000000000007', 'eBook Writing', 2),
('a0000000-0000-4000-8000-000000000007', 'Christian Book Writing', 3),
('a0000000-0000-4000-8000-000000000007', 'Self-Help Writing', 4),
('a0000000-0000-4000-8000-000000000007', 'Children''s Book Writing', 5),
('a0000000-0000-4000-8000-000000000007', 'Content Writing', 6),
('a0000000-0000-4000-8000-000000000007', 'Course Content & Curriculum', 7),
('a0000000-0000-4000-8000-000000000007', 'Manuscript Development', 8),
('a0000000-0000-4000-8000-000000000007', 'KDP Formatting', 9),
('a0000000-0000-4000-8000-000000000007', 'eBook Formatting', 10),
('a0000000-0000-4000-8000-000000000007', 'Paperback Formatting', 11),
('a0000000-0000-4000-8000-000000000007', 'Book Editing & Content Refinement', 12),
('a0000000-0000-4000-8000-000000000007', 'Research-Based Writing', 13),
('a0000000-0000-4000-8000-000000000008', 'Website Design', 1),
('a0000000-0000-4000-8000-000000000008', 'Website Development', 2),
('a0000000-0000-4000-8000-000000000008', 'Responsive Web Design', 3),
('a0000000-0000-4000-8000-000000000008', 'Web Applications', 4),
('a0000000-0000-4000-8000-000000000008', 'AI-Powered Web Applications', 5),
('a0000000-0000-4000-8000-000000000008', 'Landing Pages', 6),
('a0000000-0000-4000-8000-000000000008', 'Dashboard Design', 7),
('a0000000-0000-4000-8000-000000000008', 'Supabase Development', 8),
('a0000000-0000-4000-8000-000000000008', 'AI-Assisted Development', 9),
('a0000000-0000-4000-8000-000000000008', 'Website Deployment & Maintenance', 10),
('a0000000-0000-4000-8000-000000000009', 'UI Design', 1),
('a0000000-0000-4000-8000-000000000009', 'UX Design', 2),
('a0000000-0000-4000-8000-000000000009', 'User Research', 3),
('a0000000-0000-4000-8000-000000000009', 'Wireframing', 4),
('a0000000-0000-4000-8000-000000000009', 'Prototyping', 5),
('a0000000-0000-4000-8000-000000000009', 'Design Systems', 6),
('a0000000-0000-4000-8000-000000000009', 'Mobile App Design', 7),
('a0000000-0000-4000-8000-000000000009', 'Web App Design', 8),
('a0000000-0000-4000-8000-000000000009', 'Usability Testing', 9),
('a0000000-0000-4000-8000-000000000009', 'Information Architecture', 10),
('a0000000-0000-4000-8000-000000000009', 'Interaction Design', 11),
('a0000000-0000-4000-8000-000000000009', 'Figma Workflow', 12),
('a0000000-0000-4000-8000-000000000010', 'Shopify Fundamentals', 1),
('a0000000-0000-4000-8000-000000000010', 'Shopify Store Setup', 2),
('a0000000-0000-4000-8000-000000000010', 'Store Structure & Navigation', 3),
('a0000000-0000-4000-8000-000000000010', 'Product Research', 4),
('a0000000-0000-4000-8000-000000000010', 'Product Listing', 5),
('a0000000-0000-4000-8000-000000000010', 'Product Page Optimization', 6),
('a0000000-0000-4000-8000-000000000010', 'Shopify Theme Customization', 7),
('a0000000-0000-4000-8000-000000000010', 'Store Branding', 8),
('a0000000-0000-4000-8000-000000000010', 'Collections & Categories', 9),
('a0000000-0000-4000-8000-000000000010', 'Payment Configuration', 10),
('a0000000-0000-4000-8000-000000000010', 'Shipping Configuration', 11),
('a0000000-0000-4000-8000-000000000010', 'E-Commerce Marketing', 12),
('a0000000-0000-4000-8000-000000000010', 'Conversion Optimization', 13),
('a0000000-0000-4000-8000-000000000010', 'Dropshipping Fundamentals', 14),
('a0000000-0000-4000-8000-000000000010', 'Supplier Research', 15),
('a0000000-0000-4000-8000-000000000010', 'Order Management', 16),
('a0000000-0000-4000-8000-000000000010', 'Customer Service', 17),
('a0000000-0000-4000-8000-000000000010', 'Store Analytics', 18),
('a0000000-0000-4000-8000-000000000010', 'E-Commerce Growth Strategy', 19),
('a0000000-0000-4000-8000-000000000011', 'Blockchain Fundamentals', 1),
('a0000000-0000-4000-8000-000000000011', 'Token Concepts', 2),
('a0000000-0000-4000-8000-000000000011', 'Token Standards', 3),
('a0000000-0000-4000-8000-000000000011', 'Tokenomics Fundamentals', 4),
('a0000000-0000-4000-8000-000000000011', 'Smart Contract Fundamentals', 5),
('a0000000-0000-4000-8000-000000000011', 'Token Contract Development', 6),
('a0000000-0000-4000-8000-000000000011', 'Testnet Deployment', 7),
('a0000000-0000-4000-8000-000000000011', 'Wallet Integration', 8),
('a0000000-0000-4000-8000-000000000011', 'Contract Testing', 9),
('a0000000-0000-4000-8000-000000000011', 'Token Deployment Workflow', 10),
('a0000000-0000-4000-8000-000000000011', 'Basic Smart Contract Security', 11),
('a0000000-0000-4000-8000-000000000011', 'Token Verification', 12),
('a0000000-0000-4000-8000-000000000011', 'Launch Preparation', 13),
('a0000000-0000-4000-8000-000000000011', 'Community & Project Documentation', 14),
('a0000000-0000-4000-8000-000000000011', 'Token Project Website', 15),
('a0000000-0000-4000-8000-000000000011', 'Launch Workflow', 16),
('a0000000-0000-4000-8000-000000000011', 'Post-Launch Fundamentals', 17)
on conflict (course_category_id, title) do update set sort_order = excluded.sort_order;

delete from public.course_subcategories
where course_category_id = 'a0000000-0000-4000-8000-000000000010'
  and title in (
    'Video Editing Foundations', 'Short-Form Content', 'Storytelling for Clients',
    'Sound and Pacing', 'Export and Delivery', 'Portfolio Edit'
  );

delete from public.course_subcategories
where course_category_id = 'a0000000-0000-4000-8000-000000000011'
  and title in (
    'Professional Communication', 'Inbox and Calendar Systems', 'Research for Clients',
    'Documentation and SOPs', 'Tools for Remote Teams', 'Working with International Clients',
    'Building a VA Service Offer'
  );

update public.course_subcategories
set summary = 'Practice ' || title || ' as part of this 30-day program.'
where summary is null or btrim(summary) = '';

insert into public.journey_steps (id, step_number, phase, title, description, sort_order) values
('b0000000-0000-4000-8000-000000000001', 1, '01', 'Choose a Skill', 'Explore the academy''s professional programs.', 1),
('b0000000-0000-4000-8000-000000000002', 2, '02', 'Enroll', 'Choose your program and learning format.', 2),
('b0000000-0000-4000-8000-000000000003', 3, '03', 'Learn for 30 Days', 'Follow a structured training experience.', 3),
('b0000000-0000-4000-8000-000000000004', 4, '04', 'Build Projects', 'Turn knowledge into practical work.', 4),
('b0000000-0000-4000-8000-000000000005', 5, '05', 'Get Certified', 'Complete the requirements for certification.', 5),
('b0000000-0000-4000-8000-000000000006', 6, '06', 'Receive Mentorship', 'Continue receiving professional guidance.', 6),
('b0000000-0000-4000-8000-000000000007', 7, '07', 'Explore Opportunities', 'Develop your skills for freelancing, professional work, entrepreneurship, and other opportunities. Income, clients, and employment are not guaranteed.', 7)
on conflict (id) do update set
  step_number = excluded.step_number,
  phase = excluded.phase,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.faqs (id, question, answer, topic, sort_order, is_published) values
('c0000000-0000-4000-8000-000000000001', 'What is VibeX Skills Academy?', 'VibeX Skills Academy is a professional skills academy. Learners acquire practical skills, build projects, and continue developing after the core training period.', 'General', 1, true),
('c0000000-0000-4000-8000-000000000002', 'How long are the programs?', 'All core courses are structured as 30-day programs.', 'Programs', 2, true),
('c0000000-0000-4000-8000-000000000003', 'Are courses online or offline?', 'Programs can be offered online and offline.', 'Programs', 3, true),
('c0000000-0000-4000-8000-000000000004', 'How do I enroll?', 'Choose a program, make payment using the provided bank details, and submit your enrollment and payment information. The academy reviews the payment before admission.', 'Enrollment', 4, true),
('c0000000-0000-4000-8000-000000000005', 'How much does training cost?', 'Program fees range from ₦100,000 to ₦200,000 depending on the program. One fee covers every subcategory in that program.', 'Enrollment', 5, true),
('c0000000-0000-4000-8000-000000000006', 'Do I receive a certificate?', 'Eligible learners can receive certification after completing the required program requirements.', 'Certification', 6, true),
('c0000000-0000-4000-8000-000000000007', 'Can I continue with the academy after 30 days?', 'Yes. The academy provides opportunities for continued learning, mentorship, community engagement, and other professional support.', 'Support', 7, true),
('c0000000-0000-4000-8000-000000000008', 'Does VibeX guarantee freelancing income?', 'No. The academy provides training and guidance but does not guarantee income, clients, employment, or financial results.', 'Support', 8, true)
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  topic = excluded.topic,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

delete from public.testimonials where role = 'Sample student';
delete from public.mentors where bio ilike '%Sample profile%';
delete from public.workshops where slug in (
  'portfolio-critique-lab', 'international-clients', 'trading-risk-education', 'vibe-coding-build-night'
);

insert into public.community_posts (id, title, body, kind, author_name, is_published, sort_order) values
('ab000000-0000-4000-8000-000000000001', 'Student Community', 'Learners can stay connected, share progress, and receive academy information.', 'Community', null, true, 1),
('ab000000-0000-4000-8000-000000000002', 'Team Groups', 'Team groups are published here when the academy adds a WhatsApp, Telegram, Discord, or other link.', 'Community', null, true, 2),
('ab000000-0000-4000-8000-000000000003', 'Announcements', 'Program updates and academy notices appear in the student dashboard when an administrator publishes them.', 'Announcements', null, true, 3),
('ab000000-0000-4000-8000-000000000004', 'Learning Discussions', 'Use the community space to discuss lessons and projects. Links are added by the academy.', 'Discussions', null, true, 4),
('ab000000-0000-4000-8000-000000000005', 'Opportunities', 'The academy may share practice opportunities. Nothing here is a promise of clients, employment, or income.', 'Opportunities', null, true, 5),
('ab000000-0000-4000-8000-000000000006', 'Workshops', 'Shorter sessions are listed on the workshops page when the academy publishes them.', 'Workshops', null, true, 6),
('ab000000-0000-4000-8000-000000000007', 'Mentorship', 'Mentorship continues after the 30 days when a mentorship program is published by the academy.', 'Mentorship', null, true, 7)
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  kind = excluded.kind,
  author_name = excluded.author_name,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

update public.course_categories
set audience = array[
  'Beginners', 'Students', 'Career changers', 'Freelancers', 'Entrepreneurs',
  'Creatives', 'Professionals', 'People looking to develop new digital skills'
],
requirements = array[
  'A smartphone or computer',
  'Internet access for online learning',
  'Willingness to practice',
  'Commitment to the 30-day program'
]
where cardinality(audience) = 0;

insert into public.course_roadmaps (course_category_id, week_number, title, description, sort_order)
select c.id, w.week_number, w.title, w.description, w.week_number
from public.course_categories c
cross join (
  values
    (1, 'Foundation', 'Understand the fundamentals.'),
    (2, 'Skill Development', 'Learn practical techniques and professional workflows.'),
    (3, 'Project Building', 'Apply the skills to real-world projects.'),
    (4, 'Professional Practice', 'Complete projects, receive guidance, and prepare for real opportunities.')
) as w(week_number, title, description)
on conflict (course_category_id, week_number) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.site_settings (key, value) values
('contact_email', 'DRADURNEYFRA@GMAIL.COM'),
('whatsapp_display', '07059991266'),
('whatsapp_link', 'https://wa.me/2347059991266'),
('bank_name', 'OPay'),
('account_name', 'Adigun Muideen'),
('account_number', '7059991266')
on conflict (key) do update set value = excluded.value, updated_at = now();
