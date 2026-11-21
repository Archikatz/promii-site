-- Promii Analytics · esquema para Supabase
-- Pega este archivo completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.
-- Privacidad: no guarda IP, nombre ni correo. Cada visitante es un id aleatorio guardado en su navegador.

create table if not exists public.events (
  id        bigint generated always as identity primary key,
  ts        timestamptz not null default now(),
  vid       text not null check (char_length(vid) <= 40),   -- visitante (aleatorio, persistente)
  sid       text not null check (char_length(sid) <= 40),   -- sesión (aleatoria, por pestaña)
  type      text not null check (type in ('pageview','heartbeat','click','scroll','section','leave','form','game')),
  path      text check (char_length(path) <= 200),
  ref       text check (char_length(ref) <= 200),
  lang      text check (char_length(lang) <= 12),
  device    text check (device in ('mobile','tablet','desktop')),
  vw        int, vh int, dh int,                            -- viewport y alto del documento
  x         real, y real,                                   -- clic: x en % del ancho, y en px del documento
  label     text check (char_length(label) <= 120),         -- texto o destino del elemento clicado
  section   text check (char_length(section) <= 40),
  value     real,                                           -- segundos, % de scroll, etc.
  utm       text check (char_length(utm) <= 120)
);
create index if not exists events_ts_idx on public.events (ts desc);
create index if not exists events_type_ts_idx on public.events (type, ts desc);

-- Quién puede ver el panel
create table if not exists public.admins (email text primary key);
insert into public.admins (email) values ('hi@promii.co') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

alter table public.events enable row level security;
alter table public.admins enable row level security;

drop policy if exists "visitantes solo insertan" on public.events;
create policy "visitantes solo insertan" on public.events for insert to anon, authenticated
  with check (ts > now() - interval '5 minutes' and ts < now() + interval '5 minutes');

drop policy if exists "admin lee eventos" on public.events;
create policy "admin lee eventos" on public.events for select to authenticated using (public.is_admin());

drop policy if exists "admin se ve" on public.admins;
create policy "admin se ve" on public.admins for select to authenticated using (email = auth.jwt() ->> 'email');

-- Contador público de visitas (solo devuelve totales)
create or replace function public.visit_count() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'visitors', (select count(distinct vid) from public.events where type = 'pageview'),
    'views',    (select count(*) from public.events where type = 'pageview'));
$$;
grant execute on function public.visit_count() to anon, authenticated;

-- Resumen para el panel (solo administradores)
create or replace function public.admin_summary(days int default 30) returns json
language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => days); out_json json;
begin
  if not public.is_admin() then raise exception 'no autorizado'; end if;
  with e as (select * from public.events where ts >= since),
  sess as (select sid, min(ts) t0, max(ts) t1, count(*) filter (where type in ('click','section')) acts from e group by sid)
  select json_build_object(
    'visitors', (select count(distinct vid) from e where type = 'pageview'),
    'views',    (select count(*) from e where type = 'pageview'),
    'sessions', (select count(*) from sess),
    'avg_time', (select coalesce(round(avg(extract(epoch from t1 - t0))::numeric, 0), 0) from sess),
    'bounce',   (select coalesce(round(100.0 * count(*) filter (where acts = 0) / nullif(count(*), 0), 0), 0) from sess),
    'daily',    (select coalesce(json_agg(d order by d.day), '[]') from (select date_trunc('day', ts)::date as day, count(*) filter (where type = 'pageview') views, count(distinct vid) visitors from e group by 1) d),
    'sections', (select coalesce(json_agg(s order by s.secs desc), '[]') from (select section, count(*) views, round(sum(value)::numeric, 0) secs from e where type = 'section' and section is not null group by 1) s),
    'clicks',   (select coalesce(json_agg(c order by c.n desc), '[]') from (select label, section, count(*) n from e where type = 'click' and label is not null group by 1, 2 order by 3 desc limit 25) c),
    'refs',     (select coalesce(json_agg(c order by c.n desc), '[]') from (select coalesce(nullif(ref, ''), 'directo') ref, count(*) n from e where type = 'pageview' group by 1 order by 2 desc limit 12) c),
    'devices',  (select coalesce(json_agg(c order by c.n desc), '[]') from (select device, count(*) n from e where type = 'pageview' group by 1) c),
    'langs',    (select coalesce(json_agg(c order by c.n desc), '[]') from (select lang, count(*) n from e where type = 'pageview' group by 1) c),
    'scroll',   (select coalesce(json_agg(c order by c.b), '[]') from (select least(floor(m / 25) * 25, 100)::int b, count(*) n from (select sid, max(value) m from e where type = 'scroll' group by sid) x group by 1) c),
    'heat',     (select coalesce(json_agg(json_build_array(round(x::numeric, 1), round((y / nullif(dh, 0) * 100)::numeric, 2))), '[]') from (select x, y, dh from e where type = 'click' and device = 'desktop' and x is not null order by ts desc limit 4000) h),
    'recent',   (select coalesce(json_agg(rec), '[]') from (select ts, type, section, label, device from e where type in ('pageview', 'click', 'form') order by ts desc limit 30) rec)
  ) into out_json;
  return out_json;
end $$;
grant execute on function public.admin_summary(int) to authenticated;

-- Configuración del sitio (estilo, color de contraste, animaciones apagadas). Lectura pública, escritura solo admin.
create table if not exists public.site_config (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.site_config (id, data) values (1, '{"style":"glass","accent":"#e0261b","off":[]}') on conflict (id) do nothing;
alter table public.site_config enable row level security;
drop policy if exists "todos leen la config" on public.site_config;
create policy "todos leen la config" on public.site_config for select to anon, authenticated using (true);
drop policy if exists "admin edita la config" on public.site_config;
create policy "admin edita la config" on public.site_config for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create or replace function public.touch_site_config() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists site_config_touch on public.site_config;
create trigger site_config_touch before update on public.site_config for each row execute function public.touch_site_config();

-- Temas guardados del panel (solo admin)
create table if not exists public.design_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.design_presets enable row level security;
drop policy if exists "admin gestiona temas" on public.design_presets;
create policy "admin gestiona temas" on public.design_presets for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Promii Games: ranking público (cualquiera agrega y lee; puntaje 1–100000, nombre ≤ 20)
create table if not exists public.game_scores (
  id bigint generated always as identity primary key,
  game text not null check (game in ('torre','choques','ducto','orbita','ruta')),
  name text not null check (char_length(btrim(name)) between 1 and 20),
  score int not null check (score between 1 and 100000),
  created_at timestamptz not null default now()
);
create index if not exists game_scores_top_idx on public.game_scores (game, score desc, created_at);
alter table public.game_scores enable row level security;
create policy "anyone can add a score" on public.game_scores for insert to anon, authenticated with check (true);
create policy "anyone can read scores" on public.game_scores for select to anon, authenticated using (true);
grant select, insert on public.game_scores to anon, authenticated;
