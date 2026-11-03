# StudioSpace

StudioSpace is a marketplace for booking independent creative spaces by the
hour. This repository contains the Next.js client; the Express API is maintained
separately.

**Live URL:** Not deployed.

## Features

- Search studios by name or location, category, hourly price and capacity.
- Compare studio rates, refundable deposits, amenities, host details and reviews.
- Request a date and time with a live price estimate and booking status tracking.
- Publish, update and remove studio listings.
- Review and confirm or decline incoming booking requests.
- Use the interface in light or dark mode with responsive layouts.

## Tech stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 and shadcn/ui components
- Better Auth with the MongoDB adapter
- Sonner, Swiper, next-themes and Lucide icons
- Express API with an HTTPOnly JWT cookie for marketplace data

## Local setup

1. Install Node.js 20 or newer.
2. Install the project dependencies:

   ```bash
   npm ci
   ```

3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`,
   `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` and `MONGODB_URI`. Google sign-in
   also needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Start the separate Express API and MongoDB service.
5. Start the client:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

Run `npm run lint` and `npm run build` to check the client.

## Examiner account

No live deployment or examiner account has been provisioned for this client.
Create an account through the registration page after configuring a working API
and MongoDB instance. A reviewer account must be provisioned by the deployment
owner when a hosted environment is available.
