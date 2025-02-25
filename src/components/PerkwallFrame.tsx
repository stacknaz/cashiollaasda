import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface PerkwallFrameProps {
  onClose: () => void;
}

const PerkwallFrame: React.FC<PerkwallFrameProps> = ({ onClose }) => {
  const [clickId, setClickId] = useState('');
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    const initializeFrame = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setPlayerId(user.id);
          setClickId(crypto.randomUUID());
        }
      } catch (error) {
        console.error('Error initializing Perkwall:', error);
      }
    };

    initializeFrame();
  }, []);

  if (!clickId || !playerId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg z-10"
        >
          Close
        </button>
        <iframe
          src={`https://perkwall.com/?app_id=995d8b30b557a46be7d27e26b689ad55&click_id=${clickId}&player_id=${playerId}`}
          className="w-full h-full border-0 rounded-lg"
          title="Perkwall Offers"
        />
      </div>
    </div>
  );
};

export default PerkwallFrame;