'use client';

import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Social Media Manager at BrandCo',
      rating: 5,
      testimonial: 'Postsiva has revolutionized our Facebook marketing. We save 15+ hours per week on scheduling and can focus on creating better content.',
    },
    {
      name: 'Mike Chen',
      position: 'Founder, Digital Marketing Agency',
      rating: 5,
      testimonial: 'Our Facebook engagement increased by 300% after using Postsiva. The automation features are game-changing for our agency clients.',
      featured: true,
    },
    {
      name: 'Brandon Miller',
      position: 'E-commerce Director at ShopNow',
      rating: 5,
      testimonial: 'The analytics and scheduling features help us maintain a consistent brand presence. Our follower growth has never been better!',
    },
  ];

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Hear from Our</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Happy Users
            </span>
          </h2>
          <p className="text-gray-600 text-lg">Discover how Postsiva is helping marketers automate their Facebook presence and grow their audience.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border transition ${
                testimonial.featured
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-purple-400 shadow-xl md:scale-105'
                  : 'bg-white text-gray-900 border-gray-100 hover:shadow-lg'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={testimonial.featured ? 'fill-yellow-300 text-yellow-300' : 'fill-yellow-400 text-yellow-400'}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className={`text-lg mb-6 leading-relaxed ${testimonial.featured ? 'text-white' : 'text-gray-700'}`}>
                &quot;{testimonial.testimonial}&quot;
              </p>

              {/* Author */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Avatar is removed for minimal display or add an image/element here if fully responsive avatar is desired */}
                <div>
                  <p className={`font-bold ${testimonial.featured ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
                  <p className={`text-sm ${testimonial.featured ? 'text-blue-100' : 'text-gray-500'}`}>{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-purple-300/40 transition font-medium flex items-center gap-2">
            <span>View More</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
