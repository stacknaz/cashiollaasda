import React, { useState, useEffect } from 'react';
import { User, Mail, Edit2, Camera, LogOut, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<{
    email: string;
    username: string;
    avatar_url?: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          email: user.email || '',
          username: user.user_metadata.username || '',
          avatar_url: user.user_metadata.avatar_url
        });
        setEditedUsername(user.user_metadata.username || '');
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.auth.updateUser({
        data: { username: editedUsername }
      });

      if (error) throw error;

      setUserData(prev => prev ? { ...prev, username: editedUsername } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          ×
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-blue-950 text-3xl font-bold mb-4 mx-auto">
                {userData.username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-4 right-0 bg-blue-900 p-2 rounded-full hover:bg-blue-800 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
            <p className="text-white/60">Manage your account information</p>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="bg-blue-900/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">Username</label>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-yellow-400 hover:text-yellow-500 p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="w-full bg-blue-950/50 border border-blue-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-4 rounded-lg font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-yellow-400" />
                  {userData.username}
                </div>
              )}
            </div>

            <div className="bg-blue-900/30 rounded-xl p-4">
              <label className="text-sm font-medium text-white/80 block mb-2">Email Address</label>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-yellow-400" />
                {userData.email}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-blue-900/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-semibold">Security</h3>
              </div>
              <button className="text-white/80 hover:text-white text-sm underline">
                Change Password
              </button>
            </div>

            {/* Account Warning */}
            <div className="bg-red-500/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="text-red-500 font-semibold">Danger Zone</h4>
                  <p className="text-white/60 text-sm">
                    Logging out will require you to sign in again to access your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;