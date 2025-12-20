'use client';

import Image from 'next/image';

export default function AnalyticsInsights() {
  return (
    <div className="py-14 px-4 sm:px-6 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Side - Title & Description */}
          <div>
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-gray-900">Track Performance with</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time Analytics
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              Monitor your Facebook page performance in real-time. Track reach, engagement, follower growth, and ad performance with comprehensive analytics that help you optimize your social media strategy.
            </p>
            <a
              href="/features"
              className="inline-block w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition font-medium text-base md:text-lg text-center"
            >
              Explore More Features →
            </a>
          </div>

          {/* Right Side - Floating Cards */}
          <div className="relative w-full h-52 xs:h-64 sm:h-80 md:h-96 aspect-square max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-3xl mx-auto flex items-center justify-center">
            {/* Background gradient */}
            <Image
              src="/4.png"
              alt="Analytics Insights Cards"
              fill
              className="object-fill rounded-3xl"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
