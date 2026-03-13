-- Run migration 004_xp_and_hints.sql FIRST (adds target_time_seconds, hints_used)
-- Then run this seed if needed.

-- 1. Insert mystery
INSERT INTO public.mysteries (slug, title_en, title_fr, teaser_en, teaser_fr, theme, difficulty, xp_reward, target_time_seconds)
VALUES (
  'stolen-painting',
  'The Stolen Painting',
  'Le tableau volé',
  'London, 1977. A priceless work of art has vanished from the museum.',
  'Londres, 1977. Une œuvre inestimable a disparu du musée.',
  'mystery',
  'medium',
  100,
  720
)
ON CONFLICT (slug) DO UPDATE SET target_time_seconds = 720;

-- 2. Insert badge (required for completion save)
INSERT INTO public.badges (slug, name_en, name_fr)
VALUES (
  'escape-the-museum',
  'Escape the Museum',
  'Évasion du musée'
)
ON CONFLICT (slug) DO NOTHING;
