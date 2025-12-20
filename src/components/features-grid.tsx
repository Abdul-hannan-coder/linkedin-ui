"use client";

import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { 
  Zap, 
  Target, 
  BarChart3, 
  MessageSquare, 
  Users, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    title: "Smart Automation",
    description: "Automate your LinkedIn outreach with intelligent workflows that mimic human behavior to stay safe.",
    icon: Zap,
    delay: 0.1,
  },
  {
    title: "Precision Targeting",
    description: "Find your ideal prospects with advanced filters and AI-powered lead searching algorithms.",
    icon: Target,
    delay: 0.2,
  },
  {
    title: "Advanced Analytics",
    description: "Deep dive into your campaign performance with real-time data and actionable insights.",
    icon: BarChart3,
    delay: 0.3,
  },
  {
    title: "Engagement Booster",
    description: "Automatically engage with your target audience's content to build meaningful relationships.",
    icon: MessageSquare,
    delay: 0.4,
  },
  {
    title: "Team Collaboration",
    description: "Manage multiple accounts and collaborate with your team in a unified enterprise dashboard.",
    icon: Users,
    delay: 0.5,
  },
  {
    title: "Safety First",
    description: "Cloud-based execution and built-in proxy support to keep your LinkedIn account secure.",
    icon: ShieldCheck,
    delay: 0.6,
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
          >
            Powerful Features for <span className="text-primary">Growth</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Everything you need to dominate LinkedIn and turn connections into customers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} delay={feature.delay} className="h-full p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
