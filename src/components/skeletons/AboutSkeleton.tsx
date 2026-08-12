import React from 'react';
import { Skeleton, SkeletonText } from './SkeletonBase';

export const AboutSkeleton: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-10 text-[#1F2937] animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner Header */}
        <div className="bg-[#22A25A] text-white p-8 sm:p-10 rounded-3xl space-y-4">
          <Skeleton className="h-6 w-48 rounded-full bg-white/20" />
          <Skeleton className="h-9 w-3/4 sm:w-1/2 rounded-xl bg-white/20" />
          <Skeleton className="h-4 w-full sm:w-2/3 rounded-lg bg-white/20" />
        </div>

        {/* Hospital Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 space-y-5">
            <Skeleton className="h-6 w-52 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <SkeletonText lines={4} />
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-200 space-y-6">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Excellence Card Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <Skeleton className="w-full h-64 sm:h-80 rounded-2xl" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-6 w-56 rounded-full" />
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <SkeletonText lines={3} />
          </div>
        </div>

        {/* Tour Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-72 rounded-3xl" />
          <Skeleton className="w-full h-72 rounded-3xl" />
        </div>

      </div>
    </div>
  );
};
