import { createClient } from '@supabase/supabase-js';
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(url, anon);
export interface HeroData { id:string; greeting:string; name:string; tagline:string; cta_label:string; profile_image:string|null; }
export interface AboutData { id:string; name:string; headline:string; subtitle:string; content:string[]; skills:string[]; profile_image:string|null; resume_link:string|null; }
export interface Project { id:string; num:string; client:string; sub:string; description:string; images:string[]; live_link:string|null; github_link:string|null; tags:string[]; visible:boolean; featured:boolean; sort_order:number; }
export interface Service { id:string; num:string; title:string; description:string; tags:string[]; visible:boolean; sort_order:number; }
export interface Experience { id:string; company:string; role:string; start_date:string; end_date:string|null; current:boolean; description:string; tags:string[]; sort_order:number; visible:boolean; }
export interface Education { id:string; institution:string; degree:string; field:string; start_year:number; end_year:number|null; grade:string|null; description:string; sort_order:number; visible:boolean; }
export interface Certification { id:string; title:string; issuer:string; date:string; description:string|null; image:string|null; credential_url:string|null; category:string; featured:boolean; sort_order:number; visible:boolean; }
export interface Testimonial { id:string; name:string; role:string; company:string; content:string; rating:number; featured:boolean; visible:boolean; sort_order:number; }
export interface ResumeData { id:string; file_url:string; file_name:string; version:string; active:boolean; }
export interface SocialLink { id:string; platform:string; url:string; visible:boolean; sort_order:number; }
export interface SiteSettings { id:string; site_title:string; meta_description:string; contact_email:string; contact_phone:string|null; footer_text:string; og_image:string|null; google_analytics_id:string|null; }
export interface Skill { id:string; category:string; name:string; level:number; sort_order:number; visible:boolean; }
export interface BlogPost { id:string; title:string; slug:string; excerpt:string; content:string; cover_image:string|null; tags:string[]; published:boolean; published_at:string|null; created_at:string; }
export interface GalleryItem { id:string; title:string; image:string; category:string; sort_order:number; visible:boolean; }
