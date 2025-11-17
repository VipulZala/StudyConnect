import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  name: string;
  title: string;
  university: string;
  year: string;
  location: string;
  bio: string;
  avatar_url: string;
  cover_image_url: string;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  created_at: string;
};

export type Interest = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Course = {
  id: string;
  user_id: string;
  code: string;
  name: string;
  created_at: string;
};

export type Project = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  github_url: string;
  open_positions: number;
  max_members: number;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

export type StudyRoom = {
  id: string;
  name: string;
  course: string;
  host_id: string;
  max_participants: number;
  is_active: boolean;
  scheduled_time: string | null;
  created_at: string;
};
