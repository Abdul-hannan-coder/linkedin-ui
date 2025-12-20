import { Navbar } from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesGrid from "@/components/features-grid";
import { HowItWorks } from "@/components/how-it-works";
import AboutUs from "@/components/about-page";
import ContactUs from "@/components/contact-page";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <AboutUs />
      <ContactUs />
      <Footer />
    </main>
  );
}
