'use client';

import Image from 'next/image';

export default function StandoutFeatures() {
  const features = [
    {
      title: 'Smart Post Scheduling',
      description: 'Automatically schedule your Facebook posts at optimal times to maximize reach and engagement. Set up your content calendar weeks in advance.',
      image: '/1.png',
      bg: '#f8faf9',
    },
    {
      title: 'Engagement Analytics',
      description: 'Track likes, comments, shares, and reach in real-time. Understand which content resonates with your audience and optimize your strategy.',
      image: '/2.png',
      bg: '#f8faf9',
    },
    {
      title: 'Automated Responses',
      description: 'Set up automated replies to comments and messages to keep your audience engaged 24/7, even when you are not online.',
      image: '/3.png',
      bg: '#f8faf9',
    },
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="text-gray-900">Explore Our</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Standout Features
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto px-4">
            Manage all your Facebook marketing needs from one powerful dashboard. Schedule posts, track performance, and engage with your audience effortlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              {/* Dashboard Image */}
              <div
                className="relative h-48 sm:h-56 md:h-64 overflow-hidden"
                style={{
                  backgroundColor: feature.bg,
                }}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  priority={index === 0}
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
