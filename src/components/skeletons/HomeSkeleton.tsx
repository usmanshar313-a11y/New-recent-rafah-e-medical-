import React from 'react';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonButton } from './SkeletonBase';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Hero Section Skeleton */}
      <section className="relative bg-[#F5F1E8] pt-[clamp(45px,5vw,65px)] pb-[clamp(55px,6vw,70px)] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-12 xl:gap-14 items-center">
            
            {/* Left Hero Column */}
            <div className="max-w-[560px] space-y-5 sm:space-y-6 text-left mx-auto lg:mx-0 w-full">
              {/* Eyebrow */}
              <Skeleton className="h-7 w-52 rounded-full" />
              
              {/* Heading */}
              <div className="space-y-2">
                <Skeleton className="h-10 sm:h-12 lg:h-14 w-11/12 rounded-xl" />
                <Skeleton className="h-10 sm:h-12 lg:h-14 w-3/4 rounded-xl" />
              </div>

              {/* Description */}
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3.5 sm:gap-4">
                <SkeletonButton className="h-12 w-full sm:w-48 rounded-full" />
                <SkeletonButton className="h-12 w-full sm:w-36 rounded-full" />
              </div>
            </div>

            {/* Right Hero Column: Large Circular Frame */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Dotted ring placeholder */}
                <div className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-[#0B6B4E]/15" />
                
                {/* Circular image skeleton */}
                <SkeletonCircle className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] xl:w-[500px] xl:h-[500px] border-4 sm:border-8 border-white shadow-xl" />
                
                {/* Floating Badge Skeleton */}
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white p-3 sm:p-4 rounded-2xl shadow-lg border border-emerald-900/10 flex items-center gap-3 w-48 sm:w-56">
                  <SkeletonCircle className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-2.5 w-3/4" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <SkeletonCircle className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. About Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-emerald-900/10">
          <Skeleton className="w-full h-[320px] sm:h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <SkeletonText lines={3} />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Departments Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Skeleton className="h-6 w-40 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 rounded-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-emerald-900/10 space-y-4">
              <SkeletonCircle className="w-12 h-12 rounded-2xl" />
              <Skeleton className="h-6 w-2/3" />
              <SkeletonText lines={2} />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Doctors Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Skeleton className="h-6 w-48 rounded-full mx-auto" />
          <Skeleton className="h-8 w-2/3 rounded-lg mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-emerald-900/10 space-y-4">
              <div className="flex items-center gap-4">
                <SkeletonCircle className="w-16 h-16 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
