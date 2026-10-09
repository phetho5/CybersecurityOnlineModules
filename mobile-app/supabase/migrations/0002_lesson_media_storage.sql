-- CyberAware SA — lesson media storage
--
-- Run this once in the Supabase project's SQL editor, same as 0001_init_schema.sql.
-- Creates a public-read bucket for lesson video/audio files.
--
-- Content fidelity: lesson videos/audio are the project's own produced material (per
-- CLAUDE.md's Content fidelity rule) — uploading them is a manual step via the Supabase
-- Storage dashboard (Storage -> lesson-media -> Upload), not something this migration or
-- the app does automatically. This file only creates the bucket to upload into.

insert into storage.buckets (id, name, public)
values ('lesson-media', 'lesson-media', true)
on conflict (id) do nothing;

-- The bucket is public, so reads (GET) work without an RLS policy — Supabase Storage
-- serves public-bucket objects directly. Writes are intentionally left with no policy:
-- storage.objects has RLS enabled by default, so with no INSERT/UPDATE/DELETE policy,
-- only the service_role key (used from the dashboard, never shipped in the app) can
-- upload or change lesson media. The app only ever reads a stored public URL — it never
-- uploads on a student's behalf.
