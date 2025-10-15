# Security Fixes Guide

This document outlines the security fixes applied to the AI Icon Maker database and additional steps needed in the Supabase dashboard.

## ✅ Fixed via Migrations

### Migration 021: Secure user_complete_profile View
**Issue**: View exposed `auth.users` data and used SECURITY DEFINER
**Fix**: 
- Removed `auth.users` join (sensitive fields not needed)
- Added `security_invoker = true` to use caller's permissions
- Added RLS policies to `users` table
- Restricted anonymous access

### Migration 022: Fix Function Search Paths
**Issue**: 13+ functions had mutable search_path (SQL injection risk)
**Fix**:
- Added `SET search_path = public` to all active functions:
  - `use_tokens`
  - `record_token_usage`
  - `webhook_upsert_subscription`
  - `get_or_create_subscription_for_user`
  - `update_*_updated_at_column` trigger functions
- Removed unused legacy functions from template

### Migration 023: Fix Remaining Search Path
**Issue**: `get_or_create_subscription_for_user` still showing warning
**Fix**:
- Used DO block to drop all overloaded versions
- Recreated with proper `SET search_path = public`
- Ensures complete protection against SQL injection

## ⚠️ Manual Fixes Required in Supabase Dashboard

### 1. OTP Expiry (SECURITY - High Priority)
**Current Issue**: OTP expiry set to more than 1 hour

**How to Fix** (Updated Navigation):
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **"Email"** provider in the list
3. Click on **Email** to expand settings
4. Look for **"OTP Expiry Time"** or **"Email OTP Expiry"** field
5. Change from current value to **3600 seconds (1 hour)** or less
6. Recommended: **1800 seconds (30 minutes)**
7. Click **Save** or **Update**

**Alternative Location**:
- Authentication → **Settings** → Look for "Email OTP expiry" under Email configuration

### 2. Leaked Password Protection (SECURITY - High Priority)
**Current Issue**: Protection against compromised passwords is disabled

**How to Fix** (Updated Navigation):
1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Scroll down to **"Password Security"** or **"Auth Config"** section
3. Look for toggle or checkbox: **"Enable Leaked Password Protection"** or **"Check against HaveIBeenPwned"**
4. Enable this option
5. Click **Save**

**Alternative Location**:
- Authentication → **Configuration** → Look for password-related settings
- Project Settings → **Auth** → Password settings

**If you can't find these settings**:
The UI might vary by Supabase version. Try:
- Go to **Project Settings** (gear icon) → **Auth**
- Look for configuration JSON/TOML where you can manually set:
  - `GOTRUE_MAILER_OTP_EXP` = 1800
  - `GOTRUE_PASSWORD_HIBP_ENABLED` = true

### 3. Postgres Version (SECURITY - Medium Priority)
**Current Issue**: Postgres version has security patches available

**How to Fix**:
1. Go to Supabase Dashboard → **Database** → **Backups**
2. Create a backup before upgrading
3. Go to **Settings** → **Infrastructure**
4. Look for **"Upgrade Postgres"** option
5. Follow the upgrade wizard
6. **Note**: This may require downtime - schedule during low-traffic period

## 🔒 Security Checklist

### Database Security
- ✅ RLS enabled on users table
- ✅ RLS policies restrict users to their own data
- ✅ Views use security_invoker
- ✅ Functions have fixed search_path
- ✅ No auth.users data exposed
- ⚠️ OTP expiry needs manual fix
- ⚠️ Password protection needs manual fix
- ⚠️ Postgres needs upgrade

### API Security
- ✅ Webhook signature verification
- ✅ API key validation
- ✅ User authentication checks
- ✅ Credit validation before operations
- ✅ HTTPS enforced

### Application Security
- ✅ Environment variables for secrets
- ✅ Client-side auth context
- ✅ Protected routes with middleware
- ✅ Subscription gates on premium features

## 📋 Implementation Steps

1. **Apply database migrations**:
   ```bash
   # Run in Supabase SQL Editor or via CLI
   supabase db push
   ```

2. **Fix Auth Settings** (Supabase Dashboard):
   - Set OTP expiry to 30 minutes
   - Enable leaked password protection

3. **Schedule Postgres Upgrade** (Supabase Dashboard):
   - Create backup
   - Upgrade during low-traffic period
   - Test thoroughly after upgrade

4. **Verify Security**:
   - Check Supabase Database Linter again
   - All critical warnings should be resolved
   - Only low-priority warnings remaining

## 📊 Current Status After Migrations

### ✅ Resolved (15+ warnings fixed!)
- Auth.users data exposure
- SECURITY DEFINER view concerns  
- 13+ function search_path vulnerabilities
- Unused legacy function cleanup

### ⚠️ Remaining (3 warnings - manual dashboard fixes)
- OTP expiry setting (needs dashboard configuration)
- Leaked password protection (needs dashboard configuration)
- Postgres version upgrade (needs scheduled upgrade)

## 🚀 After Migration

Run these checks to verify security:

1. **Test user profile access**:
   - Users can only see their own data
   - Anonymous users cannot access user_complete_profile

2. **Test function security**:
   - All RPC calls work correctly
   - No SQL injection possible via search_path

3. **Test authentication**:
   - OTP expires correctly (after dashboard fix)
   - Compromised passwords are rejected (after dashboard fix)
   - Password reset flows work

## 📚 References

- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/database-linter)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Function Security](https://supabase.com/docs/guides/database/functions#security-definer-vs-invoker)
- [PostgreSQL Search Path](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PATH)

