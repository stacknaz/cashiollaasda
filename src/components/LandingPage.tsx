import React, { useState, useEffect } from 'react';
import { Trophy, Users, DollarSign, Zap, Award, Gift, Clock, CheckCircle, ArrowRight, Shield, Mail, Phone, Sparkles, TrendingUp, Star, Lock, FileText, Cookie, MessageSquare, Gamepad } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './auth/AuthModal';
import Reviews from './Reviews';
import Disclaimer from './Disclaimer';
import FAQ from './FAQ';
import LearnMore from './LearnMore';
import AffiliateSection from './AffiliateSection';

const FEATURED_GAMES = [
  {
    name: "PUBG Mobile",
    reward: "$35",
    image: "https://play-lh.googleusercontent.com/JRd05pyBH41qjgsJuWduRJpDeZG0Hnb0yjf2nWqO7VaGKL10-G5UIygxED-WNOc3pg=w240-h480-rw",
    description: "Complete level 20 and earn instant rewards",
    timeRequired: "3-5 days"
  },
  {
    name: "Coin Master",
    reward: "$25",
    image: "https://play-lh.googleusercontent.com/lja_bcS9SXsaK4x_q0rXuiqf3CIIwfy8QveRWfW5MEaAPOST_auDLuzWMyMUrBzi0sI=s96-rw",
    description: "Reach village level 5 to earn",
    timeRequired: "2-3 days"
  },
  {
    name: "Call of Duty Mobile",
    reward: "$40",
    image: "https://play-lh.googleusercontent.com/AtGuphTcfffarHBaw2mn4PHZh6SxSUjbZbSDuL0s_8apx--rXrtu3TNIs43O2_oZCQ=s96-rw",
    description: "Reach level 15 and complete 10 matches",
    timeRequired: "4-6 days"
  },
  {
    name: "Clash of Clans",
    reward: "$30",
    image: "https://play-lh.googleusercontent.com/LByrur1mTmPeNr0ljI-uAUcct1rzmTve5Esau1SwoAzjBXQUby6uHIfHbF9TAT51mgHm=w240-h480-rw",
    description: "Upgrade Town Hall to level 5",
    timeRequired: "3-4 days"
  },
  {
    name: "Travel Town",
    reward: "$20",
    image: "https://play-lh.googleusercontent.com/JUd09-Jkgctks6QibZBPeqnpPA-6A6nMXZqAW9Fa0MKOsolbvGKSXEnuq9nxiKNCFVOT=s96-rw",
    description: "Complete 25 levels to earn",
    timeRequired: "2-3 days"
  },
  {
    name: "Pokemon GO",
    reward: "$45",
    image: "https://play-lh.googleusercontent.com/eftfcMyaaRruAiGPgVZ4rkBsKU_s6qNswWuIOpF7PCNcsd2pY1vhkYnYEKdszfLfTu4=s96-rw",
    description: "Reach level 10 and catch 50 Pokemon",
    timeRequired: "5-7 days"
  }
];

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      const section = document.getElementById(location.hash.slice(1));
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleStartEarning = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Start Earning Today
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Earn Up To{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 px-4 py-1 rounded-lg">
                    $500
                  </span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                </span>
                <br />Every Week
              </h1>
              
              <p className="text-lg text-white/80 leading-relaxed">
                Join thousands of users already earning rewards by completing<br />
                simple tasks, playing games, and participating in market research.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartEarning}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Earning Now
                  <Trophy className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowLearnMore(true)}
                  className="bg-blue-900/30 hover:bg-blue-900/50 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
                >
                  Learn How to Earn $500+ a Week
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-950 object-cover z-30"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-950 object-cover z-20"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100&h=100"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-950 object-cover z-10"
                  />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-sm font-semibold text-blue-950 border-2 border-blue-950">
                    +7K
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">Join 10,000+ active users</p>
                  <p className="text-white/60 text-sm">Earning rewards daily</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 shadow-xl border border-blue-800/30">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Trophy className="w-12 h-12 text-blue-950" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Win Rewards</h3>
                <p className="text-white/80 mb-6">Complete tasks and earn amazing prizes instantly</p>
                
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 bg-blue-950/30 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white/80">Instant Rewards</span>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-950/30 p-3 rounded-lg">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80">Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-3 bg-blue-950/30 p-3 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80">Daily Bonuses</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-800/30 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: '10K+', label: 'Active Users', color: 'yellow' },
            { icon: DollarSign, value: '$500K+', label: 'Paid Out', color: 'green' },
            { icon: Zap, value: '24/7', label: 'Support', color: 'blue' },
            { icon: Award, value: '100%', label: 'Satisfaction', color: 'purple' }
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="transform hover:scale-105 transition-all">
              <div className={`bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-center shadow-xl border border-blue-800/30`}>
                <div className={`bg-${color}-400/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 text-${color}-400`} />
                </div>
                <div className={`bg-${color}-400/10 text-${color}-400 py-2 px-4 rounded-full font-bold mb-2 inline-block`}>
                  {value}
                </div>
                <p className="text-white/80">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
              Cashiolla Rewards
            </span>
          </h2>
          <p className="text-white/80">Start earning rewards in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Gift,
              title: 'High-Paying Offers',
              description: 'Access exclusive offers with rewards up to $500 per completion',
              color: 'purple'
            },
            {
              icon: Clock,
              title: 'Fast Payments',
              description: 'Get paid within 24 hours of completing your tasks',
              color: 'green'
            },
            {
              icon: CheckCircle,
              title: 'Easy to Complete',
              description: 'Simple tasks that anyone can do from anywhere',
              color: 'orange'
            }
          ].map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="transform hover:scale-105 transition-all">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-2xl text-center shadow-xl border border-blue-800/30">
                <div className={`bg-${color}-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <Icon className={`w-8 h-8 text-${color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-white/80">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Games Section */}
      <div className="py-16 bg-gradient-to-b from-blue-900/20 to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Gamepad className="w-4 h-4" />
              Featured Mobile Games
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Play Games and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                Earn Rewards
              </span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Complete in-game achievements and earn real money. Start playing today!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_GAMES.map((game, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all shadow-xl border border-blue-800/30"
              >
                <div className="relative h-48">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-400 text-blue-950 px-4 py-2 rounded-full text-sm font-bold">
                      {game.reward}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
                  <p className="text-white/80 mb-4">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-white/60">
                      <Clock className="w-4 h-4 mr-2" />
                      {game.timeRequired}
                    </div>
                    <button 
                      onClick={handleStartEarning}
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      Start Playing
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleStartEarning}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg"
            >
              View All Game Offers
              <Gamepad className="w-5 h-5" />
            </button>
            <p className="text-white/60 text-sm mt-4">
              New games added daily • Instant rewards upon completion
            </p>
          </div>
        </div>
      </div>

      {/* Affiliate Section */}
      <AffiliateSection />

      {/* Reviews Section */}
      <div id="reviews">
        <Reviews />
      </div>

      {/* Disclaimer Section */}
      <Disclaimer />

      {/* FAQ Section */}
      <div id="faq">
        <FAQ />
      </div>

      {/* Enhanced CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                Earning?
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of users already earning rewards. Start completing offers and get paid today!
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button 
                onClick={handleStartEarning}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all shadow-lg"
              >
                Create Your Account Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                No credit card required • Start earning instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-900/20 to-blue-950/40 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-2">
                  <Trophy className="w-6 h-6 text-blue-950" />
                </div>
                <span className="text-xl font-bold text-white">Cashiolla Rewards</span>
              </div>
              <p className="text-white/80 mb-4 max-w-md">
                Your trusted platform for earning rewards. Complete offers, play games, and earn real money from anywhere.
              </p>
              <div className="flex flex-col space-y-2">
                <a href="mailto:support@cashiolla.com" className="text-white/60 hover:text-white flex items-center gap-2 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@cashiolla.com</span>
                </a>
                <div className="flex items-center gap-2 text-white/60">
                  <Shield className="w-4 h-4" />
                  <span>SSL Encrypted & Secure</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/publishers" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Become a Partner
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleStartEarning}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#faq" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="mailto:support@cashiolla.com" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Data & Privacy Section */}
          <div className="border-t border-blue-800/30 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Data Protection</h4>
                    <p className="text-sm text-white/60">
                      Your data is protected using industry-standard encryption. We never share your personal information with third parties without your consent.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Privacy First</h4>
                    <p className="text-sm text-white/60">
                      We respect your privacy and comply with GDPR and other privacy regulations. You have full control over your data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <Cookie className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Cookie Policy</h4>
                    <p className="text-sm text-white/60">
                      We use essential cookies to ensure the best experience. You can manage your cookie preferences at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-blue-800/30 pt-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-3 rounded-full">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Secure & Trusted</p>
                  <p className="text-white/60 text-sm">SSL encrypted payments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">© 2025 Cashiolla Rewards. All rights reserved.</p>
                <p className="text-white/40 text-xs mt-1">
                  By using our service, you agree to our{' '}
                  <Link to="/privacy" className="hover:text-white/60">Privacy Policy</Link>
                  {' '}and{' '}
                  <Link to="/terms" className="hover:text-white/60">Terms of Service</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Banner */}
          <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 shadow-xl border border-blue-800/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-semibold mb-1">Start Earning Today</h4>
                <p className="text-white/80 text-sm">Complete offers and earn up to $500 weekly</p>
              </div>
              <button 
                onClick={handleStartEarning}
                className="whitespace-nowrap bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
              >
                Sign Up Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showLearnMore && <LearnMore onClose={() => setShowLearnMore(false)} />}
    </div>
  );
};

export default LandingPage;