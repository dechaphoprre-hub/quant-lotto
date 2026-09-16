insert into public.data_sources (market_code, name, source_type, trust_status, url)
values
  ('THAI', 'Government Lottery Office (GLO)', 'PRIMARY', 'PENDING', 'https://www.glo.or.th/mission/awarding/orderby-time'),
  ('HANOI', 'Xoso.com.vn public results', 'SECONDARY', 'PENDING', 'https://xoso.com.vn/xo-so-mien-bac/xsmb-p1.html')
on conflict do nothing;
