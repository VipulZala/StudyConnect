# StudyConnect Backend Setup Guide

This guide will help you configure the backend for your StudyConnect application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: StudyConnect (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to you
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll find two important values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your project root, create a `.env` file (or rename `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase URL and anon key.

## Step 4: Database Setup

The database schema has already been created with the migration. It includes:

- **profiles** - User profile information
- **skills** - User skills with proficiency levels
- **interests** - User interests
- **courses** - User enrolled courses
- **connections** - User connections/friendships
- **projects** - Student projects with tags and positions
- **conversations** & **messages** - Messaging system
- **study_rooms** - Virtual study rooms
- **activities** - User activity feed

All tables have Row Level Security (RLS) enabled for data protection.

## Step 5: Install Dependencies and Run

```bash
npm install
npm run dev
```

## Authentication

The app uses Supabase's built-in email/password authentication:

- **Sign Up**: Users can create accounts at `/signup`
- **Login**: Users can sign in at `/login`
- **Protected Routes**: All main pages require authentication
- **Profile**: Automatically created when user signs up

## Features Available

### 1. User Profiles
- View and edit personal information
- Add skills, interests, and courses
- Upload avatar and cover images

### 2. Connections
- Search for other students
- Filter by university and major
- Connect with students who share interests

### 3. Projects
- Create and manage projects
- Add team members and tags
- Track open positions

### 4. Messaging
- Direct messaging between users
- Real-time conversation updates
- Read/unread status tracking

### 5. Study Rooms
- Create virtual study rooms
- Join active study sessions
- Schedule future study sessions

## Database Access

You can view and manage your data in the Supabase Dashboard:

1. Go to **Table Editor** to view your tables
2. Go to **Authentication** to manage users
3. Go to **Storage** (if you add file uploads later)

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file shows the required format
- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data and public information

## Testing the Application

1. Go to `/signup` and create a test account
2. Fill in your profile information
3. Try adding skills, interests, and courses
4. Create a project to test the projects feature
5. Try connecting with other users (create multiple accounts)

## Next Steps

To enhance your application, consider:

- Adding file upload for avatars (use Supabase Storage)
- Implementing real-time features with Supabase Realtime
- Adding email verification
- Creating notification system
- Adding search functionality across all features
- Implementing video calling for study rooms

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that your `.env` file exists in the project root
- Verify the variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding environment variables

### Authentication not working
- Check that your Supabase project is running
- Verify your credentials in the `.env` file
- Check browser console for specific error messages

### Database queries failing
- Verify the migration was applied in Supabase Dashboard
- Check Row Level Security policies
- Ensure you're authenticated before making requests

## Support

For issues with:
- **Supabase**: Check https://supabase.com/docs
- **React**: Check https://react.dev
- **Vite**: Check https://vitejs.dev

## API Reference

The application uses these main Supabase features:

- **Authentication**: `supabase.auth.signUp()`, `signInWithPassword()`, `signOut()`
- **Database**: `supabase.from('table_name').select()`, `.insert()`, `.update()`, `.delete()`
- **RLS**: All data access is controlled by Row Level Security policies

Refer to the Supabase documentation for detailed API usage.
