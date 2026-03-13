-- Add target_time_seconds to mysteries (optimal solve time for XP calc)
ALTER TABLE public.mysteries
ADD COLUMN IF NOT EXISTS target_time_seconds int DEFAULT 720;

-- Add hints_used to player_progress (for XP penalty)
ALTER TABLE public.player_progress
ADD COLUMN IF NOT EXISTS hints_used int DEFAULT 0;

-- Update stolen-painting with target time (12 min = 720 sec for medium)
UPDATE public.mysteries
SET target_time_seconds = 720
WHERE slug = 'stolen-painting';
