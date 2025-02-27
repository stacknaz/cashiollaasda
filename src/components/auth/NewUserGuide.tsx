{/* Move NewUserGuide.tsx to auth folder and update imports */}
import React from 'react';
import { Trophy, Target, Gift, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface NewUserGuideProps {
  onClose: () => void;
}

const NewUserGuide: React.FC<NewUserGuideProps> = ({ onClose }) => {
  const recommendedOffers = [
    {
      title: "Survey Master",
      reward: "$5",
      time: "10-15 min",
      difficulty: "Easy"
    },
    {
      title: "App Install",
      reward: "$3",
      time: "5 min",
      difficulty: "Easy"
    },
    {
      title: "Quick Survey",
      reward: "$2",
      time: "5-10 min",
      difficulty: "Easy"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl w-full max-w-lg">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Get Started with 3 Easy Offers</h2>
            <p className="text-white/80">
              Complete these beginner-friendly offers to unlock full access and earn your first rewards
            </p>
          </div>

          <div className="space-y-4">
            {recommendedOffers.map((offer, index) => (
              <div key={index} className="bg-blue-900/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400/20 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{offer.title}</h3>
                      <p className="text-sm text-white/60">{offer.time} completion time</p>
                    </div>
                  </div>
                  <div className="text-yellow-400 font-bold">{offer.reward}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Difficulty: {offer.difficulty}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= 3 ? 'text-yellow-400 fill-current' : 'text-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-xl p-4 border border-yellow-400/20">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">New User Bonus</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                2x reward multiplier after completing 3 offers
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Unlock access to premium offers
              </li>
              <li className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Earn achievement badges
              </li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            Start with Recommended Offers
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewUserGuide;