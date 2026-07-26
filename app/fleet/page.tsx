'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FleetSection from '@/components/FleetSection';

export default function FleetPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-[#F8FAF8] pt-12">
        <FleetSection />
      </main>

      <Footer />
    </>
  );
}