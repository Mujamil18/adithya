import React, { useState } from 'react';
import { useAdminSettings } from '../../hooks/useAdminSettings';

export default function AdminSettings() {
  const { settings, updateOtp } = useAdminSettings();
  const [newOtp, setNewOtp] = useState('');

  const handleUpdateOtp = async () => {
    if (await updateOtp(newOtp)) {
      setNewOtp('');
    }
  };

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current OTP</label>
          <p className="mt-1 text-lg font-mono">{settings?.otp || '...'}</p>
        </div>
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-700">New OTP</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newOtp}
              onChange={(e) => setNewOtp(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter new OTP"
            />
            <button
              onClick={handleUpdateOtp}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}