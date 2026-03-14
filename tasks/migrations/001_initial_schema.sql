-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enum for User Roles
create type user_role as enum ('admin', 'manager', 'partner', 'client');

-- Create Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'partner',
  preferred_language text default 'ru', -- 'ru' or 'cn'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create Rooms Table
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  name text,
  created_by uuid references profiles(id),
  is_direct_message boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Rooms
alter table rooms enable row level security;

-- Create Room Participants Table
create table room_participants (
  room_id uuid references rooms(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (room_id, user_id)
);

-- Enable RLS for Room Participants
alter table room_participants enable row level security;

-- Create Messages Table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references rooms(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content_original text,
  content_translated text, -- AI translated content
  language_original text default 'ru', -- 'ru' or 'cn'
  message_type text default 'text', -- 'text', 'voice', 'file'
  file_url text,
  voice_transcription text, -- For voice messages
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Messages
alter table messages enable row level security;

-- RLS Policies for Rooms and Messages
-- 1. Users can view rooms they are participants of
create policy "Users can view rooms they are in"
  on rooms for select
  using (
    exists (
      select 1 from room_participants
      where room_participants.room_id = rooms.id
      and room_participants.user_id = auth.uid()
    )
    or
    -- Admins can view all rooms
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 2. Users can insert rooms (Managers, Admins, Partners)
-- Clients cannot create rooms
create policy "Non-clients can create rooms"
  on rooms for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'manager', 'partner')
    )
  );

-- 3. Room Participants can view messages in their rooms
create policy "Participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from room_participants
      where room_participants.room_id = messages.room_id
      and room_participants.user_id = auth.uid()
    )
    or
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 4. Participants can insert messages
create policy "Participants can insert messages"
  on messages for insert
  with check (
    exists (
      select 1 from room_participants
      where room_participants.room_id = messages.room_id
      and room_participants.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'partner'); -- Default role is partner, can be changed by admin
  return new;
end;
$$;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Buckets (for files and voice messages)
insert into storage.buckets (id, name, public) values ('chat-files', 'chat-files', true);
insert into storage.buckets (id, name, public) values ('voice-messages', 'voice-messages', true);

-- Storage Policies
create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check ( bucket_id in ('chat-files', 'voice-messages') and auth.role() = 'authenticated' );

create policy "Authenticated users can view files"
  on storage.objects for select
  using ( bucket_id in ('chat-files', 'voice-messages') and auth.role() = 'authenticated' );
