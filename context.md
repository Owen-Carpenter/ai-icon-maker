# AI Icon Maker - App Blueprint Context File

## 1. Project Breakdown

**App Name:** AIcon Studio  
**Platform:** Web (Responsive SaaS Application)  

**Vision & Goals:**  
AIcon Studio is a premium SaaS web application that enables users to create professional-grade icons either by drawing their concepts or through AI-powered text prompts. The app leverages cutting-edge AI models to transform user inputs into polished, production-ready icons. Our goal is to provide designers, developers, and content creators with an intuitive tool that simplifies icon creation while implementing a sustainable monetization model through Stripe subscriptions.

**Primary Use Case:**  
- Designers needing quick icon concepts  
- Developers requiring custom app icons  
- Content creators wanting branded social media icons  
- Non-designers who need professional-looking icons  

**Authentication Requirements:**  
- Email/password auth via Supabase  
- Social logins (Google/GitHub) via Supabase  
- Session management with JWT  
- Free tier: Create and preview icons  
- Paywall: Download/export functionality (Stripe integration)  

## 2. Tech Stack Overview

**Frontend Framework:**  
- Next.js 14 (App Router)  
- React 18 with Server Components  
- TypeScript  

**UI Components:**  
- Tailwind CSS v3.3  
- ShadCN component library  
- Radix UI primitives  

**Backend Services:**  
- Supabase (PostgreSQL database)  
- Supabase Auth  
- Supabase Storage for icon assets  

**AI Integration:**  
- OpenAI DALL-E 3 API (primary image generation)  
- Replicate API (for alternative model options)  

**Payment & Monetization:**  
- Stripe Checkout (subscriptions)  
- Stripe Customer Portal  

**Deployment:**  
- Vercel (with Edge Functions)  
- Vercel Analytics  

## 3. Core Features

**1. AI-Powered Icon Generation**  
- Text-to-icon conversion using DALL-E 3  
- Style presets (flat, 3D, line art, etc.)  
- Color palette customization  

**2. Drawing Canvas**  
- SVG-based drawing interface  
- Basic shape tools  
- Stroke width adjustment  
- Layer support  

**3. Icon Customization**  
- Real-time preview at multiple sizes (16px-512px)  
- Background removal tool  
- File format conversion (PNG, SVG, ICO)  

**4. Project Management**  
- Save draft icons to Supabase  
- Organize into projects  
- Version history  

**5. Monetization System**  
- Free tier with watermarked previews  
- Subscription tiers (monthly/annual)  
- Download quota system  

**6. Community Features**  
- Public icon gallery (watermarked)  
- Like/save others' creations  

## 4. User Flow

1. **Landing Page**  
   - Hero section with demo generator  
   - Feature highlights  
   - Pricing table  

2. **Onboarding**  
   - Sign up/in with Supabase Auth  
   - Quick tutorial walkthrough  

3. **Creation Flow**  
   - Choose input method:  
     a) Text prompt → AI generates options  
     b) Drawing canvas → manual creation  
   - Customize generated icons  
   - Save to project library  

4. **Paywall Experience**  
   - Watermarked preview available  
   - Download button triggers Stripe modal  
   - Post-payment: full-quality exports  

5. **Post-Purchase**  
   - Access to download history  
   - Subscription management via Stripe portal  
   - Increased generation limits  

## 5. Design & UI/UX Guidelines

**Visual Style:**  
- Clean, minimalist interface  
- Dark mode as default (with light option)  
- Vibrant accent colors for CTAs  

**Key UI Components (ShadCN):**  
- Command palette for quick actions  
- Hover cards for tooltips  
- Progress bars for AI generation  
- Toasters for system messages  

**Canvas Design:**  
- Fixed aspect ratio (1:1)  
- Pixel grid overlay option  
- Zoom/pan controls  

**Performance Considerations:**  
- Skeleton loading states  
- Optimistic UI updates  
- Client-side transitions  

**Accessibility:**  
- WCAG 2.1 AA compliant  
- Keyboard navigable canvas  
- ARIA labels for all actions  

## 6. Technical Implementation

**Next.js Structure:**  
```
/app
  /(marketing) - Landing pages
  /(app) - Auth-protected routes
    /generate - Creation interface
    /library - Saved icons
    /account - User settings
```

**Supabase Schema:**  
```sql
-- Users table (extends auth.users)
create table profiles (
  id uuid references auth.users,
  stripe_customer_id text,
  subscription_status text,
  credits_remaining integer
);

-- Icons table
create table icons (
  id uuid primary key,
  user_id uuid references profiles,
  prompt text,
  svg_data text,
  preview_url text,
  created_at timestamp
);
```

**AI Generation Flow:**  
1. User submits prompt via React Hook Form  
2. Next.js API route calls OpenAI/Replicate  
3. Generated images stored in Supabase Storage  
4. Database record created with metadata  
5. Real-time update via Supabase subscriptions  

**Stripe Integration:**  
1. Webhook endpoint for subscription events  
2. Sync with Supabase profiles table  
3. Custom claims for role-based access  

**Optimization Techniques:**  
- React Cache for AI results  
- Server Actions for form submissions  
- Edge Config for feature flags  

## 7. Development Setup

**Requirements:**  
- Node.js 18+  
- Supabase account  
- Stripe developer account  
- OpenAI API key  

**Setup Instructions:**  
1. Clone repository  
```bash
git clone https://github.com/yourrepo/aicon-studio.git
cd aicon-studio
```

2. Install dependencies  
```bash
npm install
```

3. Configure environment variables  
```bash
cp .env.example .env.local
# Fill in Supabase, Stripe, and OpenAI keys
```

4. Database setup  
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

5. Run development server  
```bash
npm run dev
```

**Vercel Deployment:**  
1. Connect Git repository  
2. Set environment variables  
3. Enable Edge Functions  
4. Configure Supabase and Stripe webhooks  

**Testing Tools:**  
- Playwright for E2E tests  
- Jest for unit tests  
- Storybook for UI components