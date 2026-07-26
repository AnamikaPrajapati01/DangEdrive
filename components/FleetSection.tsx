'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FleetSection() {
  return (
    <section id="fleet" className="py-24 sm:py-28 bg-[#FFFFFF] relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#EAF7EC]/80 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Car Image with Zoom Reveal + Hover Soft Shine Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex justify-start w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white shine-container group w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-[280px] sm:h-[380px] lg:h-[400px]"
              >
                <Image
                  src="/image/car 2.jpg"
                  alt="GAC Aion Y Plus Electric Vehicle"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/40 via-transparent to-transparent opacity-60" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Fleet Info with Text Fade Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="space-y-6 text-left"
          >
            <span className="text-lg sm:text-xl font-extrabold text-[#4CAF50] tracking-[0.2em] uppercase block mb-2">
              OUR FLEET
            </span>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F5A35] font-heading tracking-tight leading-snug">
              10 GAC Aion Y Plus Electric Taxis
            </h2>
            
            <p className="text-[#64748B] text-base leading-relaxed">
              Our entire fleet is made up of brand-new <strong className="text-[#1A1A1A]">GAC Aion Y Plus</strong> electric SUVs. 
              They are spacious, quiet, and produce zero emissions. 
              Every vehicle is kept clean and is regularly checked to make sure your ride is safe and comfortable.
            </p>
            
            <p className="text-[#64748B] text-base leading-relaxed">
              All our drivers are experienced professionals who know the roads of Nepal well. 
              Whether you are traveling within the city or going on a long trip, 
              we are here to provide a smooth and reliable service.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD] shadow-xs">
                100% Electric
              </span>
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD] shadow-xs">
                Air Conditioned
              </span>
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD] shadow-xs">
                5 Seater
              </span>
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD] shadow-xs">
                Professional Drivers
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}