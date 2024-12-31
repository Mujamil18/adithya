import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AdminSettings {
  id: string;
  otp: string;
  updated_at: string;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      toast.error('Failed to load admin settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOtp = async (newOtp: string) => {
    if (!settings?.id) return false;
    
    // Validate 4-digit OTP
    if (!/^\d{4}$/.test(newOtp)) {
      toast.error('OTP must be exactly 4 digits');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ otp: newOtp })
        .eq('id', settings.id);

      if (error) throw error;
      
      await fetchSettings();
      toast.success('OTP updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating OTP:', error);
      toast.error('Failed to update OTP');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    updateOtp,
    refetch: fetchSettings
  };
}