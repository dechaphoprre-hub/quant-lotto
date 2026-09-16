-- Canonical draw-id prefix per market, matching the ids already used by
-- the bundled dataset and the GLO ingestion script (e.g. "th-2026-09-01").
-- Stored here so any future writer (the admin correction trigger included)
-- derives the same id instead of re-guessing a lowercase(market_code) prefix,
-- which is wrong for LAO ("lao-"), HANOI ("hn-") and HANOI_VIP ("hnvip-").
alter table public.markets add column if not exists id_prefix text;

update public.markets set id_prefix = case code
  when 'THAI' then 'th'
  when 'LAO' then 'lao'
  when 'HANOI' then 'hn'
  when 'HANOI_VIP' then 'hnvip'
end
where id_prefix is null;

alter table public.markets alter column id_prefix set not null;

create or replace function public.draw_id_for(p_market_code text, p_draw_date date)
returns text
language sql
stable
as $$
  select id_prefix || '-' || p_draw_date::text from public.markets where code = p_market_code;
$$;
