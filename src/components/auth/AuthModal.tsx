import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import WelcomeSurvey from '../WelcomeSurvey';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        onClose();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
            return;
          }
          throw signUpError;
        }

        setStep(3);
        setShowSurvey(true); // Show survey after successful registration
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Start Earning Today</h2>
                  <p className="text-white/80">Create your account to access exclusive offers</p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Continue with Email
                  <Mail className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <p className="text-sm text-white/60">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-yellow-400 hover:underline">Terms</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isSignIn ? 'Welcome Back!' : 'Create Your Account'}
                  </h2>
                  <p className="text-white/80">
                    {isSignIn ? 'Sign in to continue earning rewards' : 'Fill in your details to get started'}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {!isSignIn && (
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-blue-900/50 border border-blue-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Choose a username"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-blue-900/50 border border-blue-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-blue-900/50 border border-blue-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder={isSignIn ? "Enter your password" : "Create a password"}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {isSignIn ? 'Signing in...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      {isSignIn ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="text-yellow-400 hover:underline text-sm"
                  >
                    {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-transparent border border-white/20 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/5 transition-all"
                >
                  Back
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                  <p className="text-white/80">
                    Welcome to EarnRewards! You can now start completing offers and earning rewards.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-950 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Start Earning
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show Welcome Survey after registration */}
      {showSurvey && <WelcomeSurvey />}
    </>
  );
};

export default AuthModal;