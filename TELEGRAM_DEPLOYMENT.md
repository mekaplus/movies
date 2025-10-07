# Telegram Mini App Deployment Guide

This guide will walk you through deploying XFLIX as a Telegram Mini App.

## Prerequisites

- Telegram account
- Deployed Next.js application (with HTTPS)
- Access to @BotFather on Telegram

---

## Step 1: Deploy Your Application

Your app needs to be publicly accessible via HTTPS. Here are recommended platforms:

### Option A: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Login to your Vercel account
   - Select your project settings
   - Deploy!

4. **Get your deployment URL**:
   - You'll receive a URL like: `https://your-app.vercel.app`
   - For production: `vercel --prod`

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically
4. Get your deployment URL

### Option C: Netlify

1. Go to [netlify.com](https://www.netlify.com)
2. Connect your repository
3. Build command: `pnpm build`
4. Publish directory: `.next`
5. Deploy!

### Option D: Your Own Server

1. Build your app:
   ```bash
   pnpm build
   ```

2. Start production server:
   ```bash
   pnpm start
   ```

3. Make sure you have:
   - HTTPS enabled (required for Telegram)
   - Valid SSL certificate
   - Public domain or IP

---

## Step 2: Create a Telegram Bot

1. **Open Telegram** and search for [@BotFather](https://t.me/BotFather)

2. **Create a new bot**:
   - Send `/newbot`
   - Choose a name for your bot (e.g., "XFLIX Streaming")
   - Choose a username (must end in 'bot', e.g., "xflix_streaming_bot")

3. **Save your bot token**:
   - BotFather will give you a token like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Keep this secure! You'll need it later.

---

## Step 3: Create the Mini App

1. **Still in BotFather**, send:
   ```
   /newapp
   ```

2. **Select your bot** from the list

3. **Provide app details**:

   - **Title**: `XFLIX`
   - **Short name**: `xflix` (used in the URL, lowercase, no spaces)
   - **Description**:
     ```
     Your favorite movies and TV shows streaming platform. Browse, search, and watch content seamlessly within Telegram.
     ```
   - **Photo**: Upload a 640x360px image (your app icon/preview)
   - **GIF** (optional): Upload a demo GIF showing your app

4. **Enter your Web App URL**:
   ```
   https://your-app.vercel.app
   ```
   ⚠️ **Important**: Must be HTTPS!

5. **Short description**:
   ```
   Stream movies & TV shows
   ```

6. **Done!** BotFather will confirm your Mini App is created.

---

## Step 4: Configure the Bot Menu Button (Optional but Recommended)

Make your Mini App easily accessible:

1. In BotFather, send:
   ```
   /mybots
   ```

2. Select your bot

3. Choose `Bot Settings` → `Menu Button` → `Configure Menu Button`

4. **Button text**: `Open XFLIX` or `🎬 Watch Now`

5. **URL**: Your Mini App URL (same as before)

---

## Step 5: Test Your Mini App

### Method 1: Direct Link
Create a direct link to test:
```
https://t.me/YOUR_BOT_USERNAME/YOUR_SHORT_NAME
```

Example:
```
https://t.me/xflix_streaming_bot/xflix
```

### Method 2: Through Bot Chat
1. Open your bot in Telegram
2. Click the menu button (bottom left)
3. Your Mini App should open!

### Method 3: Inline Mode
1. In any chat, type: `@YOUR_BOT_USERNAME`
2. Your Mini App should appear

---

## Step 6: Environment Variables

Make sure your deployed app has the necessary environment variables:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
# Add other required variables
```

For Vercel:
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

---

## Step 7: Update Your Code (Optional Enhancements)

### Add Bot Token for Backend Integration

If you want to integrate with Telegram API (send messages, etc.):

1. **Add to `.env`**:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

2. **Create API route** (`src/app/api/telegram/route.ts`):
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { getTelegramUser } from '@/lib/telegram';

   export async function POST(request: NextRequest) {
     const data = await request.json();

     // Handle Telegram user data
     // Send notifications, etc.

     return NextResponse.json({ success: true });
   }
   ```

---

## Step 8: Testing Checklist

Test these features in Telegram:

- [ ] Mini App opens correctly
- [ ] Navigation works smoothly
- [ ] Scroll behavior is correct
- [ ] Safe areas are respected (no content under notches)
- [ ] Back button works (if implemented)
- [ ] Haptic feedback works (if implemented)
- [ ] Theme matches Telegram theme
- [ ] Database connections work
- [ ] Authentication works
- [ ] All API calls succeed

---

## Troubleshooting

### Issue: Mini App won't open
- **Solution**: Ensure your URL is HTTPS
- Check if your server is publicly accessible
- Verify the URL in BotFather settings

### Issue: Content is cut off
- **Solution**: Safe areas are working! This is expected on devices with notches
- Check that you're using the safe area utilities

### Issue: Can't scroll
- **Solution**: Already fixed! The Telegram-specific styles only apply in Telegram
- Make sure TelegramProvider is working

### Issue: "This site can't be reached"
- **Solution**: Your deployment might be down
- Check your hosting provider's status
- Verify DNS settings

### Issue: Database connection fails
- **Solution**: Make sure environment variables are set on your hosting platform
- Check if your database allows connections from the hosting IP

---

## Production Optimization

### 1. Enable Analytics

Track Mini App usage:

```typescript
// src/lib/analytics.ts
export function trackMiniAppEvent(event: string, data?: any) {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    // Send to your analytics service
    console.log('Telegram Mini App Event:', event, data);
  }
}
```

### 2. Optimize Images

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src={posterUrl}
  alt={title}
  width={300}
  height={450}
  loading="lazy"
/>
```

### 3. Enable Caching

Add to `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    domains: ['your-image-cdn.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

---

## Going Live

### 1. Update Bot Description
Make it compelling:
```
/setdescription
```

Example:
```
🎬 XFLIX - Your Personal Streaming Platform

Watch thousands of movies and TV shows right in Telegram!

✨ Features:
• Huge content library
• HD & 4K quality
• Watch with friends
• Personal watchlist
• No ads, no limits

Tap below to start watching! 🍿
```

### 2. Add Bot Commands

```
/setcommands
```

Add useful commands:
```
start - Open XFLIX
movies - Browse movies
tv - Browse TV shows
search - Search content
mylist - My watchlist
help - Get help
```

### 3. Set Bot Privacy (Optional)

```
/setprivacy
```

Choose based on your needs.

### 4. Publish to Telegram App Center (Future)

When ready, you can submit to the Telegram App Center for more visibility.

---

## Example: Complete Setup Commands

Here's a complete example session with BotFather:

```
You: /newbot
Bot: Alright, a new bot. How are we going to call it?

You: XFLIX Streaming
Bot: Good. Now let's choose a username for your bot.

You: xflix_streaming_bot
Bot: Done! Here's your token: 123456789:ABC...

You: /newapp
Bot: Choose a bot to create a Web App for.

You: @xflix_streaming_bot
Bot: OK. Send me the title for your Web App.

You: XFLIX
Bot: Good. Now send me a short name (3-30 chars).

You: xflix
Bot: Great! Now send me a description.

You: Your favorite movies and TV shows streaming platform...
Bot: Nice. Now send me a photo (640x360).

You: [upload photo]
Bot: Wonderful! Now send me your Web App URL.

You: https://mini-netflix.vercel.app
Bot: Perfect! Your Mini App is ready!
```

---

## Support & Resources

- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)

---

## Quick Reference

**Your Mini App URL Format:**
```
https://t.me/YOUR_BOT_USERNAME/YOUR_SHORT_NAME
```

**Test in Telegram:**
1. Open Telegram
2. Search for your bot
3. Click the menu button
4. Mini App opens!

**Share your Mini App:**
```
Check out XFLIX on Telegram!
https://t.me/xflix_streaming_bot/xflix
```

---

## Next Steps

After deployment:

1. ✅ Test thoroughly on different devices
2. ✅ Monitor error logs
3. ✅ Gather user feedback
4. ✅ Optimize performance
5. ✅ Add new features
6. ✅ Market your Mini App!

---

**Need help?** Check the issues or contact support.

Good luck with your Telegram Mini App! 🚀
