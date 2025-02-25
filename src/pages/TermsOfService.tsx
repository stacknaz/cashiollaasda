import React from 'react';
import { Shield, ArrowLeft, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-800/30">
          <div className="flex items-center mb-8">
            <Scale className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">
              Last updated: February 24, 2025
            </p>

            <div className="space-y-8 mt-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-white/80">
                  By accessing and using EarnRewards ("the Service"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
                <p className="text-white/80">
                  To use the Service, you must:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Be at least 18 years old</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Offer Completion Rules</h2>
                <p className="text-white/80">
                  When completing offers, you agree to:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Complete offers honestly and accurately</li>
                  <li>Not use VPNs or other methods to manipulate your location</li>
                  <li>Not create multiple accounts</li>
                  <li>Complete a minimum of 30 offers to qualify for rewards</li>
                  <li>Follow all specific requirements for each offer</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Rewards and Payments</h2>
                <div className="space-y-4 text-white/80">
                  <p>
                    Rewards are subject to the following conditions:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>All rewards are subject to verification</li>
                    <li>Payments are processed within 24 hours of verification</li>
                    <li>Minimum payout threshold may apply</li>
                    <li>We reserve the right to adjust or deny rewards for suspicious activity</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Activities</h2>
                <p className="text-white/80">
                  The following activities are strictly prohibited:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Using automated methods to complete offers</li>
                  <li>Providing false information</li>
                  <li>Manipulating the reward system</li>
                  <li>Selling or transferring account access</li>
                  <li>Engaging in fraudulent activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Account Termination</h2>
                <p className="text-white/80">
                  We reserve the right to suspend or terminate accounts that:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Violate these terms</li>
                  <li>Engage in suspicious activity</li>
                  <li>Remain inactive for extended periods</li>
                  <li>Are created by previously banned users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                <p className="text-white/80">
                  We may modify these terms at any time. Continued use of the Service after changes 
                  constitutes acceptance of the new terms. Users will be notified of significant changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
                <p className="text-white/80">
                  The Service is provided "as is" without warranties. We are not liable for:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Service interruptions</li>
                  <li>Loss of rewards or earnings</li>
                  <li>Technical issues</li>
                  <li>Third-party offer problems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
                <p className="text-white/80">
                  For questions about these terms, please contact us at:
                  <br />
                  <a href="mailto:terms@earnrewards.com" className="text-yellow-400 hover:underline">
                    terms@earnrewards.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;