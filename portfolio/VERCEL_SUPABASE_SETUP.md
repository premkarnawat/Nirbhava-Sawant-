# ✅ VERCEL + SUPABASE — COMPLETE SETUP GUIDE

---

## STEP 1 — VERCEL DEPLOYMENT

### Correct Settings (Fix 404):
| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` ← MUST select this |
| **Root Directory** | `.` (leave default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` (leave default) |
| **Install Command** | `npm install` |

### Environment Variables (Vercel → Settings → Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL      = https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...your anon key...
```

### Deploy Steps:
1. Push project to GitHub
2. Go to vercel.com → New Project → Import GitHub repo
3. Select **Next.js** as framework
4. Add env vars above
5. Click Deploy

---

## STEP 2 — SUPABASE SETUP

### 2a. Create Project
1. Go to https://supabase.com → New Project
2. Choose a region near you
3. Save your database password

### 2b. Get API Keys
- **Project Settings → API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2c. Run Database Schema
1. **SQL Editor → New Query**
2. Open `supabase-schema.sql` from project
3. Select All → Paste → **Run**
4. Should say "Success" with no errors

### 2d. Create Admin User
1. **Authentication → Users → Add User → Create new user**
2. Enter your email + password
3. This is your login at `/admin/login`

### 2e. Disable Email Confirmation (for easy testing)
1. **Authentication → Providers → Email**
2. Turn OFF "Confirm email" → Save

---

## STEP 3 — SUPABASE STORAGE

### Create Portfolio Bucket:
1. **Storage → New Bucket**
2. Name: `portfolio`
3. ✅ Check **Public bucket**
4. Click **Create bucket**

### Folders (auto-created when you upload):
```
portfolio/        ← root (public)
├── profile/      ← hero & about profile photos
├── projects/     ← project screenshots
├── certifications/ ← certificate images
├── blog/         ← blog cover images
├── gallery/      ← gallery images
└── resume/       ← PDF resume files
```

### Storage Policies (run in SQL Editor if not already done):
```sql
create policy "pub_read_storage" on storage.objects
  for select using (bucket_id = 'portfolio');

create policy "auth_upload_storage" on storage.objects
  for insert with check (
    bucket_id = 'portfolio' and auth.role() = 'authenticated'
  );

create policy "auth_delete_storage" on storage.objects
  for delete using (
    bucket_id = 'portfolio' and auth.role() = 'authenticated'
  );
```

---

## STEP 4 — WHY DATA WASN'T SHOWING

**Root cause:** All sections used hardcoded static data. Now every section fetches live from Supabase:

| Section | Fetches from |
|---------|-------------|
| Hero | `hero` table |
| About | `about` table |
| Services | `services` table |
| Experience | `experiences` table |
| Education | `education` table |
| Projects | `projects` table |
| Certifications | `certifications` table |
| Testimonials | `testimonials` table |
| Resume | `resume` table |
| Contact email | `site_settings` table |
| Social icons | `social_links` table |
| Footer text | `site_settings` table |

**The fix:** Every component now calls `getHero()`, `getAbout()`, etc. on mount, and falls back to static data only if Supabase returns nothing.

---

## STEP 5 — UPLOAD YOUR PROFILE IMAGE

### Via Admin Panel (easiest):
1. Go to `yoursite.com/admin/login`
2. Login with Supabase credentials
3. **Hero** → drag & drop or click to upload photo
4. **Save Changes** → homepage updates immediately

### Via Supabase Storage:
1. Storage → portfolio → profile folder
2. Upload Files → select photo
3. Click file → copy Public URL
4. Admin → Hero → Profile Image URL → paste → Save

---

## STEP 6 — VERIFY EVERYTHING WORKS

After deploying, test:
- ✅ `yoursite.vercel.app` → homepage loads
- ✅ All sections show (with fallback data initially)
- ✅ `yoursite.vercel.app/admin/login` → login works
- ✅ Admin → Hero → change name → Save → homepage shows new name
- ✅ Admin → Projects → Add project → homepage shows it
- ✅ Admin → Social Links → add Instagram → footer shows icon
- ✅ Admin → Messages → contact form submissions appear

---

## QUICK REFERENCE

| What | Where |
|------|-------|
| Live site | `https://yourproject.vercel.app` |
| Admin panel | `https://yourproject.vercel.app/admin/login` |
| Supabase dashboard | `https://supabase.com/dashboard` |
| API keys | Supabase → Project Settings → API |
| Storage files | Supabase → Storage → portfolio |
| Database tables | Supabase → Table Editor |
| Auth users | Supabase → Authentication → Users |
| SQL editor | Supabase → SQL Editor |

---

## TROUBLESHOOTING

### 404 on Vercel?
→ Framework must be **Next.js**, not "Other"

### Data not loading?
→ Check env vars in Vercel → Settings → Environment Variables
→ Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be set

### Images not uploading in admin?
→ Create `portfolio` bucket → set to **Public**
→ Run storage policies SQL above

### Login not working?
→ Supabase → Auth → Users → confirm user exists
→ Disable email confirmation in Auth → Providers → Email

### Build fails?
→ Check `tsconfig.json` has `"strict": false`
→ Run `npm run build` locally to see exact error
