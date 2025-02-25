import React from 'react';
import { Trophy, GamepadIcon, BarChart2, Users, Gift, Sparkles, CheckCircle, ArrowRight, Clock, Target, Star, Shield, DollarSign, TrendingUp } from 'lucide-react';

const LearnMore = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl max-w-4xl w-full relative">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <DollarSign className="w-4 h-4" />
              Earn Up To $500 Weekly
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Guide to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                Maximum Earnings
              </span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Follow our proven strategies to maximize your earnings through offers, games, and referrals. 
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

          {/* Main Content */}
          <div className="space-y-6">
            {/* High-Paying Offers Section */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-800/30">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-400/20 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">Premium Offers ($20-$50 Each)</h3>
                  <p className="text-white/80 mb-4">
                    Focus on our highest-paying opportunities to maximize your earnings quickly. 
                    These premium offers typically take 15-30 minutes to complete.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-950/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Featured Offers
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Premium subscriptions ($30-50)
                        </li>
                        <li className="flex items-center gap-2 text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Financial services ($25-40)
                        </li>
                        <li className="flex items-center gap-2 text-white/80">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Market research ($20-35)
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-950/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-2 text-white/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Complete profile for better offers
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Check daily for new opportunities
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Follow instructions carefully
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gaming Rewards Section */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-800/30">
              <div className="flex items-start gap-4">
                <div className="bg-purple-400/20 p-3 rounded-lg">
                  <GamepadIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">Mobile Gaming ($100+ Weekly)</h3>
                  <p className="text-white/80 mb-4">
                    Turn your gaming time into real earnings. Our mobile game offers are fun, 
                    engaging, and highly rewarding.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Earning Methods
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 bg-blue-950/30 p-2 rounded-lg">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-white/80">Level completion bonuses</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-950/30 p-2 rounded-lg">
                          <Gift className="w-4 h-4 text-pink-400" />
                          <span className="text-white/80">Daily achievement rewards</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-950/30 p-2 rounded-lg">
                          <Star className="w-4 h-4 text-purple-400" />
                          <span className="text-white/80">Special event competitions</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-950/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-3">Weekly Gaming Schedule</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/80">Weekday Gaming</span>
                          <span className="text-yellow-400">1-2 hours</span>
                        </div>
                        <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                        </div>
                        <p className="text-white/60 text-xs mt-2">
                          Focus on daily challenges and level progression
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus Strategies Section */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-800/30">
              <div className="flex items-start gap-4">
                <div className="bg-green-400/20 p-3 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">Bonus Earning Strategies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-950/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">2X Rewards Events</h4>
                      <p className="text-white/80 text-sm mb-3">
                        Double your earnings during special promotional periods. Events typically run on weekends 
                        and holidays.
                      </p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="w-4 h-4" />
                        Check daily for event schedules
                      </div>
                    </div>
                    <div className="bg-blue-950/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Referral Network</h4>
                      <p className="text-white/80 text-sm mb-3">
                        Build your referral network to earn passive income. Earn 10% of your referrals' 
                        earnings forever.
                      </p>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Users className="w-4 h-4" />
                        Share your unique referral link
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started Steps */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-xl p-6 border border-yellow-400/20">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Start Earning in 3 Simple Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 font-bold text-xl">1</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Create Account</h4>
                  <p className="text-white/60 text-sm">Quick and free registration</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 font-bold text-xl">2</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Choose Offers</h4>
                  <p className="text-white/60 text-sm">Select from available opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-400 font-bold text-xl">3</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">Earn Rewards</h4>
                  <p className="text-white/60 text-sm">Get paid within 24 hours</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
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

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LearnMore;