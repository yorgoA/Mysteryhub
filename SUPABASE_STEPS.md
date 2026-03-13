# Supabase setup for XP formula

Run this in **Supabase → SQL Editor** (in order):

## 1. Migration 004 — add XP/hints columns

```sql
-- Add target_time_seconds to mysteries
ALTER TABLE public.mysteries
ADD COLUMN IF NOT EXISTS target_time_seconds int DEFAULT 720;

-- Add hints_used to player_progress
ALTER TABLE public.player_progress
ADD COLUMN IF NOT EXISTS hints_used int DEFAULT 0;

-- Update stolen-painting
UPDATE public.mysteries
SET target_time_seconds = 720
WHERE slug = 'stolen-painting';
```

## 2. (Optional) Refresh seed

If you need to reseed the mystery with `target_time_seconds`:

```sql
UPDATE public.mysteries
SET target_time_seconds = 720
WHERE slug = 'stolen-painting';
```
