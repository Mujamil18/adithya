import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface OTPVerificationProps {
  onVerified: () => void;
}

export default function OTPVerification({ onVerified }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate 4-digit OTP
    if (!/^\d{4}$/.test(otp)) {
      toast.error('Please enter a 4-digit OTP');
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('otp')
        .single();

      if (error) throw error;

      if (data.otp === otp) {
        onVerified();
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Want to meet?</h2>
        </div>
        
        <form onSubmit={verifyOTP} className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="sr-only">OTP</label>
            <input
              id="otp"
              type="text"
              maxLength={4}
              pattern="\d{4}"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center tracking-widest"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setOtp(value);
                }
              }}
            />
          </div>
<div className="text-center">
          <p className="mt-2 text-sm text-gray-600">YKIYK</p>
        </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}