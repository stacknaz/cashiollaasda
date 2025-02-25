import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Gamepad, AlertTriangle } from 'lucide-react';

interface PerkwallFrameProps {
  onClose: () => void;
}

const PerkwallFrame: React.FC<PerkwallFrameProps> = ({ onClose }) => {
  const [clickId, setClickId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFrame = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Please sign in to access mobile game offers');
        }

        const uniqueClickId = crypto.randomUUID();
        setClickId(uniqueClickId);
        setPlayerId(user.id);
      } catch (error) {
        console.error('Error initializing Perkwall:', error);
        setError(error instanceof Error ? error.message : 'Failed to load game offers');
      } finally {
        setLoading(false);
      }
    };

    initializeFrame();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-white/80">Loading mobile game offers...</p>
      </div>
    );
  }

  if (error || !clickId || !playerId) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
        <div className="bg-red-500/20 rounded-full p-4 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Offers</h3>
        <p className="text-white/80 mb-4">{error || 'Please try again later'}</p>
        <button
          onClick={onClose}
          className="bg-blue-900/50 hover:bg-blue-900/70 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg">
            <Gamepad className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Mobile Game Offers</h3>
            <p className="text-sm text-white/60">Complete games to earn rewards</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60 hover:text-white" />
        </button>
      </div>
      
      {/* Iframe Container */}
      <div className="relative rounded-xl overflow-hidden bg-blue-950/30">
        <iframe
          src={`https://perkwall.com/?app_id=995d8b30b557a46be7d27e26b689ad55&click_id=${clickId}&player_id=${playerId}`}
          className="w-full h-[600px]"
          style={{
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden'
          }}
          allow="fullscreen"
          title="Mobile Game Offers"
        />
      </div>
    </div>
  );
};

export default PerkwallFrame;