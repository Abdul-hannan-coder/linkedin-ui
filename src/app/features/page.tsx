"use client";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  Target,
  BarChart3,
  Clock,
  Shield,
  Zap,
  Brain,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessageSquare,
    title: "Smart Messaging",
    description:
      "Send personalized messages at scale with AI-powered templates that feel authentic and drive engagement.",
    benefits: [
      "AI-powered message personalization",
      "Template library with proven results",
      "A/B testing for message optimization",
      "Automatic follow-up sequences",
    ],
  },
  {
    icon: Users,
    title: "Connection Automation",
    description:
      "Automatically send connection requests to your ideal prospects with intelligent targeting and timing.",
    benefits: [
      "Smart connection request automation",
      "Custom invitation messages",
      "Connection acceptance tracking",
      "Daily limits and safety controls",
    ],
  },
  {
    icon: Target,
    title: "Advanced Lead Targeting",
    description:
      "Find and connect with decision-makers using advanced search filters and LinkedIn Sales Navigator integration.",
    benefits: [
      "Sales Navigator integration",
      "Advanced search filters",
      "Lead scoring and qualification",
      "CRM integration capabilities",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your LinkedIn performance with detailed analytics on connections, messages, and lead generation.",
    benefits: [
      "Real-time performance metrics",
      "Connection growth tracking",
      "Message response rates",
      "ROI and conversion analytics",
    ],
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Schedule your LinkedIn activities to run at optimal times when your prospects are most active.",
    benefits: [
      "Optimal timing recommendations",
      "Timezone-aware scheduling",
      "Activity queue management",
      "Weekend and holiday controls",
    ],
  },
  {
    icon: Shield,
    title: "Safety & Compliance",
    description: "Stay within LinkedIn's limits with built-in safety features and compliance monitoring.",
    benefits: [
      "LinkedIn limit compliance",
      "Account safety monitoring",
      "Risk assessment alerts",
      "Automatic pause features",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F4F9FF] relative">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      
      <Navbar />
      <main className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="glow-effect top-0 left-0 w-[600px] h-[600px] opacity-50" />
          <div className="glow-effect top-0 right-0 w-[600px] h-[600px] opacity-50" />
          
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Powerful Features for <span className="text-primary">LinkedIn Success</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Discover all the tools and features that make Postsiva the most comprehensive LinkedIn automation
                platform for professionals and businesses.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-12 bg-white/50 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Even More Powerful Features</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Our platform includes additional advanced features to help you maximize your LinkedIn success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card delay={0} className="text-center">
                <CardHeader>
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get intelligent recommendations on who to connect with and what messages to send based on AI
                    analysis.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card delay={0.1} className="text-center">
                <CardHeader>
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Multi-Account Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage multiple LinkedIn accounts from one dashboard with team collaboration features and role-based
                    access.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card delay={0.2} className="text-center">
                <CardHeader>
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">Real-time Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get instant alerts for new connections, messages, and important LinkedIn activities via email or
                    Slack.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5 relative overflow-hidden">
          <div className="glow-effect bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-60" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Ready to Experience All These Features?</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Start your free trial today and discover how our comprehensive feature set can transform your LinkedIn
                strategy and drive real business results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group h-14 px-10 rounded-xl text-base">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl text-base bg-white/50 backdrop-blur-sm">
                  Schedule a Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

