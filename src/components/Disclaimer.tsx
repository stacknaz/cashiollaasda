import React from 'react';
import { AlertTriangle, Info, Shield } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="bg-gradient-to-b from-blue-900/20 to-blue-950/20 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-800/30">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            
            <div className="flex-grow space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Important Information</h3>
                <div className="prose prose-invert max-w-none text-white/80 space-y-4">
                  <p>
                    Earnings may vary based on offer availability, user location, and completion rate. 
                    The $500 weekly earning potential is achievable but not guaranteed and depends on 
                    various factors including time invested and offers completed.
                  </p>
                  
                  <div className="flex items-start space-x-3 bg-blue-950/30 p-4 rounded-xl">
                    <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-white mb-2">Requirements</p>
                      <ul className="list-disc pl-4 space-y-2 text-sm">
                        <li>Minimum of 30 completed offers required to qualify for rewards</li>
                        <li>All offers must be completed accurately and honestly</li>
                        <li>Users must be 18 years or older to participate</li>
                        <li>Some offers may have additional country restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-950/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-white">Safe & Secure</h4>
                  </div>
                  <p className="text-sm text-white/70">All transactions are encrypted and protected</p>
                </div>
                
                <div className="bg-blue-950/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h4 className="font-medium text-white">Transparent</h4>
                  </div>
                  <p className="text-sm text-white/70">Clear terms and conditions for all offers</p>
                </div>
                
                <div className="bg-blue-950/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-medium text-white">Fair Play</h4>
                  </div>
                  <p className="text-sm text-white/70">Zero tolerance for fraudulent activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;