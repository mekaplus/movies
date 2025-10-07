# Quick Setup Guide

If you're getting errors when running the project, follow these steps:

## 1. Install Missing Dependencies

The project needs some additional packages that aren't included by default:

```bash
# Core CSS and styling
npm install tailwindcss autoprefixer postcss

# Icons and UI utilities
npm install lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot

# Database and validation
npm install @prisma/client prisma zod

# Authentication (optional for now)
npm install next-auth

# Development tools
npm install --save-dev prettier ts-node
```

Or install all at once:
```bash
npm install tailwindcss autoprefixer postcss lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot @prisma/client prisma zod next-auth prettier ts-node
```

## 2. Enable PostCSS/TailwindCSS

Update `postcss.config.mjs`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 3. Update Component Imports

If you get "Cannot find module" errors for icons, the components are already set up to use local icon components instead of lucide-react.

## 4. Database Setup (Optional)

For database features:
```bash
npx prisma generate
npx prisma db push
npm run seed
```

## 5. Run the Project

```bash
npm run dev
```

The app should now run on http://localhost:3000 (or 3001 if 3000 is taken).

## Common Issues

- **"Cannot find module 'tailwindcss'"** → Run the npm install command above
- **"Cannot find module 'lucide-react'"** → The app uses local icons, this should work without lucide-react
- **"prisma: command not found"** → Install prisma: `npm install prisma`
- **Port in use** → The app will automatically use the next available port

## Working Without Dependencies

The app is designed to work with minimal dependencies. If you can't install all packages:

1. The app will run with basic styling (components have fallback styles)
2. Icons are implemented locally (no external icon library needed)
3. Database features use mock data (no database setup required)