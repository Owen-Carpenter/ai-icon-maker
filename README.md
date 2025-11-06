# AI Icon Maker

A premium SaaS application for creating professional-grade icons using AI-powered generation. Built with modern web technologies and designed for designers, developers, and content creators.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🤖 AI-Powered Generation** - Create professional icons from text prompts using advanced AI models
- **🎨 Multiple Styles** - Choose from modern, flat, 3D, and other style options
- **📚 Icon Library** - Save and organize your generated icons
- **🔄 Iteration & Improvement** - Refine and improve your icons with AI-powered suggestions
- **💳 Subscription Plans** - Flexible pricing tiers to suit different needs
- **🔒 Secure Authentication** - Built-in user management with secure authentication
- **📱 Responsive Design** - Fully responsive interface that works on all devices
- **☁️ Cloud Storage** - Icons securely stored in the cloud

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS, ShadCN UI Components
- **State Management**: React Hooks & Server Components

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe Checkout & Customer Portal
- **Email**: Resend

### AI & Services
- **AI Generation**: OpenAI DALL-E 3
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- Accounts for:
  - Supabase (database & auth)
  - OpenAI (API access)
  - Stripe (payments)
  - Resend (email service)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-icon-maker.git
cd ai-icon-maker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory. See `.env.example` for a template of required environment variables.

**Required Variables:**
- Supabase configuration (URL, keys)
- OpenAI API key
- Stripe configuration (keys, price IDs)
- Resend API key
- Application URL

### 4. Database Setup

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Push database migrations
npx supabase db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-icon-maker/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   ├── (app)/                # Protected application routes
│   │   ├── generate/         # Icon generation interface
│   │   ├── library/          # User icon library
│   │   └── account/          # Account management
│   ├── api/                  # API routes
│   └── layout.tsx           # Root layout
├── components/               # React components
│   ├── ui/                  # UI components (ShadCN)
│   └── generate/            # Icon generation components
├── lib/                      # Utility functions & helpers
│   ├── chatgpt.ts          # AI generation logic
│   ├── stripe.ts            # Stripe integration
│   └── subscription-plans.ts # Plan configuration
├── supabase/
│   └── migrations/          # Database migrations
├── tests/                    # Test files
│   ├── api/                 # API route tests
│   └── mocks/               # Mock implementations
└── public/                   # Static assets
```

## 🧪 Testing

This project uses Vitest for unit and integration testing.

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

For detailed testing documentation, see [tests/README.md](./tests/README.md).

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import your Git repository to Vercel
   - Vercel will automatically detect Next.js

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Use production API keys and URLs

3. **Configure Domains**
   - Set up custom domain (optional)
   - SSL certificates are automatically provisioned

4. **Set Up Webhooks**
   - Configure Stripe webhooks to point to your production URL
   - Update webhook secrets in environment variables

### Environment Variables

Ensure all environment variables from `.env.local` are set in your production environment. Use production values for:
- API keys (Stripe, OpenAI, Resend)
- Supabase project credentials
- Application URLs

## 🔒 Security

- **Row Level Security (RLS)** enabled on all database tables
- **Security headers** configured in Next.js
- **API route authentication** required for protected endpoints
- **Environment variables** stored securely (never committed)
- **Error boundaries** for graceful error handling

## 📊 Database Schema

The application uses the following main tables:

- **users** - User profiles and authentication data
- **subscriptions** - User subscription information
- **icons** - Generated icon metadata
- **usage_tracking** - Token usage and generation tracking

Database migrations are managed through Supabase and located in `supabase/migrations/`.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain code style consistency
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation in the project wiki
- Review the [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for deployment guidance

## 🙏 Acknowledgments

Built with modern web technologies and open-source tools. Special thanks to:
- Next.js team for an amazing framework
- Supabase for backend infrastructure
- OpenAI for AI capabilities
- The open-source community

---

**Built with ❤️ using Next.js and modern web technologies**
