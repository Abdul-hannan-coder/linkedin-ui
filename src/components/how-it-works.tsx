"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Search, ListChecks, Send, LineChart } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    title: "Define Your Audience",
    description: "Use our advanced filters to find exactly who you want to reach out to.",
    icon: Search,
    image: "/define-your-audience.jpg",
  },
  {
    title: "Create Your Campaign",
    description: "Write personalized messages and set up automated follow-up sequences.",
    icon: ListChecks,
    image: "/create-your-campaign.jpg",
  },
  {
    title: "Launch & Automate",
    description: "Let Postsiva handle the outreach while you focus on closing deals.",
    icon: Send,
    image: "/launch-automate.jpg",
  },
  {
    title: "Analyze & Optimize",
    description: "Track performance and refine your approach with real-time data.",
    icon: LineChart,
    image: "/analyze-optimize.jpg",
  },
];

export const HowItWorks = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get your LinkedIn automation up and running in four simple steps.
          </p>
        </div>

        <div ref={containerRef} className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 rounded-full hidden md:block" />
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-0.5 bg-primary -translate-x-1/2 rounded-full z-10 hidden md:block"
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`md:flex flex-col ${index % 2 === 1 ? "md:items-end md:text-right" : ""}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Circle */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-[3px] border-primary rounded-full z-20 flex items-center justify-center text-primary shadow-lg hidden md:flex">
                   <step.icon className="w-5 h-5" />
                </div>

                {/* Step Visual with Image */}
                <div className="flex-1 w-full">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-video group hover:border-primary/30 hover:shadow-lg transition-all duration-500 relative">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
