# Xflix

A streaming platform built with Next.js, featuring a dark theme, modern UI, and comprehensive movie/TV show browsing experience.

## ✨ Features

- **Sleek Dark UI**: Modern dark theme with smooth animations and hover effects
- **Hero Banner**: Featured content with play and more info buttons
- **Content Rows**: Horizontal scrolling carousels by category (Trending, Top Rated, Action, etc.)
- **Movie Detail Pages**: Full movie information with cast, director, and similar titles
- **Search Functionality**: Real-time search with debouncing
- **My List**: Personal watchlist with add/remove functionality
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Type-Safe**: Built with TypeScript throughout
- **Production Ready**: Optimized for performance and scalability

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Custom CSS Variables
- **UI Components**: shadcn/ui components (Button, etc.)
- **Database**: Prisma ORM (SQLite for development, PostgreSQL-ready)
- **Icons**: Lucide React
- **Authentication**: Next-Auth (prepared, currently mock auth)
- **Validation**: Zod for input validation
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment variables
cp .env.example .env
```

Update `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
# Install core dependencies
npm install

# Install additional packages needed
npm install tailwindcss autoprefixer postcss @prisma/client prisma zod lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot next-auth

# For development
npm install --save-dev prettier ts-node
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed the database with mock data
pnpm seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm seed` - Seed database with mock data
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:generate` - Generate Prisma client

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── titles/        # Movie/TV show endpoints
│   │   └── my-list/       # User list endpoints
│   ├── title/[id]/        # Movie detail pages
│   ├── search/            # Search page
│   ├── movies/            # Movies listing
│   ├── tv/                # TV shows listing
│   └── my-list/           # User's watchlist
├── components/            # React components
│   ├── navbar/            # Navigation components
│   ├── hero/              # Hero banner components
│   ├── rows/              # Content row components
│   ├── cards/             # Title card components
│   └── common/            # Shared UI components
├── lib/                   # Utilities and configurations
│   ├── repos/             # Data access layer
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── db.ts              # Prisma client
├── seed/                  # Mock data files
│   ├── movies.json        # Movie/TV show data
│   ├── genres.json        # Genre definitions
│   └── people.json        # Cast and crew data
├── scripts/               # Database and utility scripts
└── prisma/                # Database schema
```

## 🎬 Features Overview

### Home Page
- Hero banner with featured movie
- Multiple content rows (Trending, Top Rated, by Genre)
- Smooth horizontal scrolling with navigation arrows

### Movie Detail Page
- Full movie information and metadata
- Cast and crew details with profile images
- "More Like This" recommendations
- Action buttons (Play, Add to List, Like)

### Search
- Real-time search with debounced API calls
- Grid layout for search results
- No results and empty state handling

### My List
- Personal watchlist functionality
- Add/remove movies and TV shows
- Persistent storage (mock implementation)

## 🗄 Database Schema

The application uses Prisma with the following main models:

- **Movie**: Core content with metadata, ratings, and media type
- **Genre**: Content categorization
- **Person**: Cast and crew information
- **Credit**: Relationships between movies and people (actors/directors)
- **User**: User accounts (prepared for authentication)
- **UserList**: User's personal watchlist

## 🔄 Switching to PostgreSQL

To switch from SQLite to PostgreSQL:

1. **Update DATABASE_URL** in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/xflix"
   ```

2. **Run migrations**:
   ```bash
   pnpm prisma migrate dev --name init
   ```

3. **Re-seed if needed**:
   ```bash
   pnpm seed
   ```

The application is designed to work seamlessly with either database.

## 🎨 Styling & Theming

- **Dark Theme**: Modern dark color palette
- **Custom CSS Variables**: Consistent theming throughout
- **TailwindCSS**: Utility-first styling with custom colors
- **Responsive**: Mobile-first design with breakpoint considerations
- **Animations**: Smooth hover effects and transitions

## 🔒 Code Quality

- **TypeScript**: Full type safety with no `any` types in core functionality
- **ESLint**: Configured with Next.js best practices
- **Prettier**: Consistent code formatting
- **Modern React**: Uses React Server Components and latest Next.js patterns

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Run `pnpm lint` before submitting changes
3. Ensure all TypeScript types are properly defined
4. Test functionality across different screen sizes
5. Update documentation for new features

## 📄 License

This project is for educational and demonstration purposes.
