/*
  # Meeting Scheduler Schema

  1. New Tables
    - `meetings`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the person requesting the meeting
      - `email` (text) - Email of the person requesting the meeting
      - `category` (text) - Meeting category (vivu, vinu, nivu, ninu)
      - `start_time` (timestamptz) - Meeting start time
      - `end_time` (timestamptz) - Meeting end time
      - `status` (text) - Meeting status (pending, confirmed, cancelled, rescheduled)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `meetings` table
    - Add policies for public access (insert) and admin access (all)
*/

CREATE TYPE meeting_category AS ENUM ('vivu', 'vinu', 'nivu', 'ninu');
CREATE TYPE meeting_status AS ENUM ('pending', 'confirmed', 'cancelled', 'rescheduled');

CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  category meeting_category NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status meeting_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create meeting requests
CREATE POLICY "Anyone can create meeting requests"
  ON meetings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to view confirmed meetings (for calendar display)
CREATE POLICY "Anyone can view confirmed meetings"
  ON meetings
  FOR SELECT
  TO public
  USING (status = 'confirmed');

-- Allow admin to do everything
CREATE POLICY "Admin can do everything"
  ON meetings
  TO authenticated
  USING (true)
  WITH CHECK (true);