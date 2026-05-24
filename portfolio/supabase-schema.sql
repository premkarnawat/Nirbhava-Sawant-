-- ═══════════════════════════════════════════════
-- NIRBHAVA SAWANT PORTFOLIO — COMPLETE SCHEMA v4
-- Run in: Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════

create extension if not exists "uuid-ossp";

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- HERO
create table if not exists hero (
  id uuid primary key default uuid_generate_v4(),
  greeting text default 'HI, I''M',
  name text default 'NIRBHAVA SAWANT',
  tagline text default 'A 3D designer passionate about crafting bold and memorable projects ✦',
  cta_label text default 'Contact Me',
  profile_image text,
  updated_at timestamptz default now()
);

-- ABOUT
create table if not exists about (
  id uuid primary key default uuid_generate_v4(),
  name text default 'Nirbhava Sawant',
  headline text default '3D Designer & Visual Artist',
  subtitle text,
  content text[] default array['With over five years of experience in the design industry,','I specialize in branding, web design and 3D visualization.','I love collaborating with businesses to tell their story and shape how they''re seen by the world.'],
  skills text[] default array['3D Modeling','Blender','Figma','After Effects','Branding','Web Design','Motion','UI/UX'],
  profile_image text,
  resume_link text,
  updated_at timestamptz default now()
);

-- SKILLS
create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  name text not null,
  level int default 80 check (level between 0 and 100),
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- PROJECTS
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  num text,
  client text not null default 'CLIENT',
  sub text,
  description text,
  images text[] default '{}',
  live_link text,
  github_link text,
  tags text[] default '{}',
  visible bool default true,
  featured bool default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- CASE STUDIES
create table if not exists case_studies (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  overview text,
  problem text,
  research text,
  process text,
  outcome text,
  tools text[] default '{}',
  timeline text,
  metrics text[] default '{}',
  gallery text[] default '{}',
  created_at timestamptz default now()
);

-- SERVICES
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  num text,
  title text not null,
  description text,
  tags text[] default '{}',
  visible bool default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- EXPERIENCES
create table if not exists experiences (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  role text not null,
  start_date text,
  end_date text,
  current bool default false,
  description text,
  tags text[] default '{}',
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- EDUCATION
create table if not exists education (
  id uuid primary key default uuid_generate_v4(),
  institution text not null,
  degree text not null,
  field text,
  start_year int,
  end_year int,
  grade text,
  description text,
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- CERTIFICATIONS
create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text not null,
  date text,
  description text,
  image text,
  credential_url text,
  category text default 'Design',
  featured bool default false,
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- AWARDS
create table if not exists awards (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text not null,
  date text,
  description text,
  image text,
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- RESUME
create table if not exists resume (
  id uuid primary key default uuid_generate_v4(),
  file_url text,
  file_name text,
  version text,
  active bool default true,
  uploaded_at timestamptz default now()
);

-- TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  company text,
  avatar text,
  content text not null,
  rating int default 5 check (rating between 1 and 5),
  featured bool default false,
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- SOCIAL LINKS
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  sort_order int default 0,
  visible bool default true
);

-- CONTACTS (form submissions)
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text,
  read bool default false,
  created_at timestamptz default now()
);

-- BLOG POSTS
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  tags text[] default '{}',
  published bool default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- GALLERY
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  title text,
  image text not null,
  category text default 'General',
  sort_order int default 0,
  visible bool default true,
  created_at timestamptz default now()
);

-- SITE SETTINGS
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  site_title text default 'Nirbhava Sawant',
  meta_description text default 'A 3D designer passionate about crafting bold and memorable projects.',
  contact_email text default 'nirbhava@design.com',
  contact_phone text,
  footer_text text default '© 2025 Nirbhava Sawant',
  og_image text,
  google_analytics_id text
);

-- ═══ ROW LEVEL SECURITY ═══════════════════
do $$ declare t text; begin
  foreach t in array array['hero','about','skills','projects','case_studies','services',
    'experiences','education','certifications','awards','resume','testimonials',
    'social_links','contacts','blog_posts','gallery','site_settings'] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Public read (visitors)
create policy "pub_read_hero"     on hero          for select using (true);
create policy "pub_read_about"    on about         for select using (true);
create policy "pub_read_skills"   on skills        for select using (visible=true);
create policy "pub_read_projects" on projects      for select using (visible=true);
create policy "pub_read_cs"       on case_studies  for select using (true);
create policy "pub_read_services" on services      for select using (visible=true);
create policy "pub_read_exp"      on experiences   for select using (visible=true);
create policy "pub_read_edu"      on education     for select using (visible=true);
create policy "pub_read_certs"    on certifications for select using (visible=true);
create policy "pub_read_awards"   on awards        for select using (visible=true);
create policy "pub_read_resume"   on resume        for select using (active=true);
create policy "pub_read_testi"    on testimonials  for select using (visible=true);
create policy "pub_read_social"   on social_links  for select using (visible=true);
create policy "pub_read_blog"     on blog_posts    for select using (published=true);
create policy "pub_read_gallery"  on gallery       for select using (visible=true);
create policy "pub_read_settings" on site_settings for select using (true);

-- Public insert contacts
create policy "pub_insert_contacts" on contacts for insert with check (true);

-- Auth users: full management
do $$ declare t text; begin
  foreach t in array array['hero','about','skills','projects','case_studies','services',
    'experiences','education','certifications','awards','resume','testimonials',
    'social_links','contacts','blog_posts','gallery','site_settings'] loop
    execute format('create policy "auth_all_%s" on %I for all using (auth.role()=''authenticated'')', t, t);
  end loop;
end $$;

-- ═══ STORAGE ══════════════════════════════
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "pub_read_storage" on storage.objects
  for select using (bucket_id='portfolio');
create policy "auth_upload_storage" on storage.objects
  for insert with check (bucket_id='portfolio' and auth.role()='authenticated');
create policy "auth_delete_storage" on storage.objects
  for delete using (bucket_id='portfolio' and auth.role()='authenticated');

-- ═══ SEED DATA ════════════════════════════
insert into hero (greeting, name, tagline, cta_label) values
  ('HI, I''M','NIRBHAVA SAWANT','A 3D designer passionate about crafting bold and memorable projects ✦','Contact Me')
on conflict do nothing;

insert into about default values on conflict do nothing;

insert into services (num, title, description, tags, sort_order) values
  ('01','3D Design','Creation of detailed objects, characters, or environments.',array['Blender','Cinema 4D'],1),
  ('02','UI/UX Design','Crafting intuitive, beautiful digital experiences from wireframes to polished interfaces.',array['Figma','Framer'],2),
  ('03','Branding','Building memorable brand identities. Logo design, color systems, and guidelines.',array['Identity','Strategy'],3),
  ('04','Motion Design','Smooth, cinematic motion graphics and transitions.',array['After Effects','Motion'],4)
on conflict do nothing;

insert into social_links (platform, url, sort_order) values
  ('Instagram','https://instagram.com',1),
  ('Behance','https://behance.net',2),
  ('LinkedIn','https://linkedin.com',3),
  ('GitHub','https://github.com',4)
on conflict do nothing;

insert into skills (category, name, level, sort_order) values
  ('Design Tools','Figma',90,1),('Design Tools','Blender',88,2),
  ('Design Tools','After Effects',82,3),('Design Tools','Cinema 4D',78,4),
  ('Frontend','Next.js',75,5),('Frontend','Tailwind CSS',80,6)
on conflict do nothing;

insert into site_settings default values on conflict do nothing;
