import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import FleetSection from '@/components/FleetSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import SectionDivider from '@/components/SectionDivider';
import { Car, Users, ShieldCheck, PhoneCall } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Landing */}
        <Hero />

        {/* Statistics Section (Floating Cards Row overlapping Hero/About) */}
        <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              value="10 Active"
              label="Modern Taxis"
              description="A dedicated local fleet of sedans and 6-seater vehicles always clean and ready."
              icon={<Car className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value="Professional"
              label="Vetted Drivers"
              description="Experienced local navigators background-verified for passenger safety."
              icon={<Users className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value="Safe & Checked"
              label="Real-time GPS"
              description="Every single trip is tracked and monitored by our centralized dispatch office."
              icon={<ShieldCheck className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value="24/7 Hotline"
              label="Instant Support"
              description="Direct communication lines for emergency adjustments and custom routing."
              icon={<PhoneCall className="w-6 h-6 text-[#4CAF50]" />}
            />
          </div>
        </section>

        {/* Section Wave Divider into About */}
        <SectionDivider variant="wave" fillColor="#0B3D26" className="-mb-1 mt-12" />

        {/* About Section */}
        <About />

        {/* Section Wave Divider out of About */}
        <SectionDivider variant="curve" fillColor="#F8FAF8" className="-mt-1 bg-[#0B3D26]" />

        {/* Features Value Proposition Grid */}
        <Features />

        {/* Section Angle Divider into Fleet */}
        <SectionDivider variant="angle" fillColor="#FFFFFF" className="-mb-1" />

        {/* Fleet Section (10 Vehicle showcase) */}
        <FleetSection />

        {/* Section Wave Divider into Contact */}
        <SectionDivider variant="wave" fillColor="#F8FAF8" className="-mb-1" />

        {/* Contact & Booking Section */}
        <Contact />
      </main>

      <Footer />
    </>
  );
}
