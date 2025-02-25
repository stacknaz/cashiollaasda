import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Globe, Zap, Shield, CheckCircle, ArrowRight, Target, Gift, TrendingUp } from 'lucide-react';

const PublisherPage = () => {
  return (
    <div className="min-h-screen bg-blue-950">
      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partner With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                Cashiolla
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Join our affiliate program and earn up to 50% commission on every user you refer.
              Monetize your traffic with high-converting offers.
            </p>
            <a 
              href="https://tarboch.offer18.com/m/signup_self_aff?r=&am="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              Become a Publisher
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Publisher Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
            <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Website Owners</h3>
            <p className="text-white/80">
              Monetize your website traffic with our high-converting offers. Perfect for content sites,
              blogs, and review platforms.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Influencers</h3>
            <p className="text-white/80">
              Turn your social media following into revenue. Share our offers with your audience
              and earn commissions on every conversion.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6">
            <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Developers</h3>
            <p className="text-white/80">
              Integrate our offers into your apps or games. Access our API and earn through
              in-app promotions.
            </p>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Commission Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-950/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Standard</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-4">30%</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  0-100 conversions/month
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Basic reporting
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Email support
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-950/30 rounded-xl p-6 ring-2 ring-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Premium</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-4">40%</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  101-500 conversions/month
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-950/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-semibold text-white">Elite</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-4">50%</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  500+ conversions/month
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Custom dashboard
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Dedicated manager
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Why Partner With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">High Payouts</h3>
                <p className="text-white/80">
                  Earn up to 50% commission on every conversion. Our offers convert well and pay better.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Reliable Tracking</h3>
                <p className="text-white/80">
                  Advanced tracking system ensures you get credited for every conversion.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <Gift className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Exclusive Offers</h3>
                <p className="text-white/80">
                  Access to unique, high-converting offers not available elsewhere.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fast Payments</h3>
                <p className="text-white/80">
                  Weekly payments with low minimum payout threshold. Get paid reliably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherPage;