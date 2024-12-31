/*
  # Update meeting table policies

  1. Changes
    - Drop and recreate all policies except the insert policy
    - Add policy for viewing pending meetings
    - Update policy for confirmed meetings
    - Add policy for updating meetings
  
  2. Security
    - Maintain existing insert policy
    - Allow public access to view pending and confirmed meetings
    - Allow public access to update meetings
*/

-- Drop existing policies (except the insert policy which already exists)
DROP POLICY IF EXISTS "Anyone can view confirmed meetings" ON meetings;
DROP POLICY IF EXISTS "Admin can do everything" ON meetings;

-- Allow anyone to view pending meetings (for admin dashboard)
CREATE POLICY "View pending meetings"
  ON meetings
  FOR SELECT
  TO public
  USING (status = 'pending');

-- Allow anyone to view confirmed meetings (for calendar display)
CREATE POLICY "View confirmed meetings"
  ON meetings
  FOR SELECT
  TO public
  USING (status = 'confirmed');

-- Allow anyone to update meetings
CREATE POLICY "Update meetings"
  ON meetings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);