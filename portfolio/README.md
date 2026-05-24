# Nirbhava Sawant Portfolio v4 — Production Ready

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Supabase** (PostgreSQL + Auth + Storage)
- **Vercel** deployment
- Zero external animation dependencies (pure CSS + JS)

## Quick Start
```bash
npm install
cp .env.local.example .env.local  # add your Supabase keys
# Run supabase-schema.sql in Supabase SQL Editor
npm run dev
```

## Project Structure
```
portfolio/
├── app/
│   ├── globals.css              # Design system + animations
│   ├── layout.tsx               # Root layout + SEO
│   ├── page.tsx                 # Homepage (all sections)
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login
│   │   └── dashboard/page.tsx   # CMS dashboard (15 panels)
│   └── case-study/[id]/page.tsx # Dynamic case study pages
├── components/
│   ├── Navbar.tsx               # Mobile-first with hamburger
│   ├── HeroSection.tsx          # Dynamic hero
│   ├── AboutSection.tsx         # Dynamic about + skills
│   ├── ServicesSection.tsx      # Dynamic services
│   ├── ProjectsSection.tsx      # Dynamic projects + case study links
│   ├── ContactSection.tsx       # Dynamic form + social icons
│   ├── SocialIcons.tsx          # 8 platform icons with tooltips
│   ├── Footer.tsx               # Dynamic footer
│   ├── SplashScreen.tsx         # Cinematic intro
│   ├── ScrollProgress.tsx       # Top progress bar
│   ├── sections/
│   │   ├── ExperienceSection.tsx    # Timeline
│   │   ├── EducationSection.tsx     # Education cards
│   │   ├── CertificationsSection.tsx # Filterable certs grid
│   │   ├── TestimonialsSection.tsx  # Testimonials carousel
│   │   └── ResumeSection.tsx        # Resume download
│   └── admin/
│       └── ImageUpload.tsx      # Drag & drop image upload
├── hooks/
│   └── useReveal.ts             # useReveal, useParallax, useScrollY
├── lib/
│   ├── supabase.ts              # Client + all TypeScript types
│   ├── data.ts                  # Typed data fetching (all tables)
│   └── auth.ts                  # Auth helpers
├── supabase-schema.sql          # Complete DB schema + RLS + seed
├── VERCEL_SUPABASE_SETUP.md    # Full deployment guide
└── .env.local.example
```

## Admin Panel
URL: `/admin/login`
Panels: Hero · About · Skills · Projects · Services · Experience · Education · Certifications · Resume · Testimonials · Social Links · Messages · Blog · Gallery · Settings
