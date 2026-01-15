# E-Commerce App

Modern full-stack e-commerce platform built with Next.js 14, Prisma, and NextAuth.js.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## ✅ Phase 1 Complete

- ✅ Prisma database setup
- ✅ NextAuth.js authentication
- ✅ User registration & login
- ✅ Protected routes
- ✅ Basic UI components

See [PHASE1_SETUP.md](./PHASE1_SETUP.md) for detailed setup instructions.

## 📁 Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   ├── dashboard/        # Protected dashboard
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities & config
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
