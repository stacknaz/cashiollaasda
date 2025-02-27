import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Trophy, Menu, X, AlertTriangle, Mail, Phone, ArrowRight, HomeIcon, Star, RefreshCw, Gamepad, MessageSquare, ShoppingBag, Target, Clock, Sparkles, TrendingUp, Filter, Crown, Flame, Gift, Zap, Award } from 'lucide-react';
import { fetchOffers, calculateEarningPotential, getOptimalOfferSettings, categorizeOffers } from '../services/offerService';
import { supabase } from '../lib/supabase';
import OfferCard from './OfferCard';
import SettingsPanel from './SettingsPanel';
import PerkwallFrame from './PerkwallFrame';

const CATEGORIES = [
  {
    id: 'all',
    name: 'All Offers',
    icon: Trophy,
    color: 'yellow-400',
    description: 'Browse all available offers'
  },
  {
    id: 'mobile',
    name: 'Mobile Games',
    icon: Gamepad,
    color: 'purple-400',
    description: 'Play games and earn rewards'
  },
  {
    id: 'surveys',
    name: 'Surveys',
    icon: MessageSquare,
    color: 'blue-400',
    description: 'Share your opinion and get paid'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: 'pink-400',
    description: 'Earn cashback on purchases'
  }
];

const SORT_OPTIONS = [
  { id: 'reward-high', label: 'Highest Reward' },
  { id: 'reward-low', label: 'Lowest Reward' },
  { id: 'conversion', label: 'Best Converting' },
  { id: 'newest', label: 'Newest First' }
];

const REFRESH_TIME = 24 * 60 * 60;

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

const Offerwall = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('reward-high');
  const [earned, setEarned] = useState(0);
  const [completedOffers, setCompletedOffers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(REFRESH_TIME);
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [dailyOffers, setDailyOffers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalOffersNeeded = 30;
  const progressPercentage = (completedOffers / totalOffersNeeded) * 100;

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev <= 1 ? REFRESH_TIME : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) throw statsError;

      setEarned(stats.total_earnings);
      setCompletedOffers(stats.completed_offers);
      setDailyOffers(stats.daily_offers);
      setStreak(stats.streak_days);

    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    fetchUserStats();
    
    const subscription = supabase
      .channel('offer_clicks_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'offer_clicks'
      }, () => fetchUserStats())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleOfferComplete = async (event: MessageEvent) => {
      if (event.data?.type === 'offerCompleted') {
        await fetchUserStats();
        
        // Show completion notification
        if (event.data.totalCompleted === 3) {
          // User completed their first 3 offers
          setShowNotification({
            message: 'Congratulations! You\'ve unlocked full access and 2x rewards!',
            type: 'achievement'
          });
        }
      }
    };

    window.addEventListener('message', handleOfferComplete);
    return () => window.removeEventListener('message', handleOfferComplete);
  }, []);

  const { data: offerSettings } = useQuery('offerSettings', getOptimalOfferSettings, {
    staleTime: Infinity,
  });

  const { data: offers = [], isLoading, error, refetch } = useQuery(
    ['offers', offerSettings],
    () => fetchOffers(offerSettings),
    {
      enabled: !!offerSettings,
      refetchOnWindowFocus: false,
      staleTime: 300000,
    }
  );

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        fetchUserStats(),
        refetch()
      ]);
      setTimeLeft(REFRESH_TIME);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const categorizedOffers = useMemo(() => {
    const allCategories = categorizeOffers(offers);
    return {
      all: offers,
      mobile: allCategories['Mobile'] || [],
      surveys: allCategories['Survey'] || [],
      shopping: allCategories['Shopping'] || [],
    };
  }, [offers]);

  const sortOffers = (offers: any[]) => {
    return [...offers].sort((a, b) => {
      switch (sortOption) {
        case 'reward-high':
          return parseFloat(b.reward) - parseFloat(a.reward);
        case 'reward-low':
          return parseFloat(a.reward) - parseFloat(b.reward);
        case 'conversion':
          return parseFloat(b.conversion) - parseFloat(a.conversion);
        case 'newest':
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        default:
          return 0;
      }
    });
  };

  const displayedOffers = useMemo(() => {
    const filtered = categorizedOffers[selectedCategory] || [];
    return sortOffers(filtered);
  }, [categorizedOffers, selectedCategory, sortOption]);

  const totalEarningPotential = calculateEarningPotential(offers);

  const handleStartOffer = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: currentOffers, error: countError } = await supabase
        .from('offer_clicks')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'completed');

      if (countError) throw countError;

      const newCount = (currentOffers?.length || 0) + 1;
      setCompletedOffers(Math.min(newCount, totalOffersNeeded));
    } catch (error) {
      console.error('Error updating offer progress:', error);
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

  const getDailyGoalProgress = () => {
    for (const goal of DAILY_GOALS) {
      if (dailyOffers < goal.offers) {
        return {
          current: dailyOffers,
          target: goal.offers,
          reward: goal.reward,
          icon: goal.icon,
          progress: (dailyOffers / goal.offers) * 100
        };
      }
    }
    return {
      current: dailyOffers,
      target: DAILY_GOALS[DAILY_GOALS.length - 1].offers,
      reward: DAILY_GOALS[DAILY_GOALS.length - 1].reward,
      icon: DAILY_GOALS[DAILY_GOALS.length - 1].icon,
      progress: 100
    };
  };

  const renderMobileGamesSection = () => {
    if (selectedCategory !== 'mobile') return null;

    return (
      <div className="mb-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Gamepad className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Mobile Game Offers</h3>
                <p className="text-white/80">Complete game offers and earn extra rewards</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900/30 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">High Payouts</span>
              </div>
              <p className="text-white/60 text-sm">Earn up to $50 per game completion</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Quick Rewards</span>
              </div>
              <p className="text-white/60 text-sm">Most games credit within 24 hours</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Bonus Points</span>
              </div>
              <p className="text-white/60 text-sm">Earn extra points for achievements</p>
            </div>
          </div>

          <PerkwallFrame onClose={() => setSelectedCategory('all')} />
        </div>
      </div>
    );
  };

  const currentLevel = getCurrentLevel(completedOffers);
  const nextLevel = getNextLevel(completedOffers);
  const progressToNextLevel = nextLevel
    ? ((completedOffers % 30) / 30) * 100
    : 100;
  const dailyGoal = getDailyGoalProgress();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-4 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400/20 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Earned</p>
              <p className="text-white font-semibold">${earned.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-400/20 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Daily Streak</p>
              <p className="text-white font-semibold">{streak} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-400/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Today's Offers</p>
              <p className="text-white font-semibold">{dailyOffers} Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-400/20 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Next Refresh</p>
              <p className="text-white font-semibold">{formatTimeLeft(timeLeft)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-${currentLevel?.color || 'blue-900'}/20 flex items-center justify-center`}>
              {currentLevel ? (
                <currentLevel.icon className={`w-8 h-8 text-${currentLevel.color}`} />
              ) : (
                <Trophy className="w-8 h-8 text-white/60" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {currentLevel ? `${currentLevel.name} Level` : 'Getting Started'}
              </h3>
              <p className="text-white/80">
                {currentLevel
                  ? `${currentLevel.multiplier}x Reward Multiplier Active`
                  : 'Complete offers to unlock reward multipliers'}
              </p>
            </div>
          </div>

          {nextLevel && (
            <div className="flex-1 max-w-md w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Progress to {nextLevel.name}</span>
                <span className="text-yellow-400">
                  {completedOffers} / {nextLevel.threshold} Offers
                </span>
              </div>
              <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  style={{ width: `${progressToNextLevel}%` }}
                ></div>
              </div>
              <p className="text-white/60 text-sm mt-2">
                {nextLevel.threshold - completedOffers} more offers until {nextLevel.multiplier}x multiplier
              </p>
            </div>
          )}

          {!nextLevel && (
            <div className="bg-yellow-400/20 p-4 rounded-xl">
              <p className="text-yellow-400 font-semibold">
                Maximum Level Achieved! 2x Rewards Active
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Goals */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_GOALS.map((goal, index) => {
            const isCompleted = dailyOffers >= goal.offers;
            const progress = Math.min((dailyOffers / goal.offers) * 100, 100);
            const Icon = goal.icon;

            return (
              <div
                key={index}
                className={`bg-blue-950/30 rounded-xl p-4 ${
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
                        {isCompleted ? 'Completed' : `${goal.offers - dailyOffers} more to go`}
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
                    {Math.min(dailyOffers, goal.offers)}/{goal.offers}
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

      {/* Category Navigation */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Available Offers</h2>
            <p className="text-white/80">Choose from our curated selection of high-paying offers</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-950/50 hover:bg-blue-950/70 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-blue-950/50 text-white px-4 py-2 rounded-lg border border-blue-800/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
          showFilters ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowFilters(false);
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                  isActive
                    ? `bg-${category.color} text-blue-950`
                    : 'bg-blue-950/50 text-white/80 hover:bg-blue-950/70 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium">{category.name}</span>
                <span className="text-sm opacity-80">{categorizedOffers[category.id]?.length || 0} offers</span>
                <p className="text-xs text-center opacity-70">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Games Section */}
      {renderMobileGamesSection()}

      {/* Offers Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-500">Error Loading Offers</h3>
              <p className="text-white/80">Please try refreshing the page or try again later.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOffers.map((offer) => (
              <OfferCard
                key={offer.offer_id || offer.link}
                {...offer}
                onStart={handleStartOffer}
              />
            ))}
          </div>

          {displayedOffers.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-blue-900/50 inline-block p-4 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Offers Available</h3>
              <p className="text-white/80 max-w-md mx-auto">
                There are currently no offers in this category. Please check back later or try a different category.
              </p>
            </div>
          )}
        </>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Offers'}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          stats={{
            earned,
            completedOffers,
            totalOffersNeeded,
            username,
            dailyOffers,
            streak
          }}
        />
      )}
    </div>
  );
};

export default Offerwall;