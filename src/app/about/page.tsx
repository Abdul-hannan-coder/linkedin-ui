"use client";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Award, TrendingUp, ArrowRight, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Users,
    title: "Customer Success",
    description:
      "We're committed to helping every customer achieve their LinkedIn goals and grow their professional network.",
  },
  {
    icon: Target,
    title: "Innovation",
    description: "We continuously innovate and improve our platform to stay ahead of LinkedIn's evolving landscape.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from product development to customer support.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "We believe in sustainable growth for our customers and our company, built on trust and results.",
  },
];

const stats = [
  { value: "2019", label: "Founded" },
  { value: "10,000+", label: "Active Users" },
  { value: "50+", label: "Team Members" },
  { value: "99.9%", label: "Uptime" },
];

export default function AboutPage() {
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
                About <span className="text-primary">Postsiva</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                We&apos;re on a mission to help professionals and businesses unlock the full potential of LinkedIn through
                intelligent automation and meaningful connections.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Story</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Postsiva was born from a simple frustration: spending countless hours manually managing LinkedIn
                    outreach while seeing minimal results. Our founder experienced this firsthand while
                    building a consulting business.
                  </p>
                  <p>
                    After years of understanding LinkedIn&apos;s intricacies, we assembled a
                    team of experts in AI, automation, and B2B marketing to create a solution that would change how
                    professionals approach LinkedIn networking.
                  </p>
                  <p>
                    Today, Postsiva helps over 10,000 professionals and businesses automate their LinkedIn activities
                    while maintaining authenticity and compliance with LinkedIn&apos;s terms of service.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl md:text-3xl font-black text-primary mb-1">{stat.value}</div>
                      <div className="text-xs md:text-sm text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Card className="p-6 md:p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <Linkedin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Mission Statement</h3>
                        <p className="text-sm text-slate-500">Empowering professionals worldwide</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <h4 className="font-bold text-slate-900 mb-2">Our Mission</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          To democratize LinkedIn success by providing intelligent automation tools that help
                          professionals build meaningful connections and grow their businesses.
                        </p>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <h4 className="font-bold text-slate-900 mb-2">Our Vision</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          A world where every professional can leverage the power of LinkedIn to achieve their career
                          and business goals through authentic networking.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 bg-white/50 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Values</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape how we build products, serve customers, and grow as a
                company.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  delay={index * 0.1}
                  className="text-center"
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
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
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Join Our Growing Community</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Become part of a community of successful professionals who are transforming their LinkedIn presence and
                achieving their business goals with Postsiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group h-14 px-10 rounded-xl text-base">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl text-base bg-white/50 backdrop-blur-sm">
                  Contact Our Team
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

