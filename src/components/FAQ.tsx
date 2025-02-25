import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const faqs = [
  {
    question: "How do I start earning rewards?",
    answer: "Getting started is easy! Simply create an account, browse available offers, and start completing tasks. You'll need to complete a minimum of 30 offers to qualify for rewards."
  },
  {
    question: "How much can I earn?",
    answer: "Earnings vary based on the offers you complete. Users can earn up to $500 per week by consistently completing high-value offers and participating in special promotions."
  },
  {
    question: "When and how do I get paid?",
    answer: "Payments are processed within 24 hours of offer verification. We support multiple payment methods including PayPal, bank transfer, and cryptocurrency."
  },
  {
    question: "Are there any fees?",
    answer: "No, EarnRewards is completely free to use. We never charge any fees for joining or withdrawing your earnings."
  },
  {
    question: "What types of offers are available?",
    answer: "We offer a variety of tasks including mobile games, surveys, shopping cashback, and market research opportunities. New offers are added daily."
  },
  {
    question: "Is EarnRewards available worldwide?",
    answer: "Yes, EarnRewards is available globally, though offer availability may vary by region. Some offers may have country-specific requirements."
  },
  {
    question: "What if an offer doesn't credit?",
    answer: "If an offer doesn't credit within 24 hours of completion, contact our support team with your offer details. We'll investigate and resolve the issue promptly."
  },
  {
    question: "Can I have multiple accounts?",
    answer: "No, multiple accounts are strictly prohibited. Each user may only maintain one active account. Violations may result in account termination."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    // If we have a hash in the URL, open the first FAQ by default
    if (location.hash === '#faq') {
      setOpenIndex(0);
    }
  }, [location]);

  return (
    <div className="py-16 bg-gradient-to-b from-blue-900/20 to-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
              Questions
            </span>
          </h2>
          <p className="text-white/80">Everything you need to know about earning rewards</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl overflow-hidden shadow-xl border border-blue-800/30"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-blue-800/50"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="font-semibold text-white">{faq.question}</span>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-white/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-white/80 pl-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-center">
          <p className="text-white mb-2">Still have questions?</p>
          <a
            href="mailto:support@earnrewards.com"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors"
          >
            Contact our support team
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;