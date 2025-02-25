import React, { useState } from 'react';
import { Star, Quote, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Alex M.",
    rating: 5,
    comment: "I've earned over $200 in my first month! The tasks are easy and payments are always on time.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    date: "2 days ago",
    earnings: "$200+",
    completedOffers: 15,
    verified: true
  },
  {
    id: 2,
    name: "Sarah K.",
    rating: 5,
    comment: "Best reward platform I've used. Customer support is excellent and there are always new offers available.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    date: "1 week ago",
    earnings: "$150+",
    completedOffers: 12,
    verified: true
  },
  {
    id: 3,
    name: "David R.",
    rating: 5,
    comment: "Very reliable platform. I complete surveys during my free time and earn good rewards consistently.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    date: "3 days ago",
    earnings: "$300+",
    completedOffers: 20,
    verified: true
  },
  {
    id: 4,
    name: "Emily W.",
    rating: 5,
    comment: "The mobile game offers are my favorite. Easy to complete and the rewards are great!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    date: "5 days ago",
    earnings: "$180+",
    completedOffers: 14,
    verified: true
  },
  {
    id: 5,
    name: "Michael P.",
    rating: 5,
    comment: "Started using EarnRewards last month and already earned enough for my monthly bills!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    date: "1 week ago",
    earnings: "$250+",
    completedOffers: 18,
    verified: true
  }
];

const Reviews = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <div className="py-16 bg-gradient-to-b from-blue-900/20 to-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
              Users Say
            </span>
          </h2>
          <p className="text-white/80">Join thousands of satisfied users earning rewards daily</p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-blue-900/50 hover:bg-blue-900/70 text-white p-2 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-blue-900/50 hover:bg-blue-900/70 text-white p-2 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 relative transform hover:scale-105 transition-all shadow-xl border border-blue-800/30"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-yellow-400/20" />
                
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full ring-2 ring-yellow-400/20"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{review.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-white/60 text-sm">{review.date}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4">{review.comment}</p>
                
                <div className="border-t border-blue-800/30 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Earned</p>
                      <p className="text-yellow-400 font-semibold">{review.earnings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Completed</p>
                      <p className="text-yellow-400 font-semibold">{review.completedOffers} Offers</p>
                    </div>
                  </div>
                </div>
                
                {review.verified && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-950 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      Verified User
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage
                    ? 'bg-yellow-400 w-4'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;