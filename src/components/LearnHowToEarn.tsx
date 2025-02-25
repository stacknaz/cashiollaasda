import React from 'react';
import { X, Trophy, Target, Clock, Star, Gift, Sparkles, TrendingUp, Shield, CheckCircle, ArrowRight, Gamepad, MessageSquare, ShoppingBag } from 'lucide-react';

interface LearnHowToEarnProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnHowToEarn: React.FC<LearnHowToEarnProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" />
              Maximize Your Earnings
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Guide to Earning{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                $500+ Weekly
              </span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Follow our proven strategies to maximize your earnings through offers, games, and surveys.
              Start earning today with these expert tips and techniques.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-900/30 rounded-xl p-4 text-center">
              <div className="bg-yellow-400/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-1">Quick Start</h4>
              <p className="text-white/60 text-sm">Earn your first reward in under 30 minutes</p>
            </div>
            <div className="bg-blue-900/30 rounded-xl p-4 text-center">
              <div className="bg-green-400/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-1">Daily Goal</h4>
              <p className="text-white/60 text-sm">Complete 4-5 offers per day</p>
            </div>
            <div className="bg-blue-900/30 rounded-xl p-4 text-center">
              <div className="bg-blue-400/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-1">Weekly Potential</h4>
              <p className="text-white/60 text-sm">$500+ in weekly earnings</p>
            </div>
          </div>

          {/* Offer Types */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Types of Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900/30 p-6 rounded-xl">
                <div className="bg-purple-400/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Gamepad className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Mobile Games</h4>
                <p className="text-white/70 mb-4">Play games and reach specific levels to earn rewards. Perfect for gaming enthusiasts.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Earn $20-50 per game
                  </li>
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Fun and engaging
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/30 p-6 rounded-xl">
                <div className="bg-blue-400/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Surveys</h4>
                <p className="text-white/70 mb-4">Share your opinions and complete market research surveys for quick rewards.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    $1-5 per survey
                  </li>
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Fast completion
                  </li>
                </ul>
              </div>

              <div className="bg-blue-900/30 p-6 rounded-xl">
                <div className="bg-pink-400/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Shopping</h4>
                <p className="text-white/70 mb-4">Earn cashback and rewards for your online purchases and sign-ups.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Up to 20% cashback
                  </li>
                  <li className="flex items-center gap-2 text-white/60">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Bonus sign-up rewards
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-xl p-6 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Pro Tips for Maximum Earnings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Focus on High-Value Offers</h4>
                    <p className="text-white/60 text-sm">Prioritize offers with higher rewards to maximize your time investment.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Set a Daily Schedule</h4>
                    <p className="text-white/60 text-sm">Dedicate specific times for completing offers to maintain consistency.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Follow Instructions Carefully</h4>
                    <p className="text-white/60 text-sm">Read and follow all offer requirements to ensure successful completion.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Take Advantage of Bonuses</h4>
                    <p className="text-white/60 text-sm">Look for special promotions and bonus reward opportunities.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Track Your Progress</h4>
                    <p className="text-white/60 text-sm">Monitor your earnings and set increasing goals for yourself.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Stay Consistent</h4>
                    <p className="text-white/60 text-sm">Regular participation leads to higher earnings and bonus rewards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started CTA */}
          <div className="text-center space-y-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              Start Earning Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/60 text-sm">
              No credit card required • Start earning instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnHowToEarn;