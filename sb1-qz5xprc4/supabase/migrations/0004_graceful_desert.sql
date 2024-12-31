/*
  # Add OTP and description fields

  1. New Fields
    - Add OTP field to store admin-set password
    - Add description field for meeting details
    
  2. Changes
    - Add new meeting status 'postponed'
*/

-- Add OTP table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  otp text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert default OTP
INSERT INTO admin_settings (otp) VALUES ('123456');

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read OTP
CREATE POLICY "read_otp"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow updating OTP
CREATE POLICY "update_otp"
  ON admin_settings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Add description to meetings
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';

-- Update meeting_status type to include postponed
ALTER TYPE meeting_status ADD VALUE IF NOT EXISTS 'postponed';