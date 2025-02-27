import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, ArrowRight, Star, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  icon: React.ElementType;
  options: {
    text: string;
    value: string;
  }[];
}

const SURVEY_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Are you ready to start earning rewards?",
    icon: Trophy,
    options: [
      { text: "Yes, I'm excited!", value: "yes" },
      { text: "I need more information", value: "info" }
    ]
  },
  {
    id: 2,
    text: "Can you spare 30 minutes daily to complete offers?",
    icon: Clock,
    options: [
      { text: "Yes, I have time", value: "yes" },
      { text: "Maybe, it depends", value: "maybe" },
      { text: "No, I'm too busy", value: "no" }
    ]
  },
  {
    id: 3,
    text: "What's your daily earning goal?",
    icon: Target,
    options: [
      { text: "$5-$10 per day", value: "low" },
      { text: "$10-$25 per day", value: "medium" },
      { text: "$25+ per day", value: "high" }
    ]
  }
];

interface WelcomeSurveyProps {
  onComplete: () => void;
}

const WelcomeSurvey: React.FC<WelcomeSurveyProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Force navigation to root and reload to ensure fresh state
    window.location.href = '/';
  };

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (showCompletion) {
      // Set a timer to auto-redirect after showing completion screen
      redirectTimer = setTimeout(handleRedirect, 2000);
    }
    
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [showCompletion]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Save answers if needed
      localStorage.setItem('survey_completed', 'true');
      localStorage.setItem('survey_answers', JSON.stringify({
        ...answers,
        [questionId]: answer
      }));
      
      // Show completion screen
      setShowCompletion(true);
      
      // Call onComplete after a delay
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleStartEarning = () => {
    handleRedirect();
  };

  const handleSkip = () => {
    handleRedirect();
  };

  const question = SURVEY_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-2xl w-full max-w-lg relative">
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="absolute -top-8 right-0 flex items-center gap-2 bg-blue-900/50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/80 text-sm">
                Question {currentQuestion + 1}/{SURVEY_QUESTIONS.length}
              </span>
            </div>
          </div>

          {showCompletion ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
                <p className="text-white/80">
                  Thanks for completing the survey. Redirecting you to start earning...
                </p>
              </div>
              <button
                onClick={handleStartEarning}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-950 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-white/60 text-sm">
                Get ready to complete offers and earn rewards!
              </p>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <question.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{question.text}</h2>
                <p className="text-white/60">
                  Choose the option that best describes you
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className="w-full bg-blue-900/30 hover:bg-blue-900/50 text-white p-4 rounded-xl flex items-center justify-between group transition-all"
                  >
                    <span className="text-lg">{option.text}</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>

              {/* Skip Button */}
              <div className="text-center">
                <button
                  onClick={handleSkip}
                  className="text-white/60 hover:text-white text-sm"
                >
                  Skip Survey
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSurvey;