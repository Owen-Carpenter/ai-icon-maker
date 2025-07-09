# AI Icon Maker - AI-Powered Icon Generator

A premium SaaS web application that enables users to create professional-grade icons using AI or drawing tools. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🤖 **AI-Powered Icon Generation** - Create icons from text prompts using OpenAI DALL-E 3
- 🎨 **Drawing Canvas** - Manual icon creation with intuitive drawing tools
- 📚 **Icon Library** - Save and organize your created icons
- 💰 **Subscription Model** - Monetized with Stripe integration
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Authentication** - Secure user management with Supabase Auth
- ☁️ **Cloud Storage** - Icons stored in Supabase Storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI Components
- **Backend**: Supabase (Database, Auth, Storage)
- **AI**: OpenAI DALL-E 3 API, Replicate API
- **Payments**: Stripe
- **Deployment**: Vercel

## Project Structure

```
ai-icon-maker/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   └── page.tsx          # Landing page
│   ├── (app)/               # Protected app routes
│   │   ├── generate/        # Icon generation interface
│   │   ├── library/         # User's icon library
│   │   └── account/         # Account settings
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable UI components
├── lib/                     # Utility functions
├── public/                  # Static assets
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aicon-studio.git
   cd aicon-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
   STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
   ```

4. **Set up Supabase**
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

```sql
-- User profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text,
  subscription_status text,
  credits_remaining integer default 10,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Icons table
create table icons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  prompt text,
  style text,
  svg_data text,
  image_url text,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Projects table (for organizing icons)
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create components in the `components/` directory
2. Add utility functions to `lib/`
3. Create new pages in the appropriate route groups
4. Update the database schema if needed
5. Add environment variables to `.env.local`

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Configure domains** if using custom domain
4. **Set up webhooks** for Stripe integration

### Required Environment Variables for Production

- All variables from `.env.local`
- Update URLs to production domains
- Use production API keys for Stripe, OpenAI, etc.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@aiconsstudio.com or join our Discord community.

---

Built with ❤️ using Next.js and modern web technologies. 