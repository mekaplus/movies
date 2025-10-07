#!/bin/bash

echo "🚀 Installing Xflix dependencies..."

# Install core dependencies first
echo "📦 Installing base packages..."
npm install

# Install additional required packages
echo "📦 Installing additional packages..."
npm install tailwindcss autoprefixer postcss @prisma/client prisma zod lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot next-auth

# Install dev dependencies
echo "📦 Installing dev dependencies..."
npm install --save-dev prettier ts-node

echo "✅ All dependencies installed!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Run 'npm run db:generate' to generate Prisma client"
echo "3. Run 'npm run db:push' to set up database"
echo "4. Run 'npm run seed' to add sample data"
echo "5. Run 'npm run dev' to start the application"