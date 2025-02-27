import React, { useState, useEffect } from 'react';
import { Timer, Star, Globe, ArrowRight, Gift } from 'lucide-react';
import { formatPoints, trackOfferClickEvent } from '../services/offerService';
import type { OfferItem } from '../services/offerService';
import OfferModal from './OfferModal';
import Notification from './Notification';
import { trackOfferImpression } from '../lib/offer18';

interface OfferCardProps extends OfferItem {
  onStart: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  title,
  description,
  reward,
  country,
  type,
  points,
  photo,
  conversion,
  link,
  difficulty = 'Easy',
  offer_id,
  onStart
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Track impression when card is rendered
    if (offer_id) {
      try {
        trackOfferImpression(offer_id, {
          custom_data: {
            offer_title: title,
            offer_type: type,
            reward: reward
          }
        }).catch(err => {
          // Silently handle tracking errors
          console.log('Offer impression tracking error handled');
        });
      } catch (error) {
        // Silently handle tracking errors
        console.log('Offer impression tracking error handled');
      }
    }
    
    // Listen for offer completion events
    const handleOfferComplete = (event: MessageEvent) => {
      if (event.data?.type === 'offerCompleted' && event.data?.offerId === link) {
        setShowNotification(true);
        onStart();
      }
    };

    window.addEventListener('message', handleOfferComplete);
    return () => window.removeEventListener('message', handleOfferComplete);
  }, [link, onStart, offer_id, title, type, reward]);

  const handleStartOffer = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const trackedLink = await trackOfferClickEvent({
        title,
        description,
        reward,
        country,
        type,
        points,
        photo,
        conversion,
        link,
        difficulty,
        pubDate: new Date().toISOString(),
        category: type,
        offer_id
      });

      if (!trackedLink) {
        throw new Error('Unable to generate tracking link. Please try again.');
      }

      // Open offer in new window
      window.open(trackedLink, '_blank');
      
    } catch (error) {
      console.error('Error starting offer:', error);
      setError('Unable to start offer. Please try again.');
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div 
        className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer shadow-xl border border-blue-800/30"
        onClick={() => setShowModal(true)}
      >
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img 
            src={photo} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <span className="bg-yellow-400 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-bold shadow-lg">
              ${reward}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold flex-1 pr-4 text-white line-clamp-2">{title}</h3>
            <span className="text-sm text-yellow-400 flex items-center whitespace-nowrap">
              <Gift className="w-4 h-4 mr-1" />
              {formatPoints(points)} points
            </span>
          </div>
          
          <p className="text-white/80 mb-4 text-sm sm:text-base line-clamp-2">{description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm sm:text-base text-white">
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-yellow-400" />
                <span>{country || 'Worldwide'}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                  {difficulty}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button 
            onClick={handleStartOffer}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center group transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Complete & Earn ${reward}
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <OfferModal
          {...{
            title,
            description,
            reward,
            country,
            type,
            points,
            photo,
            conversion,
            link,
            difficulty,
            offer_id,
            onClose: () => setShowModal(false),
            onStart: handleStartOffer
          }}
        />
      )}

      {showNotification && (
        <Notification
          message="Offer completed successfully!"
          reward={parseFloat(reward)}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default OfferCard;