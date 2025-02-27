import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Menu, X, HomeIcon, Bell, Settings, MessageSquare, Star, User, BookOpen, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthModal from './auth/AuthModal';
import SettingsPanel from './SettingsPanel';
import LearnHowToEarn from './LearnHowToEarn';
import { trackEvent, TrackingEventType } from '../lib/offer18';

interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Track logout event
      trackEvent(TrackingEventType.CLICK, {
        custom_data: {
          action: 'logout',
          page: location.pathname
        }
      });
      
      await supabase.auth.signOut();
      // Redirect to home page after logout
      navigate('/');
    } catch (error) {
      // Silent error handling in production
    }
  };

  const scrollToSection = (id: string) => {
    // Track navigation event
    trackEvent(TrackingEventType.CLICK, {
      custom_data: {
        action: 'navigation',
        target: id,
        page: location.pathname
      }
    });
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleShowAuthModal = () => {
    // Track auth modal open event
    trackEvent(TrackingEventType.CLICK, {
      custom_data: {
        action: 'open_auth_modal',
        page: location.pathname
      }
    });
    
    setShowAuthModal(true);
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-950 py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-yellow-400 rounded-lg p-2 transform group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-950" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">Cashiolla Rewards</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-2 ${
                    location.pathname === '/'
                      ? 'text-yellow-400'
                      : 'text-white/80 hover:text-white'
                  } transition-colors`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                <button
                  onClick={() => setShowLearnModal(true)}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Learn How to Earn
                </button>

                {/* Notifications */}
                <button className="relative text-white/80 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-950 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* Settings Button */}
                <button 
                  onClick={() => setShowSettings(true)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setShowLearnModal(true)}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Learn How to Earn
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Reviews
                </button>
                <button
                  onClick={handleShowAuthModal}
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-blue-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[72px] bg-blue-900 border-t border-blue-800 p-4 space-y-4 shadow-lg max-h-[calc(100vh-72px)] overflow-y-auto">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-3 text-white/80 hover:text-white block py-3 px-4 rounded-lg hover:bg-blue-800/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    setShowLearnModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Learn How to Earn</span>
                </button>

                {/* Mobile Notifications */}
                <button className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50">
                  <div className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-950 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <span>Notifications</span>
                </button>

                {/* Mobile Settings */}
                <button 
                  onClick={() => {
                    setShowSettings(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>

                {/* Mobile Logout */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-red-400 hover:text-red-300 py-3 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowLearnModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Learn How to Earn</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection('faq');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>FAQ</span>
                </button>
                <button
                  onClick={() => {
                    scrollToSection('reviews');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-white/80 hover:text-white py-3 px-4 rounded-lg hover:bg-blue-800/50"
                >
                  <Star className="w-5 h-5" />
                  <span>Reviews</span>
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 py-3 px-4 rounded-lg font-semibold"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showSettings && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showLearnModal && (
        <LearnHowToEarn
          isOpen={showLearnModal}
          onClose={() => setShowLearnModal(false)}
        />
      )}
    </header>
  );
};

export default Header;