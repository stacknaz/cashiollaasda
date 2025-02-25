import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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

        <div className="bg-blue-900/20 rounded-2xl p-8">
          <div className="flex items-center mb-8">
            <Shield className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">
              Last updated: February 24, 2025
            </p>

            <div className="space-y-8 mt-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                <p className="text-white/80">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Name and email address when you create an account</li>
                  <li>Payment information when you request a withdrawal</li>
                  <li>Information about offers you complete</li>
                  <li>Communications you have with us</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                <p className="text-white/80">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your rewards and payments</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                <p className="text-white/80">
                  We take reasonable measures to help protect your personal information from loss, 
                  theft, misuse, and unauthorized access. All data is encrypted in transit and at 
                  rest using industry-standard protocols.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                <p className="text-white/80">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mt-4 text-white/80">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                <p className="text-white/80">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  <a href="mailto:privacy@cashiolla.com" className="text-yellow-400 hover:underline">
                    privacy@cashiolla.com
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

export default PrivacyPolicy;