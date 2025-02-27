import React, { useState, useEffect } from 'react';
import { X, Trophy, Target, Clock, TrendingUp, Bell, Shield, User, BarChart2, Gift, Crown, Flame, Award, Zap, Star, LogOut } from 'lucide-react';
import ProfilePanel from './ProfilePanel';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: {
    earned: number;
    completedOffers: number;
    totalOffersNeeded: number;
    username: string;
    dailyOffers: number;
    streak: number;
  };
}

const COMPLETION_LEVELS = [
  { threshold: 30, name: 'Bronze', color: 'yellow-600', multiplier: 1, icon: Trophy },
  { threshold: 60, name: 'Silver', color: 'gray-400', multiplier: 1.5, icon: Award },
  { threshold: 90, name: 'Gold', color: 'yellow-400', multiplier: 2, icon: Crown }
];

const DAILY_GOALS = [
  { offers: 3, reward: 5, icon: Flame },
  { offers: 5, reward: 10, icon: Zap },
  { offers: 10, reward: 25, icon: Gift }
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'settings'>('progress');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    earned: 0,
    completedOffers: 0,
    totalOffersNeeded: 30,
    username: '',
    dailyOffers: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id);

        if (statsError) throw statsError;

        if (stats && stats.length > 0) {
          setUserStats({
            earned: stats[0].total_earnings || 0,
            completedOffers: stats[0].completed_offers || 0,
            totalOffersNeeded: 30,
            username: user.user_metadata.username || '',
            dailyOffers: stats[0].daily_offers || 0,
            streak: stats[0].streak_days || 0
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (isOpen) {
      fetchUserStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      onClose();
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getCurrentLevel = (completedOffers: number) => {
    for (let i = COMPLETION_LEVELS.length - 1; i >= 0; i--) {
      if (completedOffers >= COMPLETION_LEVELS[i].threshold) {
        return COMPLETION_LEVELS[i];
      }
    }
    return null;
  };

  const getNextLevel = (completedOffers: number) => {
    for (const level of COMPLETION_LEVELS) {
      if (completedOffers < level.threshold) {
        return level;
      }
    }
    return null;
  };

  const currentLevel = getCurrentLevel(userStats.completedOffers);
  const nextLevel = getNextLevel(userStats.completedOffers);
  const progressToNextLevel = nextLevel
    ? ((userStats.completedOffers % nextLevel.threshold) / nextLevel.threshold) * 100
    : 100;

  const getDailyGoalProgress = () => {
    for (const goal of DAILY_GOALS) {
      if (userStats.dailyOffers < goal.offers) {
        return {
          current: userStats.dailyOffers,
          target: goal.offers,
          reward: goal.reward,
          icon: goal.icon,
          progress: (userStats.dailyOffers / goal.offers) * 100
        };
      }
    }
    return {
      current: userStats.dailyOffers,
      target: DAILY_GOALS[DAILY_GOALS.length - 1].offers,
      reward: DAILY_GOALS[DAILY_GOALS.length - 1].reward,
      icon: DAILY_GOALS[DAILY_GOALS.length - 1].icon,
      progress: 100
    };
  };

  const dailyGoal = getDailyGoalProgress();

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            {/* Header with Level Badge */}
            <div className="text-center mb-6 relative">
              <div className="absolute top-0 right-0 flex items-center gap-2 bg-blue-900/50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm">Level {Math.floor(userStats.completedOffers / 30) + 1}</span>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-blue-950 text-3xl font-bold mb-4 mx-auto ring-4 ring-yellow-400/20">
                {userStats.username.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, {userStats.username || 'User'}</h2>
              <p className="text-white/60">Track your progress and manage settings</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-all">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-white/60">Total Earned</div>
                <div className="text-lg font-bold text-white">${userStats.earned.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-all">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-white/60">Completed</div>
                <div className="text-lg font-bold text-white">{userStats.completedOffers}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-all">
                <Flame className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-white/60">Daily Streak</div>
                <div className="text-lg font-bold text-white">{userStats.streak} Days</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-4 text-center transform hover:scale-105 transition-all">
                <Gift className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-white/60">Today's Offers</div>
                <div className="text-lg font-bold text-white">{userStats.dailyOffers}</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-blue-800/30 mb-6">
              {['progress', 'achievements', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-yellow-400 border-b-2 border-yellow-400'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                {/* Level Progress */}
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full bg-${currentLevel?.color || 'blue-900'}/20 flex items-center justify-center ring-4 ring-${currentLevel?.color || 'blue-900'}/20`}>
                      {currentLevel ? (
                        <currentLevel.icon className={`w-8 h-8 text-${currentLevel.color}`} />
                      ) : (
                        <Trophy className="w-8 h-8 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {currentLevel ? `${currentLevel.name} Level` : 'Getting Started'}
                      </h3>
                      <p className="text-white/60">
                        {currentLevel
                          ? `${currentLevel.multiplier}x Reward Multiplier Active`
                          : 'Complete offers to unlock reward multipliers'}
                      </p>
                      {nextLevel && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/80">Progress to {nextLevel.name}</span>
                            <span className="text-yellow-400">
                              {userStats.completedOffers % 30}/{nextLevel.threshold} Offers
                            </span>
                          </div>
                          <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                              style={{ width: `${progressToNextLevel}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level Milestones */}
                  <div className="space-y-4">
                    {COMPLETION_LEVELS.map((level, index) => {
                      const Icon = level.icon;
                      const isCompleted = userStats.completedOffers >= level.threshold;
                      const isActive = currentLevel?.name === level.name;
                      
                      return (
                        <div 
                          key={level.name}
                          className={`bg-blue-950/30 rounded-xl p-4 transition-all ${
                            isActive ? 'ring-2 ring-yellow-400' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg bg-${level.color}/20`}>
                              <Icon className={`w-5 h-5 text-${level.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white">{level.name} Level</span>
                                <span className={`text-sm ${isCompleted ? 'text-yellow-400' : 'text-white/60'}`}>
                                  {level.multiplier}x Multiplier
                                </span>
                              </div>
                              <div className="text-sm text-white/60">
                                {level.threshold} offers required
                              </div>
                            </div>
                          </div>
                          <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 bg-${level.color}`}
                              style={{
                                width: `${Math.min((userStats.completedOffers / level.threshold) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Goals */}
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-400" />
                      Daily Goals
                    </h3>
                    <div className="bg-yellow-400/20 px-3 py-1 rounded-full">
                      <span className="text-yellow-400 text-sm font-semibold">
                        +${dailyGoal.reward} Bonus Available
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {DAILY_GOALS.map((goal, index) => {
                      const isCompleted = userStats.dailyOffers >= goal.offers;
                      const progress = Math.min((userStats.dailyOffers / goal.offers) * 100, 100);
                      const Icon = goal.icon;

                      return (
                        <div
                          key={index}
                          className={`bg-blue-950/30 rounded-xl p-4 transform transition-all ${
                            isCompleted ? 'ring-2 ring-yellow-400' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                isCompleted ? 'bg-yellow-400/20' : 'bg-blue-900/50'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  isCompleted ? 'text-yellow-400' : 'text-white/60'
                                }`} />
                              </div>
                              <div>
                                <span className="text-white font-medium">
                                  {goal.offers} Offers
                                </span>
                                <div className="text-sm text-white/60">
                                  {isCompleted ? 'Completed' : `${goal.offers - userStats.dailyOffers} more to go`}
                                </div>
                              </div>
                            </div>
                            <div className={`text-lg font-semibold ${
                              isCompleted ? 'text-yellow-400' : 'text-white/60'
                            }`}>
                              +${goal.reward}
                            </div>
                          </div>
                          <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                  : 'bg-white/20'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-white/60">
                              {Math.min(userStats.dailyOffers, goal.offers)}/{goal.offers}
                            </span>
                            {isCompleted && (
                              <span className="text-yellow-400 flex items-center gap-1">
                                <Trophy className="w-4 h-4" />
                                Goal Achieved!
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-yellow-400/20 p-2 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">First Earnings</h4>
                        <p className="text-sm text-white/60">Complete your first offer</p>
                      </div>
                      {userStats.completedOffers > 0 && (
                        <div className="ml-auto">
                          <div className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: userStats.completedOffers > 0 ? '100%' : '0%' }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-400/20 p-2 rounded-lg">
                        <Flame className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Hot Streak</h4>
                        <p className="text-sm text-white/60">Complete offers 7 days in a row</p>
                      </div>
                      {userStats.streak >= 7 && (
                        <div className="ml-auto">
                          <div className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 transition-all duration-500"
                        style={{ width: `${Math.min((userStats.streak / 7) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-white/60 text-sm">{userStats.streak}/7 days</span>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-400/20 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Daily Champion</h4>
                        <p className="text-sm text-white/60">Complete all daily goals</p>
                      </div>
                      {userStats.dailyOffers >= 10 && (
                        <div className="ml-auto">
                          <div className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 transition-all duration-500"
                        style={{ width: `${Math.min((userStats.dailyOffers / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-white/60 text-sm">{userStats.dailyOffers}/10 offers</span>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-400/20 p-2 rounded-lg">
                        <Award className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Elite Earner</h4>
                        <p className="text-sm text-white/60">Earn your first $100</p>
                      </div>
                      {userStats.earned >= 100 && (
                        <div className="ml-auto">
                          <div className="bg-green-500/20 text-green-500 text-xs font-semibold px-2 py-1 rounded-full">
                            Completed
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 transition-all duration-500"
                        style={{ width: `${Math.min((userStats.earned / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-white/60 text-sm">${userStats.earned.toFixed(2)}/$100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-full bg-blue-900/30 rounded-xl p-4 flex items-center justify-between hover:bg-blue-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-yellow-400" />
                    <div className="text-left">
                      <h4 className="font-semibold text-white">Profile Settings</h4>
                      <p className="text-sm text-white/60">Manage your account details</p>
                    </div>
                  </div>
                  <span className="text-white/60">→</span>
                </button>

                <div className="bg-blue-900/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-white">Notifications</h4>
                      <p className="text-sm text-white/60">Manage your notification preferences</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    Configure
                  </button>
                </div>

                <div className="bg-blue-900/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-white">Security</h4>
                      <p className="text-sm text-white/60">Update your security settings</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    Manage
                  </button>
                </div>

                <div className="bg-blue-900/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="font-semibold text-white">Rewards History</h4>
                      <p className="text-sm text-white/60">View your earnings and rewards</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white">
                    View
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
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
            )}
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

export default SettingsPanel;