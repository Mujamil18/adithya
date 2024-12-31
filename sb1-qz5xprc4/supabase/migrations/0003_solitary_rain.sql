/*
  # Fix RLS policies for meetings table

  1. Changes
    - Drop existing policies
    - Add new comprehensive policies for meetings table
    - Allow public access for creating meetings
    - Allow public access to view confirmed meetings
    - Allow public access to view and update pending meetings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create meeting requests" ON meetings;
DROP POLICY IF EXISTS "View pending meetings" ON meetings;
DROP POLICY IF EXISTS "View confirmed meetings" ON meetings;
DROP POLICY IF EXISTS "Update meetings" ON meetings;

-- Allow anyone to create meeting requests
CREATE POLICY "create_meetings"
  ON meetings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to view confirmed meetings (for calendar display)
CREATE POLICY "view_confirmed_meetings"
  ON meetings
  FOR SELECT
  TO public
  USING (status = 'confirmed');

-- Allow anyone to view pending meetings
CREATE POLICY "view_pending_meetings"
  ON meetings
  FOR SELECT
  TO public
  USING (status = 'pending');

-- Allow anyone to update meetings
CREATE POLICY "update_meetings"
  ON meetings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete meetings
CREATE POLICY "delete_meetings"
  ON meetings
  FOR DELETE
  TO public
  USING (true);