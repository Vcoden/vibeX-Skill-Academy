-- VibeX Skills Academy starter content.
-- Run after schema.sql.
-- Replace sample testimonials, mentors, and community notes with real people before a public launch.
--
-- The original brief listed categories 01-09 and was cut off during UI/UX.
-- "Web App Design" completes that curriculum.
-- Categories 10 and 11 are starter programs so the academy has 11 skills in the database.
-- Edit or replace them from the admin dashboard. Nothing here is hardcoded in the app.

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
  'video-production', 10, '10', 'Video Production', null,
  'Edit and deliver videos that hold attention and meet a client brief.',
  'Learn editing, short-form storytelling, sound, and delivery. You finish a portfolio edit produced from a client-style brief. This starter program can be renamed in the admin dashboard.',
  'Clapperboard', 145000, 30, 'Online & Offline', null,
  array['Complete a portfolio edit', 'Cut a short-form piece', 'Export and deliver files correctly'],
  true
),
(
  'a0000000-0000-4000-8000-000000000011',
  'virtual-assistance', 11, '11', 'Virtual Assistance', null,
  'Support clients professionally online, including founders and teams abroad.',
  'Practice communication, operations, research, and the tools used by virtual assistants. You build a service offer and a client onboarding kit. This starter program can be renamed in the admin dashboard.',
  'Headset', 100000, 30, 'Online & Offline', null,
  array['Write a VA service offer', 'Set up a client onboarding kit', 'Practice professional remote communication'],
  true
)
on conflict (slug) do update set
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
('a0000000-0000-4000-8000-000000000010', 'Video Editing Foundations', 1),
('a0000000-0000-4000-8000-000000000010', 'Short-Form Content', 2),
('a0000000-0000-4000-8000-000000000010', 'Storytelling for Clients', 3),
('a0000000-0000-4000-8000-000000000010', 'Sound and Pacing', 4),
('a0000000-0000-4000-8000-000000000010', 'Export and Delivery', 5),
('a0000000-0000-4000-8000-000000000010', 'Portfolio Edit', 6),
('a0000000-0000-4000-8000-000000000011', 'Professional Communication', 1),
('a0000000-0000-4000-8000-000000000011', 'Inbox and Calendar Systems', 2),
('a0000000-0000-4000-8000-000000000011', 'Research for Clients', 3),
('a0000000-0000-4000-8000-000000000011', 'Documentation and SOPs', 4),
('a0000000-0000-4000-8000-000000000011', 'Tools for Remote Teams', 5),
('a0000000-0000-4000-8000-000000000011', 'Working with International Clients', 6),
('a0000000-0000-4000-8000-000000000011', 'Building a VA Service Offer', 7)
on conflict (course_category_id, title) do update set sort_order = excluded.sort_order;

insert into public.journey_steps (id, step_number, phase, title, description, sort_order) values
('b0000000-0000-4000-8000-000000000001', 1, 'Before day 1', 'Choose your skill', 'Pick a 30-day program aligned with the work you want to do. Review the curriculum, fee, and format, then submit your enrollment.', 1),
('b0000000-0000-4000-8000-000000000002', 2, 'Days 1–7', 'Learn the foundations', 'Work through the core lessons with a clear weekly target. Mentors help you understand the skill before you rush into tools.', 2),
('b0000000-0000-4000-8000-000000000003', 3, 'Days 8–16', 'Practice with feedback', 'Complete guided exercises, attend workshop sessions, and get critique from mentors and your cohort.', 3),
('b0000000-0000-4000-8000-000000000004', 4, 'Days 17–24', 'Build a real project', 'Apply the skill to a portfolio piece a client or employer can understand. This is project-based learning, not a pile of theory.', 4),
('b0000000-0000-4000-8000-000000000005', 5, 'Days 25–28', 'Earn your certification', 'Complete the program requirements and assessment. Your certificate records the skill you trained, not a promise of income.', 5),
('b0000000-0000-4000-8000-000000000006', 6, 'Days 29–30', 'Prepare for real opportunities', 'Get freelancing support, learn how to present your work, and receive guidance for working with clients, including international clients.', 6)
on conflict (id) do update set
  step_number = excluded.step_number,
  phase = excluded.phase,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.faqs (id, question, answer, topic, sort_order, is_published) values
('c0000000-0000-4000-8000-000000000001', 'How long is each program?', 'Each main program is a structured 30-day skills program. You move from foundations to practice, a real project, and certification requirements.', 'Programs', 1, true),
('c0000000-0000-4000-8000-000000000002', 'Are programs online or offline?', 'Training is offered online and offline. The format for each program is shown on its page and can include live sessions, practical work, and campus or studio time when a cohort is in person.', 'Programs', 2, true),
('c0000000-0000-4000-8000-000000000003', 'Do I receive a certificate?', 'Yes. Students who complete the program requirements and assessment receive a VibeX Skills Academy certificate for that program. The certificate validates your training. It is not a guarantee of employment or income.', 'Certification', 3, true),
('c0000000-0000-4000-8000-000000000004', 'Is mentorship included?', 'Yes. Mentorship sits alongside lessons. You get guidance on your work, your project, and the next step after the 30 days.', 'Support', 4, true),
('c0000000-0000-4000-8000-000000000005', 'What does freelancing support include?', 'You learn how to package your skill, present a project, communicate with clients, and look for opportunities. Support includes guidance for working with international clients. The academy does not promise clients or earnings.', 'Support', 5, true),
('c0000000-0000-4000-8000-000000000006', 'Does the Forex program promise profits?', 'No. Forex training at VibeX is educational. Trading involves financial risk, including the possible loss of money. You will study risk management and practice on a demo account. Nothing in the program is a guarantee of profit.', 'Programs', 6, true),
('c0000000-0000-4000-8000-000000000007', 'How do I enroll?', 'Create an account, choose a program, and submit your enrollment. The academy confirms your place and payment status. You can track the status from your student dashboard.', 'Enrollment', 7, true),
('c0000000-0000-4000-8000-000000000008', 'Can I track my learning after I enroll?', 'Yes. Once you are enrolled, your dashboard includes the program curriculum so you can mark modules complete as you work through the 30 days.', 'Learning', 8, true)
on conflict (id) do update set
  question = excluded.question,
  answer = excluded.answer,
  topic = excluded.topic,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published;

insert into public.testimonials (id, name, role, program_label, quote, rating, is_published, sort_order) values
('d0000000-0000-4000-8000-000000000001', 'Amaka O.', 'Sample student', 'Digital Marketing', 'The 30 days gave me a campaign I could actually explain. I was not collecting random tips. I was building something I could show.', 5, true, 1),
('d0000000-0000-4000-8000-000000000002', 'Daniel K.', 'Sample student', 'VIBE CODING', 'I shipped a small web app and learned how to talk about it with a client. The project mattered more than the number of lessons.', 5, true, 2),
('d0000000-0000-4000-8000-000000000003', 'Sarah M.', 'Sample student', 'Writing & Publishing', 'Mentorship kept the manuscript moving. I finished a sample chapter and a formatted file instead of another unfinished draft.', 5, true, 3),
('d0000000-0000-4000-8000-000000000004', 'Ibrahim T.', 'Sample student', 'UI/UX Design', 'I left with a case study, not just screenshots. The feedback on my prototype was specific and useful.', 5, true, 4)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  program_label = excluded.program_label,
  quote = excluded.quote,
  rating = excluded.rating,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

insert into public.workshops (id, slug, title, summary, description, starts_at, mode, location, price_ngn, seats, is_published) values
('e0000000-0000-4000-8000-000000000001', 'portfolio-critique-lab', 'Portfolio Critique Lab', 'Bring a project and leave with clear next edits.', 'A practical studio session for students preparing portfolio pieces. Mentors review structure, presentation, and what a client would ask next.', '2026-11-07 10:00:00+01', 'Hybrid', 'Campus studio and online', 15000, 24, true),
('e0000000-0000-4000-8000-000000000002', 'international-clients', 'Working with International Clients', 'Learn how to communicate, scope, and deliver work across borders.', 'A workshop on proposals, time zones, professional communication, and presenting your skill to clients outside your city. No client placements are promised.', '2026-11-14 15:00:00+01', 'Online', 'Live online session', 20000, 40, true),
('e0000000-0000-4000-8000-000000000003', 'trading-risk-education', 'Trading Risk Education', 'A plain-language session on risk, journals, and demo practice.', 'This session reinforces that trading can lead to financial loss. It covers position risk, journaling, and why a demo account comes before live capital.', '2026-11-21 11:00:00+01', 'Hybrid', 'Campus classroom and online', 0, 50, true),
('e0000000-0000-4000-8000-000000000004', 'vibe-coding-build-night', 'Vibe Coding Build Night', 'Build a small web feature with mentors in the room.', 'A focused build session for students in VIBE CODING and anyone curious about shipping a page, a form, or a dashboard feature.', '2026-11-28 16:00:00+01', 'Offline', 'Campus lab', 25000, 20, true)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  starts_at = excluded.starts_at,
  mode = excluded.mode,
  location = excluded.location,
  price_ngn = excluded.price_ngn,
  seats = excluded.seats,
  is_published = excluded.is_published;

insert into public.mentors (id, name, title, focus, bio, is_published, sort_order) values
('f0000000-0000-4000-8000-000000000001', 'Chioma Adeyemi', 'Lead mentor, design and marketing', 'Digital Marketing, Creative & Visual, UI/UX', 'Chioma reviews campaign plans, brand visuals, and interface case studies. Sample profile for setup. Replace with your real mentor before launch.', true, 1),
('f0000000-0000-4000-8000-000000000002', 'Michael Okonkwo', 'Lead mentor, VIBE CODING', 'Web design, Supabase, deployment', 'Michael helps students ship and explain a working project. Sample profile for setup. Replace with your real mentor before launch.', true, 2),
('f0000000-0000-4000-8000-000000000003', 'Ruth Bassey', 'Lead mentor, writing', 'Publishing, creative writing, research', 'Ruth coaches structure, voice, and research notes for long-form work. Sample profile for setup. Replace with your real mentor before launch.', true, 3),
('f0000000-0000-4000-8000-000000000004', 'Samuel Nwosu', 'Career mentor', 'Freelancing and international clients', 'Samuel runs sessions on offers, communication, and professional delivery. He does not promise clients or income. Sample profile for setup.', true, 4)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  focus = excluded.focus,
  bio = excluded.bio,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

insert into public.community_posts (id, title, body, kind, author_name, is_published, sort_order) values
('ab000000-0000-4000-8000-000000000001', 'Skill circles', 'Each cohort has a circle for questions, work reviews, and accountability. You are not studying alone for 30 days.', 'Circle', 'VibeX team', true, 1),
('ab000000-0000-4000-8000-000000000002', 'Project showcases', 'Students present practical projects, from campaign samples and manuscripts to websites and design case studies.', 'Showcase', 'VibeX team', true, 2),
('ab000000-0000-4000-8000-000000000003', 'Mentor office hours', 'Bring a stuck lesson, a draft, or a client-style brief. Office hours are for specific feedback.', 'Support', 'VibeX team', true, 3),
('ab000000-0000-4000-8000-000000000004', 'International client practice', 'Community sessions cover proposals, updates, and delivery habits for working with clients in other countries.', 'Career', 'VibeX team', true, 4)
on conflict (id) do update set
  title = excluded.title,
  body = excluded.body,
  kind = excluded.kind,
  author_name = excluded.author_name,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;
