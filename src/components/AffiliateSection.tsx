import React from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign, ArrowRight, Globe } from 'lucide-react';

const AffiliateSection = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-blue-900/20 to-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 border border-blue-800/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Monetize Your Traffic with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                  Cashiolla
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join our affiliate program and earn up to 50% commission on every user you refer.
                Perfect for influencers, developers, and website owners.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-950/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">High Commissions</span>
                  </div>
                  <p className="text-white/60 text-sm">Up to 50% revenue share</p>
                </div>
                
                <div className="bg-blue-950/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">All Traffic Types</span>
                  </div>
                  <p className="text-white/60 text-sm">Social, mobile, web & more</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://tarboch.offer18.com/m/signup_self_aff?r=&am="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Become a Publisher
                  <ArrowRight className="w-5 h-5" />
                </a>
                
                <Link
                  to="/publishers"
                  className="bg-blue-950/30 hover:bg-blue-950/50 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Learn More
                  <Globe className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-2xl p-6 border border-yellow-400/20">
                <h3 className="text-2xl font-bold text-white mb-6">Publisher Benefits</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-white/80">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold">1</span>
                    </div>
                    <span>High-converting offers with up to $50 per conversion</span>
                  </li>
                  <li className="flex items-center gap-4 text-white/80">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold">2</span>
                    </div>
                    <span>Weekly payments with low minimum threshold</span>
                  </li>
                  <li className="flex items-center gap-4 text-white/80">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold">3</span>
                    </div>
                    <span>Advanced tracking and real-time reporting</span>
                  </li>
                  <li className="flex items-center gap-4 text-white/80">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold">4</span>
                    </div>
                    <span>Dedicated support and optimization help</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateSection;