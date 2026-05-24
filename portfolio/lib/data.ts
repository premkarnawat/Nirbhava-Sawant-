import { supabase } from './supabase';

const q = async <T>(table: string, filter?: Record<string,any>): Promise<T[]> => {
  let query = supabase.from(table).select('*').order('sort_order', { ascending: true });
  if (filter) Object.entries(filter).forEach(([k,v]) => { query = query.eq(k, v); });
  const { data, error } = await query;
  if (error) console.error(`[${table}]`, error.message);
  return (data ?? []) as T[];
};

const one = async <T>(table: string, filter?: Record<string,any>): Promise<T|null> => {
  let query = supabase.from(table).select('*');
  if (filter) Object.entries(filter).forEach(([k,v]) => { query = (query as any).eq(k, v); });
  const { data, error } = await (query as any).single();
  if (error && error.code !== 'PGRST116') console.error(`[${table}]`, error.message);
  return (data ?? null) as T|null;
};

export const getHero           = () => one<any>('hero');
export const getAbout          = () => one<any>('about');
export const getSiteSettings   = () => one<any>('site_settings');
export const getResume         = () => one<any>('resume', { active: true });
export const getProjects       = () => q<any>('projects', { visible: true });
export const getServices       = () => q<any>('services', { visible: true });
export const getExperiences    = () => q<any>('experiences', { visible: true });
export const getEducation      = () => q<any>('education', { visible: true });
export const getCertifications = () => q<any>('certifications', { visible: true });
export const getAwards         = () => q<any>('awards', { visible: true });
export const getTestimonials   = () => q<any>('testimonials', { visible: true });
export const getSocialLinks    = () => q<any>('social_links', { visible: true });
export const getSkills         = () => q<any>('skills', { visible: true });
export const getBlogPosts      = () => q<any>('blog_posts', { published: true });
export const getGallery        = () => q<any>('gallery', { visible: true });
export const getCaseStudy      = (projectId: string) => one<any>('case_studies', { project_id: projectId });

export const submitContact = async (data: { name:string; email:string; message:string }) => {
  const { error } = await supabase.from('contacts').insert(data);
  return !error;
};
