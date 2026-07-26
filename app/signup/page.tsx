'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Car, Lock, Mail, User, Phone, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    // Simulate signup request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    // Directly log the user in to /dashboard for demo purposes
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-bg-custom to-accent/5 p-4 sm:p-6 relative overflow-hidden">
      {/* Blurred decorative blobs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Floating back button to home page */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 shadow-2xl p-8 sm:p-10 relative z-10 my-8"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 mb-3">
            <Car className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-extrabold text-primary font-heading tracking-tight">
            Accountant Sign Up
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Register a new accountant login credentials
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold text-primary uppercase">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="name"
                type="text"
                placeholder="Ramesh Chaudhary"
                {...register('name')}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-primary uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="email"
                type="email"
                placeholder="ramesh@dangedrive.com"
                {...register('email')}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-bold text-primary uppercase">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 9857821000"
                {...register('phone')}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-bold text-primary uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-primary uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger font-semibold flex items-center mt-1">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Accountant</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary font-medium">
            Already have an account?{' '}
            <Link href="/signin" className="text-accent font-bold hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
