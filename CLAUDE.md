# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Operations (Drizzle ORM)
- `npm run drizzle:generate` - Generate migrations from schema changes
- `npm run drizzle:migrate` - Apply migrations to database
- `npm run drizzle:push` - Push schema changes directly to database
- `npm run drizzle:pull` - Pull schema from database

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **UI Framework**: ShadcnUI components with Tailwind CSS
- **State Management**: Jotai for global state
- **Database**: MySQL with Drizzle ORM
- **Authentication**: NextAuth.js with credentials provider
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with dark mode support

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, movements, profile, users)
│   ├── auth/login/        # Authentication pages
│   ├── movements/         # Financial movements management
│   ├── profile/           # User profile management
│   └── page.tsx           # Dashboard (root page)
├── components/            # React components
│   ├── ui/               # ShadcnUI components
│   └── layout/           # Navigation components
├── drizzle/              # Database schema and migrations
├── lib/                  # Utilities (auth, db, currency, dashboard)
└── types/                # TypeScript type definitions
```

### Key Components
- **Dashboard**: Main financial overview with charts and balance display
- **Movement Management**: CRUD operations for financial transactions
- **Authentication**: Login/register with NextAuth.js
- **Profile Management**: User profile editing with tabbed interface

### Database Schema
- **users**: User accounts with authentication
- **movements**: Financial transactions with multi-currency support

### Core Features
1. **Multi-currency support**: MGA (primary), RMB, AED, EUR, USD with exchange rates
2. **Movement tracking**: Entry/exit transactions with responsible user assignment
3. **Dashboard analytics**: Daily balance charts and summary statistics
4. **Mobile-first design**: Responsive UI optimized for mobile usage
5. **Dark mode**: Theme switching capability

### State Management
- Uses Jotai atoms for global state
- Session management through NextAuth.js
- Client-side state for UI interactions

### Styling Conventions
- Tailwind CSS with semantic color classes
- Green for entries, red for exits
- ShadcnUI component library exclusively
- Mobile-first responsive design
- Dark mode ready color palette

### API Structure
- RESTful API endpoints under `/api/`
- Authentication required for most endpoints
- JSON responses with proper error handling
- Server-side validation and database operations

## Development Guidelines
- When a migration is generated, please rename it following the existing name of other migration