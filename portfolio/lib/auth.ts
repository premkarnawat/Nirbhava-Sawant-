import { supabase } from './supabase';
export const signIn  = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();
export const getUser = async () => { const { data: { user } } = await supabase.auth.getUser(); return user; };
