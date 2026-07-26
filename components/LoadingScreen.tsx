'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8FAF8] bg-leaf-pattern"
        >
          {/* Subtle background glow */}
          <div className="absolute w-[350px] h-[350px] bg-[#4CAF50]/15 rounded-full filter blur-3xl animate-pulse pointer-events-none" />

          {/* Logo with gentle pulse */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-44 h-44 mb-6 z-10"
          >
            <Image
              src="/image/logo.png"
              alt="Dang E Drive Loading"
              fill
              priority
              className="object-contain drop-shadow-md"
            />
          </motion.div>

          {/* Company Title */}
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg font-bold text-[#0F5A35] font-heading tracking-wide mb-4 z-10"
          >
            Dang E Drive Pvt. Ltd.
          </motion.h2>

          {/* Progress Bar Container */}
          <div className="w-56 h-2 bg-[#DCE7DD] rounded-full overflow-hidden relative shadow-inner z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0F5A35] via-[#2E7D32] to-[#4CAF50] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <p className="text-xs font-semibold text-[#64748B] mt-2 z-10">
            Loading premium experience... {progress}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
