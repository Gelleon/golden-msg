-- Policies for Room Participants

-- 1. View policies
create policy "Admins and Managers can view all room participants"
  on room_participants for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'manager')
    )
  );

create policy "Users can view participants of rooms they are in"
  on room_participants for select
  using (
    exists (
      select 1 from room_participants rp
      where rp.room_id = room_participants.room_id
      and rp.user_id = auth.uid()
    )
  );

-- 2. Insert policies (Invite/Add users)
create policy "Admins and Managers can add participants"
  on room_participants for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'manager')
    )
  );
  
-- Allow users to add themselves when creating a room?
-- Actually, the creator needs to add themselves.
-- If I am a Manager creating a room, I insert into rooms, then insert into room_participants.
-- The above policy covers Managers.
-- But what about Partners? Can Partners create rooms?
-- In 001_initial_schema.sql: "Non-clients can create rooms" includes 'partner'.
-- So Partners can create rooms.
-- If a Partner creates a room, they need to add themselves.
-- So I need a policy allowing Partners to add themselves to a room they just created?
-- Or allow Partners to add themselves to ANY room? No.
-- Maybe allow inserting if user_id = auth.uid() AND room was created by auth.uid()?
-- But room creation and participant insertion are separate transactions usually.
-- Simplest: Allow Partners to add THEMSELVES to a room if they are the creator.
-- But how to check if they are the creator in the check?
-- `exists (select 1 from rooms where id = room_id and created_by = auth.uid())`

create policy "Creators can add themselves as participants"
  on room_participants for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from rooms
      where rooms.id = room_id
      and rooms.created_by = auth.uid()
    )
  );

-- 3. Delete policies (Remove users)
create policy "Admins and Managers can remove participants"
  on room_participants for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'manager')
    )
  );
