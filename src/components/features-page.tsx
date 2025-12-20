'use client';

import { 
  Clock, Target, Zap, Users, Sparkles, CheckCircle,
  BarChart3, Shield, Globe, TrendingUp, Settings, Rocket
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Clock,
      title: 'Time Saving',
      description: 'Reduce content creation time by 80%. Focus on creating while we handle the optimization.',
    },
    {
      icon: Target,
      title: 'SEO Optimization',
      description: 'AI-generated titles and descriptions optimized for Facebook\'s algorithm and search.',
    },
    {
      icon: Zap,
      title: 'Smart Scheduling',
      description: 'Schedule posts for peak engagement times based on your audience analytics.',
    },
    {
      icon: Users,
      title: 'Audience Insights',
      description: 'Get detailed analytics on what content performs best with your Facebook audience.',
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Content',
      description: 'Generate eye-catching posts and visuals that increase engagement and reach.',
    },
    {
      icon: CheckCircle,
      title: 'Bulk Operations',
      description: 'Process multiple posts at once and manage your entire Facebook content pipeline.',
    },
  ];

  const advancedCapabilities = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep dive into performance metrics with real-time data and comprehensive reporting.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security to protect your Facebook accounts and data.',
    },
    {
      icon: Globe,
      title: 'Multi-Account Management',
      description: 'Manage multiple Facebook pages and accounts from a single dashboard.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Optimization',
      description: 'AI-powered recommendations to boost your reach and engagement automatically.',
    },
    {
      icon: Settings,
      title: 'Custom Automation',
      description: 'Build custom workflows and automation rules tailored to your business needs.',
    },
    {
      icon: Rocket,
      title: 'API Integration',
      description: 'Connect with your favorite tools and platforms through our robust API.',
    },
  ];

  const whyChoose = [
    {
      title: 'Proven Results',
      description: 'Join thousands of businesses that have increased their Facebook engagement by 300% on average.',
    },
    {
      title: '24/7 Automation',
      description: 'Never miss an opportunity to engage. Our platform works around the clock to maximize your presence.',
    },
    {
      title: 'Easy to Use',
      description: 'No technical skills required. Get started in minutes and see results immediately.',
    },
    {
      title: 'Scalable Platform',
      description: 'Grow from a single page to managing hundreds of accounts without changing tools.',
    },
  ];

  return (
    <>
      {/* Powerful Features Section */}
      <section className="py-6 sm:py-6 md:py-6 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-gray-900">Powerful</span>{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Everything you need to scale your Facebook presence and automate your social media marketing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                >
                  <div className="mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Capabilities
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Take your Facebook automation to the next level with enterprise-grade features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {advancedCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                >
                  <div className="mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{capability.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Postsiva Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Postsiva</span>?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4">
              Discover what makes Postsiva the leading choice for Facebook automation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {whyChoose.map((reason, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{reason.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Experience Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-gray-900">Ready to Experience These</span>{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Features?
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Start automating your Facebook marketing today and see the difference Postsiva can make for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a
              href="#"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 sm:py-4 rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition font-medium text-base sm:text-lg"
            >
              Get Started Free
            </a>
            <a
              href="#"
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-3 sm:py-4 rounded-lg hover:border-purple-600 hover:text-purple-600 transition font-medium text-base sm:text-lg"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

