# StudioSpace

StudioSpace is a marketplace for booking independent creative spaces by the hour. Hosts list their studios, and customers search, compare, and book them.

This repository contains the **Next.js client**. The Express API lives in a separate repository: [StudioSpaceServer](https://github.com/masudmoon695-alt/StudioSpaceServer).

**Live site:** [studiospaceclient.vercel.app](https://studiospaceclient.vercel.app)
**API:** [studiospaceserver-five.vercel.app](https://studiospaceserver-five.vercel.app)

---

## Features

**For customers**
- Search studios by name or location, category, hourly price, and capacity
- Compare rates, refundable deposits, amenities, host details, and reviews
- Request a date and time with a live price estimate
- Track booking status from request to confirmation
- Leave reviews on studios

**For hosts**
- Publish, update, and remove studio listings
- Review and confirm or decline incoming booking requests

**General**
- Light and dark mode
- Responsive layouts for mobile, tablet, and desktop
- Email/password and Google sign-in

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Auth | Better Auth with the MongoDB adapter |
| UI extras | Sonner (toasts), Swiper (carousels), next-themes, Lucide icons |
| Backend | Express API using an HTTP-only JWT cookie for marketplace data |
| Linting | ESLint |

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A running instance of the [StudioSpaceServer](https://github.com/masudmoon695-alt/StudioSpaceServer) API
- A MongoDB database
- Google OAuth credentials (only for Google sign-in)

### Installation

```bash
git clone https://github.com/masudmoon695-alt/StudioSpaceClient.git
cd StudioSpaceClient
npm ci
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the StudioSpace Express API |
| `BETTER_AUTH_URL` | Yes | Public URL of this client (for example `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Yes | Long random secret used to sign auth data |
| `MONGODB_URI` | Yes | MongoDB connection string used by Better Auth |
| `GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | For Google sign-in | Google OAuth client secret |

> Never commit `.env.local`. `.env.example` contains placeholders only.

### Run the App

1. Start the Express API and make sure MongoDB is reachable.
2. Start the client:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |

Run `npm run lint` and `npm run build` before pushing to check the client.

## Project Structure

```
StudioSpaceClient/
├── src/                 # App Router pages, components, and utilities
├── components.json      # shadcn/ui configuration
├── next.config.ts       # Next.js configuration
├── eslint.config.mjs    # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment variable template
└── package.json
```

## Deployment

The client is set up for deployment on Vercel:

1. Import the repository into Vercel.
2. Add the environment variables above in the project settings.
3. Set `BETTER_AUTH_URL` to the deployed client URL and `NEXT_PUBLIC_API_URL` to the deployed API URL.
4. Add the deployed client origin to `CLIENT_URL` and `CORS_ORIGINS` on the API so credentialed requests are allowed.

## Related

- **API:** [StudioSpaceServer](https://github.com/masudmoon695-alt/StudioSpaceServer): Express and MongoDB backend with studios, bookings, reviews, and image uploads

## Author

**Masud Moon**, CSE student at ULAB
GitHub: [@masudmoon695-alt](https://github.com/masudmoon695-alt)
