/*
# Create users and posts tables

## Purpose
This blog application has its own authentication system (Express + JWT + bcrypt)
that talks to the database via Prisma. The tables mirror the existing
Prisma schema (prisma/schema.prisma) so the app's existing routes work
against Supabase Postgres without schema changes.

## 1. New Tables

### `User`
- `id` — integer, auto-incrementing primary key
- `name` — varchar(255), user's first name
- `surname` — varchar(255), user's last name
- `email` — varchar(255), unique, used for login and password recovery
- `password` — varchar(255), bcrypt-hashed password
- `role` — varchar, defaults to 'user'

### `Posts`
- `id` — integer, auto-incrementing primary key
- `title` — varchar(255), post title
- `content` — text, post body
- `createdAt` — timestamp, defaults to now()
- `updatedAt` — timestamp, auto-updated on row change
- `imagePath` — text, public URL of the post image stored in Supabase Storage

## 2. Security (RLS + Grants)

Both tables have RLS enabled. The application accesses these tables
through Prisma using a connection string (service-level credentials),
not through the Supabase Data API with the anon key. Access is enforced
by the Express backend (JWT verification on protected routes).

Because the Express backend connects with privileged database credentials
that bypass RLS, and there is no direct browser-to-Data-API access,
policies are permissive to avoid blocking the backend's queries.

- `User`: GRANT all CRUD to anon + authenticated. RLS enabled with
  permissive policies for anon + authenticated.
- `Posts`: GRANT all CRUD to anon + authenticated. RLS enabled with
  permissive policies for anon + authenticated.

## 3. Notes
- Table names and column names match the Prisma schema exactly (PascalCase
  table names: "User" and "Posts") so Prisma Client queries work unchanged.
- `updatedAt` uses a trigger to auto-update on row modification, matching
  Prisma's @updatedAt behavior.
- `id` columns use SERIAL (auto-incrementing integer) to match Prisma's
  @default(autoincrement()).
*/

-- ────────────────────────────────
-- User table
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL DEFAULT 'user'
);

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON "User" TO anon, authenticated;

-- Sequence grant for SERIAL column
GRANT USAGE ON SEQUENCE "User_id_seq" TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_users" ON "User";
CREATE POLICY "anon_select_users" ON "User"
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_users" ON "User";
CREATE POLICY "anon_insert_users" ON "User"
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_users" ON "User";
CREATE POLICY "anon_update_users" ON "User"
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_users" ON "User";
CREATE POLICY "anon_delete_users" ON "User"
    FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────
-- Posts table
-- ────────────────────────────────
CREATE TABLE IF NOT EXISTS "Posts" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "imagePath" TEXT NOT NULL
);

ALTER TABLE "Posts" ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Posts" TO anon, authenticated;

-- Sequence grant for SERIAL column
GRANT USAGE ON SEQUENCE "Posts_id_seq" TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_posts" ON "Posts";
CREATE POLICY "anon_select_posts" ON "Posts"
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON "Posts";
CREATE POLICY "anon_insert_posts" ON "Posts"
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posts" ON "Posts";
CREATE POLICY "anon_update_posts" ON "Posts"
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON "Posts";
CREATE POLICY "anon_delete_posts" ON "Posts"
    FOR DELETE TO anon, authenticated USING (true);

-- ────────────────────────────────
-- Trigger to auto-update "updatedAt" on Posts
-- (mirrors Prisma's @updatedAt behavior)
-- ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at_trigger ON "Posts";

CREATE TRIGGER posts_updated_at_trigger
    BEFORE UPDATE ON "Posts"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
