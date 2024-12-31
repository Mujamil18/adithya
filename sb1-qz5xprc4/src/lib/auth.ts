import { supabase } from './supabase';

export async function signIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'admin123'
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}