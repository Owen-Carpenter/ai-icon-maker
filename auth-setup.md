# Authentication Setup Guide

## Overview
This project uses Supabase for authentication with Next.js. The authentication system includes:
- User registration and login
- Password reset functionality
- Protected routes
- Session management

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Setup
1. Go to [Supabase](https://supabase.com/) and create a new project
2. In your Supabase dashboard, go to Settings > API
3. Copy the Project URL and anon/public key
4. Add these to your `.env.local` file

## Authentication Flow
- **Login**: `/auth/login` - User login page
- **Register**: `/auth/register` - User registration page
- **Forgot Password**: `/auth/forgot-password` - Password reset request
- **Reset Password**: `/auth/reset-password` - Password reset form

## Protected Routes
The following routes require authentication:
- `/generate` - AI icon generation
- `/library` - User's icon library
- `/account` - User account settings

## File Structure
```
contexts/
  AuthContext.tsx       # Authentication context provider
lib/
  supabase.ts          # Supabase client configuration
  auth.ts              # Authentication service functions
app/
  (auth)/
    login/page.tsx     # Login page
    register/page.tsx  # Registration page
    forgot-password/page.tsx  # Forgot password page
    reset-password/page.tsx   # Reset password page
middleware.ts          # Route protection middleware
```

## Usage
The authentication system is automatically integrated into the app. Users will be redirected to login when accessing protected routes, and authenticated users will be redirected away from auth pages.

## Email Configuration
For password reset emails to work, you'll need to configure email templates in your Supabase dashboard under Authentication > Email Templates.

## Security Features
- Password validation (minimum 6 characters)
- Email verification for new accounts
- Secure session management
- Protected route middleware
- CSRF protection through Supabase 