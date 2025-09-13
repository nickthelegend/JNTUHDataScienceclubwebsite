# Database Setup Guide

## Overview
This project uses Supabase PostgreSQL with Prisma ORM for database management.

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string for Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Database Schema

### Event Model
```prisma
model Event {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  content     String?
  imageUrl    String?
  date        DateTime
  location    String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("events")
}
```

## Setup Steps

1. **Update DATABASE_URL**: Replace `[YOUR-PASSWORD]` in .env with actual Supabase password
2. **Run Migration**: `npx prisma migrate dev --name init`
3. **Generate Client**: `npx prisma generate` ✅ DONE

## Files Created
- `prisma/schema.prisma` - Database schema
- `lib/prisma.js` - Prisma client instance
- `app/admin/page.js` - Admin dashboard
- `app/admin/events/page.js` - Events listing
- `app/admin/event/[slug]/page.js` - Event details
- `app/admin/event/new/page.js` - Add event form
- `app/api/events/route.js` - Events API endpoint

## Admin Dashboard Routes
- `/admin/events` - List all events
- `/admin/event/[slug]` - View/edit specific event

## Prisma Commands
- `npx prisma studio` - Open database browser
- `npx prisma migrate dev` - Create and apply migration
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database without migration

## Notes
- Update your Supabase password in the DATABASE_URL
- The schema uses `cuid()` for unique IDs
- Events have a slug field for URL-friendly identifiers
- `isPublished` controls event visibility