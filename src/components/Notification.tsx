import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  reward?: number;
  onClose: () => void;
  autoClose?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  reward, 
  onClose, 
  autoClose = true 
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg max-w-md flex items-start gap-3">
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {reward && (
            <p className="text-green-100 mt-1">
              You earned ${reward.toFixed(2)}!
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Notification;