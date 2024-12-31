import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Meeting } from '../types/meetings';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);
  const [postponedMeetings, setPostponedMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      toast.error('Failed to load meetings');
    }
  };

  const fetchConfirmedMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'confirmed')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setConfirmedMeetings(data || []);
    } catch (err) {
      console.error('Error fetching confirmed meetings:', err);
    }
  };

  const fetchPostponedMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('status', 'postponed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPostponedMeetings(data || []);
    } catch (err) {
      console.error('Error fetching postponed meetings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    fetchConfirmedMeetings();
    fetchPostponedMeetings();
  }, []);

  return {
    meetings,
    confirmedMeetings,
    postponedMeetings,
    isLoading,
    refetch: {
      fetchMeetings,
      fetchConfirmedMeetings,
      fetchPostponedMeetings
    }
  };
}