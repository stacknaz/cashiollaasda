import React from 'react';
import { X, Clock, Trophy, Shield, ArrowRight, CheckCircle, AlertTriangle, Gift, Globe, Star, Target, Info } from 'lucide-react';
import type { OfferItem } from '../services/offerService';

interface OfferModalProps extends OfferItem {
  onClose: () => void;
  onStart: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({
  title,
  description,
  reward,
  country,
  type,
  points,
  photo,
  conversion,
  onClose,
  onStart
}) => {
  const getEstimatedTime = () => {
    switch (type.toLowerCase()) {
      case 'survey':
        return '15-45 minutes';
      case 'install':
        return '5-10 minutes';
      case 'signup':
        return '2-5 minutes';
      default:
        return '10-30 minutes';
    }
  };

  const getDifficulty = () => {
    const convRate = parseFloat(conversion);
    if (convRate > 0.5) return 'Easy';
    if (convRate > 0.2) return 'Medium';
    return 'Hard';
  };

  const getXPReward = () => Math.floor(points / 10);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-blue-900/95 to-blue-950 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/20 rounded-full transition-colors text-white/60 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <div className="flex items-center gap-2 text-white/60">
            <Globe className="w-4 h-4" />
            <span>{country}</span>
          </div>
        </div>

        {/* Reward Banner */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-transparent p-4 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-yellow-400">Reward</div>
                <div className="text-2xl font-bold text-yellow-400">${reward}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Points</div>
              <div className="text-lg font-semibold text-white">{points} XP</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="bg-blue-900/50 rounded-xl p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-yellow-400 mb-2" />
              <div className="text-sm text-white/60 mb-1">Time Required</div>
              <div className="font-semibold text-white">{getEstimatedTime()}</div>
            </div>
          </div>
          <div className="bg-blue-900/50 rounded-xl p-4">
            <div className="flex flex-col items-center text-center">
              <Target className="w-5 h-5 text-yellow-400 mb-2" />
              <div className="text-sm text-white/60 mb-1">Difficulty</div>
              <div className="font-semibold text-white">{getDifficulty()}</div>
            </div>
          </div>
          <div className="bg-blue-900/50 rounded-xl p-4">
            <div className="flex flex-col items-center text-center">
              <Star className="w-5 h-5 text-yellow-400 mb-2" />
              <div className="text-sm text-white/60 mb-1">XP Reward</div>
              <div className="font-semibold text-white">{getXPReward()} XP</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">About This Offer</h3>
            <p className="text-white/80 leading-relaxed">{description}</p>
          </div>

          {/* Steps Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">How to Complete</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Complete Required Actions</h4>
                  <p className="text-white/60 text-sm">Follow all instructions carefully</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Submit for Verification</h4>
                  <p className="text-white/60 text-sm">Your submission will be reviewed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Receive Your Reward</h4>
                  <p className="text-white/60 text-sm">Get paid within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Notice */}
          <div className="bg-blue-900/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">Requirements</h4>
                <ul className="text-white/60 text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    Complete all steps in order
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    Use accurate information
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    One completion per user only
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-500">Secure & Verified</h4>
                <p className="text-white/60 text-sm">
                  This offer has been verified by our team. Complete it accurately to ensure reward credit.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onStart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold py-4 px-6 rounded-xl flex items-center justify-center group transition-all"
            >
              Start Earning ${reward}
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="w-full bg-blue-800/30 hover:bg-blue-800/50 text-white font-medium py-3 px-6 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;